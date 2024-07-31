import { createContext, useContext, useEffect, useState } from 'react';

import getRecordsFromObject from '@utils/getRecordsFromObject';
import { loadCallbacks } from '@utils/performScript';

// Parses the JSON from FileMaker into a readable config
const parseConfig = (cfg: string) => {
    try {
        const config = JSON.parse(cfg) as JAC.Config;
        const records = getRecordsFromObject(config.records) || [];

        let _configWarned = false;
        config.records = records.map(record => {
            if (record._config !== undefined) {
                if (!_configWarned) {
                    console.warn(`One or more records passed include a _config key. This key is reserved, so the original value is available in __config`);
                    _configWarned = true;
                }
                
                record.__config = record._config;
            }

            record._config = config;
            return record;
        });

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
    const parsedConfig = parseConfig(cfg);
    if (!parsedConfig) return;

    window._config = parsedConfig;
    runLoadCallbacks();
};

const ConfigContext = createContext<State<JAC.Config|null>>([null, () => {}]);
const ConfigProvider: FC = ({ children }) => {
    const [config, setConfig] = useState<JAC.Config|null>(null);

    useEffect(() => {
        if (window._config !== undefined) setConfig(window._config);

        window.init = cfg => {
            const parsedConfig = parseConfig(cfg);
            if (!parsedConfig) return;

            setConfig(parsedConfig);

            window._config = parsedConfig;
            runLoadCallbacks();
        }
    }, []);

    // Update window._config upon change
    useEffect(() => {
        window._config = config || undefined;
    }, [config]);

    //if (!config) return null;
    return <ConfigContext.Provider value={[config, setConfig]}>
        {children}
    </ConfigContext.Provider>
}

export const useConfig = () => {
    const [config] = useContext(ConfigContext);
    return config;
}

export const useConfigState = () => {
    const ctx = useContext(ConfigContext);
    return ctx;
}

export default ConfigProvider;