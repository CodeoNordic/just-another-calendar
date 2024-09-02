export default function getEventsFromObject<T = FM.Event>(
    obj: FM.Event<T>[]|FM.DataAPIEvent<T>[]|FM.DataAPIResponse<T>|null
): FM.Event<T>[]|null {
    // null
    if (obj === null) return null;

    // FM.DataAPIResponse
    if (!(obj instanceof Array)) return obj?.response?.data?.map?.(event => event?.fieldData) as FM.Event<T>[]|null;

    // FM.DataAPIEvent[]
    if (obj[0]?.fieldData !== undefined) return obj?.map?.(event => event?.fieldData) as FM.Event<T>[];

    // FM.Event[]
    return obj as FM.Event<T>[];
}