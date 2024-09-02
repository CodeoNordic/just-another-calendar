import { useConfigState } from '@context/Config';
import Crossmark from 'jsx:@assets/svg/crossmark.svg';
import Checkmark from 'jsx:@assets/svg/checkmark.svg';


interface NewEventProps {
    creatingState: State<boolean>;
    eventState: State<JAC.Event|null>;
    pos: { x: number, y: number } | null;
}

export function setObjectValue(obj: object, path: string, value: any) {
    const keys = path.split('.'); 
    let current = obj as any;

    for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];

        if (!(key in current) || typeof current[key] !== 'object') {
            current[key] = {};
        }

        current = current[key];
    }

    current[keys[keys.length - 1]] = value;
}

function getObjectValue(obj: object, path: string) {
    const keys = path.split('.');
    
    let value = obj as any;
    for (let key of keys) {
        if (value && typeof value === 'object' && key in value) {
            value = value[key];
        } else {
            return undefined;
        }
    }
    
    return value;
}

const NewEvent: FC<NewEventProps> = props => {
    const [creatingEvent, setCreatingEvent] = props.creatingState;
    const [newEvent, setNewEvent] = props.eventState;

    const [config, setConfig] = useConfigState();

    return <div>
        {creatingEvent && <div className='createEvent' style={{
            top: props.pos?.y,
            left: props.pos?.x
        }}>
            <div className='inputsDiv'>
                <div className='topCreate' style={{
                    background: newEvent?.colors?.background || "#3788d8"
                }}>
                    <Crossmark className='icon' onClick={() => setCreatingEvent(false)}/>
                </div>
                <div className='bodyCreate'>
                    <p className='createTitle'>Create Event?</p>
                    {config?.newEventFields?.map(value => <div key={value.field} className='inputDiv'>
                        <p>{value.title ?? value.field}</p>
                        <input 
                            type={value.type ?? "string"} 
                            value={value.type === "time" 
                                ? getObjectValue(newEvent || {}, value.field).toString().split("T")[1] 
                                : getObjectValue(newEvent || {}, value.field) || ""}
                            placeholder={value.placeholder ?? ""}     
                            onChange={e => {
                                let inputValue = e.target.value as string | number | boolean;
                                e.type === "checkbox" && (inputValue = e.target.checked);
                                e.type === "time" && (inputValue = newEvent?.[value.field].toString().split("T")[0] + "T" + inputValue);
                                const newEventCopy = {...newEvent};
                                setObjectValue(newEventCopy, value.field, inputValue);
                                setNewEvent({...newEventCopy} as JAC.Event)}} />
                    </div>)}
                </div>
            </div>
            <div className='buttonsDiv'>
                <button onClick={() => {
                    setCreatingEvent(false);
                    setNewEvent(null);
                }}><Crossmark className='icon'/>Discard</button>
                <button onClick={() => {
                    setCreatingEvent(false);
                    setNewEvent(null);
                    setConfig((prev: JAC.Config | null) => ({...prev, events: [...config!.events, newEvent]} as JAC.Config));
                }}><Checkmark className='icon'/>Save</button>
            </div>
        </div>}
    </div>
}

export default NewEvent;