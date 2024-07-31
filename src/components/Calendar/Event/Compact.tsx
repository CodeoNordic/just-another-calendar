import { useMemo, Fragment } from 'react';

import { useConfig } from '@context/Config';
import useTooltip from '@hooks/useTooltip';

import performScript from '@utils/performScript';
import combineClasses from '@utils/combineClasses';

// Import SVG Icons
import ProfileIcon from 'jsx:@svg/profile.svg';
import ClockIcon from 'jsx:@svg/clock.svg';
import LightningIcon from 'jsx:@svg/lightning.svg';

const fixedFields: (string & keyof JAC.Event)[] = [
    'dateFinishedDisplay',
    'patientReference'
];

const CompactEvent: FC<JAC.Event> = props => {
    const config = useConfig();

    const {
        onPointerMove,
        onPointerLeave,

        onButtonEnter,
        onButtonLeave
    } = useTooltip(props.tooltip, props.colors);

    const patientFullName = !config?.privacyMode && props.patientFullName;
    const fields: Required<JAC.Config['compactFields']> = useMemo(() =>
        (config?.compactFields instanceof Array)
            ? config.compactFields
            : [config?.compactFields ?? 'patientReference', 'dateFinishedDisplay'],
        [config?.compactFields]
    );

    const extraFields = useMemo(() =>
        fields.filter(f =>
            !fixedFields.includes(f)
        ).map(f => props[f]).filter(f => !!f),
    [fields]);

    return <div
        className={combineClasses(
            'jac-event compact',
            !!extraFields.length && 'extra-fields',
            ...fields.map(f => `includes-${f}`)
        )}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
    >
        {fields.includes('dateFinishedDisplay') && <div className="top" style={{ color: props.colors?.date }}>
            <ClockIcon className="clock-icon" />
            <span className='date'>{props.dateFinishedDisplay?.replace(/\d{2}(\d{2})$/, '$1')}</span>

            {Boolean(props.isUrgent) && <LightningIcon className="urgent-icon" style={{ color: props.colors?.urgentIcon ?? '#D90B00' }} />}
        </div>}

        {!!extraFields.length && <>
            <br />
            <div className="extra-fields">
                {extraFields.map((v, i) => <span key={i}>
                    {v}
                </span>)}
            </div>
        </>}

        {fields.includes('patientReference') && <button
            className="patient"
            onClick={() => performScript('openPatient', props.patientId)}
            style={{ color: props.colors?.text }}
            onPointerMove={onButtonEnter}
            onPointerLeave={onButtonLeave}
        >
            <ProfileIcon />
            <p>{props.patientReference}{Boolean(props.patientReference && patientFullName) && ' - '}</p>
            {Boolean(props.patientReference && patientFullName) && <p>{patientFullName}</p>}
        </button>}
    </div>
}

export default CompactEvent;