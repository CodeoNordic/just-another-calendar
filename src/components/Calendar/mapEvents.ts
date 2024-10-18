import filterEvents from './filterEvents';

import calculateContrast from '@utils/contrast';
import datesFromEvent from '@utils/datesFromEvent';

import { warn } from '@utils/log';

export function eventToFcEvent(event: JAC.Event, config: JAC.Config, i: number = 0, noIdCheck: boolean = false) {
    if (!event.id && !noIdCheck) {
        warn(`The following event does not have an associated ID, and will instead use its array index`, event);
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

    if (event._affectingFilters?.some(filter => !!filter.eventColor) && !(event.colors?.background || event.colors?.border || event.colors?.text)) {
        const affectingFilter = event._affectingFilters.filter(filter => !!filter.eventColor).sort((a, b) => {
            return (a.eventColorPriority || 0) - (b.eventColorPriority || 0);
        }).pop(); 

        event.colors ??= {};

        const eventColor = affectingFilter?.eventColor!;

        if (typeof eventColor === 'string') {
            !event.colors.background && (event.colors.background = eventColor);
            !event.colors.border && (event.colors.border = eventColor);
        } else if (eventColor instanceof Object) {
            !event.colors.background && (event.colors.background = eventColor.background);
            !event.colors.border && (event.colors.border = eventColor.border);
            !event.colors.text && (event.colors.text = eventColor.text);
        }
    }

    return {
        id: event.id,
        resourceId: resourceIds[0],
        resourceIds,
        backgroundColor: event.colors?.background || "#3788d8",
        borderColor: event.colors?.border || "#3788d8",
        textColor: (config?.contrastCheck !== false && !calculateContrast(event.colors?.text || "#fff", event.colors?.background || "#3788d8", config.contrastMin)) ? 
        (calculateContrast("#000", event.colors?.background || "#3788d8", config.contrastMin) ? "#000" : "#fff") : event.colors?.text,
        start: eventStart,
        end: eventEnd,
        duration: event.duration,
        extendedProps: { event },
        allDay: Boolean(event.allDay)
    }
}

export default function mapEvents(config: JAC.Config) {
    return filterEvents(config).map((event, i) => eventToFcEvent(event, config, i))/*.filter(ev => {
        const filterIds = ev.extendedProps.event.filterId;
        let filteredOut = false;

        if (typeof filterIds === 'string' && !config.scriptNames.onEventFilterChange && config.eventFilters) 
            filteredOut = config.eventFilters.some(filter => 
                !filter.enabled && filter.id == filterIds && !filter.script
            );
        else if (filterIds instanceof Array && !config.scriptNames.onEventFilterChange && config.eventFilters) {
            if (config.eventFilterAreas) {
                const filters = config.eventFilterAreas.map(area => // filters ordered in array of filters for each area
                    config.eventFilters?.filter(filter => filter.areaName == area.name)
                );

                const filtersEvent = filters.map(filterArr => // filters for event ordered the same as above
                    filterIds?.filter(filterId =>filterArr?.some(filter => filter.id === filterId))
                );

                filteredOut = filters.some((filterArr, i) => // change to every if all different types of filters have to be off for event to filter out
                    // if no filters for area, return false so it doesn't return true and filter out
                    filtersEvent[i].length == 0 ? false : filtersEvent[i].every(id => // change to some if only one of same filter have to be off for event to filter out
                        filterArr?.some(filter => filter.id == id && !filter.enabled && !filter.script) 
                    )  
                );
            } else {
                filteredOut = filterIds.every(id => 
                    config.eventFilters?.some(filter => filter.id == id && !filter.enabled && !filter.script)
                );
            }
        }
            
        const filteredSearch = config.searchFields ? config.searchFields.some(searchField => {
            if (searchField.eval && searchField.value) {
                try {
                const func = eval(searchField.eval);
                if (typeof func !== 'function') throw new Error('Eval result was not a function')
            
                const result = func(searchField.value, ev.extendedProps.event, window._config);

                return !Boolean(result);

                } catch(err) {
                    console.error('Failed to parse eval for the following field', searchField);
                    console.error(err);
                    return false;
                }
            }
 
            if (!searchField.value || !searchField.searchBy || searchField.script || config.scriptNames.onSearch) return false;

            return searchField.searchBy?.every(field => 
                !ev.extendedProps.event[field]?.toLowerCase().includes(searchField.value?.toLowerCase())
            );
        }) : false;

        if (filteredOut || filteredSearch) return false;

        if ((!ev.start || !ev.end)) {
            warn(`The following event has an invalid start and/or end date`, ev.extendedProps.event);
            return false;
        }

        return true;
    })*/
}