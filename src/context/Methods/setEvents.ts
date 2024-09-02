import { useEffect } from 'react';
import { useConfigState } from '@context/Config';

import createMethod from '@utils/createMethod';

export default function useSetEvents() {
    const [, setConfig] = useConfigState();

    useEffect(() => createMethod('setEvents', param => setConfig(prev => {
        if (!prev) return null;
        const { events, ...rest } = prev;

        return {
            ...rest,
            events: param instanceof Array? param: [param]
        }
    })), []);
}