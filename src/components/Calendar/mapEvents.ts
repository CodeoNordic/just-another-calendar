import dateFromString from '@utils/dateFromString';
import calculateContrast from '@utils/contrast';

export default function mapEvents(config: JAC.Config) {
    return config.events.map((event, i) => {
        if (!event.id) {
            console.warn(`The following event does not have an associated ID, and will instead use its array index`, event);
            event.id = String(i);
        }
        //if (!event.resourceId && event.type !== 'backgroundEvent') console.warn(`The following event does not have a resource ID`, event);

        const eventStart = dateFromString(event.timestampStart ?? event.start ?? event.startDate ?? event.dateStart);
        const eventEnd = dateFromString(event.timestampEnd ?? event.end ?? event.endDate ?? event.dateEnd ?? event.dateFinishedDisplay);

        const timeStart = event.startTime ?? event.timeStart;
        const timeEnd = event.endTime ?? event.timeEnd;

        if (timeStart) {
            const match = timeStart.match(/^(\d{1,2}):(\d{1,2})/);
            match && eventStart?.setHours(Number(match[1]), Number(match[2]));
        }

        if (timeEnd) {
            const match = timeEnd.match(/^(\d{1,2}):(\d{1,2})/);
            match && eventEnd?.setHours(Number(match[1]), Number(match[2]));
        }

        if (event.type === 'backgroundEvent') return {
            start: eventStart,
            end: eventEnd,
            allDay: true,
            display: 'background',
            backgroundColor: event.backgroundColor ?? '#eaa',
            extendedProps: { event }
        }

        const resourceIds = event.resourceId instanceof Array? event.resourceId: (event.resourceId? [event.resourceId]: []);

        return {
            id: event.id,
            resourceId: resourceIds[0],
            resourceIds,
            backgroundColor: event.colors?.background,
            borderColor: event.colors?.border,
            textColor: (config?.contrastCheck !== false && !calculateContrast(event.colors?.text || "#fff", event.colors?.background || "#3788d8")) ? 
            "#000" : event.colors?.text,
            start: eventStart,
            end: eventEnd,
            extendedProps: { event },
            allDay: Boolean(event.allDay)
        }
    }).filter(ev => {
        const filteredOut = config.eventFilters?.some(filter => {
            return ev.extendedProps.event.filterId && !filter.enabled && filter.id == ev.extendedProps.event.filterId;
        });

        const filteredSearch = config.searchBy ? (config?.searchBy).every((field) => {
            return config.search && !ev.extendedProps.event[field].toLowerCase().includes(config.search);
        }) : false;

        if (filteredOut || filteredSearch) return false;

        if (!ev.start || !ev.end) {
            console.warn(`The following event has an invalid start and/or end date`, ev.extendedProps.event);
            return false;
        }

        // Return if the event is outside the date range
        /*if (dateRange) {
            if (
                (ev.start.valueOf() > dateRange.end.valueOf())
                || ev.end.valueOf() < dateRange.start.valueOf()
            ) return false;
        }*/

        return true;
    })
}