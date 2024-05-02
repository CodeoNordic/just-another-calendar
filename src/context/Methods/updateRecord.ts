import { useEffect } from 'preact/hooks';
import { useConfigState } from '@context/Config';

import createMethod from '@utils/createMethod';
import searchArray from '@utils/searchArray';

export default function useUpdateRecord() {
    const [, setConfig] = useConfigState();

    useEffect(createMethod('updateRecord', (find, data) => setConfig(config => {
        if (!config || !config.records) return null;
        const copy = [...config.records];

        const records = searchArray(copy, find);
        if (!records.length) {
            console.warn(`updateRecord find returned no results`);
            return config;
        }

        if (records.length > 1) {
            console.warn(`updateRecord find returned more than 1 result`);
            return config;
        }
        
        const [record] = records;

        for (const k in data) {
            record[k] = data[k];
        }

        return {
            ...config,
            records: [...copy]
        }
    })), []);
}