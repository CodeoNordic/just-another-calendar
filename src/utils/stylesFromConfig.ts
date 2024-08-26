type Styles = Required<JAC.Config>['styles'];

const map: { [k in keyof Styles]: string } = {
    event: '.jac-event, .jac-event button',
    resourceHeader: '.fc-resource-group, .fc-resource .fc-scrollgrid-sync-inner',
    dateHeader: '.date-header',
    dayHeader: '.fc-timeline-slot, .fc-day.fc-col-header-cell',
    tooltip: '#tooltip'
}

const styleLine = (selector: string, style: JAC.TextStyle) => {
    const rules: string[] = [];

    style.font && rules.push(`${selector} {font-family:${style.font} !important;}`);
    style.size && rules.push(`${selector} {font-size:${style.size} !important;}`);
    (style.weight || style.boldness) && rules.push(`${selector} {font-weight: ${style.weight || style.boldness} !important;}`);
    style.padding && rules.push(`${selector} {padding:${style.padding} !important;}`);
    (style.color || style.textColor) && rules.push(`${selector} {color:${style.color || style.textColor} !important;}`);
    (style.background || style.backgroundColor) && rules.push(`${selector} {background-color:${style.background || style.backgroundColor} !important;}`);
    
    if (style.alignment) {
        rules.push(`${selector} {text-align: ${style.alignment} !important;}`);

        selector === map.dayHeader && rules.push(`.fc-timeline-slot-frame {justify-content:${
            style.alignment === 'left'? 'flex-start':
            style.alignment === 'right'? 'flex-end':
            'center'
        } !important;}`)
    }

    if (!rules.length) return '';
    return rules.join('\n');
}

export default function stylesFromConfig(styles: JAC.Config['styles']) {
    const lines = Object.keys(map)
        .filter(k => !!styles?.[k as keyof Styles] && k !== 'base')
        .map(k => styleLine(map[k as keyof Styles]!, styles![k as keyof Styles]!));

    styles?.base && lines.push(styleLine('.calendar', styles.base));
    return lines.join('\n');
}