import { render } from 'preact'
import App from './App';

import ConfigProvider from '@context/Config';
import MethodsProvider from '@context/Methods';

render(
    <ConfigProvider>
        <MethodsProvider>
            <App />
        </MethodsProvider>
    </ConfigProvider>, 
    document.body
);