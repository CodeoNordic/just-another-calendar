# Events
To inject content into the calendar, events must be passed using the `events` key in the [config](./init.md#events-array).

The minimum requirement for each event is a unique `id` (string), and a start+end time.
If you are using a [FullCalendar view](./init.md#view-string), each event must also have
an associated `resourceId` (string or array of strings).

You can add any amount of additional fields, as long as they do not conflict with fields
already in use by the calendar. It is recommended to avoid using `camelCase`-casing for
additional fields, as the calendar uses this format. 

## Start+End
Due to a diversity in preference, there are multiple ways of defining a date/time range for events:

**Note:** FullCalendar by default DOES NOT respect timezones. Due to this, we've created a way
of translating the event time to the correct timezone, but ONLY IF the event uses
ISO timestamps.

### Valid Start date/time definitions
- `start` (string) or `timestampStart` (string) - An ISO timestamp (E.G 2024-11-19T07:00:00.000Z)

- `dateStart` (string) or `startDate` (string) - A standard date format (E.G 2024-11-19, 11/19/2024, 19.11.2024, etc.)
- `timeStart` (string) or `startTime` (string) - A 24-hour time (E.G 09:00, 17:30, etc.)
- `unixStart` (number) - A unix timestamp in seconds (E.G 1731999600)

### Valid End date/time definitions
- `end` (string) or `timestampEnd` (string) - An ISO timestamp (E.G 2024-11-19T08:00:00.000Z)

- `dateEnd` (string) or `endDate` (string) - A standard date format (E.G 2024-11-19, 11/19/2024, 19.11.2024, etc.)
- `timeEnd` (string) or `endTime` (string) - A 24-hour time (E.G 10:00, 18:30, etc.)
- `unixEnd` (number) - A unix timestamp in seconds (E.G 1732003200)

## Example
```json
{
    "resources": [
        {
            "id": "room6",
            "title": "Room 6"
        }
    ],

    // Config
    "events": [
        {
            "id": "1",
            "resourceId": "room6",

            "start": "2024-11-19T07:00:00.000Z",
            "end": "2024-11-19T08:00:00.000Z",

            // Additional custom fields to be used in an event component
            "Title": "Just Another Calendar",
            "Sponsor": "Andreas Haandlykken"
        }
    ]
}
```