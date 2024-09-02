import { useEffect } from 'react';
import { useConfigState } from '@context/Config';

import createMethod from '@utils/createMethod';
import searchArray from '@utils/searchArray';

export default function useRemoveEvents() {
    const [, setConfig] = useConfigState();

    useEffect(() => createMethod('removeEvents', (search, limit) => setConfig(prev => {
        if (!prev) return null;
        const { events, ...rest } = prev;

        if (!search || !events) return { ...prev, events: [] };

        return {
            ...rest,
            events: searchArray(events, search, true)
        }
    })), []);
}