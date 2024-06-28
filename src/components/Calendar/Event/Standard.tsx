import { useConfig } from '@context/Config';
import useTooltip from '@hooks/useTooltip';

const StandardEvent: FC<FM.EventRecord> = props => {
    const config = useConfig();

    const {
        onPointerMove,
        onPointerLeave,

        //onButtonEnter,
        //onButtonLeave
    } = useTooltip(props.tooltip, props.colors);

    const title = (config?.privacyMode
        ? props.patientReference
        : (props.patientFullName || props.patientReference)) || props.title;

    return <div
        className="nobs-event"
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
    >
        {!props.allDay && <p className="time">{props.timeStart?.substring(0, 5)} - {props.timeEnd?.substring(0, 5)}</p>}
        <p className="title">{title}</p>
    </div>
}

export default StandardEvent;