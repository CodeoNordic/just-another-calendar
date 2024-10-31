import { useMemo, useState, useCallback } from 'react';
import { useConfigState } from '@context/Config';

import Collapse from './Collapse';
import performScript from '@utils/performScript';

import getCalendarDates from '@utils/calendarDates';
import weekNumber from '@utils/weekNumber';
import dateFromString from '@utils/dateFromString';
import dateToObject from '@utils/dateToObject';

import ArrowUp from 'jsx:@svg/arrow-up.svg';
import ArrowDown from 'jsx:@svg/arrow-down.svg';
import combineClasses from '@utils/combineClasses';

const DatePicker: FC = () => {
    const [config, setConfig] = useConfigState();

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
    const dates = useMemo(() => getCalendarDates(selectedMonth, config?.firstDayOfWeek), [selectedMonth, config?.firstDayOfWeek]);
    const allDates = [...dates.start, ...dates.middle, ...dates.end];

    const onDateSelected = useCallback((selected: Date) => {
        if (!config?.scriptNames?.onDateSelected) return setConfig(prev => {
            if (!prev) return null;

            return {
                ...prev,
                date: selected.toISOString()
            }
        });

        performScript('onDateSelected', dateToObject(selected));
    }, [config?.scriptNames?.onDateSelected]);

    const weekNumbers = useMemo(() => {
        const nums: number[] = [];

        // Could be optimized, but for simplicities sake, loop through each date
        allDates.forEach(date => {
            const num = weekNumber(new Date(date));
            if (nums.includes(num)) return;

            nums.push(num);
        });

        // Remove excess
        while (nums.length > 6) nums.pop();
        return nums;
    }, [dates]);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return <div className="date-picker">
        <Collapse top={<>
            <span className="title">{monthTitle}</span>
            
            <button className="today" onClick={() => {
                onDateSelected(today);
            }}>
                {config?.translations?.todayButton || "Today"}
            </button>

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
                    <span>{config?.translations?.weekNumberHeader || "W"}</span>
                    {weekNumbers.map((num, i) => <span key={i}>{String(num)}</span>)}
                </div>

                <div className="days">
                    {Array.from(new Array(7)).map((_, i) => <span key={i} className="weekday">
                        {new Date(allDates[i]).toLocaleDateString(config?.locale || 'en', { weekday: 'short' }).substring(0, 2)}
                    </span>)}

                    {dates.start.map((date, i) => <button
                        key={i}
                        className="extra-date"
                        style={date.toISOString() === today.toISOString() ? { background: 'rgba(255, 220, 40, 0.3)' } : {}}
                        onClick={() => onDateSelected(date)}
                    >
                        {new Date(date).getDate()}
                    </button>)}

                    {dates.middle.map((date, i) => <button
                        key={i}
                        className={combineClasses('date', (new Date(date).valueOf() === selectedDate.valueOf()) && 'selected')}
                        style={(date.toISOString() === today.toISOString() && date.toISOString() !== selectedDate.toISOString()) ? { background: 'rgba(255, 220, 40, 0.3)' } : {}}
                        onClick={() => onDateSelected(date)}
                    >
                        {new Date(date).getDate()}
                    </button>)}

                    {dates.end.map((date, i) => <button
                        key={i}
                        className="extra-date"
                        style={date.toISOString() === today.toISOString() ? { background: 'rgba(255, 220, 40, 0.3)' } : {}}
                        onClick={() => onDateSelected(date)}
                    >
                        {new Date(date).getDate()}
                    </button>)}
                </div>
            </div>
        </Collapse>
    </div>
}

export default DatePicker;