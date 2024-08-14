import { useConfig } from '@context/Config';
import useTooltip from '@hooks/useTooltip';

import BackgroundEvent from './Background';
import Field from './Field';
import { templateKey } from '@utils/getFieldValue';

const Event: FC<JAC.Event> = props => {
    // An event does not render without the config being present
    const config = useConfig()!;
    const {
        onPointerMove,
        onPointerLeave,

        onButtonEnter,
        onButtonLeave
    } = useTooltip(props.type !== 'backgroundEvent'? props.tooltip: undefined, props.colors);

    if (props.type === 'backgroundEvent') return <BackgroundEvent {...props} />

    // Find the correct component to use
    const componentName = props._component ?? config.eventComponent;
    let component = config.eventComponents?.find(component => component.name === componentName);

    // Default to the first component if none was found
    if (!component) {
        console.warn(`A component by the name ${componentName} was not found in the config. Using the first defined component`);
        component = config.eventComponents?.[0];
    }

    if (!component) return null;
    if (component.htmlTemplate) {
        const parsedHtml = component.htmlTemplate
            .replaceAll(
                /\{([^{}]*?(?:\\\{|\\\}|[^{}])*)\}/g,
                (_, key: string) => templateKey(
                    props,
                    key.replaceAll('\\{', '{')
                        .replaceAll('\\}', '}')
                )
            ).replaceAll('\\{', '{')
                .replaceAll('\\}', '}');

        return <div
            className="jac-event"
            onPointerMove={onPointerMove}
            onPointerLeave={onPointerLeave}
            dangerouslySetInnerHTML={{ __html: parsedHtml ?? '' }}
        />
    }

    return <div
        className="jac-event-wrapper"
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
    >
        <div
            className="jac-event"
            onPointerMove={onPointerMove}
            onPointerLeave={onPointerLeave}
        >
            {component.fields?.map((field, i) => <Field
                key={i}
                record={props}
                onButtonEnter={onButtonEnter}
                onButtonLeave={onButtonLeave}
                {...field}
            />)}
        </div>
    </div>
}

export default Event;