import { useEffect } from 'preact/hooks';
import { useConfigState } from '@context/Config';

import createMethod from '@utils/createMethod';

export default function useRemoveRecords() {
    const [, setConfig] = useConfigState();

    useEffect(() => createMethod('removeRecords', (search, limit) => setConfig(prev => {
        if (!prev) return null;
        const { records, ...rest } = prev;

        if (!search || !records) return { ...prev, records: [] };

        const searches = search instanceof Array? search: [search];
        const maxFilteredRecords = limit || Infinity;

        let filteredRecords: number = 0;
        const indexesToFilter: number[] = [];

        for (let i = 0; (i < records.length) && (filteredRecords < maxFilteredRecords); i++) {
            const record = records[i];

            // Check that every property of the record matches the search
            const toBeRemoved = searches.every(s => Object.keys(s)
                .every(k => record[k] == s[k])
            );

            if (toBeRemoved) {
                indexesToFilter.push(i);
                filteredRecords++;
            }
        }

        return {
            ...rest,
            records: [...records.filter((r, i) => !indexesToFilter.includes(i))]
        }
    })), []);
}