import { useState } from 'react';

import DatePicker from './DatePicker';
import ChevronIcon from 'jsx:@svg/menu-toggle.svg';

import combineClasses from '@utils/combineClasses';
import EventFilters from './EventFilters';
import Search from './Search';
import SourceFilters from './SourceFilters';
import EventTemplates from './EventTemplates';
import { useConfigState } from '@context/Config';



const SideMenu: FC = () => {
    const [config, setConfig] = useConfigState();
    
    const setOpen = (open: boolean) => {
        setConfig((prev: JAC.Config | null) => ({...prev, sideMenuOpen: open} as JAC.Config));
    }

    return <div className={combineClasses('side-menu', config?.sideMenuOpen && 'open')}>
        <button className="toggle-button" onClick={() => {
            setOpen(!config?.sideMenuOpen);
            window.dispatchEvent(new Event('resize'));
        }}>
            <ChevronIcon />
        </button>

        <div className="wrapper">
            <DatePicker />
            <Search />
            <EventFilters />
            <SourceFilters />
            <EventTemplates />
        </div>
    </div>
}

export default SideMenu;