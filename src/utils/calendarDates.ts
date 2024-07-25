const weekDayOrder: string[] = [
    'mon',
    'tue',
    'wed',
    'thu',
    'fri',
    'sat',
    'sun'
];

export default function getCalendarDates(date: Date): ({ middle: Date[]; start: Date[]; end: Date[] }) {
    const startDate = new Date(date);
    startDate.setDate(1);

    const endDate = new Date(date);
    endDate.setMonth(endDate.getMonth() + 1);
    endDate.setDate(0);

    const year = endDate.getFullYear();
    const month = endDate.getMonth() + 1; // 0 indexed months

    const max = endDate.getDate();

    const datesMiddle: Date[] = [];
    for (let i = 1; i <= max; i++)
        datesMiddle.push(new Date(`${year}/${month}/${i}`));

    const startWeekday = startDate.toLocaleDateString('en', { weekday: 'short' }).toLowerCase();
    //const endWeekday = endDate.toLocaleDateString('en', { weekday: 'short' }).toLowerCase();

    const extraStartDates = Math.max(weekDayOrder.indexOf(startWeekday), 0);
    const extraEndDates = Math.max(42 - (datesMiddle.length + extraStartDates), 0);//Math.max(6 - weekDayOrder.indexOf(endWeekday), 0);

    if (!extraStartDates && !extraEndDates) return { middle: datesMiddle, start: [], end: [] };

    const firstStartDate = new Date(startDate);
    firstStartDate.setDate(-(extraStartDates - 1));

    const monthStart = startDate.getMonth() + 1; // 0 indexed months

    const datesStart: Date[] = [];
    const datesEnd: Date[] = [];

    for (let i = 1; i <= extraStartDates; i++) {
        datesStart.push(new Date(firstStartDate));
        firstStartDate.setDate(firstStartDate.getDate() + 1);
    }

    const nextMonth = new Date(date);
    nextMonth.setMonth(nextMonth.getMonth() + 1);

    const nextMonthBase = `${nextMonth.getFullYear()}/${nextMonth.getMonth() + 1}`;

    for (let i = 1; i <= extraEndDates; i++)
        datesEnd.push(new Date(`${nextMonthBase}/${i}`));

    return {
        middle: datesMiddle,
        start: datesStart,
        end: datesEnd
    }
}

//window.debug = getCalendarDates;

/*
    // Calculate additional dates to fill the date picker
    const extraDates = useMemo(() => {
        const start = new Date(selectedMonth);
        start.setDate(1);

        const end = new Date(selectedMonth);
        end.setMonth(end.getMonth() + 1);

        const nextMonthBase = `${end.getFullYear()}/${end.getMonth() + 1}`;
        end.setDate(0);

        const startWeekday = start.toLocaleDateString('en', { weekday: 'short' }).toLowerCase();
        const endWeekday = end.toLocaleDateString('en', { weekday: 'short' }).toLowerCase();

        const extraStart = weekMap[startWeekday as keyof typeof weekMap] ?? 0;
        let extraEnd = 6 - (weekMap[endWeekday as keyof typeof weekMap] ?? 0);

        const year = selectedMonth.getFullYear();
        const monthStart = start.getMonth() + 1; // 0 indexed months

        const firstStartDate = new Date(start);
        firstStartDate.setDate(-(extraStart - 1));
        
        const extraDatesStart: string[] = [];
        // Add start dates
        for (let i = 0; i < extraStart; i++) {
            extraDatesStart.push(`${year}/${monthStart}/${firstStartDate.getDate() + i}`);
        }

        // Ensure that 6 weeks will be shown
        if ((dates.length + extraDatesStart.length + extraEnd) <= 35) extraEnd += 7;

        const extraDatesEnd: string[] = [];
        // Add end dates

        for (let i = 1; i <= extraEnd; i++) {
            extraDatesEnd.push(`${nextMonthBase}/${i}`);
        }

        return {
            start: extraDatesStart,
            end: extraDatesEnd
        }
    }, [dates, selectedMonth]);
    */