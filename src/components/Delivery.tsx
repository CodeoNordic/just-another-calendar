import performScript from '@utils/performScript';

// Import SVG icons
import ProfileIcon from 'jsx:@svg/profile.svg';
import ClockIcon from 'jsx:@svg/clock.svg';
import ArrowIcon from 'jsx:@svg/arrow.svg';
import LightningIcon from 'jsx:@svg/lightning.svg';

const Delivery: FC<FM.DeliveryRecord> = props => {
    return <div className="delivery">
        <div className="top"> 
            <ClockIcon />
            <span className='date'>{props.dateFinishedDisplay}</span>
            {props.isUrgent && <LightningIcon />}
            <span className="user-initials">{props.responsibleNextTaskInitials}</span>
        </div>
        
        <div className="summary"> 
            <button className="order-button" onClick={() => {performScript('openOrder', props.orderId)}}>
                <p className="order-text">
                    <strong>{props.orderNumber}</strong> - {props.nomenklatur}
                </p>
                <ArrowIcon />
            </button>
            <p>{props.orderCategory}</p>
        </div>
        
        <div className="coworker">
            <p>{props.responsibleNextTask}</p>
        </div>
        
        <button className="patient" onClick={() => performScript('openPatient', props.patientId)}>
            <ProfileIcon />
            <p>{props.patientFullName}</p>
        </button>
    </div>
}

export default Delivery;