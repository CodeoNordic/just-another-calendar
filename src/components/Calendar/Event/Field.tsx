import { useMemo, forwardRef } from 'react';

import Icon from '@components/Icon'
import combineClasses from '@utils/combineClasses';
import getFieldValue from '@utils/getFieldValue';
import performScript from '@utils/performScript';
import searchObject from '@utils/searchObject';
import { useConfig } from '@context/Config';

const Field: FC<JAC.EventField & { event: JAC.Event; onButtonEnter?: () => void; onButtonLeave?: () => void; tooSmall: boolean; }> = props => {
    const config = useConfig()!;
    
    const filterCheck = useMemo(() =>
        props._filter? searchObject(props.event, props._filter): true,
        [props._filter, props.event]
    );

    // Optimize value parsing with useMemo
    const fieldValue: JSX.Element | string | null = useMemo(() => {
        const value =  getFieldValue(props.event, {
            eval: props.eval,
            htmlTemplate: props.htmlTemplate,
            template: props.template,
            value: props.value,
            icon: props.icon
        });

        if (typeof props.htmlTemplate === 'string' && props.htmlTemplate[0] === '<' && value !== null) return <div
            dangerouslySetInnerHTML={{ __html: value }}
        />

        return value;
    }, [props.htmlTemplate, props.event, props.eval, props.htmlTemplate, props.template, props.value, props.icon, config]);

    // Get the icon
    const fieldIconSrc: string|null = useMemo(() => {
        if (!props.icon) return null;
        if (typeof props.icon === 'string') return props.icon;

        const matches = (props.icon instanceof Array? props.icon: [props.icon])
            .filter(obj => !obj._filter || searchObject(props.event, obj._filter));
        
        return matches[0]?.icon || null;
    }, [props.icon, props.event, config]);

    if (!filterCheck) return null;
    const fieldIcon = (fieldIconSrc) && <Icon src={fieldIconSrc} style={{
        marginLeft: props.iconPosition === 'right'? '4px': undefined,
        marginRight: props.iconPosition !== 'right'? '4px': undefined
    }} />

    if (!props.showIfEmpty && fieldValue === null && fieldIconSrc === null) return null;
    const fieldType = props.type?.toLowerCase() || 'text';

    return <>
        {props.lineBreakStart && <div className="line-break" />}
        <div
            className={combineClasses(
                'jac-field', `type-${fieldType}`,
                props.value && `field-${props.value.replace(/\s/g, '_')}`,
                props.fullWidth && !props.tooSmall && 'field-fullwidth',
                props.cssClass
            )}
            style={{
                color: props.color ?? props.textStyle?.color ?? props.textStyle?.textColor,
                backgroundColor: props.textStyle?.background ?? props.textStyle?.backgroundColor,
                margin: props.textStyle?.margin,
                padding: props.textStyle?.padding,
                marginTop: (typeof props.marginTop === 'number')? `${props.marginTop}px`: props.marginTop,
                marginBottom: (typeof props.marginBottom === 'number')? `${props.marginBottom}px`: props.marginBottom,
                marginLeft: (typeof props.marginLeft === 'number')? `${props.marginLeft}px`: props.marginLeft,
                marginRight: (typeof props.marginRight === 'number')? `${props.marginRight}px`: props.marginRight,
                flexGrow: props.grow,
                fontFamily: props.textStyle?.font,
                fontWeight: props.textStyle?.weight ?? props.textStyle?.boldness,
                fontStyle: props.textStyle?.style,
                textAlign: props.textStyle?.alignment
            }}
        >
            {['text', 'time', 'date'].includes(fieldType) && <>
                {props.iconPosition !== 'right' && fieldIcon}
                {fieldValue && <span>{fieldValue}</span>}
                {props.iconPosition === 'right' && fieldIcon}
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
                {props.iconPosition !== 'right' && fieldIcon}
                {fieldValue && <span>{fieldValue}</span>}
                {props.iconPosition === 'right' && fieldIcon}
            </button>}
        </div>
        {props.lineBreakEnd && <div className="line-break" />}
    </>
}

export default Field;