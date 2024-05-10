import { useEffect, useRef, useState } from 'react';
import { useConfig } from '@context/Config';

// Import components
import Delivery from '@components/Delivery';

// Import FullCalendar
import { default as FullCalendarReact } from '@fullcalendar/react';
import { DateInput, EventSourceInput } from '@fullcalendar/core';

// Import Calendar plugins
import momentPlugin from '@fullcalendar/moment';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import resourcePlugin from '@fullcalendar/resource'
import resourceDayGridPlugin from '@fullcalendar/resource-daygrid';
import resourceTimeGridPlugin from '@fullcalendar/resource-timegrid';
import resourceTimelinePlugin from '@fullcalendar/resource-timeline';

// Import utils
import createMethod from '@utils/createMethod';
import dateFromString from '@utils/dateFromString';
import performScript from '@utils/performScript';

interface Props {
    records?: FM.DeliveryRecord[];
    initialDate?: DateInput;
}

const FullCalendar: FC<Props> = props => {
    const calendarRef = useRef<FullCalendarReact|null>(null);
    const config = useConfig()!;

    const [currentDate, setCurrentDate] = useState<Date>(dateFromString(config.initialDate) || new Date());
    const cur = currentDate.valueOf();

    useEffect(() => {
        if (!calendarRef.current) return;
        const api = calendarRef.current.getApi();

        const cleanupSetView = createMethod('setView', view => api.changeView(view));
        const cleanupSetCurrentDate = createMethod('setCurrentDate', str => {
            const date = dateFromString(str) || new Date();
            api.gotoDate(date);
            setCurrentDate(date);
        });

        return () => {
            cleanupSetView();
            cleanupSetCurrentDate();
        }
    }, [calendarRef]);

    const eventsBase: EventSourceInput = (props.records ?? []).map(record => {
        const eventStart = dateFromString(record.dateStart)?.valueOf() || Infinity;
        const eventEnd = dateFromString(record.dateFinishedDisplay)?.valueOf() || 0;
        
        const overdue = cur > eventEnd;

        const start = /*overdue? new Date(cur).setHours(0, 0, 0, 0): */eventStart;
        const end = overdue? new Date(cur.valueOf() + (1000 * 60 * 60 * 24)).setHours(23, 59, 59): eventEnd;

        return {
            id: record.id,
            resourceId: record.resourceId,
            backgroundColor: record.colors?.background,
            borderColor: record.colors?.border,
            textColor: record.colors?.text,
            start,
            end,
            extendedProps: { record },
            allDay: true
        }
    });

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
                duration: { days: config.days },
                resourceGroupField: 'id',
                resourceGroupLabelContent: props => {
                    const resource = config.resources.find(r => r.id === props.groupValue);
                    return resource?.title ?? 'Uten navn';
                },
                resourceLabelContent: () => null,
                slotDuration: { days: 1 },
                slotLabelFormat: { day: '2-digit', weekday: 'long' },
                resourceAreaWidth: '15%',
                resourceAreaHeaderContent: () => null
            }
        }}

        // Add content
        resources={config.resources}
        events={eventsBase}

        // Renderer for each delivery
        eventContent={props => <Delivery
            {...props.event.extendedProps.record as FM.DeliveryRecord}
        />}

        // Sorting
        resourceOrder="title"
        eventOrder={(a, b) => {
            const recordA = (a as { record: FM.DeliveryRecord }).record;
            const recordB = (b as { record: FM.DeliveryRecord }).record;

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
        filterResourcesWithEvents={false}
        fixedWeekCount={false}
        slotEventOverlap={false}

        allDaySlot={false}
        
        buttonIcons={false}
        headerToolbar={{
            left: 'title',
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
            console.log(info);
            performScript('onDrag', {
                record: info.event.extendedProps.record,
                oldResource: info.oldResource?.toJSON(),
                newResource: info.newResource?.toJSON()
            })
        }}
    />
}

export default FullCalendar;