import useAddRecords from './addRecords';
import useRemoveRecords from './removeRecords';

// The purpose of applying the window methods in a react component is to be able to access e.g the config context
const MethodsProvider: FC = ({ children }) => {
    useAddRecords();
    useRemoveRecords();

    return <>{children}</>;
}

export default MethodsProvider;