import { useConfig } from '@context/Config';
import Button from '@components/Button';

import codeo_logo from '@png/codeo_logo.png';

const App: React.FC = () => {
    const config = useConfig();

    return <>
        <h1>Hello world!</h1>
        <p>Message from FileMaker: {config?.messageFromFileMaker ?? <pre>no message</pre>}</p>
        <p>{config?.records?.length || 0} records were passed through the config</p>
        <Button />
        <img src={codeo_logo} width="100" height="100" />
    </>
}

export default App;