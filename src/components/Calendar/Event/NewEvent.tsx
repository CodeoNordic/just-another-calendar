import { useConfigState } from '@context/Config';
import Crossmark from 'jsx:@assets/svg/crossmark.svg';


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
                    <Crossmark className='cross' onClick={() => setCreatingEvent(false)}/>
                </div>
                <div className='bodyCreate'>
                    <p className='createTitle'>Create Event?</p>
                    {config.newEventFields?.map(field => <div key={field.field}>
                        <p>{field.title ?? field.field}:</p>
                        <input 
                            type={field.type ?? "string"} 
                            value={field.type === "time" 
                                ? newEvent?.[field.field].toString().split("T")[1] 
                                : newEvent?.[field.field] || ""} onChange={e => {
                            let value = e.target.value as string | number | boolean;
                            field.type === "checkbox" && (value = e.target.checked);
                            field.type === "time" && (value = newEvent?.[field.field].toString().split("T")[0] + "T" + value);

                            setNewEvent({...newEvent, [field.field]: value} as JAC.Event)}} />
                    </div>)}
                </div>
            </div>
            <div className='buttonsDiv'>
                <button onClick={() => {
                    setCreatingEvent(false);
                    setNewEvent(null);
                }}>Discard</button>
                <button onClick={() => {
                    setCreatingEvent(false);
                    setNewEvent(null);
                    setConfig((prev: JAC.Config | null) => ({...prev, records: [...config.records, newEvent]} as JAC.Config));
                }}>Save</button>
            </div>
        </div>}
    </div>
}

export default NewEvent;