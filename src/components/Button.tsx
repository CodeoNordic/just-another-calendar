import { useState } from 'preact/hooks';
import { FunctionComponent } from 'preact';

const Button: FunctionComponent = () => {
    const [num, setNum] = useState<number>(0);

    return <button onClick={() => setNum(num + 1)}>
        Clicked {num} times
    </button>
}

export default Button;