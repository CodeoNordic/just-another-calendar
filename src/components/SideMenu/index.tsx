import { useState } from 'react';

import DatePicker from './DatePicker';
import ChevronIcon from 'jsx:@svg/menu-toggle.svg';

import combineClasses from '@utils/combineClasses';
import EventFilters from './EventFilters';


const SideMenu: FC = () => {
    const [open, setOpen] = useState<boolean>(false);

    return <div className={combineClasses('side-menu', open && 'open')}>
        <button className="toggle-button" onClick={() => {
            setOpen(!open);
            window.dispatchEvent(new Event('resize'));
        }}>
            <ChevronIcon />
        </button>

        <div className="wrapper">
            <DatePicker />
            <EventFilters />
        </div>
    </div>
}

export default SideMenu;