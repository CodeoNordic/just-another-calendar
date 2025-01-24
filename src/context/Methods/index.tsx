import useAddEvents from './addEvents';
import useRemoveEvents from './removeEvents';
import useSetEvents from './setEvents';

import useUpdateEvent from './updateEvent';
import useSetConfigValue from './setConfigValue';

import useUpdateEventFilter from './updateEventFilter';

import useGetEvent from './getEvent';
import useRender from './render';

// The purpose of applying the window methods in a react component is to be able to access other react contexts, such as calendarRef and the config
const Methods: FC = ({ children }) => {
    useAddEvents();
    useRemoveEvents();
    useSetEvents();

    useUpdateEvent();
    useSetConfigValue();

    useUpdateEventFilter();

    useGetEvent();
    useRender();

    return <>{children}</>;
}

export default Methods;