import useAddRecords from './addRecords';
import useRemoveRecords from './removeRecords';
import useSetRecords from './setRecords';

import useUpdateRecord from './updateRecord';

// The purpose of applying the window methods in a react component is to be able to access e.g the config context
const MethodsProvider: FC = ({ children }) => {
    useAddRecords();
    useRemoveRecords();
    useSetRecords();

    useUpdateRecord();

    return <>{children}</>;
}

export default MethodsProvider;