import { useConfigState } from '@context/Config';
import { useCreateMethod } from '@utils/createMethod';

import searchObject from '@utils/searchObject';
import set from 'lodash.set';

import { warn } from '@utils/log';

export default function useUpdateEventFilter() {
    const [, setConfig] = useConfigState();

    useCreateMethod('updateEventFilter', (find, data) => setConfig(config => {
        if (!config || !config.eventFilters) return config;
        const copy = [...config.eventFilters];

        // Find the filter
        const filter = (typeof find === 'number')
            ? copy[find] : (typeof find === 'string')
            ? copy.find(f => f.id === find) : (typeof find === 'object')
            ? copy.find(f => searchObject(f, find)) : undefined;

        if (!filter) {
            warn('The following find returned no results when attempting to update a filter', find);
            return config;
        }

        // Update the filter with each key of the data
        Object.keys(data).forEach(k => {
            set(filter, k, data[k as keyof typeof data]);
        });

        return {
            ...config,
            eventFilters: copy
        }
    }));
}