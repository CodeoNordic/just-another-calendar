import { Fragment } from 'react';

import { useConfig } from '@context/Config';
import useTooltip from '@hooks/useTooltip';

import performScript from '@utils/performScript';

// Import SVG icons
import ProfileIcon from 'jsx:@svg/profile.svg';
import ClockIcon from 'jsx:@svg/clock.svg';
import ArrowIcon from 'jsx:@svg/arrow.svg';
import LightningIcon from 'jsx:@svg/lightning.svg';

const StandardEvent: FC<FM.EventRecord> = props => {
    const config = useConfig();

    const {
        onPointerMove,
        onPointerLeave,

        onButtonEnter,
        onButtonLeave
    } = useTooltip(props.tooltip, props.colors);

    const patientFullName = !config?.privacyMode && props.patientFullName;

    return <div
        className="nobs-event"
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
    >
        <div className="top" style={{ color: props.colors?.date }}>
            <ClockIcon />
            <span className='date'>{props.dateFinishedDisplay}</span>

            {Boolean(props.isUrgent) && <LightningIcon className="urgent-icon" style={{ color: props.colors?.urgentIcon ?? '#D90B00' }} />}
            {props.responsibleNextTaskInitials && <span className="user-initials">
                {props.responsibleNextTaskInitials.split('\n').map((initials, i) => <Fragment key={i}>
                    {i !== 0 && <br />}
                    {initials}
                </Fragment>)}
            </span>}
        </div>
        
        <div className="summary"> 
            <button
                className="order-button"
                onClick={() => {performScript('openOrder', props.orderId)}}
                onPointerMove={onButtonEnter}
                onPointerLeave={onButtonLeave}
            >
                <p className="order-text">
                    <strong>{props.orderNumber}</strong> - {props.nomenklatur}
                </p>
                
                <ArrowIcon />
            </button>
            <p>{props.orderCategory}</p>
        </div>
        
        {props.responsibleNextTask && <div className="coworker">
            <p>{props.responsibleNextTask}</p>
        </div>}
        
        <button
            className="patient"
            onClick={() => performScript('openPatient', props.patientId)}
            style={{ color: props.colors?.patient }}
            onPointerMove={onButtonEnter}
            onPointerLeave={onButtonLeave}
        >
            <ProfileIcon />
            <p>{props.patientReference}{Boolean(props.patientReference && patientFullName) && ' - '}</p>
            {Boolean(props.patientReference && patientFullName) && <p>{patientFullName}</p>}
        </button>
    </div>
}

export default StandardEvent;