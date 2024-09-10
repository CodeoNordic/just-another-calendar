import Collapse from "./Collapse";
import { useConfig } from "@context/Config";
import calculateContrast from "@utils/contrast";

const EventTemplates: FC = () => {
    const config = useConfig();
    
    if (!config?.eventTemplates) return null

    return <div className="insertable-events">
        <div className="divider" />
        <Collapse top={<>
            <div>{config?.translations?.insertableEventsHeader ?? "Insertable events"}</div>
        </>}>
            {config?.eventTemplates.map(template => {
                template.event.duration ??= "01:00";

                return (
                    <div
                        data-event={JSON.stringify(template.event)}
                        className="insertable-event"
                        key={template.title}  
                        style={{
                            background: template.backgroundColor || "#3788d8",
                            color: calculateContrast(template.textColor || "#fff", template.backgroundColor || "#3788d8", config?.contrastMin) 
                                ? template.textColor || "#fff" 
                                : "#000"
                        }}
                    >
                        {template.title}
                    </div>
                )})}
        </Collapse>
    </div>
}

export default EventTemplates;