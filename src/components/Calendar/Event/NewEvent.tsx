import { useConfigState } from '@context/Config';
import Crossmark from 'jsx:@assets/svg/crossmark.svg';
import Checkmark from 'jsx:@assets/svg/checkmark.svg';
import get from 'lodash.get';
import set from 'lodash.set';
import performScript from '@utils/performScript';


interface NewEventProps {
    creatingState: State<boolean>;
    eventState: State<JAC.Event|null>;
    pos: { x: number, y: number } | null;
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
                    {config?.newEventFields?.map(value => (
                        <div key={value.field} className='inputDiv'>
                            <p>{value.title ?? value.field}</p>
                            <input 
                            lang={config?.locale ?? "en"}
                            type={value.type ?? "string"} 
                            className={value.type ? `${value.type}Input` : "stringInput"}
                            value={value.type === "time" 
                                ? get(newEvent as JAC.Event, value.field)?.toString().split("T")[1] || ""
                                : get(newEvent as JAC.Event, value.field) || ""}
                            placeholder={value.placeholder ?? ""}     
                            onChange={e => {
                                console.log(get(newEvent as JAC.Event, value.field)?.toString().split("T")[1]);
                                let inputValue = e.target.value as string | number | boolean;
                                if (e.target.type === "checkbox") {
                                inputValue = e.target.checked;
                                } else if (e.target.type === "time") {
                                const datePart = get(newEvent as JAC.Event, value.field)?.toString().split("T")[0] || "";
                                inputValue = `${datePart}T${e.target.value}`;
                                }
                                console.log(inputValue);
                                const newEventCopy = {...newEvent};
                                set(newEventCopy, value.field, inputValue);
                                setNewEvent({...newEventCopy} as JAC.Event);
                            }} 
                            />
                        </div>
                        ))}
                </div>
            </div>
            <div className='buttonsDiv'>
                <button onClick={() => {
                    setCreatingEvent(false);
                    setNewEvent(null);
                }}><Crossmark className='icon'/>Discard</button>
                <button onClick={() => {
                    setConfig((prev: JAC.Config | null) => ({...prev, events: [...config!.events, newEvent]} as JAC.Config));
                    config?.scriptNames.createEvent && performScript(config?.scriptNames.createEvent as string, newEvent);
                    setCreatingEvent(false);
                    setNewEvent(null);
                }}><Checkmark className='icon'/>Save</button>
            </div>
        </div>}
    </div>
}

export default NewEvent;