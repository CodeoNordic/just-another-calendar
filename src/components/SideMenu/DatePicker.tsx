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
import { warn } from '@utils/log';
import datesFromEvent from '@utils/datesFromEvent';
import clamp from '@utils/clamp';
import calculateContrast from '@utils/contrast';

const DatePicker: FC = () => {
    const [config, setConfig] = useConfigState();

    const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());
    const selectedDate = useMemo(() => {
        const d = dateFromString(config?.date) || new Date();

        setSelectedMonth(new Date(new Date(d).setDate(1)));
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

    const colorFromPercentage = (percentage: number): string => {
        const startColor = { r: 173, g: 216, b: 230 }; // Light Blue
        const endColor = { r: 0, g: 0, b: 255 }; // Dark Blue
    
        const r = Math.round(startColor.r + (endColor.r - startColor.r) * percentage);
        const g = Math.round(startColor.g + (endColor.g - startColor.g) * percentage);
        const b = Math.round(startColor.b + (endColor.b - startColor.b) * percentage);
    
        return `rgb(${r}, ${g}, ${b})`;
    };    

    const heatmap = useMemo(() => {
        const heatmap: { [key: string]: {color: string, hours: number} } = {};
        
        const [startHour, startMinute] = config!.calendarStartTime!.split(':').map(Number);
        const [endHour, endMinute] = config!.calendarEndTime!.split(':').map(Number);

        const fullDayHours = (endHour - startHour) + (endMinute - startMinute) / 60;

        if (config?.heatmap === true && config?.events?.length) {
            config.events.forEach(event => {
                const dates = datesFromEvent(event);
                if (!dates.start || !dates.end) return warn('Event is missing start or end date, will not be used', event);
                
                const iso = new Date(new Date(dates.start).setHours(0, 0, 0, 0)).toISOString();

                const hours = (dates.end.valueOf() - dates.start.valueOf()) / 1000 / 60 / 60;
                const oldHours = heatmap[iso]?.hours || 0;

                const percentage = clamp((hours + oldHours), 0, fullDayHours) / fullDayHours;
                const color = colorFromPercentage(percentage);

                if (!heatmap[iso]) heatmap[iso] = { color: '', hours: 0 };
                heatmap[iso].color = color;
                heatmap[iso].hours += hours;
            });
        } else if (Array.isArray(config?.heatmap) && config?.heatmap.length) {
            config.heatmap.forEach(event => {
                if (event.hours === undefined && !event.color) return warn('Heatmap event is missing hours and color, will not be used', event);
                if (!event.hours) return;

                const iso = dateFromString(event.date)?.toISOString();
                if (!iso) return warn('Heatmap event has invalid or missing date, will not be used', event);

                let color = event.color || '';

                if (event.hours && !event.color) {
                    color = colorFromPercentage(clamp(event.hours, 0, fullDayHours) / fullDayHours);
                }

                if (!heatmap[iso]) heatmap[iso] = { color: '', hours: 0 };
                heatmap[iso].color = color;
                heatmap[iso].hours = event.hours || 0;
            });
        }

        return heatmap;
    }, [allDates, config?.calendarEndTime, config?.calendarStartTime, config?.events, config?.heatmap]);

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
                const newDate = new Date(selectedMonth);
                newDate.setDate(1);
                newDate.setMonth(newDate.getMonth() - 1);
                setSelectedMonth(newDate);
                config?.scriptNames?.onMonthChange && performScript('onMonthChange', dateToObject(newDate));
            }}>
                <ArrowUp />
            </button>

            <button className="next-month" onClick={() => {
                const newDate = new Date(selectedMonth);
                newDate.setDate(1);
                newDate.setMonth(newDate.getMonth() + 1);
                setSelectedMonth(newDate);
                config?.scriptNames?.onMonthChange && performScript('onMonthChange', dateToObject(newDate));
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
                        style={{ 
                            background: date.toISOString() === today.toISOString() ? 'rgba(255, 220, 40, 0.3)' 
                                : heatmap?.[date.toISOString()]?.color || '',
                            color: heatmap?.[date.toISOString()] && calculateContrast(heatmap?.[date.toISOString()]?.color || '') ? 'white' : 'black',
                        }}
                        onClick={() => onDateSelected(date)}
                    >
                        {new Date(date).getDate()}
                    </button>)}

                    {dates.middle.map((date, i) => <button
                        key={i}
                        className={combineClasses('date', (new Date(date).valueOf() === selectedDate.valueOf()) && 'selected')}
                        style={{ 
                            background: date.toISOString() !== selectedDate.toISOString() ? date.toISOString() === today.toISOString() ? 'rgba(255, 220, 40, 0.3)' : heatmap?.[date.toISOString()]?.color || '' : '',
                            border: date.toISOString() === today.toISOString() ? '1px solid black' : '',
                            margin: date.toISOString() === today.toISOString() ? '-1px' : '',
                            fontWeight: date.toISOString() === today.toISOString() ? 700 : 400,
                            color: date.toISOString() !== selectedDate.toISOString() && date.toISOString() !== today.toISOString() && heatmap?.[date.toISOString()] && calculateContrast(heatmap?.[date.toISOString()]?.color || '') ? 'white' : 'black',
                        }}
                        onClick={() => onDateSelected(date)}
                    >
                        {new Date(date).getDate()}
                    </button>)}

                    {dates.end.map((date, i) => <button
                        key={i}
                        className="extra-date"
                        style={{ 
                            background: date.toISOString() === today.toISOString() ? 'rgba(255, 220, 40, 0.3)' 
                                : heatmap?.[date.toISOString()]?.color || '',
                            color: heatmap?.[date.toISOString()] && calculateContrast(heatmap?.[date.toISOString()]?.color || '') ? 'white' : 'black',
                        }}
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