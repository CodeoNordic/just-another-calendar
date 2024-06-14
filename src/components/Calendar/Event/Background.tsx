const BackgroundEvent: FC<FM.EventRecord> = props => {
    if (props.type !== 'backgroundEvent') return null;

    return <div className="nobs-background-event">
        {props.backgroundText}
    </div>
}

export default BackgroundEvent;