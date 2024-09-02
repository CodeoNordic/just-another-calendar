import { useEffect, useState } from 'react';
import { useConfig } from '@context/Config';

import searchArray from '@utils/searchArray';

/** 
 * Perform a search using a partial event
 * @example
 * ```tsx
 * const events = useEventSearch({ FirstName: 'Joakim' });
 * 
 * return <>
 *     {events.map((r, k) => <Delivery
 *         key={k}
 *         {...r}
 *     >)}
 * </>
 * ```
 */
export default function useEventSearch(search?: null|string|Partial<JAC.Event>, negativeSearch?: boolean) {
    const [events, setEvents] = useState<JAC.Event[]>([]);
    const config = useConfig();

    useEffect(() => {
        if (!config?.events?.length) return setEvents([]);
        setEvents(searchArray(config.events, search, negativeSearch));
    }, [config, search]);

    return events;
}