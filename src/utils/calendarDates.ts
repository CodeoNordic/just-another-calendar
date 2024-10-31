export const weekDays: string[] = [
    'sun',
    'mon',
    'tue',
    'wed',
    'thu',
    'fri',
    'sat'
];

export const isWeekendDay = (date: Date) => {
    if (!window._config) return false;

    let firstDay = window._config?.firstDayOfWeek!;
    if (typeof firstDay === 'string')
        firstDay = weekDays.indexOf(firstDay.toLowerCase().substring(0, 3));

    if (firstDay < 0) firstDay = 0;

    let firstWeekendDay = firstDay + 5;
    let secondWeekendDay = firstDay + 6;

    if (firstWeekendDay > 6) {
        firstDay -= 7;
        secondWeekendDay -= 7;
    }

    else if (secondWeekendDay > 6)
        secondWeekendDay -= 7;

    return [firstWeekendDay, secondWeekendDay].includes(date.getDay());
}

/** Get all the dates that should be displayed on a calendar for a particular month */
export default function getCalendarDates(date: Date, firstDay: string|number = 'mon'): ({ middle: Date[]; start: Date[]; end: Date[] }) {
    // Splicing from index and down, insert prev
    const weekDayOrder: string[] = [...weekDays];

    const firstDayIndex = typeof firstDay === 'string'
        ? Math.max(weekDays.findIndex(day => day === firstDay.toLowerCase().substring(0, 3)), 0)
        : firstDay;
    
    if (firstDayIndex > 0) {
        for (let i = 0; i < firstDayIndex; i++) {
            const day = weekDayOrder.splice(0, 1)[0];
            weekDayOrder.push(day);
        }
    }
    
    const startDate = new Date(date);
    startDate.setDate(1);

    const endDate = new Date(date);
    endDate.setDate(1);
    endDate.setMonth(endDate.getMonth() + 1);
    endDate.setDate(0);

    const year = endDate.getFullYear();
    const month = endDate.getMonth() + 1; // 0 indexed months

    const max = endDate.getDate();

    const datesMiddle: Date[] = [];
    for (let i = 1; i <= max; i++)
        datesMiddle.push(new Date(`${year}/${month}/${i}`));

    const startWeekday = startDate.toLocaleDateString('en', { weekday: 'short' }).toLowerCase();

    const extraStartDates = Math.max(weekDayOrder.indexOf(startWeekday), 0);
    const extraEndDates = Math.max(42 - (datesMiddle.length + extraStartDates), 0);

    if (!extraStartDates && !extraEndDates) return { middle: datesMiddle, start: [], end: [] };

    const firstStartDate = new Date(startDate);
    firstStartDate.setDate(-(extraStartDates - 1));

    const datesStart: Date[] = [];
    const datesEnd: Date[] = [];

    for (let i = 1; i <= extraStartDates; i++) {
        datesStart.push(new Date(firstStartDate));
        firstStartDate.setDate(firstStartDate.getDate() + 1);
    }

    const nextMonth = new Date(date);
    nextMonth.setDate(1);
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