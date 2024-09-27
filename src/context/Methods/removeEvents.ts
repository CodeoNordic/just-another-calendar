import { useConfigState } from '@context/Config';
import { useCreateMethod } from '@utils/createMethod';

import searchArray from '@utils/searchArray';
import searchObject from '@utils/searchObject';

export default function useRemoveEvents() {
    const [, setConfig] = useConfigState();

    const removeEvents: Window['removeEvents'] = (search, limit) => setConfig(prev => {
        if (!prev) return null;
        const { events, ...rest } = prev;

        if (!search || !events) return { ...prev, events: [] };

        if (!Number.isFinite(limit) || (limit! < 1)) return {
            ...rest,
            events: searchArray(events, search, true)
        }

        return {
            ...rest,
            events: events.filter((event, i) => {
                if (i >= limit!) return true;
                return !searchObject(event, search)
            })
        }
    });
    
    useCreateMethod('removeEvents|removeEvent', removeEvents);
}