import { useMemo, useState } from 'react';
import { useConfig } from '@context/Config';

import Collapse from './Collapse';
import performScript from '@utils/performScript';

import getCalendarDates from '@utils/calendarDates';
import weekNumber from '@utils/weekNumber';
import dateFromString from '@utils/dateFromString';

import ArrowUp from 'jsx:@svg/arrow-up.svg';
import ArrowDown from 'jsx:@svg/arrow-down.svg';
import combineClasses from '@utils/combineClasses';

const DatePicker: FC = () => {
    const config = useConfig();

    const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());
    const selectedDate = useMemo(() => {
        const d = dateFromString(config?.date) || new Date();

        setSelectedMonth(new Date(d));
        return d;
    }, [config?.date]);

    const monthTitle = useMemo(() => {
        const name = selectedMonth.toLocaleDateString(config?.locale ?? 'nb', { month: 'long' });
        return `${name.substring(0, 1).toUpperCase()}${name.substring(1)} ${selectedMonth.getFullYear()}`
    }, [selectedMonth]);

    // Calculate the dates of the current month
    const dates = useMemo(() => getCalendarDates(selectedMonth), [selectedMonth]);

    const weekNumbers = useMemo(() => {
        const nums: number[] = [];

        // Could be optimized, but for simplicities sake, loop through each date
        [...dates.middle, ...dates.start, ...dates.end].forEach(date => {
            const num = weekNumber(new Date(date));
            if (nums.includes(num)) return;

            nums.push(num);
        });

        // Remove excess
        while (nums.length > 6) nums.pop();
        return nums;
    }, [dates]);

    return <div className="date-picker">
        <Collapse top={<>
            <span className="title">{monthTitle}</span>

            <button className="prev-month" onClick={() => {
                setSelectedMonth(new Date(selectedMonth.setMonth(selectedMonth.getMonth() - 1)))
            }}>
                <ArrowUp />
            </button>

            <button className="next-month" onClick={() => {
                setSelectedMonth(new Date(selectedMonth.setMonth(selectedMonth.getMonth() + 1)))
            }}>
                <ArrowDown />
            </button>
        </>}>
            <div className="date-picker-wrapper">
                <div className="week-numbers">
                    <span>U</span>
                    {weekNumbers.map((num, i) => <span key={i}>{String(num)}</span>)}
                </div>

                <div className="days">
                    <span>Ma</span>
                    <span>Ti</span>
                    <span>On</span>
                    <span>To</span>
                    <span>Fr</span>
                    <span>Lø</span>
                    <span>Sø</span>

                    {dates.start.map((date, i) => <button disabled key={i} className="extra-date">
                        {new Date(date).getDate()}
                    </button>)}

                    {dates.middle.map((date, i) => <button
                        key={i}
                        className={combineClasses('date', (new Date(date).valueOf() === selectedDate.valueOf()) && 'selected')}
                        onClick={() => {
                            const d = new Date(date);
                            performScript('onDateSelected', {
                                year: d.getFullYear(),
                                month: d.getMonth() + 1, // 0 indexed months
                                day: d.getDate()
                            });
                        }}
                    >
                        {new Date(date).getDate()}
                    </button>)}

                    {dates.end.map((date, i) => <button disabled key={i} className="extra-date">
                        {new Date(date).getDate()}
                    </button>)}
                </div>
            </div>
        </Collapse>
    </div>
}

export default DatePicker;