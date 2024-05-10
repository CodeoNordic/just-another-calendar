import { useConfig } from '@context/Config';

import FullCalendar from './FullCalendar';
import dateFromString from '@utils/dateFromString';

const Calendar: FC = () => {
    const config = useConfig();
    const records = config?.records;

    const initialDate = dateFromString(config?.initialDate)?.valueOf();
    
    if (!config) return null;

    return <div className="calendar">
        <FullCalendar
            records={records}
            initialDate={initialDate}
        />
    </div>
}

export default Calendar;