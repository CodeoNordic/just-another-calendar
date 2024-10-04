import DatePicker from './DatePicker';
import EventFilters from './EventFilters';
import Search from './Search';
import EventTemplates from './EventTemplates';

import { useConfigState } from '@context/Config';

import performScript from '@utils/performScript';
import combineClasses from '@utils/combineClasses';

import ChevronIcon from 'jsx:@svg/menu-toggle.svg';


const SideMenu: FC = () => {
    const [config, setConfig] = useConfigState();
    
    const setOpen = (open: boolean) => {
        setConfig((prev: JAC.Config | null) => {
            if (open && prev?.scriptNames.onSideMenuOpened) performScript('onSideMenuOpened');
            else if (prev?.scriptNames.onSideMenuClosed) performScript('onSideMenuClosed');
            
            return {...prev, sideMenuOpen: open} as JAC.Config;
        });
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
            <EventTemplates />
        </div>
    </div>
}

export default SideMenu;