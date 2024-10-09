import { useConfigState } from '@context/Config';
import { useCreateMethod } from '@utils/createMethod';

import searchObject from '@utils/searchObject';

export default function useRemoveEvents() {
    const [, setConfig] = useConfigState();

    const removeEvents: Window['removeEvents'] = (search, limit = Infinity) => setConfig(prev => {
        if (!prev) return null;
        const { events, ...rest } = prev;

        if (!search || !events) return { ...prev, events: [] };
        if (!Number.isFinite(limit) || (limit < 1))
            limit = Infinity;

        let deleted = 0;

        // If the search is a string, remove the event ID
        if (typeof search === 'string') {
            limit = 1;
            return {
                ...rest,
                events: events.filter((ev) => {
                    if (ev.id === search && deleted < limit) {
                        deleted++;
                        return false;
                    }
    
                    return true;
                })
            }
        }

        // The search may be an array of _filters and/or string IDs
        if (search instanceof Array) {
            return {
                ...rest,
                events: events.filter(event => {
                    if (search.some(s => {
                        if (typeof s === 'string') return event.id === s;
                        return searchObject(event, search);
                    }) && deleted < limit) {
                        deleted++;
                        return false;
                    }

                    return true;
                })
            }
        }

        // Otherwise, the search is one _filter object
        return {
            ...rest,
            events: events.filter(event => {
                if (searchObject(event, search) && deleted < limit) {
                    deleted++;
                    return false;
                }

                return true;
            })
        }
    });
    
    useCreateMethod('removeEvents|removeEvent|deleteEvents|deleteEvent', removeEvents);
}