import { useEffect } from 'react';
import { useConfigState } from '@context/Config';

import createMethod from '@utils/createMethod';
import searchArray from '@utils/searchArray';



export default function useAddEvents() {
    const [, setConfig] = useConfigState();

    const addEvents = (param: JAC.Event | JAC.Event[]) => setConfig(prev => {
        console.log(param);
        if (!prev) return null;
        
        const { events, ...rest } = prev;
        if (!events?.length) return prev;


        return {
            ...rest,
            events: [
                ...(events instanceof Array? events: []),
                // If _filter is defined, the event should only be included if no existing events match it
                ...(param instanceof Array? param: [param])//.filter(event => !Boolean(
                    //searchArray(events, event._filter).length
                //))
            ]
        }
    })

    useEffect(() => createMethod('addEvents', addEvents), []);
    useEffect(() => createMethod('addEvent', addEvents), []);
}

