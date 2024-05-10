import { useCreateMethod } from '@utils/createMethod';
import { useConfigState } from '@context/Config';

const useSetMinDate = () => {
    const [, setConfig] = useConfigState();

    useCreateMethod('setMinDate', str => setConfig(prev => prev && ({
        ...prev,
        minDate: str
    })));
}

export default useSetMinDate;