import searchObject from '@utils/searchObject';
import filemakerFindEquivalent from '@utils/filemakerFindEquivalent';

import get from 'lodash.get';

export default function filterEvents(config: JAC.Config): JAC.Event[] {
    const filters = config.eventFilters || [];
    if (!filters.length) return config.events;

    const searchFields = config.searchFields instanceof Array? config.searchFields: [];

    return config?.events?.filter(event => {
        const filterIds = (typeof event.filterId === 'string')? [event.filterId]: (event.filterId || []);

        const affectingFilters = filters.filter(filter => {
            let included = false;

            // True if the filter ID matches
            if ((typeof filter.id === 'string')) included = filterIds.includes(filter.id);

            // Run JavaScript
            if (!included && typeof filter.eval === 'string') {
                try {
                    const func = eval(filter.eval);
                    if (typeof func !== 'function') throw new Error('Eval result did not return a function');

                    const result = func(event, config);
                    if (Boolean(result)) included = true;
                } catch(err) {
                    console.error('Eval failed for the following event filter');
                    console.error(filter);
                    console.error(err);
                }
            }

            // True if the _filter criteria is fulfilled
            if (!included && filter._filter) included = searchObject(event, filter._filter);
            return included;
        });

        const filterCheck = !affectingFilters.length || affectingFilters.some(filter => !([0, false].includes(filter.enabled!)));

        const searchCheck = searchFields.every(field => {
            if ([undefined, null, NaN, ''].includes(field.value)) return true;
            
            // If eval is defined, return its result
            if (typeof field.eval === 'string') {
                try {
                    const func = eval(field.eval);
                    if (typeof func !== 'function') throw new Error('Eval result did not return a function');

                    const result = func(event, field.value, config);
                    return Boolean(result);
                } catch (err) {
                    console.error('Eval failed for the following search field');
                    console.error(field);
                    console.error(err);
                }
            }
            
            const searchBy = (typeof field.searchBy === 'string')
                ? [field.searchBy]
                : ((field.searchBy instanceof Array)? field.searchBy: []);

            return searchBy.some(key => filemakerFindEquivalent(
                String(get(event, key)),
                String(field.value)
            ));
        });

        return filterCheck && searchCheck;
    }) || [];
}