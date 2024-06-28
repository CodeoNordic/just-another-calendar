export default function dateFromString(str?: string) {
    if (!str) return;
    const parts = str.split('.');

    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);

    if ([day, month, year].includes(NaN)) return new Date(str.replaceAll('-', '/') || NaN) || undefined;
    const result = new Date(year, month, day);

    return result || new Date(str.replaceAll('-', '/') || NaN) || undefined;
}