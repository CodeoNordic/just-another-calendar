import { useEffect } from 'preact/hooks';
import { useConfigState } from '@context/Config';

import createMethod from '@utils/createMethod';
import searchArray from '@utils/searchArray';

export default function useRemoveRecords() {
    const [, setConfig] = useConfigState();

    useEffect(() => createMethod('removeRecords', (search, limit) => setConfig(prev => {
        if (!prev) return null;
        const { records, ...rest } = prev;

        if (!search || !records) return { ...prev, records: [] };

        return {
            ...rest,
            records: searchArray(records, search, true)
        }
    })), []);
}