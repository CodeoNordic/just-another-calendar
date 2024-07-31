import searchObject from './searchObject';

export default function searchArray<T extends Array<any>>(arr: T, searchParam?: null|string|RSAny, negativeSearch: boolean = false): T {
    if (!searchParam) return arr;

    const res = arr.filter(obj => searchObject(obj, searchParam)) as T;
    if (!negativeSearch) return res;

    // Return a negative search
    return arr.filter(obj => !res.includes(obj)) as T;
}