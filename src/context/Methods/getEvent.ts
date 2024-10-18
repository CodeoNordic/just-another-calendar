import { useCreateMethod } from '@utils/createMethod';

export default function useGetEvent() {
    useCreateMethod('getEvent', id => {
        return window._config?.events?.find(ev => ev.id === id);
    });
}