import { useCreateMethod } from '@utils/createMethod';
import { useCalendarRef } from '@context/CalendarRefProvider';

const useRender = () => {
    const calendarRef = useCalendarRef();

    useCreateMethod('render|rerender', () => {
        calendarRef.current?.render();
    });
}

export default useRender;