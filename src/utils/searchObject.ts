import fileMakerFindEquivalent from './filemakerFindEquivalent';

export default function searchObject(obj: RSAny, searchParam: string|RSAny): boolean {
    if (typeof searchParam === 'string') return Object.keys(obj)
        .some(k => {
            const value = obj[k];
            if (typeof value === 'object' && value !== null)
                return searchObject(value, searchParam);
            if (typeof value === 'string')
                return fileMakerFindEquivalent(value, searchParam);

            return false;
        });
    
    // searchParam is object
    return Object.keys(searchParam)
        .every(k => {
            const searchValue = searchParam[k];
            const value = (k === '_config')? window._config: obj[k];

            if (searchValue === '*') return ![undefined, null].includes(value);
            if (typeof searchValue === 'string' && typeof value === 'string')
                return fileMakerFindEquivalent(value, searchValue);

            if (typeof value === 'object')
                return searchObject(value, searchValue);

            return value == searchValue;
        });
}