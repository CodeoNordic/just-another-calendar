import { useMemo } from 'react';

import Collapse from "./Collapse";
import { useConfig } from "@context/Config";
import calculateContrast from "@utils/contrast";
import performScript from '@utils/performScript';
import capitalize from '@utils/capitalize';
import Icon from '@components/Icon';

const EventTemplates: FC = () => {
    const config = useConfig()!;

    const sortedTemplates = useMemo(() => {
        if (!config.eventTemplates) return null;

        return [...(config.eventTemplates)]
            .sort((a, b) => (a.sort || Infinity) - (b.sort || Infinity));
    }, [config.eventFilters]);
    
    const filteredAreas = useMemo<(JAC.Area & { templates: JAC.EventTemplate[] })[]>(() => config?.eventTemplateAreas?.map((area, i) => {
        const templates = sortedTemplates?.filter(template =>
            (template.areaName === area.name)
        );

        return {
            ...area,
            templates: templates!
        };
    }).filter(area =>
        Boolean(area?.templates?.length)
    ) || [{ name: 'default', title: config?.translations?.eventTemplatesHeader ?? 'Templates', templates: sortedTemplates! }],
        [config?.eventTemplateAreas, sortedTemplates]
    );

    if (!filteredAreas?.length || !filteredAreas.some(area => Boolean(area?.templates?.length))) return null;

    return <div className="insertable-events">
        <div className="divider" />
        {filteredAreas.map((area, i) => <Collapse
            className="event-template-area"
            key={i}
            top={<div>{((area.title ?? (capitalize(area.name)))) || config?.translations?.eventTemplatesHeader || 'Templates'}</div>}
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
                    data-instant={template.instant? '': undefined}
                    className="insertable-event"
                    style={{
                        backgroundColor,
                        color: config!.contrastCheck
                            ? (calculateContrast(textColor, backgroundColor, config!.contrastMin)? textColor: '#000')
                            : textColor
                    }}
                >
                    <div className="insertable-event-content">
                        {template.icon && <Icon src={template.icon} />}
                        {template.title && <span>{template.title}</span>}
                    </div>
                </div>
            })}
        </Collapse>)}
    </div>
}

export default EventTemplates;