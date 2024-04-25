export default function combineClasses(...classes: any[]) {
    return classes.filter(c => typeof c === 'string').join(' ');
}

export function classHelper(styles: Record<string, string>) {
    return (...keys: any[]) => keys
        .filter(k => typeof k === 'string')
        .map(k => `${styles[k]} ${k}`)
        .join(' ')
}