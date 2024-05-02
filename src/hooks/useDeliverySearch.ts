import { useEffect, useState } from 'react';
import { useConfig } from '@context/Config';

import searchArray from '@utils/searchArray';

/** 
 * Perform a search with similar functionality to that of FileMaker
 * @example
 * ```tsx
 * const records = useContactSearch({ FirstName: 'Joakim' });
 * 
 * return <>
 *     {records.map((r, k) => <Contact
 *         key={k}
 *         {...r}
 *     >)}
 * </>
 * ```
 */
export default function useContactSearch<T = {}>(search?: null|string|Partial<FM.Record<T>>) {
    const [records, setRecords] = useState<FM.DeliveryRecord[]>([]);
    const config = useConfig();

    useEffect(() => {
        if (!config?.records?.length) return setRecords([]);
        setRecords(searchArray(config.records, search));
    }, [config, search]);

    return records;
}