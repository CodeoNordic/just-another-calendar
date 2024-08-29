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
                    {config.createFields ? config.createFields.map(field => <div key={field.field}>
                        <p>{field.title ?? field.field}:</p>
                        <input type={field.type ?? "string"} value={newEvent?.[field.field] || ""} onChange={e => {
                            setNewEvent({...newEvent, [field.field]: e.target.value} as JAC.Event)}} />
                    </div>) : Object.keys(config.records[0])?.map((field: any) => <div key={field}>
                        <p>{field}:</p>
                        <input type='text' value={newEvent?.[field] || ""} onChange={e => setNewEvent({...newEvent, [field]: e.target.value} as JAC.Event)} />
                    </div>)}
                </div>
            </div>
            <div className='buttonsDiv'>
                <button onClick={() => {
                    setCreatingEvent(false);
                    setNewEvent(null);
                }}>Cancel</button>
                <button onClick={() => {
                    setCreatingEvent(false);
                    setNewEvent(null);
                    setConfig((prev: JAC.Config | null) => ({...prev, records: [...config.records, newEvent]} as JAC.Config));
                }}>Create</button>
            </div>
        </div>}
    </div>
}

export default NewEvent;