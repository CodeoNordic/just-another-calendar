import { useRef, createContext, useContext } from "react";
import { default as FullCalendarReact } from '@fullcalendar/react';

export const CalendarRefContext = createContext<React.MutableRefObject<FullCalendarReact|null>>({current: null});
export const useCalendarRef = () => useContext(CalendarRefContext);

const CalendarRefProvider : FC = ({ children }) => {
    const calendarRef = useRef<FullCalendarReact|null>(null);

    return <CalendarRefContext.Provider
        value={calendarRef}
    >{children}</CalendarRefContext.Provider>
}

export default CalendarRefProvider;