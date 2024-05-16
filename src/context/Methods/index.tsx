import useAddRecords from './addRecords';
import useRemoveRecords from './removeRecords';
import useSetRecords from './setRecords';

import useUpdateRecord from './updateRecord';
import useSetConfigProp from './setConfigProp';

import useSetMinDate from './setMinDate';

// The purpose of applying the window methods in a react component is to be able to access e.g the config context
const MethodsProvider: FC = ({ children }) => {
    useAddRecords();
    useRemoveRecords();
    useSetRecords();

    useUpdateRecord();
    useSetConfigProp();

    useSetMinDate();

    return <>{children}</>;
}

export default MethodsProvider;