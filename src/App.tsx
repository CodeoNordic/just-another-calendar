import { useState } from 'preact/hooks';
import { useConfig } from '@context/Config';

import Contact from '@components/Contact';
import useContactSearch from '@hooks/useContactSearch';

import LoadMore from '@components/LoadMore';

const App: React.FC = () => {
    const [search, setSearch] = useState<string|null>(null);
    const records = useContactSearch(search);

    const config = useConfig();

    // Optionally, for a better workflow, we can tell FileMaker whenever the widget has loaded
    /*
    useEffect(() => {
        window.FileMaker.PerformScript('On Widget Load');
    }, []);
    */

    return <>
        <div className="hello">
            <h1>Hello world!</h1>
            <p>Message from FileMaker: {config?.messageFromFileMaker ?? '(no message)'}</p>

            <input
                type="text"
                onInput={e => setSearch(e.currentTarget.value)}
            />

            {records.length
                ?<p>Showing {records.length || 0} contacts</p>
                :<pre>No contacts in config</pre>}
        </div>

        <div className="contacts">
            {!!records.length && records.map((props, i) => <Contact key={i} {...props as FM.ContactRecord} />)}
        </div>

        <LoadMore perClick={5} />
    </>
}

export default App;