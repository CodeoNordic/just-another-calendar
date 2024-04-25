import { useEffect, useState } from 'preact/hooks';
import { useConfig } from '@context/Config';

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
    const [records, setRecords] = useState<FM.ContactRecord[]>([]);
    const config = useConfig();

    useEffect(() => {
        if (!config?.records?.length) return setRecords([]);

        // If the search is empty, it should be cleared
        if ((search === null) || (search === undefined) || (search === '')) {
            setRecords(config.records);
            return;
        }

        if (typeof search === 'string') {
            // Checks whether a record includes the search string in any of it's values
            setRecords(config.records.filter(r =>
                Object.values(r)
                    .some(v => Boolean(
                        String(v).match(search)
                    ))
            ));
        } else {
            // Ensure that every value matches the search on the record
            setRecords(config.records.filter(r => {
                Object.keys(search)
                    .every(k => r[k] == search[k])
            }));
        }
    }, [config, search]);

    return records;
}