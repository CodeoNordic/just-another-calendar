import dateFromString from './dateFromString';

export default function dateToObject(d: Date|string) {
    if (typeof d === 'string') d = dateFromString(d)!;
    if (!(d instanceof Date)) throw new Error(`Attempted to parse ${d} as a date`);
    
    return {
        year: d.getFullYear(),
        month: d.getMonth() + 1, // 0 indexed months
        day: d.getDate(),
        iso: d.toISOString(),
        utc: d.toUTCString(),
        unix: Math.floor(d.valueOf() / 1000)
    }
}