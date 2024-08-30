import dateFromString from '@utils/dateFromString';
import calculateContrast from '@utils/contrast';

export default function mapEvents(config: JAC.Config) {
    return config.records.map((record, i) => {
        if (!record.id) {
            console.warn(`The following record does not have an associated ID, and will instead use its array index`, record);
            record.id = String(i);
        }
        //if (!record.resourceId && record.type !== 'backgroundEvent') console.warn(`The following record does not have a resource ID`, record);

        const eventStart = dateFromString(record.timestampStart ?? record.start ?? record.startDate ?? record.dateStart);
        const eventEnd = dateFromString(record.timestampEnd ?? record.end ?? record.endDate ?? record.dateEnd ?? record.dateFinishedDisplay);

        const timeStart = record.startTime ?? record.timeStart;
        const timeEnd = record.endTime ?? record.timeEnd;

        if (timeStart) {
            const match = timeStart.match(/^(\d{2}):(\d{2})/);
            match && eventStart?.setHours(Number(match[1]), Number(match[2]));
        }

        if (timeEnd) {
            const match = timeEnd.match(/^(\d{2}):(\d{2})/);
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
            textColor: (config?.contrastCheck !== false && !calculateContrast(record.colors?.text || "#fff", record.colors?.background || "#3788d8")) ? 
            "#000" : record.colors?.text,
            start: eventStart,
            end: eventEnd,
            extendedProps: { record },
            allDay: Boolean(record.allDay)
        }
    }).filter(ev => {
        const filteredOut = config.eventFilters?.some(filter => {
            return ev.extendedProps.record.filterId && !filter.enabled && filter.id == ev.extendedProps.record.filterId;
        });

        const filteredSearch = config.searchBy ? (config?.searchBy).every((field) => {
            return config.search && !ev.extendedProps.record[field].toLowerCase().includes(config.search);
        }) : false;

        if (filteredOut || filteredSearch) return false;

        if (!ev.start || !ev.end) {
            console.warn(`The following event has an invalid start and/or end date`, ev.extendedProps.record);
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