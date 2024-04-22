import { render } from 'preact'
import App from './App';

import ConfigProvider from '@context/Config';

render(
    <ConfigProvider>
        <App />
    </ConfigProvider>, 
    document.body
);