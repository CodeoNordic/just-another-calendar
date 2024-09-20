import calculateContrast from '@utils/contrast';
import datesFromEvent from '@utils/datesFromEvent';

export default function mapEvents(config: JAC.Config) {
    return config.events.map((event, i) => {
        if (!event.id) {
            console.warn(`The following event does not have an associated ID, and will instead use its array index`, event);
            event.id = String(i);
        }

        const dates = datesFromEvent(event);

        const eventStart = dates.start;
        const eventEnd = dates.end;

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
            backgroundColor: event.colors?.background || "#3788d8",
            borderColor: event.colors?.border || "#3788d8",
            textColor: (config?.contrastCheck !== false && !calculateContrast(event.colors?.text || "#fff", event.colors?.background || "#3788d8", config.contrastMin)) ? 
            "#000" : event.colors?.text,
            start: eventStart,
            end: eventEnd,
            extendedProps: { event },
            allDay: Boolean(event.allDay)
        }
    }).filter(ev => {
        const filterId = ev.extendedProps.event.filterId;
        let filteredOut = false 

        if (typeof filterId === 'string') 
            filteredOut = config.eventFilters?.some(filter => {
                return !filter.enabled && filter.id == filterId && filter.clientOnly;
            }) || false;
        else if (filterId instanceof Array)  
            filteredOut = filterId?.every(id => {
                return config.eventFilters?.some(filter => filter.id == id && !filter.enabled && filter.clientOnly); 
            });
    
        
        const sourceId = ev.extendedProps.event.source; 
        let filteredSource = false;

        const filteredSearch = config.searchBy ? (config?.searchBy).every((field) => {
            return config.search && !ev.extendedProps.event[field]?.toLowerCase().includes(config.search.toLowerCase());
        }) : false;

        if (filteredOut || filteredSearch || filteredSource) return false;

        if (!ev.start || !ev.end) {
            console.warn(`The following event has an invalid start and/or end date`, ev.extendedProps.event);
            return false;
        }

        return true;
    })
}