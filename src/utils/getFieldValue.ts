import get from 'lodash.get';
import dateFromString from './dateFromString';

export function templateKey(event: JAC.Event, key: string) {
    // If the key starts with 'Date:' return a formatted date
    if (key.toLowerCase().startsWith('date:')) return new Date(
        dateFromString(String(get(
            event,
            key.substring(5)
        ))) || ''
    ).toLocaleDateString(window._config?.locale, { day: '2-digit', month: 'long' });

    // {Time:dateStart+timeStart}
    // If the key starts with 'Time:' return a formatted time
    if (key.toLowerCase().startsWith('time:')) {
        const pair = key.substring(5).split('+');    
        
        const date = dateFromString(String(get(event, pair[0])));

        if (pair[1] && date) {
            const time = String(get(event, pair[1])).split(':');
            date.setHours(Number(time[0]), Number(time[1]));
        }

        return date?.toLocaleTimeString(window._config?.locale, { hour: '2-digit', minute: '2-digit' }) || '';
    }

    // If the key starts with 'Eval:' call the function
    if (key.toLowerCase().startsWith('eval:')) {
        const func = eval(key.substring(5));
        if (typeof func !== 'function') throw new Error('Eval result was not a function');

        const result = func(event, window._config);

        if (['', null, undefined].includes(result)) return '';
        return String(result);
    }

    // Else, return the value as a string
    return String(get(event, key) || '');
}

/**
 * Parses the field definition and returns the desired value
 * 
 * _filter should be handled before this function is ran
*/
export default function getFieldValue(event: JAC.Event, field: JAC.EventField) {
    if (typeof field.eval === 'string') {
        try {
            // Parse the passed JS code. Must be a callable function
            const func = eval(field.eval);
            if (typeof func !== 'function') throw new Error('Eval result was not a function');

            const result = func(event, window._config);
            if (!['', null, undefined].includes(result)) return String(result);
        } catch(err) {
            console.error('Failed to parse eval for the following field', field);
            console.error(err);

            return null;
        }
    }

    if (typeof field.htmlTemplate === 'string' && field.htmlTemplate[0] === '<') {
        try {
            return field.htmlTemplate.replaceAll(
                /\{([^{}]*?(?:\\\{|\\\}|[^{}])*)\}/g,
                (_, key: string) => templateKey(
                    event,
                    key.replaceAll('\\{', '{')
                        .replaceAll('\\}', '}')
                )
            );
        } catch(err) {
            console.error('Failed to parse the HTML template for the following field', field);
            console.error(err);
        }
    }

    if (typeof field.template === 'string') {
        try {
            return field.template.replaceAll(
                /\{([^{}]*?(?:\\\{|\\\}|[^{}])*)\}/g,
                (_, key: string) => templateKey(
                    event,
                    key.replaceAll('\\{', '{')
                        .replaceAll('\\}', '}')
                )
            );
        } catch(err) {
            console.error('Failed to parse the template for the following field', field);
            console.error(err);
        }
    }

    // Warn and return null if none of the keys are defined
    if (typeof field.value !== 'string') {
        typeof field.template !== 'string' && typeof field.eval !== 'string' && console.warn("The following field definition has no key to determine its value. One of three keys must be defined: 'value', 'template', 'eval'", field);
        return null;
    }

    // Return based on field.value
    const value = get(event, field.value);
    if (['', null, undefined].includes(value)) return null;

    return String(value);
}