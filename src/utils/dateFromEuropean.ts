export default function dateFromEuropean(str: string) {
    const parts = str.split(/\.|-|\//);

    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);

    if ([day, month, year].includes(NaN)) return;
    return new Date(year, month, day);
}