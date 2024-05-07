import { useEffect } from 'react';
import { useConfigState } from '@context/Config';

import createMethod from '@utils/createMethod';

export default function useSetRecords() {
    const [, setConfig] = useConfigState();

    useEffect(() => createMethod('setRecords', param => setConfig(prev => {
        if (!prev) return null;
        const { records, ...rest } = prev;

        return {
            ...rest,
            records: param instanceof Array? param: [param]
        }
    })), []);
}