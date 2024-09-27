import useAddEvents from './addEvents';
import useRemoveEvents from './removeEvents';
import useSetEvents from './setEvents';

import useUpdateEvent from './updateEvent';
import useSetConfigValue from './setConfigValue';

import useUpdateEventFilter from './updateEventFilter';

// The purpose of applying the window methods in a react component is to be able to access e.g the config context
const Methods: FC = ({ children }) => {
    useAddEvents();
    useRemoveEvents();
    useSetEvents();

    useUpdateEvent();
    useSetConfigValue();

    useUpdateEventFilter();

    return <>{children}</>;
}

export default Methods;