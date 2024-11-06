import { createContext, useContext, useEffect, useState } from 'react';

import getEventsFromObject from '@utils/getEventsFromObject';
import { loadCallbacks } from '@utils/performScript';

import { info, warn } from '@utils/log';

const defaultConfig: Partial<JAC.Config> = {
    defaultEventComponent: "default",
    eventComponents: [
        {
            name: "default",
            fields: [
                {
                    value: "title"
                },
                {
                    template: "{Time:start} - {Time:end}"
                }
            ]
        }
    ],
    newEventFields: [
        {
            name: "title",
            title: "Title",
            placeholder: "Add a title",
            type: "string"
        },
        {
            name: "start",
            title: "Start",
            type: "time"
        },
        {
            name: "end",
            title: "End",
            type: "time"
        },
        {
            name: "description",
            title: "Description",
            placeholder: "Add a description",
            type: "string"
        },
        {
            name: "allDay",
            title: "All Day",
            type: "checkbox"
        }
    ],
    scriptNames: {},
    translations: {},
    eventCreation: true,
    newEventMovable: false,
    firstDayOfWeek: 1,
    contrastCheck: true,
    contrastMin: 2,
    nowIndicator: true,
    eventTemplatesOpen: true,
    sideMenuOpen: false,
    ignoreWarnings: false,
    eventFilterBehaviour: 'groupedAny',
    calendarStartTime: "08:00",
    calendarEndTime: "21:15",
};


// Parses the JSON from FileMaker into a readable config
const parseConfig = (cfg: string = '{}') => {
    try {
        const config = JSON.parse(cfg) as JAC.Config;
        const events = getEventsFromObject(config.events) || [];

        Object.keys(defaultConfig).forEach((key) => {
            (config as RSAny)[key] ??= defaultConfig[key as keyof JAC.Config];
        });

        const assignedTemplates: JAC.EventTemplate[] = [];
        config.eventTemplates?.forEach(template => {
            if (!template.event.id) {
                //template.event.id = randomUUID();
                assignedTemplates.push(template);
            }
        });

        if (assignedTemplates.length) {
            const multiple = assignedTemplates.length > 1;
            info(`The following template${multiple?'s':''} had no ID in ${multiple? 'their':'its'} event. A random UUID will be assigned for ${multiple? 'each one':'it'} upon creation.`);
            info(multiple? assignedTemplates: assignedTemplates[0]);
        }

        // Map 'enabled' into each event filter
        config.eventFilters = config.eventFilters?.map(filter => ({
            ...filter,
            enabled: ![0, false].includes(filter.enabled!)
        }))

        const missingId: JAC.Event[] = [];
        let configWarned = false;

        config.events = events.map((event, i) => {
            if (typeof event.id !== 'string') {
                missingId.push(event);
                event.id = String(i);
            }

            if (event._config !== undefined) {
                event.__config = event._config;
                delete event._config;

                if (!configWarned) {
                    warn('One or more events has the _config key defined. This was automatically remapped to __config due to the initial key being used by JAC');
                    configWarned = true;
                }
            }

            return event;
        });

        if (missingId.length) {
            const multiple = missingId.length > 1;
            warn(`The following event ${multiple? 's':''} had no ID. ${multiple? 'Their array indexes were': 'Its array index was'} used instead.`);
            warn(multiple? missingId: missingId[0]);
        }

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

            window._config = parsedConfig;
            setConfig(parsedConfig);

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