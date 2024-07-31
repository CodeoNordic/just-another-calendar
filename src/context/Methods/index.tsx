import useAddRecords from './addRecords';
import useRemoveRecords from './removeRecords';
import useSetRecords from './setRecords';

import useUpdateRecord from './updateRecord';
import useSetConfigValue from './setConfigValue';

// The purpose of applying the window methods in a react component is to be able to access e.g the config context
const Methods: FC = ({ children }) => {
    useAddRecords();
    useRemoveRecords();
    useSetRecords();

    useUpdateRecord();
    useSetConfigValue();

    return <>{children}</>;
}

export default Methods;