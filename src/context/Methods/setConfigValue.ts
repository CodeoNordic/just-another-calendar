import set from 'lodash.set';

import { useCreateMethod } from '@utils/createMethod';
import { useConfigState } from '@context/Config';

const useSetConfigValue = () => {
    const [, setConfig] = useConfigState();

    useCreateMethod('setConfigValue|setConfigProp', (k: string, v: any) => setConfig(prev => {
        if (!prev) return null;
        const copy = { ...prev };

        set(copy, k, v);
        return copy;
    }));
}

export default useSetConfigValue;