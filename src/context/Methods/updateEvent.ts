import { useEffect } from 'react';
import { useConfigState } from '@context/Config';

import createMethod from '@utils/createMethod';
import searchArray from '@utils/searchArray';

export default function useUpdateEvent() {
    const [, setConfig] = useConfigState();

    useEffect(createMethod('updateEvent', (find, data, autocreate = false) => setConfig(config => {
        if (!config || !config.events) return null;
        const copy = [...config.events];

        
        const events = searchArray(copy, find);
        if (!events.length) {
            if (!autocreate) {
                console.warn(`updateEvent find returned 0 results`);
                return config;
            }

            return {
                ...config,
                events: [...copy, data]
            };
            
        }

        if (events.length > 1) {
            console.warn(`updateEvent find returned more than 1 result`);
            return config;
        }

        const [event] = events;
    

        for (const k in data) {
            event[k] = data[k];
        }

        return {
            ...config,
            events: [...copy]
        }
    })), []);
}