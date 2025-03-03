import fileMakerFindEquivalent from './filemakerFindEquivalent';

/**
 * searches for a value in an object
 * @param obj the object to search 
 * @param searchParam the value to search for
 * @returns if the value is found
 * @example
 * ```ts
 * searchObject({ "FirstName": "John" }, "John"); // true
 * searchObject({ "FirstName": "John" }, { "FirstName": "John" }); // true
 * searchObject({ "FirstName": "John" }, "Doe"); // false 
 * searchObject({ "FirstName": "John", "Age": 21 }, [{ "FirstName": "John" }, { "Age": 21 }]); Searches for anyone named John OR the age of 21
 * ```
 */
export default function searchObject(obj: RSAny, searchParam: string|RSAny|Array<string|RSAny>): boolean {
    if (!obj || !searchParam) return true;

    if (typeof searchParam === 'string') return Object.keys(obj)
        .some(k => {
            const value = obj[k];
            if (typeof value === 'object' && value !== null)
                return searchObject(value, searchParam);
            if (typeof value === 'string')
                return fileMakerFindEquivalent(value, searchParam);

            return false;
        });

    if (searchParam instanceof Array)
        return searchParam.some(param => {
            const s = searchObject(obj, param);
            return s;
        });
    
    // searchParam is object
    return Object.keys(searchParam)
        .every(k => {
            const searchValue = searchParam[k];
            const value = (k === '_config')? window._config: obj[k];

            if (searchValue === '*') return !["", undefined, null, NaN].includes(value);
            if (typeof searchValue === 'string' && typeof value === 'string')
                return fileMakerFindEquivalent(value, searchValue);

            if (typeof value === 'object')
                return searchObject(value, searchValue);

            return fileMakerFindEquivalent(value, searchValue);
        });
}