import { v4 as randomUUID } from 'uuid';
import performScript, { loadCallbacks } from './performScript';

const promises = new Map<string, { resolve: (data: any) => void; reject: (err?: any) => void}>();

window.onScriptResult = (uuid, data) => {
    const promise = promises.get(uuid);
    if (!promise) return;

    try {
        const parsedData = JSON.parse(data);
        promise.resolve(parsedData);
    } catch(err) {
        console.error(err);
        promise.reject(err);
    }

    promises.delete(uuid);
}

/**
 * Asynchronously waits for FileMaker to send a response to JS
 * @param scriptKey The key of the script as per `JAC.Config`
 * @example
 * ```ts
 * fetchFromFileMaker('getContacts', { FirstName: 'Joakim' }).then(contacts => {
 *     console.log(contacts);
 * });
 * ```
 */
export default async function fetchFromFileMaker<T = RSAny>(
    scriptKey: string & keyof JAC.Config['scriptNames'],
    param?: any,
    timeoutInMs: number = 30_000,
    option?: Parameters<typeof window['FileMaker']['PerformScriptWithOption']>[2]
): Promise<T|null> {
    // Waits until config has loaded before running
    if (!window._config) {
        return new Promise<T>((res, rej) => {
            loadCallbacks.push(() => {
                fetchFromFileMaker<T>(scriptKey, param, timeoutInMs, option)
                    .then(result => {
                        if (result === undefined) rej('Result was undefined');
                        else res(result as T);
                    })
                    .catch(rej)
            });

            console.warn(`Script key ${scriptKey} was fetched before the config was loaded, a load callback was added`);
        });
    }

    // Get the script name
    const scriptName = window._config.scriptNames?.[scriptKey];
    if (typeof scriptName !== 'string') {
        console.warn(`Script name of the key '${scriptKey}' was not found in the config`);
        return null
    }

    const uuid = randomUUID();
    
    return new Promise<T>((res, rej) => {
        // Configure the timeout
        const timeout = setTimeout(() => {
            promises.delete(uuid);
            rej('Timed out');
        }, timeoutInMs);

        // Add a callback to the promise map
        promises.set(uuid, {
            resolve: data => {
                clearTimeout(timeout);
    
                if (data instanceof Error) rej(data);
                else res(data);
            },
            reject: err => {
                clearTimeout(timeout);
                rej(err);
            }
        });

        const status = performScript('onJsRequest', {
            uuid,
            scriptName,
            scriptParameter: param
        }, option);

        if (status !== true) {
            clearTimeout(timeout);
            rej(status);
        }
    });
}