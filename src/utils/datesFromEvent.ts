import dateFromString from "./dateFromString";

export default function datesFromEvent(event: JAC.Event) {
    const eventStart = dateFromString(event.timestampStart ?? event.start ?? event.startDate ?? event.dateStart);
    const eventEnd = dateFromString(event.timestampEnd ?? event.end ?? event.endDate ?? event.dateEnd ?? event.dateFinishedDisplay);

    const timeStart = event.startTime ?? event.timeStart;
    const timeEnd = event.endTime ?? event.timeEnd;

    if (timeStart) {
        const match = timeStart.match(/^(\d{1,2}):(\d{1,2})/);
        match && eventStart?.setHours(Number(match[1]), Number(match[2]));
    }

    if (timeEnd) {
        const match = timeEnd.match(/^(\d{1,2}):(\d{1,2})/);
        match && eventEnd?.setHours(Number(match[1]), Number(match[2]));
    }

    return { start: eventStart, end: eventEnd };
}