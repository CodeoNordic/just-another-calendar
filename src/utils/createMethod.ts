export default function createMethod<Name extends string & keyof Constrain<Window, Function>>(name: Name, cb: Window[Name]) {
    window[name] = (...params: string[]) => {
        try {
            const parsedParams = params.map(p => JSON.parse(p));
            return cb(...parsedParams);
        } catch(err) {
            console.error(err);
        }
    }

    // Return cleanup function
    return () => {
        window[name] = undefined;
    }
}