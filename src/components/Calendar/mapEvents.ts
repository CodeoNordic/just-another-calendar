import filterEvents from './filterEvents';

import calculateContrast from '@utils/contrast';
import datesFromEvent from '@utils/datesFromEvent';

import { warn } from '@utils/log';
import tinycolor from 'tinycolor2';

export function eventToFcEvent(event: JAC.Event, config: JAC.Config, i: number = 0, noIdCheck: boolean = false) {
    if (!event.id && !noIdCheck) {
        warn(`The following event does not have an associated ID, and will instead use its array index`, event);
        event.id = String(i);
    }

    const dates = datesFromEvent(event);

    const eventStart = dates.start;
    const eventEnd = dates.end;

    
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
    
    if (event.type === 'backgroundEvent') {
        const backgroundColor = tinycolor(event.colors?.background || '#eaa').setAlpha(0.3);

        return {
            start: eventStart,
            end: eventEnd,
            allDay: Boolean(event.allDay),
            display: 'background',
            backgroundColor: backgroundColor.toRgbString(),
            resourceId: resourceIds[0],
            resourceIds,
            extendedProps: { event },
        }
    }
    
    return {
        id: event.id,
        resourceId: resourceIds[0],
        resourceIds,
        backgroundColor: event.colors?.background || "#3788d8",
        borderColor: event.colors?.border || event.colors?.background || "#3788d8",
        textColor: config?.contrastCheck !== false ? ( 
                calculateContrast(event.colors?.text || "#fff", event.colors?.background || "#3788d8", config.contrastMin)
                    ? event.colors?.text || "#fff" 
                    : calculateContrast("#000", event.colors?.background || "#3788d8", config.contrastMin) ? "#000" : "#fff"
            ) : event.colors?.text || "#fff",
        start: eventStart,
        end: eventEnd,
        duration: event.duration,
        extendedProps: { event },
        allDay: Boolean(event.allDay)
    }
}

export default function mapEvents(config: JAC.Config) {
    return filterEvents(config).map((event, i) => eventToFcEvent(event, config, i));
}