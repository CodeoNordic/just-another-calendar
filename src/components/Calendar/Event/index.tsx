import StandardEvent from './Standard';
import CompactEvent from './Compact';

import BackgroundEvent from './Background';

const Event: FC<FM.EventRecord & { component?: NOBS.Config['eventComponent'] }> = props => {
    if (props.type === 'backgroundEvent') return <BackgroundEvent {...props} />

    return props.component === 'compact'
        ? <CompactEvent {...props} />
        : <StandardEvent {...props} />
}

export default Event;