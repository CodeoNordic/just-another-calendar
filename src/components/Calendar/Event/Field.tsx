import Icon from '@components/Icon'
import combineClasses from '@utils/combineClasses';
import performScript from '@utils/performScript';
import searchObject from '@utils/searchObject';

import get from 'lodash.get';

const Field: FC<JAC.EventField & { record: JAC.Event; onButtonEnter?: () => void; onButtonLeave?: () => void; }> = props => {
    if (!props.value) return null;
    if (props._filter && !searchObject(props.record, props._filter)) return null;
    
    const fieldIcon = props.icon && <Icon src={props.icon} />
    const fieldValue = props.record && get(props.record, props.value);
    
    if (!props.showIfEmpty && ['', undefined, null].includes(fieldValue)) return null;
    const fieldType = props.type || 'text';

    return <div className={combineClasses('jac-field', `type-${props.type}`, `field-${props.value.replace(/\s/g, '_')}`, props.cssClass)}>
        {fieldType === 'text' && <>
            {fieldIcon}
            <span>{fieldValue}</span>
        </>}

        {fieldType === 'button' && <button
            onPointerEnter={props.onButtonEnter}
            onPointerLeave={props.onButtonLeave}
            onClick={props.script? () => performScript(
                props.script as string,
                props.record,
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