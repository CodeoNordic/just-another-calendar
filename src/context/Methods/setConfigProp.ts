import { useCreateMethod } from '@utils/createMethod';
import { useConfigState } from '@context/Config';

const useSetConfigProp = () => {
    const [, setConfig] = useConfigState();

    useCreateMethod('setConfigProp', (k, v) => setConfig(prev => prev && ({
        ...prev,
        [k]: v
    })));
}

export default useSetConfigProp;