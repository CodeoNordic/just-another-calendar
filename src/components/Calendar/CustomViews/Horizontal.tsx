import { sliceEvents, createPlugin, Duration } from '@fullcalendar/core';
import { DateProfile, ViewProps } from '@fullcalendar/core/internal';

interface Props extends ViewProps {
    dateProfile: DateProfile;
    nextDayThreshold: Duration;
}

// TODO
const Horizontal: FC<Props> = props => {
    const events = sliceEvents(props, false);

    return null;
}