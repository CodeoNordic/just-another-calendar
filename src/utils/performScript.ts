import isDevMode from './isDevMode';
export const loadCallbacks: VoidFunction[] = [];

/**
 * Performs a FileMaker script
 * @param key The key of the script as per `JAC.Config`
 */
export default function performScript(
    key: string & keyof JAC.Config['scriptNames'] | (string & {}),
    param?: any,
    option?: Parameters<typeof window['FileMaker']['PerformScriptWithOption']>[2],
    directScriptName: boolean = false
): string|boolean {
    if (!window._config && !directScriptName) {
        loadCallbacks.push(() => {
            performScript(key, param, option);
        });

        console.warn(`Script ${key} was called before the config was loaded, a load callback was added`);
        return true;
    }

    try {
        const parsedParam = typeof param === 'undefined'? param:JSON.stringify(param);
        
        const scriptName = directScriptName? key: window._config?.scriptNames?.[key as keyof JAC.Config['scriptNames']];
        if (typeof scriptName !== 'string') {
            const msg = `Script name of the key '${key}' was not found in the config`;
            (key !== 'onJsError') && console.warn(msg);
            return msg;
        }

        if (!window.FileMaker && isDevMode()) {
            console.log(`[DEV]: Running script '${scriptName}'`);
            return true;
        }

        if (Number.isInteger(Number(option ?? NaN)))
            window.FileMaker.PerformScript(
                scriptName,
                typeof parsedParam === 'undefined'? '':parsedParam
            );
        else
            window.FileMaker.PerformScriptWithOption(
                scriptName,
                typeof parsedParam === 'undefined'? '':parsedParam,
                option!
            );

        return true;
    } catch(err) {
        console.log(err);
        return (err as Error).message || err as string;
    }
}