import moment from 'moment';

moment.locale('no', {
    week: {
        dow: 1
    }
});

// Source: https://www.w3resource.com/javascript-exercises/javascript-date-exercise-24.php
export default function weekNumber(dt: Date) 
{
    return moment(dt).week();
}