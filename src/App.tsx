import { useEffect } from 'react';
import { useConfig } from '@context/Config';

import Calendar from '@components/Calendar';

const App: React.FC = () => {
    const config = useConfig();

    const css = config?.customCSS;
    useEffect(() => {
        if (!css) return;
        document.querySelector('style#nobs-custom-css')?.remove();

        const elem = document.createElement('style');
        elem.id = 'nobs-custom-css';
        elem.innerHTML = css;

        document.head.appendChild(elem);
        return () => elem.remove();
    }, [css]);

    return <Calendar />
}

export default App;