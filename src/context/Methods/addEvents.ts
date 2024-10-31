import { useConfigState } from '@context/Config';

import { useCreateMethod } from '@utils/createMethod';
import searchArray from '@utils/searchArray';

export default function useAddEvents() {
    const [, setConfig] = useConfigState();

    const addEvents = (param: WithFilter<JAC.Event> | WithFilter<JAC.Event>[]) => setConfig(prev => {
        if (!prev) return null;
        
        const { events, ...rest } = prev;
        if (!events?.length) return prev;


        return {
            ...rest,
            events: [
                ...(events instanceof Array? events: []),
                // If _filter is defined, the event should only be included if no existing events match it
                ...(param instanceof Array? param: [param]).filter(event => !event._filter || !Boolean(
                    searchArray(events, event._filter).length
                )).map(({ _filter, ...ev }) => ev)
            ]
        }
    })

    useCreateMethod('addEvents|addEvent', addEvents);
}

