type Styles = Required<NOBS.Config>['styles'];

const map: { [k in keyof Styles]: string } = {
    event: '.nobs-event, .nobs-event button',
    resourceHeader: '.fc-resource-group, .fc-resource .fc-scrollgrid-sync-inner',
    dateHeader: '.date-header',
    dayHeader: '.fc-timeline-slot',
    tooltip: '#tooltip'
}

const styleLine = (selector: string, style: NOBS.TextStyle) => {
    const rules: string[] = [];

    style.font && rules.push(`${selector} {font-family:${style.font} !important;}`);
    style.size && rules.push(`${selector} {font-size:${style.size} !important;}`);
    (style.weight || style.boldness) && rules.push(`${selector} {font-weight: ${style.weight || style.boldness} !important;}`);
    style.padding && rules.push(`${selector} {padding:${style.padding} !important;}`);
    style.color && rules.push(`${selector} {color:${style.color} !important;}`);
    style.background && rules.push(`${selector} {background-color:${style.background} !important;}`);
    //style.verticalAlignment && rules.push(``);
    if (style.horizontalAlignment) {
        rules.push(`${selector} {text-align: ${style.horizontalAlignment} !important;}`);

        selector === map.dayHeader && rules.push(`.fc-timeline-slot-frame {justify-content:${
            style.horizontalAlignment === 'left'? 'flex-start':
            style.horizontalAlignment === 'right'? 'flex-end':
            'center'
        } !important;}`)
    }

    if (!rules.length) return '';
    return rules.join('\n');
}

export default function stylesFromConfig(styles: NOBS.Config['styles']) {
    const lines = Object.keys(map)
        .filter(k => !!styles?.[k as keyof Styles] && k !== 'base')
        .map(k => styleLine(map[k as keyof Styles]!, styles![k as keyof Styles]!));

    styles?.base && lines.push(styleLine('.calendar', styles.base));
    return lines.join('\n');
}