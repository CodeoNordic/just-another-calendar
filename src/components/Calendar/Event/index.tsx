import { useMemo } from 'react';
import { useConfig } from '@context/Config';
import useTooltip from '@hooks/useTooltip';

import searchObject from '@utils/searchObject';
import { templateKey } from '@utils/getFieldValue';

import BackgroundEvent from './Background';
import Field from './Field';

import { warn } from '@utils/log';

const Event: FC<JAC.Event> = ({ children, ...props }) => {
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
    const component = useMemo(() => {
        let comp: JAC.EventComponent|undefined;
        
        if (props._component) {
            comp = config.eventComponents?.find(c => c.name === props._component);
            if (!comp) warn(`A component by the name ${props._component} was not found`, props);
        }

        else {
            const matchingComponents = config.eventComponents?.filter(c => c._filter && searchObject(props, c._filter)) || [];
            if (matchingComponents.length > 1)
                warn(`More than one event component had a positive match for the following event. The first one (${matchingComponents[0].name}) will be used.`, props);

            comp = matchingComponents[0];
        }

        if (!comp && config.defaultEventComponent) {
            comp = config.eventComponents?.find(c => c.name === config.defaultEventComponent);
        }

        return comp;
    }, [props, config.defaultEventComponent, config.eventComponents]);

    if (!Object.keys(props).length) return null;

    if (!component) {
        warn('A component was not found for the following event', props);
        return null;
    }
    
    if (component.htmlTemplate && component.htmlTemplate[0] === '<') {
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
        data-eventid={props.id}
    >
        <div
            className="jac-event"
            onPointerMove={onPointerMove}
            onPointerLeave={onPointerLeave}
        >
            {component.fields?.map((field, i) => <Field
                key={i}
                event={props}
                onButtonEnter={onButtonEnter}
                onButtonLeave={onButtonLeave}
                {...field}
            />)}
        </div>
    </div>
}

export default Event;