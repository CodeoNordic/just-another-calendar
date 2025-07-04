import { useEffect } from 'react';
import { useConfig } from '@context/Config';

import FullCalendar from './FullCalendar';
import stylesFromFontSizes from '@utils/stylesFromConfig';

const Calendar: FC = () => {
    const config = useConfig();
    const fontStyles = config?.styles;

    useEffect(() => {
        if (!fontStyles) return;
        document.querySelector('style#injected-calendar-styles')?.remove();

        const style = document.createElement('style');
        style.innerHTML = stylesFromFontSizes(fontStyles);
        style.id = 'injected-calendar-styles';

        document.head.appendChild(style);
        return () => style.remove();
    }, [fontStyles]);

    if (!config) return null;

    return <div className="calendar">
        <FullCalendar />
    </div>
}

export default Calendar;