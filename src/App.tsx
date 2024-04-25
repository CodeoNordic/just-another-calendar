import { useState } from 'preact/hooks';
import { useConfig } from '@context/Config';

import Contact from '@components/Contact';
import useContactSearch from '@hooks/useContactSearch';

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
            <p>Message from FileMaker: {config?.messageFromFileMaker ?? <pre>no message</pre>}</p>
            <p>{config?.records?.length || 0} records were passed through the config</p>

            <input
                type="text"
                onInput={e => setSearch(e.currentTarget.value)}
            />

            {records.length
                ?<p>Showing {records.length} results</p>
                :<pre>No results</pre>}
        </div>

        <div className="contacts">
            {records.map((props, i) => <Contact key={i} {...props as FM.ContactRecord} />)}
        </div>
    </>
}

export default App;