import { useEffect } from 'react';

export default function createMethod<Name extends string & keyof Constrain<Window, Function>>(name: Name, cb: Window[Name]) {
    window[name] = (...params: string[]) => {
        console.log(params);
        try {
            const parsedParams = params.map(p => {
                try {
                    return JSON.parse(p)
                } catch {
                    return p;
                }
            });
            
            return cb(...parsedParams);
        } catch(err) {
            console.error(err);
        }
    }

    // Return cleanup function
    return () => {
        delete window[name];
    }
}

export function useCreateMethod<Name extends string & keyof Constrain<Window, Function>>(name: Name, cb: Window[Name], dependencies?: any[]) {
    useEffect(() => {
        const cleanup = createMethod(name, cb);
        return cleanup;
    }, dependencies ?? []);
}