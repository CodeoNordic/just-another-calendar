import StandardEvent from './Standard';
import EventWithStatus from './WithStatus';
import CompactEvent from './Compact';

import BackgroundEvent from './Background';

const Event: FC<FM.EventRecord & { component?: NOBS.Config['eventComponent'] }> = props => {
    if (props.type === 'backgroundEvent') return <BackgroundEvent {...props} />

    return props.component === 'withStatus'
        ?<EventWithStatus {...props} />
        : props.component === 'compact'
        ? <CompactEvent {...props} />
        : <StandardEvent {...props} />
}

export default Event;