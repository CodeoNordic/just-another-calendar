export const loadCallbacks: VoidFunction[] = [];

/**
 * Performs a FileMaker script
 * @param key The key of the script as per `NOBS.Config`
 */
export default function performScript(
    key: string & keyof NOBS.Config['scriptNames'],
    param?: any,
    option?: Parameters<typeof window['FileMaker']['PerformScriptWithOption']>[2]
) {
    if (!window._config) {
        loadCallbacks.push(() => {
            performScript(key, param, option);
        });

        return console.warn(`Script ${key} was called before the config was loaded, a load callback was added`);
    }

    try {
        const parsedParam = typeof param === 'undefined'? param:JSON.stringify(param);
        const scriptName = window._config.scriptNames?.[key];

        if (typeof scriptName !== 'string') return console.warn(`Script name of the key '${key}' was not found in the config`);

        if (typeof option === 'undefined')
            window.FileMaker.PerformScript(
                scriptName,
                typeof parsedParam === 'undefined'? '':parsedParam
            );
        else
            window.FileMaker.PerformScriptWithOption(
                scriptName,
                typeof parsedParam === 'undefined'? '':parsedParam,
                option
            );
    } catch(err) {
        console.log(err);
    }
}