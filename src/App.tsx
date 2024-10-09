import { useEffect, useCallback } from 'react';
import { useConfigState } from '@context/Config';

import EventDropdownProvider from '@components/Calendar/Event/Dropdown';

import SideMenu from '@components/SideMenu';
import Calendar from '@components/Calendar';

import '@utils/calendarDates';
import CalendarRefProvider from '@context/CalendarRefProvider';

import performScript from '@utils/performScript';

const App: React.FC = () => {
    const [config, setConfig] = useConfigState();

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

    const poll = useCallback(() => {
        performScript('poll');
    }, [config?.scriptNames?.poll]);

    // Singular polling
    const nextPollMs = config?.nextPollMs;
    useEffect(() => {
        if (
            !config ||
            !Number.isFinite(config.nextPollMs) ||
            (config.nextPollMs! <= 0)
        ) return;

        const t = setTimeout(() => {
            poll();
            setConfig(prev => prev && ({
                ...prev,
                nextPollMs: undefined
            }));
        }, config.nextPollMs);
        return () => clearTimeout(t);
    }, [nextPollMs, poll]);

    // Continuous polling
    const pollIntervalMs = config?.pollIntervalMs;
    useEffect(() => {
        if (
            !config ||
            !Number.isFinite(config.pollIntervalMs) ||
            (config.pollIntervalMs! <= 0)
        ) return;

        const i = setInterval(poll, config.pollIntervalMs);
        return () => clearInterval(i);
    }, [pollIntervalMs, poll]);

    if (!config) return null;
    return <EventDropdownProvider>
        <CalendarRefProvider>
            <div className="app-wrapper">
                {!config?.sideMenuDisabled && <SideMenu />}
                <Calendar />
            </div>
        </CalendarRefProvider>
    </EventDropdownProvider>
}

export default App;