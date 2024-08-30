import { useConfigState } from '@context/Config';
import Crossmark from 'jsx:@assets/svg/crossmark.svg';


interface NewEventProps {
    creatingEvent: boolean;
    setCreatingEvent: (value: boolean) => void;
    newEvent: JAC.Event | null;
    setNewEvent: (value: JAC.Event | null) => void;
    newEventPos: { x: number, y: number } | null;
}

const NewEvent: FC<NewEventProps> = props => {
    const { creatingEvent, setCreatingEvent, newEvent, setNewEvent, newEventPos } = props;
    const [config, setConfig] = useConfigState();
    
    if (!config || !creatingEvent) return null

    return <div>
        {creatingEvent && <div className='createEvent' style={{
            top: newEventPos?.y,
            left: newEventPos?.x
        }}>
            <div className='inputsDiv'>
                <div className='topCreate' style={{
                    background: newEvent?.colors?.background || "#3788d8"
                }}>
                    <Crossmark className='cross' onClick={() => setCreatingEvent(false)}/>
                </div>
                <div className='bodyCreate'>
                    <p className='createTitle'>Create Event?</p>
                    {config.newEventFields?.map(value => <div key={value.field}>
                        <p>{value.title ?? value.field}</p>
                        <input 
                            type={value.type ?? "string"} 
                            value={value.type === "time" 
                                ? newEvent?.[value.field].toString().split("T")[1] 
                                : newEvent?.[value.field] || ""}
                            placeholder={value.placeholder ?? ""}     
                            onChange={e => {
                                let inputValue = e.target.value as string | number | boolean;
                                e.type === "checkbox" && (inputValue = e.target.checked);
                                e.type === "time" && (inputValue = newEvent?.[value.field].toString().split("T")[0] + "T" + inputValue);

                            setNewEvent({...newEvent, [value.field]: value} as JAC.Event)}} />
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