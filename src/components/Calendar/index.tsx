import { useEffect } from 'react';
import { useConfig } from '@context/Config';

import FullCalendar from './FullCalendar';

import dateFromString from '@utils/dateFromString';
import stylesFromFontSizes from '@utils/styleFromFontSizes';

const Calendar: FC = () => {
    const config = useConfig();
    const records = config?.records;

    const initialDate = dateFromString(config?.initialDate)?.valueOf();

    const fontSizes = config?.fontSizes;

    useEffect(() => {
        if (!fontSizes) return;

        const style = document.createElement('style');
        style.innerHTML = stylesFromFontSizes(fontSizes);

        document.head.appendChild(style);
        return () => style.remove();
    }, [fontSizes]);

    if (!config) return null;

    return <div className="calendar">
        <FullCalendar
            records={records}
            initialDate={initialDate}
        />
    </div>
}

export default Calendar;