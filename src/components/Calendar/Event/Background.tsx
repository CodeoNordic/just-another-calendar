const BackgroundEvent: FC<JAC.Event> = props => {
    console.log(props);
    if (props.type !== 'backgroundEvent') return null;

    console.log(props);

    // Background color is controlled in fullcalendar
    return <div className="jac-background-event" style={{ color: props.textColor? `${props.textColor}`: 'inherit' }}>
        tekst
    </div>
}

export default BackgroundEvent;