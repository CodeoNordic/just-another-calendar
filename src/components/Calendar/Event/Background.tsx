const BackgroundEvent: FC<JAC.Event> = props => {
    if (props.type !== 'backgroundEvent') return null;

    // Background color is controlled in fullcalendar
    return <div className="jac-background-event" style={{ color: props.textColor? `${props.textColor}`: 'inherit' }}>
        {props.backgroundText}
    </div>
}

export default BackgroundEvent;