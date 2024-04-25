import { createContext } from 'preact';
import { useContext, useEffect, useState } from 'preact/hooks';

import getRecordsFromObject from '@utils/getRecordsFromObject';
import { loadCallbacks } from '@utils/performScript';

// Parses the JSON from FileMaker into a readable config
const parseConfig = (cfg: string) => {
    try {
        const config = JSON.parse(cfg) as NOBS.Config;
        config.records = getRecordsFromObject(config.records);

        return config;
    } catch(err) {
        console.error(err);
    }
}

// Runs any script that was attempted called before the config was loaded
const runLoadCallbacks = () => loadCallbacks.length && loadCallbacks.forEach(cb => {
    cb();
    loadCallbacks.splice(loadCallbacks.indexOf(cb), 1);
});

// FileMaker may call init before useEffect can assign the function
// This acts as a failsafe
window.init = cfg => {
    window.config = parseConfig(cfg);
    runLoadCallbacks();
};

const ConfigContext = createContext<NOBS.Config|null>(null);
const ConfigProvider: React.FC = ({ children }) => {
    const [config, setConfig] = useState<NOBS.Config|null>(null);

    useEffect(() => {
        if (window.config !== undefined) setConfig(window.config);

        window.init = cfg => {
            const parsedConfig = parseConfig(cfg);
            parsedConfig && setConfig(parsedConfig);

            window.config = parsedConfig;
            runLoadCallbacks();
        }
    }, []);

    return <ConfigContext.Provider value={config}>
        {children}
    </ConfigContext.Provider>
}

export const useConfig = () => useContext(ConfigContext);
export default ConfigProvider;