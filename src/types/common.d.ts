declare global {
    type RSAny = Record<string, any>;
    type FC<T = {}> = React.FC<T>;

    /**
     * Filters out properties of T given by constraint C
     * @example
     * ```ts
     * interface MyObject {
     *     someValue: 5;
     *     run(): void;
     *     get(): void;
     * }
     * 
     * // Method keys of MyObject
     * type Methods = keyof Constrain<MyObject, Function>;
     * ```
    */
    type Constrain<T, C> = Pick<T, {
        [K in keyof T]: T[K] extends C? K: never
    }[keyof T]>;
}

export {}