import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { useConfig } from '@context/Config';

import { useCreateMethod } from '@utils/createMethod';
import { v4 as randomUUID } from 'uuid';

// Import components
import Event from '@components/Calendar/Event';
import { useEventDropdown } from './Event/Dropdown';

// Import FullCalendar
import { default as FullCalendarReact } from '@fullcalendar/react';
import { DateInput, EventDropArg, EventSourceInput } from '@fullcalendar/core';

// Import Calendar plugins
import momentPlugin from '@fullcalendar/moment';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';

import resourcePlugin, { ResourceApi } from '@fullcalendar/resource'
import resourceDayGridPlugin from '@fullcalendar/resource-daygrid';
import resourceTimeGridPlugin from '@fullcalendar/resource-timegrid';
import resourceTimelinePlugin from '@fullcalendar/resource-timeline';

// Import utils
import createMethod from '@utils/createMethod';
import dateFromString from '@utils/dateFromString';
import performScript from '@utils/performScript';
import capitalize from '@utils/capitalize';
import searchObject from '@utils/searchObject';

interface Props {
    records?: JAC.Event[];
    date?: DateInput;
}

const FullCalendar: FC<Props> = props => {
    const calendarRef = useRef<FullCalendarReact|null>(null);
    const config = useConfig()!;

    const [currentDate, setCurrentDate] = useState<Date>(dateFromString(config.date) || new Date());
    const [resourcesTitle, setResourcesTitle] = useState<string>('');
    const [,setRevertFunctions] = useState<Record<string, Function>>({});

    const [,setDropdown] = useEventDropdown();

    // Determine dropdown buttons for each record
    const eventButtons = useCallback((r: JAC.Event) => {
        if (!config.eventButtons) return [];
        return config.eventButtons?.filter(btn => !btn._filter || searchObject(r, btn._filter));
    }, [config.eventButtons]);
    
    // Automatically change date
    useEffect(() => {
        const date = config.date && dateFromString(config.date);
        if (!calendarRef.current || !date) return;

        calendarRef.current.getApi().gotoDate(date);
        setCurrentDate(date);
    }, [calendarRef, config!.date]);

    // Automatically change view
    useEffect(() => {
        if (!calendarRef.current || !config.view) return;
        calendarRef.current.getApi().changeView(config.view);
    }, [calendarRef, config!.view]);

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

    const eventsBase: EventSourceInput = useMemo(() => (props.records ?? []).map((record, i) => {
        if (!record.id) {
            console.warn(`The following record does not have an associated ID, and will instead use its array index`, record);
            record.id = String(i);
        }
        //if (!record.resourceId && record.type !== 'backgroundEvent') console.warn(`The following record does not have a resource ID`, record);

        const eventStart = dateFromString(record.timestampStart);
        const eventEnd = dateFromString(record.timestampEnd);

        if (record.timeStart) {
            const match = record.timeStart.match(/^(\d{2}):(\d{2})/);
            match && eventStart?.setHours(Number(match[1]), Number(match[2]));
        }

        if (record.timeEnd) {
            const match = record.timeEnd.match(/^(\d{2}):(\d{2})/);
            match && eventEnd?.setHours(Number(match[1]), Number(match[2]));
        }

        if (record.type === 'backgroundEvent') return {
            start: eventStart,
            end: eventEnd,
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
            start: eventStart,
            end: eventEnd,
            extendedProps: { record },
            allDay: Boolean(record.allDay)
        }
    }), [props.records]);

    return <FullCalendarReact
        ref={cal => calendarRef.current = cal}

        // Base config
        schedulerLicenseKey={config.fullCalendarLicense}
        locale={config.locale ?? 'no-nb'}

        //initialView={/*config.initialView ?? */'resourceTimeGrid'}
        initialDate={currentDate}

        editable
        eventResourceEditable={false}
        eventStartEditable
        eventDurationEditable
        nowIndicator

        weekends={new Date(currentDate).getDay() > 5? true: (config.showWeekends || false)}

        // Add plugins
        plugins={[
            momentPlugin,
            interactionPlugin,
            dayGridPlugin,
            timeGridPlugin,

            resourcePlugin,
            resourceDayGridPlugin,
            resourceTimeGridPlugin,
            resourceTimelinePlugin
        ]}

        // Set up views
        views={{
            resourceTimeGrid: {
                dayHeaderContent: info => {
                    const base = capitalize(info.date.toLocaleDateString(config.locale, {
                        weekday: 'long',
                        day: '2-digit',
                        month: 'long'
                    }), true);
                    
                    const bgEvents = config.records?.filter(ev => ev.type === 'backgroundEvent');
                    if (!bgEvents?.length) return base;

                    const firstColor = bgEvents[0].backgroundColor;
                    return <span style={{ color: firstColor }}>
                        {base}
                        <br />
                        ({bgEvents.map(ev => ev.backgroundText).join(', ')})
                    </span>
                },

                slotLabelContent: info => {
                    const str = info.date.toLocaleTimeString(
                        config.locale,
                        {
                            hour: '2-digit',
                            minute: '2-digit'
                        }
                    );

                    const isHourly = str.endsWith('00');

                    return <span className={isHourly? 'timeslot-large': 'timeslot-small'}>
                        {isHourly? str: str.substring(3)}
                    </span>
                },

                duration: { days: config.days },
                dayHeaders: true,
                datesAboveResources: true,

                allDayContent: 'Hele dagen',
                allDaySlot: true//eventsBase.some(ev => ev.allDay)
            }
        }}

        // Add content
        resources={config.resources}
        events={eventsBase}

        // Renderer for each event
        eventContent={props => <Event
            component={config.eventComponent}
            {...(props.event.extendedProps.record ?? {}) as JAC.Event}
        />}

        resourceGroupLabelClassNames={info => `resource-group-label-${info.groupValue}`}

        // Automatically open/close resource groups on first load
        resourceGroupLabelDidMount={info => {
            const resource = config.resources?.find(r => r.id === info.groupValue);
            
            const noEvents = !eventsBase.some(e => e.resourceIds?.includes(info.groupValue));
            const collapsed = resource?.collapsed !== undefined? resource.collapsed: noEvents;

            const expander = info.el.querySelector(`.fc-datagrid-expander:has(.fc-icon-${collapsed? 'minus':'plus'}-square)`) as HTMLButtonElement;
            expander?.click();
        }}

        // Sorting
        resourceOrder="title"
        eventOrder={(a, b) => {
            const recordA = (a as { record: JAC.Event }).record;
            const recordB = (b as { record: JAC.Event }).record;

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
        
        buttonIcons={false}
        headerToolbar={{
            left: '',//'title',
            right: ''
        }}
        
        eventTimeFormat={config.eventTimeFormat ?? 'HH:mm'}
        
        // These will be switched out for config values in the future
        slotMinTime="08:00"
        slotMaxTime="21:15"

        slotLabelFormat="HH:mm"
        slotDuration="00:15"
        slotLabelInterval={15}

        // Event handlers
        eventClick={info => {
            const root = info.el;

            // Return if the element clicked was a button
            const buttons = root.querySelectorAll('button');

            const target = info.jsEvent.target as HTMLElement;
            for (const button of buttons) {
                if (target === button || button.contains(target)) return;
            }

            performScript('editEvent', info.event.id);
        }}

        eventChange={info => {
            const revertId = randomUUID();
            setRevertFunctions(prev => ({ ...prev, [revertId]: info.revert }));

            performScript('onEventChange', {
                record: info.event.extendedProps.record,
                start: info.event.start,
                end: info.event.end,
                oldResource: (info as EventDropArg).oldResource?.toJSON(),
                newResource: (info as EventDropArg).newResource?.toJSON(),
                revertId
            });
        }}

        eventMouseEnter={info => {
            const rect = info.el.getBoundingClientRect();
            const record = info.event.extendedProps.record as JAC.Event;

            const buttons = eventButtons(record);

            setDropdown(prev => ({
                ...prev,
                x: rect.left + rect.width,
                // Move the dropdown up slightly if there's space for it
                y: rect.top + rect.height - (
                (
                    Math.min(rect.width, rect.height) >= (50) ||
                    (rect.height >= 100)
                )? 34: 2),
                buttons,
                visible: true
            }))
        }}

        eventMouseLeave={() => {
            setDropdown(prev => ({ ...prev, visible: false }))
        }}

        datesSet={info => {
            setResourcesTitle(info.view.title);
        }}
    />
}

export default FullCalendar;