export default function fileMakerFindEquivalent(value: any, search: string): boolean {
    search = String(search);

    // If search starts with ^, do an inverse search
    if (search.startsWith('^')) return !fileMakerFindEquivalent(value, search.substring(1));
    if (search === '=') return ["", undefined, null, NaN].includes(value);

    const stringValue = String(value).toLowerCase();

    let start = search.substring(0, 2);
    let trimmed = search.substring(2).toLowerCase();

    switch(start) {
        case '==': return stringValue == trimmed;
        case '!=': return stringValue != trimmed;
        case '<=': return stringValue <= trimmed;
        case '>=': return stringValue >= trimmed;
    }

    start = search.substring(0, 1);
    trimmed = search.substring(1);

    switch(start) {
        case '*': return !["", 'undefined', 'null', 'NaN'].includes(String(value));
        case '<': return stringValue < trimmed;
        case '>': return stringValue > trimmed;
    }

    return stringValue == search.toLowerCase();
}