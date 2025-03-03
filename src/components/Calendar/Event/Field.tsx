import { useMemo } from 'react';

import Icon from '@components/Icon'
import combineClasses from '@utils/combineClasses';
import getFieldValue from '@utils/getFieldValue';
import performScript from '@utils/performScript';
import searchObject from '@utils/searchObject';
import { useConfig } from '@context/Config';

const cssFields: (string & keyof Partial<JAC.EventField>)[] = [
    'marginTop',
    'marginBottom',
    'marginLeft',
    'marginRight',

    'paddingTop',
    'paddingBottom',
    'paddingLeft',
    'paddingRight'
];

const Field: FC<JAC.EventField & { event: JAC.Event; onButtonEnter?: () => void; onButtonLeave?: () => void; tooSmall: boolean; }> = props => {
    const config = useConfig()!;
    
    const filterCheck = useMemo(() =>
        props._filter? searchObject(props.event, props._filter): true,
        [props._filter, props.event]
    );

    // Optimize value parsing with useMemo
    const fieldValue: JSX.Element | string | null = useMemo(() => {
        const value = props.type === 'divider' ? null : getFieldValue(props.event, {
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

    // Apply passed styles
    const passedStyles = useMemo(() => {
        const styles: RSAny = {};

        cssFields.forEach(f => {
            if (!['string', 'number'].includes(typeof props[f])) return;
            styles[f] = typeof props[f] === 'string' ? props[f] : `${props[f]}px`;
        });
        
        return styles;
    }, cssFields.map(f => props[f]));

    if (!filterCheck) return null;
    const fieldIcon = (fieldIconSrc) && <Icon
        src={fieldIconSrc}
        thickness={props.iconThickness}
        width={props.iconWidth}
        height={props.iconHeight}
        style={{
            marginLeft: props.iconPosition === 'right'? '4px': undefined,
            marginRight: props.iconPosition !== 'right'? '4px': undefined
        }}
    />

    const fieldType = props.type?.toLowerCase() || 'text';
    
    if (
        props.type !== 'divider'
        && !props.showIfEmpty
        && fieldValue === null
        && fieldIconSrc === null
    ) return null;

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
                flexGrow: props.grow,
                fontFamily: props.textStyle?.font,
                fontWeight: props.textStyle?.weight ?? props.textStyle?.boldness,
                fontStyle: props.textStyle?.style,
                textAlign: props.textStyle?.alignment,
                borderColor: props.color ?? props.textStyle?.color ?? props.textStyle?.textColor ?? 'inherit',
                borderTopStyle: props.type === 'divider' ? 'solid' : undefined,
                borderTopWidth: props.type === 'divider' ? '1px' : undefined,
                width: props.type === 'divider' ? '100%' : undefined,
                ...passedStyles
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