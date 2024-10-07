import { useConfigState } from '@context/Config';
import { useCreateMethod } from '@utils/createMethod';

import searchObject from '@utils/searchObject';

export default function useRemoveEvents() {
    const [, setConfig] = useConfigState();

    const removeEvents: Window['removeEvents'] = (search, limit) => setConfig(prev => {
        if (!prev) return null;
        const { events, ...rest } = prev;

        if (!search || !events) return { ...prev, events: [] };
        if (!Number.isFinite(limit) || ((limit ?? Infinity) < 1))
            limit = Infinity;

        let deleted = 0;

        // If the search is a string, remove the event ID
        if (typeof search === 'string') return {
            ...rest,
            events: events.filter((ev) => {
                if (ev.id === search && deleted < limit!) {
                    deleted++;
                    return false;
                }

                return true;
            })
        }

        return {
            ...rest,
            events: events.filter((event, i) => {
                if (searchObject(event, search) && deleted < limit!) {
                    deleted++;
                    return false;
                }

                return true;
            })
        }
    });
    
    useCreateMethod('removeEvents|removeEvent|deleteEvents|deleteEvent', removeEvents);
}