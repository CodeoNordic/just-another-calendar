import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import momentPlugin from '@fullcalendar/moment';
import resourcePlugin from '@fullcalendar/resource'
import resourceDayGridPlugin from '@fullcalendar/resource-daygrid';
import interactionPlugin from '@fullcalendar/interaction';

import { useConfig } from '@context/Config';

import Delivery from './Delivery';
import performScript from '@utils/performScript';
import dateFromEuropean from '@utils/dateFromEuropean';

const Calendar: FC = () => {
    const config = useConfig();
    if (!config) return null;

    return <div className="calendar">
        <FullCalendar
            // Base config            
            schedulerLicenseKey={config.licenseKey}
            locale={config.locale ?? 'nb'}

            initialView={config.initialView ?? 'resourceDayGridWeek'}
            initialDate={dateFromEuropean(config.initialDate) || new Date(new Date(config.initialDate).valueOf() || new Date())}

            editable
            eventResourceEditable
            eventDurationEditable={false}

            // Add plugins
            plugins={[
                momentPlugin,
                interactionPlugin,
                dayGridPlugin,
                resourcePlugin,
                resourceDayGridPlugin
            ]}

            // Set up views
            views={{
                resourceDayGridWeek: {
                    duration: { days: 1 },
                    weekends: false,
                }
            }}

            // Add content
            resources={config.resources}
            events={config.records.map(record => ({
                id: record.id,
                resourceId: record.resourceId,
                backgroundColor: record.colors?.background,
                borderColor: record.colors?.border,
                textColor: record.colors?.text,
                start: new Date(record.dateStart),
                end: new Date(record.dateFinishedDisplay),
                extendedProps: { record }
            }))}

            // Renderer for each delivery
            eventContent={props => <Delivery
                {...props.event.extendedProps.record as FM.DeliveryRecord}
            />}

            // Sorting
            resourceOrder="title,id"
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
                performScript('onDrag', { id: info.event.id, resourceId: info.newResource!.id })
            }}
        />
    </div>
}

export default Calendar;