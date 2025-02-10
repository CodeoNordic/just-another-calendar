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

    if (config.clampStartDates)
        dates.start = new Date(
            Math.max(dates.start?.valueOf() ?? 0, new Date(config.date ?? Date.now()).valueOf())
        );

    if (config.clampEndDates)
        dates.end = new Date(
            Math.min(dates.end?.valueOf() ?? 0, new Date(config.date ?? Date.now()).valueOf() + ((config.days ?? 0) * 1000 * 60 * 60 * 24))
        );

    const eventStart = dates.start;
    let eventEnd = dates.end;

    if ((eventEnd?.valueOf() ?? 0) < (eventStart?.valueOf() ?? 0))
        eventEnd = new Date(
            (eventStart?.valueOf() ?? 0) + ((config.days ?? 0) * 1000 * 60 * 60 * 24)
        );

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

    const backgroundColor = tinycolor(event.colors?.background || '#3788d8');
    const borderColor = tinycolor(event.colors?.border || event.colors?.background || '#3788d8');
    const textColor = event.colors?.text || '#fff';

    if (event.type === 'backgroundEvent') {
        backgroundColor.setAlpha(0.3);
        borderColor.setAlpha(0.3);

        return {
            start: eventStart,
            end: eventEnd,
            allDay: Boolean(event.allDay),
            display: 'background',
            backgroundColor: backgroundColor.toRgbString(),
            borderColor: borderColor.toRgbString(),
            textColor: config?.contrastCheck !== false ? ( 
                calculateContrast(textColor, backgroundColor.toRgbString(), config.contrastMin)
                    ? textColor 
                    : calculateContrast("#000", backgroundColor.toRgbString(), config.contrastMin) ? "#000" : "#fff"
            ) : textColor, 
            extendedProps: { event },
            ...(resourceIds.length > 0 && { resourceId: resourceIds[0], resourceIds })
        };
    }
    
    return {
        id: event.id,
        resourceId: resourceIds[0],
        resourceIds,
        backgroundColor: backgroundColor.toRgbString(),
        borderColor: borderColor.toRgbString(),
        textColor: config?.contrastCheck !== false ? ( 
                calculateContrast(textColor, backgroundColor.toRgbString(), config.contrastMin)
                    ? textColor 
                    : calculateContrast("#000", backgroundColor.toRgbString(), config.contrastMin) ? "#000" : "#fff"
            ) : textColor,
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