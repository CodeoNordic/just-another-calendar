import { useEffect } from 'react';
import { useConfigState } from '@context/Config';

import createMethod from '@utils/createMethod';

export default function useAddRecords() {
    const [, setConfig] = useConfigState();

    useEffect(() => createMethod('addRecords', param => setConfig(prev => {
        if (!prev) return null;
        const { records, ...rest } = prev;

        return {
            ...rest,
            records: [
                ...(records instanceof Array? records: []),
                ...(param instanceof Array? param: [param])
            ]
        }
    })), []);
}