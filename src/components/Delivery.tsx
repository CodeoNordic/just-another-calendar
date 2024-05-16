import useTooltip from '@hooks/useTooltip';
import performScript from '@utils/performScript';

// Import SVG icons
import ProfileIcon from 'jsx:@svg/profile.svg';
import ClockIcon from 'jsx:@svg/clock.svg';
import ArrowIcon from 'jsx:@svg/arrow.svg';
import LightningIcon from 'jsx:@svg/lightning.svg';

const Delivery: FC<FM.DeliveryRecord> = props => {
    const {
        onPointerMove,
        onPointerLeave,

        onButtonEnter,
        onButtonLeave
    } = useTooltip(props.tooltip, props.colors);

    return <div
        className="delivery"
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
    >
        <div className="top" style={{ color: props.colors?.date }}>
            <ClockIcon />
            <span className='date'>{props.dateFinishedDisplay}</span>

            {Boolean(props.isUrgent) && <LightningIcon style={{ color: props.colors?.urgentIcon ?? '#D90B00' }} />}
            {props.responsibleNextTaskInitials && <span className="user-initials">{props.responsibleNextTaskInitials}</span>}
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

            <p>{props.patientFullName}</p>
        </button>
    </div>
}

export default Delivery;