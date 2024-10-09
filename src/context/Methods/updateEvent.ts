import { useConfigState } from '@context/Config';
import { useCreateMethod } from '@utils/createMethod';

import searchArray from '@utils/searchArray';
import { warn } from '@utils/log';

import { v4 as randomUUID } from 'uuid';

export default function useUpdateEvent() {
    const [, setConfig] = useConfigState();

    useCreateMethod('updateEvent', (search, data, autocreate = false) => setConfig(config => {
        if (!config || !config.events || (typeof data !== 'object')) return config;
        const copy = [...config.events];
        
        const events = typeof search === 'string'
            ? copy.filter(ev => ev.id === search)
            : searchArray(copy, search);

        if (!events.length) {
            if (!autocreate) {
                warn(`updateEvent find returned 0 results`);
                return config;
            }

            if (!data.id) {
                warn(`Autocreate for the following event had no passed ID. An automatic UUID was generated.`);

                data.id = randomUUID();
                warn(data);
            }

            return {
                ...config,
                events: [...copy, data]
            };
            
        }

        if (events.length > 1) {
            warn(`updateEvent find returned more than 1 result`);
            return config;
        }

        const [event] = events;

        for (const k in data) {
            event[k] = data[k];
        }

        return {
            ...config,
            events: copy
        }
    }));
}