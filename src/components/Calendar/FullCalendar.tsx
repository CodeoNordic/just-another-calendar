import { useEffect, useRef, useState, useMemo } from 'react';
import { useConfig } from '@context/Config';

import { useCreateMethod } from '@utils/createMethod';
import { v4 as randomUUID } from 'uuid';

// Import components
import Event from '@components/Calendar/Event';

// Import FullCalendar
import { default as FullCalendarReact } from '@fullcalendar/react';
import { DateInput, EventSourceInput } from '@fullcalendar/core';

// Import Calendar plugins
import momentPlugin from '@fullcalendar/moment';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import resourcePlugin, { ResourceApi } from '@fullcalendar/resource'
import resourceDayGridPlugin from '@fullcalendar/resource-daygrid';
import resourceTimeGridPlugin from '@fullcalendar/resource-timegrid';
import resourceTimelinePlugin from '@fullcalendar/resource-timeline';

// Import utils
import createMethod from '@utils/createMethod';
import dateFromString from '@utils/dateFromString';
import performScript from '@utils/performScript';

interface Props {
    records?: FM.EventRecord[];
    initialDate?: DateInput;
}

const FullCalendar: FC<Props> = props => {
    const calendarRef = useRef<FullCalendarReact|null>(null);
    const config = useConfig()!;

    const [currentDate, setCurrentDate] = useState<Date>(dateFromString(config.initialDate) || new Date());
    const [resourcesTitle, setResourcesTitle] = useState<string>('');
    const [,setRevertFunctions] = useState<Record<string, Function>>({});

    const cur = currentDate.valueOf();

    useEffect(() => {
        if (!calendarRef.current) return;
        const api = calendarRef.current.getApi();

        window.debug = api;

        const cleanupSetView = createMethod('setView', view => api.changeView(view));
        const cleanupSetCurrentDate = createMethod('setCurrentDate', str => {
            const date = dateFromString(str) || new Date();
            api.gotoDate(date);
            setCurrentDate(date);
        });

        // Automatically open/close resource groups on update
        const resourceListener = (resources: ResourceApi[]) => {
            resources.forEach(resource => {
                const parent = document.querySelector(`.resource-group-label-${resource.id}`);
                const noEvents = !resource.getEvents()?.length;

                const collapsed = Boolean(resource.extendedProps.initiallyCollapsed) || noEvents;

                const expander = parent?.querySelector(`.fc-datagrid-expander:has(.fc-icon-${collapsed? 'minus':'plus'}-square)`) as HTMLButtonElement;
                expander?.click();
            })
        }
        
        api.on('resourcesSet', resourceListener);
        return () => {
            cleanupSetView();
            cleanupSetCurrentDate();
            api.off('resourcesSet', resourceListener);
        }
    }, [calendarRef]);

    useCreateMethod('revert', id => {
        setRevertFunctions(prev => {
            const { [id]: func, ...funcs } = prev;
            func?.();
            return funcs;
        });
    });

    const eventsBase: EventSourceInput = useMemo(() => (props.records ?? []).map(record => {
        if (!record.resourceId && record.type !== 'backgroundEvent') console.warn(`The following record does not have a resource ID`, record);

        const eventStart = dateFromString(record.dateStart)?.valueOf() || Infinity;
        const eventEnd = dateFromString(record.dateFinishedDisplay)?.valueOf() || 0;
        
        const overdue = cur > eventEnd;

        const start = /*overdue? new Date(cur).setHours(0, 0, 0, 0): */eventStart;
        const end = overdue? new Date(cur.valueOf() + (1000 * 60 * 60 * 24)).setHours(23, 59, 59): eventEnd;

        if (record.type === 'backgroundEvent') return {
            start,
            end,
            allDay: true,
            display: 'background',
            backgroundColor: record.backgroundColor ?? '#eaa',
            extendedProps: { record }
        }

        const resourceIds = record.resourceId instanceof Array? record.resourceId: (record.resourceId? [record.resourceId]: []);

        return {
            id: record.id,
            resourceId: resourceIds[0],
            resourceIds,
            backgroundColor: record.colors?.background,
            borderColor: record.colors?.border,
            textColor: record.colors?.text,
            start,
            end,
            extendedProps: { record },
            allDay: true
        }
    }), [props.records]);

    return <FullCalendarReact
        ref={cal => calendarRef.current = cal}

        // Base config
        schedulerLicenseKey={config.licenseKey}
        locale={config.locale ?? 'nb'}

        initialView={config.initialView ?? 'resourceDayGridWeek'}
        initialDate={currentDate}

        editable
        eventResourceEditable
        eventDurationEditable={false}

        weekends={new Date(currentDate).getDay() > 5? true: (config.showWeekends || false)}

        // Add plugins
        plugins={[
            momentPlugin,
            interactionPlugin,
            dayGridPlugin,
            resourcePlugin,
            resourceDayGridPlugin,
            resourceTimeGridPlugin,
            resourceTimelinePlugin
        ]}

        // Set up views
        views={{
            resourceDayGridWeek: {
                duration: { days: /*config.days ??*/ 1 },
                dayHeaderContent: () => null,
            },

            resourceTimelineWeek: {
                resourceGroupField: 'id',
                duration: { days: config.days },
                resourceGroupLabelContent: props => {
                    const resource = config.resources.find(r => r.id === props.groupValue);
                    const eventCount = eventsBase.filter(ev => ev.resourceId === resource?.id);

                    return `${resource?.title ?? 'Uten navn'}${/*eventCount.length? */` (${eventCount.length})`/*:''*/}`;
                },
                resourceLabelContent: () => null,
                slotDuration: { days: 1 },
                slotLabelFormat: { day: '2-digit', weekday: 'long' },
                resourceAreaHeaderContent: () => resourcesTitle
            }
        }}

        // Add content
        resources={config.resources}
        events={eventsBase}

        // Renderer for each event
        eventContent={props => <Event
            component={config.eventComponent}
            {...(props.event.extendedProps.record ?? {}) as FM.EventRecord}
        />}

        resourceGroupLabelClassNames={info => `resource-group-label-${info.groupValue}`}

        // Automatically open/close resource groups on first load
        resourceGroupLabelDidMount={info => {
            const resource = config.resources.find(r => r.id === info.groupValue);
            
            const noEvents = !eventsBase.some(e => e.resourceId === info.groupValue);
            const collapsed = resource?.initiallyCollapsed !== undefined? resource.initiallyCollapsed: noEvents;

            const expander = info.el.querySelector(`.fc-datagrid-expander:has(.fc-icon-${collapsed? 'minus':'plus'}-square)`) as HTMLButtonElement;
            expander?.click();
        }}

        // Sorting
        resourceOrder="title"
        eventOrder={(a, b) => {
            const recordA = (a as { record: FM.EventRecord }).record;
            const recordB = (b as { record: FM.EventRecord }).record;

            // If both records have the same 'isUrgent' value, sort by dateFinishedDisplay
            if (recordA.isUrgent === recordB.isUrgent) {
                const dateA = new Date(recordA.dateFinishedDisplay);
                const dateB = new Date(recordB.dateFinishedDisplay);

                return dateA.valueOf() - dateB.valueOf()
            }

            // Otherwise, put the urgent record first
            return recordA.isUrgent? -1: 1;
        }}
        
        // Additional config values
        resourceAreaHeaderContent={() => <div className="date-header">{resourcesTitle}</div>}
        resourceAreaWidth={config.resourcesWidth || '17.5rem'}
        filterResourcesWithEvents={false}
        fixedWeekCount={false}
        slotEventOverlap={false}

        allDaySlot={false}
        
        buttonIcons={false}
        headerToolbar={{
            left: '',//'title',
            right: ''
        }}
        
        eventTimeFormat={config.eventTimeFormat ?? 'HH:mm'}
        
        scrollTime="08:00"
        slotMinTime="00:00"
        slotMaxTime="24:00"

        // Event handlers
        eventClick={info => {
            const root = info.el;

            // Return if the element clicked was a button
            const patientButton = root.querySelector('button.patient');
            const orderButton = root.querySelector('button.order-button');

            const target = info.jsEvent.target as HTMLElement;
            if (
                // Patient button
                target === patientButton ||
                patientButton?.contains(target) ||

                // Order button
                target === orderButton ||
                orderButton?.contains(target)
            ) return;

            performScript('openDelivery', info.event.id);
        }}

        eventDrop={info => {
            const revertId = randomUUID();
            setRevertFunctions(prev => ({ ...prev, [revertId]: info.revert }));

            performScript('onDrag', {
                record: info.event.extendedProps.record,
                start: info.event.start,
                end: info.event.end,
                oldResource: info.oldResource?.toJSON(),
                newResource: info.newResource?.toJSON(),
                revertId
            });
        }}

        datesSet={info => {
            setResourcesTitle(info.view.title);
        }}
    />
}

export default FullCalendar;