import { useConfigState } from '@context/Config';
import { useCreateMethod } from '@utils/createMethod';

export default function useSetEvents() {
    const [, setConfig] = useConfigState();

    useCreateMethod('setEvents', param => setConfig(prev => {
        if (!prev) return prev;
        const { events, ...rest } = prev;

        return {
            ...rest,
            events: param instanceof Array? param: [param]
        }
    }));
}