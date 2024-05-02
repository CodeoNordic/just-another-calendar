import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import momentPlugin from '@fullcalendar/moment';
import resourcePlugin from '@fullcalendar/resource'
import resourceTimelinePlugin from '@fullcalendar/resource-timeline';

import { useConfig } from '@context/Config';
import { formatDate } from '@fullcalendar/core';

import performScript from '@utils/performScript';

const Calendar: FC = () => {
    const config = useConfig();
    if (!config) return null;

    return <FullCalendar
        schedulerLicenseKey={config.licenseKey}
        plugins={[ dayGridPlugin, timeGridPlugin, momentPlugin, resourcePlugin, resourceTimelinePlugin ]}
        initialView={config.initialView}
        initialDate={config.initialDate}
        locale={config.locale}
        fixedWeekCount={false}
        buttonIcons={false}
        headerToolbar={{
            left: 'title'
        }}
        editable
        eventDurationEditable
        droppable={false}
        eventTimeFormat={config.eventTimeFormat}
        eventDisplay='block'
        slotEventOverlap={false}
        defaultAllDay
        scrollTime='08:00'
        slotMinTime='00:00'
        slotMaxTime='24:00'
        datesSet={date => {
            const dateStr = formatDate(date.start);
            console.log(dateStr)
            performScript('date', dateStr);
        }}
    />
}

export default Calendar;