import { useMemo } from 'react';

import Icon from '@components/Icon'
import combineClasses from '@utils/combineClasses';
import getFieldValue from '@utils/getFieldValue';
import performScript from '@utils/performScript';
import searchObject from '@utils/searchObject';

const Field: FC<JAC.EventField & { event: JAC.Event; onButtonEnter?: () => void; onButtonLeave?: () => void; }> = props => {
    const filterCheck = useMemo(() =>
        (props._filter && !searchObject(props.event, props._filter)) || true,
        [props._filter, props.event]
    );

    // Optimize value parsing with useMemo
    const fieldValue: JSX.Element | string | null = useMemo(() => {
        const value =  getFieldValue(props.event, {
            eval: props.eval,
            htmlTemplate: props.htmlTemplate,
            template: props.template,
            value: props.value
        });

        if (typeof props.htmlTemplate === 'string' && props.htmlTemplate[0] === '<' && value !== null) return <div dangerouslySetInnerHTML={{ __html: value }} />
        return value;
    }, [props.htmlTemplate, props.event, props.eval, props.htmlTemplate, props.template, props.value]);

    if (!filterCheck) return null;
    const fieldIcon = props.icon && <Icon src={props.icon} />

    if (!props.showIfEmpty && fieldValue === null) return null;
    const fieldType = props.type?.toLowerCase() || 'text';

    return <div 
        className={combineClasses(
            'jac-field', `type-${props.type}`, 
            props.value && `field-${props.value.replace(/\s/g, '_')}`, 
            props.cssClass
        )}
        style={{
            width: props.fullWidth? '100%': undefined,
            color: props.color
        }}
    >
        {['text', 'time', 'date'].includes(fieldType) && <>
            {fieldIcon}
            <span>{fieldValue}</span>
        </>}

        {fieldType === 'button' && <button
            onPointerEnter={props.onButtonEnter}
            onPointerLeave={props.onButtonLeave}
            onClick={props.script? () => performScript(
                props.script as string,
                props.event,
                undefined,
                true
            ): undefined
        }>
            {fieldIcon}
            <span>{fieldValue}</span>    
        </button>}
    </div>
}

export default Field;