import { useEffect } from 'react';
import { useConfig } from '@context/Config';

import EventDropdownProvider from '@components/Calendar/Event/Dropdown';

import SideMenu from '@components/SideMenu';
import Calendar from '@components/Calendar';

import '@utils/calendarDates';

const App: React.FC = () => {
    const config = useConfig();

    const css = config?.customCSS;
    useEffect(() => {
        if (!css) return;
        document.querySelector('style#jac-custom-css')?.remove();

        const elem = document.createElement('style');
        elem.id = 'jac-custom-css';
        elem.innerHTML = css;

        document.head.appendChild(elem);
        return () => elem.remove();
    }, [css]);

    if (!config) return null;
    return <EventDropdownProvider>
        <div className="app-wrapper">
            <SideMenu />
            <Calendar />
        </div>
    </EventDropdownProvider>
}

export default App;