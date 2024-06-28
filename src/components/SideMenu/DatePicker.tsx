import { useMemo, useState } from 'react';
import { useConfig } from '@context/Config';

import Collapse from './Collapse';

import performScript from '@utils/performScript';
import weekNumber from '@utils/weekNumber';
import dateFromString from '@utils/dateFromString';

import ArrowUp from 'jsx:@svg/arrow-up.svg';
import ArrowDown from 'jsx:@svg/arrow-down.svg';
import combineClasses from '@utils/combineClasses';

// Used to determine extra days to fill the date picker
const weekMap = {
    mon: 0,
    tue: 1,
    wed: 2,
    thu: 3,
    fri: 4,
    sat: 5,
    sun: 6
} as const;

const DatePicker: FC = () => {
    const config = useConfig();

    const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());
    const selectedDate = useMemo(() => {
        const d = dateFromString(config?.initialDate) || new Date();

        setSelectedMonth(new Date(d));
        return d;
    }, [config?.initialDate]);

    const monthTitle = useMemo(() => {
        const name = selectedMonth.toLocaleDateString(config?.locale ?? 'nb', { month: 'long' });
        return `${name.substring(0, 1).toUpperCase()}${name.substring(1)} ${selectedMonth.getFullYear()}`
    }, [selectedMonth]);

    // Calculate the dates of the current month
    const dates = useMemo(() => {
        const maxDate = new Date(selectedMonth);
        maxDate.setMonth(maxDate.getMonth() + 1);
        maxDate.setDate(0);

        const year = maxDate.getFullYear();
        const month = maxDate.getMonth() + 1; // 0 indexed months

        const max = maxDate.getDate();

        const dates: string[] = [];
        for (let i = 1; i <= max; i++) {
            dates.push(`${year}/${month}/${i}`);
        }

        return dates;
    }, [selectedMonth]);

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

    const weekNumbers = useMemo(() => {
        const nums: number[] = [];

        // Could be optimized, but for simplicities sake, loop through each date
        [...dates, ...extraDates.start, ...extraDates.end].forEach(date => {
            const num = weekNumber(new Date(date));
            if (nums.includes(num)) return;

            nums.push(num);
        });

        // Remove excess
        while (nums.length > 6) nums.pop();

        return nums;
    }, [dates, extraDates]);

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

                    {extraDates.start.map((date, i) => <button disabled key={i} className="extra-date">
                        {new Date(date).getDate()}
                    </button>)}

                    {dates.map((date, i) => <button
                        key={i}
                        className={combineClasses('date', (new Date(date).valueOf() === selectedDate.valueOf()) && 'selected')}
                        onClick={() => {
                            const d = new Date(date);
                            performScript('selectDate', {
                                year: d.getFullYear(),
                                month: d.getMonth() + 1,
                                day: d.getDate()
                            });
                        }}
                    >
                        {new Date(date).getDate()}
                    </button>)}

                    {extraDates.end.map((date, i) => <button disabled key={i} className="extra-date">
                        {new Date(date).getDate()}
                    </button>)}
                </div>
            </div>
        </Collapse>
    </div>
}

export default DatePicker;