import { useEffect, useState } from 'react';
import { useConfig } from '@context/Config';

import searchArray from '@utils/searchArray';

/** 
 * Perform a search using a partial record
 * @example
 * ```tsx
 * const records = useEventSearch({ FirstName: 'Joakim' });
 * 
 * return <>
 *     {records.map((r, k) => <Delivery
 *         key={k}
 *         {...r}
 *     >)}
 * </>
 * ```
 */
export default function useEventSearch(search?: null|string|Partial<JAC.Event>, negativeSearch?: boolean) {
    const [records, setRecords] = useState<JAC.Event[]>([]);
    const config = useConfig();

    useEffect(() => {
        if (!config?.records?.length) return setRecords([]);
        setRecords(searchArray(config.records, search, negativeSearch));
    }, [config, search]);

    return records;
}