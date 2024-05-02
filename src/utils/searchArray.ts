function searchInObject(obj: RSAny, searchParam: string|RSAny): boolean {
    if (typeof searchParam === 'string') return Object.keys(obj)
        .some(k => {
            const value = obj[k];
            if (typeof value === 'object' && value !== null)
                return searchInObject(value, searchParam);
            if (typeof value === 'string')
                return value.toLowerCase().includes(searchParam.toLowerCase());

            return false;
        });
    
    // searchParam is object
    return Object.keys(searchParam)
        .every(k => {
            const searchValue = searchParam[k];
            const value = obj[k];

            if (typeof searchValue === 'string' && typeof value === 'string')
                // Do an exact match if value starts with ==
                return searchValue.startsWith('==')
                    ? value.toLowerCase() === searchValue.substring(2).toLowerCase()
                    : value.toLowerCase().includes(searchValue.toLowerCase());

            if (typeof value === 'object')
                return searchInObject(value, searchValue);

            return false;
        });
}

export default function searchArray<T extends Array<any>>(arr: T, searchParam?: null|string|RSAny, negativeSearch: boolean = false): T {
    if (!searchParam) return arr;

    const res = arr.filter(obj => searchInObject(obj, searchParam)) as T;
    if (!negativeSearch) return res;

    // Return a negative search
    return arr.filter(obj => !res.includes(obj)) as T;
}