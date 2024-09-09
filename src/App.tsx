import { useEffect } from 'react';
import { useConfig } from '@context/Config';

import EventDropdownProvider from '@components/Calendar/Event/Dropdown';

import SideMenu from '@components/SideMenu';
import Calendar from '@components/Calendar';

import '@utils/calendarDates';
import CalendarRefProvider from '@context/CalendarRefProvider';

const App: React.FC = () => {
    const config = useConfig();

    const css = config?.customCSS;
    useEffect(() => {
        if (!css) return;
        document.querySelector('style#jac-custom-css')?.remove();

        const elem = document.createElement('style');
        elem.id = 'jac-custom-css';
        elem.innerHTML = css.replaceAll('\r', '\n');

        document.head.appendChild(elem);
        return () => elem.remove();
    }, [css]);

    if (!config) return null;
    return <EventDropdownProvider>
        <CalendarRefProvider>
            <div className="app-wrapper">
                <SideMenu />
                <Calendar />
            </div>
        </CalendarRefProvider>
    </EventDropdownProvider>
}

export default App;