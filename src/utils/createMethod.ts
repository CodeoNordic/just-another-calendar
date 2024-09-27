import { useEffect } from 'react';

export default function createMethod<Name extends string & keyof Constrain<Window, Function>>(name: Name|(string & {}), cb: Window[Name]) {
    const method = (...params: any[]) => {
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

    // Easy aliasing by splitting names with the | symbol (functionName|aliasFunctionName)
    const keys = name.split('|');
    // @ts-ignore
    keys.forEach(k => window[k] = method)

    // Return cleanup function
    return () => {
        // @ts-ignore
        keys.forEach(k => delete window[k]);
    }
}

export function useCreateMethod<Name extends string & keyof Constrain<Window, Function>>(name: Name|(string & {}), cb: Window[Name], dependencies?: any[]) {
    useEffect(() => {
        const cleanup = createMethod(name, cb);
        return cleanup;
    }, dependencies ?? []);
}