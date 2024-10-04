import { useMemo } from 'react';

import Collapse from "./Collapse";
import { useConfig } from "@context/Config";
import calculateContrast from "@utils/contrast";
import performScript from '@utils/performScript';
import capitalize from '@utils/capitalize';

const EventTemplates: FC = () => {
    const config = useConfig();
    
    const filteredAreas = useMemo<(JAC.Area & { templates: JAC.EventTemplate[] })[]>(() => config?.eventTemplateAreas?.map((area, i) => {
        const templates = config?.eventTemplates?.filter(template =>
            (template.areaName === area.name)
        );

        return {
            ...area,
            templates: templates!
        };
    }).filter(area =>
        Boolean(area?.templates?.length)
    ) || [{ name: 'default', title: config!.translations!.eventTemplatesHeader ?? 'Templates', templates: config!.eventTemplates! }],
        [config?.eventTemplateAreas, config?.eventTemplates]
    );

    if (!filteredAreas?.length) return null;

    return <div className="insertable-events">
        <div className="divider" />
        {filteredAreas.map((area, i) => <Collapse
            className="event-template-area"
            key={i}
            top={<div>{((area.title ?? (capitalize(area.name)))) || config!.translations!.eventTemplatesHeader || 'Templates'}</div>}
            collapsed={!area.open}
            onChange={collapsed => {
                // Pass the index to make tracking easier
                const param = {
                    ...area,
                    open: !collapsed,
                    index: i
                };

                if (!collapsed && config!.scriptNames!.onEventTemplateAreaOpened)
                    performScript('onEventTemplateAreaOpened', param);
                else if (collapsed && config!.scriptNames!.onEventTemplateAreaClosed)
                    performScript('onEventTemplateAreaClosed', param);
            }}
        >
            {area.templates?.map((template, j) => {
                template.event.duration ??= '01:00';

                const backgroundColor = template.backgroundColor || '#3788d8';
                const textColor = template.textColor || '#fff';

                return <div
                    key={j}
                    data-event={JSON.stringify(template.event)}
                    className="insertable-event"
                    style={{
                        backgroundColor,
                        color: config!.contrastCheck
                            ? (calculateContrast(textColor, backgroundColor, config!.contrastMin)? textColor: '#000')
                            : textColor
                    }}
                >
                    {template.title}
                </div>
            })}
        </Collapse>)}
        {/*<Collapse top={<>
            <div>{config!.translations?.eventTemplatesHeader ?? "Event templates"}</div>
        </>}
        collapsed={!config!.eventTemplatesOpen}
        >
            {config!.eventTemplates?.map((template, i) => {
                template.event.duration ??= "01:00";

                return <div
                    data-event={JSON.stringify(template.event)}
                    className="insertable-event"
                    key={i}  
                    style={{
                        background: template.backgroundColor || "#3788d8",
                        color: calculateContrast(template.textColor || "#fff", template.backgroundColor || "#3788d8", config?.contrastMin) 
                            ? template.textColor || "#fff" 
                            : "#000",
                        pointerEvents: template.locked ? "none" : "auto",
                        opacity: template.locked ? 0.5 : 1,
                        cursor: template.locked ? "not-allowed" : "grab"
                    }}>
                    {template.title}
                </div>
            })}
        </Collapse>*/}
    </div>
}

export default EventTemplates;