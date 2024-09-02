export default function dateToObject(d: Date|string) {
    if (typeof d === 'string') d = new Date(d);
    
    return {
        year: d.getFullYear(),
        month: d.getMonth() + 1, // 0 indexed months
        day: d.getDate(),
        iso: d.toISOString(),
        unix: Math.floor(d.valueOf() / 1000)
    }
}