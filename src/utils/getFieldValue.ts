import get from 'lodash.get';
import dateFromString from './dateFromString';

/**
 * Parses the field definition and returns the desired value
 * 
 * _filter should be handled before this function is ran
*/
export default function getFieldValue(record: JAC.Event, field: JAC.EventField) {
    if (typeof field.eval === 'string') {
        try {
            const func = eval(field.eval);
            if (typeof func !== 'function') throw new Error('Eval result was not a function');

            const result = func(record);
            if (!['', null, undefined].includes(result)) return String(result);
        } catch(err) {
            console.error('Failed to parse eval for the following field', field);
            console.error(err);

            return null;
        }
    }

    if (typeof field.template === 'string') {
        try {
            return field.template.replaceAll(/\{([^\{\}]+)\}/g, (_, key: string) => {
                // If the key starts with 'Date:' return a formatted date
                if (key.toLowerCase().startsWith('date:')) return new Date(
                    dateFromString(String(get(
                        record,
                        key.substring(5)
                    ))) || ''
                ).toLocaleDateString(window._config?.locale, { day: '2-digit', month: 'long' });

                // If the key starts with 'Time:' return a formatted time
                if (key.toLowerCase().startsWith('time:')) return new Date(
                    dateFromString(String(get(
                        record,
                        key.substring(5)
                    ))) || ''
                ).toLocaleTimeString(window._config?.locale, { hour: '2-digit', minute: '2-digit' });

                // Else, return the value as a string
                return String(get(record, key));
            });
        } catch(err) {
            console.error('Failed to parse the template in the following field', field);
            console.error(err);
        }
    }

    if (typeof field.value !== 'string') {
        console.warn('The following field definition has no key to determine its value', field);
        return null;
    }

    const value = get(record, field.value);
    if (['', null, undefined].includes(value)) return null;

    return String(value);
}