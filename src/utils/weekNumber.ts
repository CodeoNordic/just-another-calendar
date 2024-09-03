import moment from 'moment';
import { weekDays } from './calendarDates';



// Source: https://www.w3resource.com/javascript-exercises/javascript-date-exercise-24.php
export default function weekNumber(dt: Date) 
{
    const locale = window._config?.locale ?? 'en';
    const firstDayOfWeek = typeof window._config?.firstDayOfWeek === 'string' ? 
        Math.max(weekDays.indexOf(window._config?.firstDayOfWeek.toLowerCase().substring(0, 3)), 1) : 
        window._config?.firstDayOfWeek ?? 1;

    moment.updateLocale(locale, {
        week: {
            dow: firstDayOfWeek
        }
    });

    return moment(dt).locale(locale).week();

    /*
    Old code, kept for now if needed

    moment.locale('no', {
        week: {
            dow: typeof window._config?.firstDayOfWeek === 'string' ? 
            Math.max(weekDays.indexOf(window._config?.firstDayOfWeek.toLowerCase().substring(0,3)), 1) : 
            window._config?.firstDayOfWeek ?? 1
        }
    });

    return moment(dt).locale(window._config?.locale ?? 'en').week();

    */
}