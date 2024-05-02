import { useState } from 'react';
import { useConfig } from '@context/Config';

import Calendar from '@components/Calendar';

const App: React.FC = () => {
    // Optionally, for a better workflow, we can tell FileMaker whenever the widget has loaded
    /*
    useEffect(() => {
        window.FileMaker.PerformScript('On Widget Load');
    }, []);
    */
    return <Calendar />
}

export default App;