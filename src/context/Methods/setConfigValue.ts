import { useCreateMethod } from '@utils/createMethod';
import { useConfigState } from '@context/Config';

const useSetConfigValue = () => {
    const [, setConfig] = useConfigState();

    useCreateMethod('setConfigValue', (k, v) => setConfig(prev => prev && ({
        ...prev,
        [k]: v
    })));
}

export default useSetConfigValue;