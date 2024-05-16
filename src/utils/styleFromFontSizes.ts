type Sizes = Required<NOBS.Config>['fontSizes']

const map: { [k in keyof Sizes]: string } = {
    delivery: '.delivery, .delivery button',
    resourceHeader: '.fc-resource-group',
    dateHeader: '.date-header',
    dayHeader: '.fc-timeline-slot'
}

const sizeFromValue = (v: string|number) => typeof v === 'number'? `${v}px`:v;
const getStyle = (selector: string, size: string|number) => `${selector} { font-size: ${sizeFromValue(size)} !important; }`;

export default function stylesFromFontSizes(sizes: Sizes) {
    const styles = Object.keys(map)
        .filter(k => !!sizes[k as keyof Sizes] && k !== 'base')
        .map(k => getStyle(map[k as keyof Sizes]!, sizes[k as keyof Sizes]!));

    sizes.base && styles.push(`.calendar { font-size: ${sizes.base} !important; }`);

    return styles.join('\n');
}