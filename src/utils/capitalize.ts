export default function capitalize(str: string, firstOnly: boolean = false) {
    if (firstOnly) return str.substring(0, 1).toUpperCase() + str.substring(1);

    return str.split(' ')
        .map(w => w.substring(0, 1).toUpperCase() + w.substring(1))
        .join(' ');
}