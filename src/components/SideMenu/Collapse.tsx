import { useState } from 'react';
import ChevronDown from 'jsx:@svg/chevron-down.svg';

import combineClasses from '@utils/combineClasses';

const Collapse: FC<{ top?: React.JSX.Element, collapsed?: boolean }> = props => {
    const [collapsed, setCollapsed] = useState<boolean>(props.collapsed ?? false);

    return <div className={combineClasses('collapse', collapsed && 'collapsed')}>
        <div className="top">
            <button className="collapse-toggle" onClick={() => setCollapsed(!collapsed)}>
                <ChevronDown />
            </button>

            {props.top}
        </div>

        <div className="collapse-container">
            {props.children}
        </div>
    </div>
}

export default Collapse;