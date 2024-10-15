import Collapse from "./Collapse";
import { useConfig } from "@context/Config";
import calculateContrast from "@utils/contrast";
import performScript from '@utils/performScript';
import capitalize from '@utils/capitalize';
import Icon from '@components/Icon';

const EventTemplates: FC<{area: JAC.Area & {templates: JAC.EventTemplate[]}, index: number}> = (props) => {
    const config = useConfig()!;
    const area = props.area;
    const index = props.index;

    return <div className="insertable-events">
        <Collapse
            className="event-template-area"
            top={<div>{((area.title ?? (capitalize(area.name)))) || config?.translations?.eventTemplatesHeader || 'Templates'}</div>}
            collapsed={!area.open}
            onChange={collapsed => {
                // Pass the index to make tracking easier
                const param = {
                    ...area,
                    open: !collapsed,
                    index: index
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
        </Collapse>
    </div>
}

export default EventTemplates;