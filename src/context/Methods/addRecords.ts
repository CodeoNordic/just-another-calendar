import { useEffect } from 'react';
import { useConfigState } from '@context/Config';

import createMethod from '@utils/createMethod';
import searchArray from '@utils/searchArray';

export default function useAddRecords() {
    const [, setConfig] = useConfigState();

    useEffect(() => createMethod('addRecords', param => setConfig(prev => {
        if (!prev) return null;
        
        const { records, ...rest } = prev;
        if (!records?.length) return prev;

        return {
            ...rest,
            records: [
                ...(records instanceof Array? records: []),
                // If _filter is defined, the record should only be included if no existing records match it
                ...(param instanceof Array? param: [param]).filter(record => !Boolean(
                    searchArray(records, record._filter).length
                ))
            ]
        }
    })), []);
}