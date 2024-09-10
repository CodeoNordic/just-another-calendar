import calculateContrast from "@utils/contrast";
import Collapse from "./Collapse";
import { useConfigState } from "@context/Config";

const InsertableEvents: FC = () => {
    const [config, setConfig] = useConfigState();
    
    if (!config?.insertableEvents) return null

    return <div className="insertable-events">
        <div className="divider" />
        <Collapse top={<>
            <div>{config?.translations?.insertableEventsHeader ?? "Insertable events"}</div>
        </>}>
            {config?.insertableEvents.map(event => {
                event.duration ??= "01:00";

                return (
                    <div
                        data-event={JSON.stringify(event)}
                        className="insertable-event"
                        key={event.id}  
                        style={{
                            marginTop: "2px",
                            borderRadius: "5px",
                            padding: "2px",
                            cursor: "grab",
                            background: event.colors?.background || "#3788d8",
                            border: event.colors?.border || "1px solid #3788d8",
                            color: calculateContrast(event.colors?.text || "#fff", event.colors?.background || "#3788d8", config?.contrastMin) 
                                ? event.colors?.text || "#fff" 
                                : "#000"
                        }}
                    >
                        {event.FirstName} {/* convert to use layout from config later */}
                    </div>
                )})}
        </Collapse>
    </div>
}

export default InsertableEvents;