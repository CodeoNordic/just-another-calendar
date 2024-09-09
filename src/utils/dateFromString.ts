export default function dateFromString(str?: string) {
    if (!str) return;
    str = str.trim();

    const [strDate, strTime] = str.split('T');
    const parts = strDate.split('.');

    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);

    let result: Date|undefined;

    if ([day, month, year].includes(NaN)) result = new Date(strDate.replaceAll('-', '/') || NaN) || undefined;
    else result = new Date(year, month, day) || new Date(strDate.replaceAll('-', '/') || NaN);

    //if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?(?:Z|[+-]\d{2}:\d{2})?$/.test(strTime)) {
        const time = strTime?.match(/(\d{2}):(\d{2}):(\d{2})/); /* (\d{1,2}):(\d{1,2}):?(\d{1,2})?\.?(\d{1,3})?Z?$ <- old*/
        if (time) result.setHours(
            Number(time[1]) || 0,
            Number(time[2]) || 0,
            Number(time[3]) || 0,
            Number(time[4]) || 0
        );
    //}


    return result || new Date(0);
}