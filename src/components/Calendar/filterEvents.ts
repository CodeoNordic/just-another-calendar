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

        affectingFilters && (event._affectingFilters = affectingFilters);

        let filterCheck = !affectingFilters.length;
        if (affectingFilters.length) {
            // Check if all filters are enabled, if not, filter out the event
            if (config.eventFilterBehaviour == 'all')
                filterCheck = affectingFilters.every(filter => !([0, false].includes(filter.enabled!)));

            // Check if any filter is enabled, if not, filter out the event
            else if (config.eventFilterBehaviour == 'any' || !config.eventFilterAreas?.length)
                filterCheck = affectingFilters.some(filter => !([0, false].includes(filter.enabled!)));
            
            else if ((config.eventFilterBehaviour === 'groupedAll' || config.eventFilterBehaviour == 'groupedAny')) {
                const filtersEvent = config.eventFilterAreas!.reduce<string[][]>((acc, area) => {
                    const filteredIds = filterIds?.filter(filterId => 
                        config.eventFilters?.some(filter => filter.areaName === area.name && filter.id === filterId)
                    );
                    acc.push(filteredIds);
                    return acc;
                }, []);
            
                // Check if all filters for at least one area is enabled, if not, filter out the event
                if (config.eventFilterBehaviour === 'groupedAll') filterCheck = filtersEvent.some(filterGroup => 
                    filterGroup.length > 0 && filterGroup.every(id => 
                        affectingFilters.some(filter => filter.id === id && !([0, false].includes(filter.enabled!)))
                    )
                );

                // Check if at least one filter for every area is enabled, if not, filter out the event
                if (config.eventFilterBehaviour === 'groupedAny') filterCheck = filtersEvent.every(filterGroup =>
                    filterGroup.length > 0 && filterGroup.some(id => 
                        affectingFilters.some(filter => filter.id === id && !([0, false].includes(filter.enabled!)))
                    )
                );
            }
        }

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
                    console.error('Eval failed for the following search field', field, err);
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