# Built-in Event Creation
Codeo uses its own FileMaker popup for creating new events.
However, the calendar has built-in support for this.

You are able to define a list of fields to be displayed
upon selecting a time range for a new event.

When an event is created using the built-in popup, the `onEventCreated` script defined in [`scriptNames`](./script-names.md)
is ran. An ID is automatically assigned for the event, which can later be updated
by using the [`updateEvent()`](./functions.md#updateeventsearch-data-autocreate) function.

If the field is nested, you can access it by typing out the path, like for example `colors.background`.  

**Note:** The `start` and `end` field-names will be automatically
filled in with the selected time-range. If you wish to use these,
the fields must be of the type `time`.

The `type` value is passed to the HTML `<input>` element, but there is also custom support for
a `dropdown` type, used for selection.

```json
{
    "newEventFields": [
        {
            "name": "title",
            "type": "text",
            "placeholder": "Write a title...",
            "defaultValue": "Untitled Event"
        },

        {
            "name": "start",
            "title": "Start",
            "type": "time"
        },

        {
            "name": "colors.background",
            "title": "Edge color",
            "type": "color",
            "default": "#3788d8"
        },  

        {
            "name": "room",
            "type": "dropdown",
            "placeholder": "---Room---",

            "items": [
                { "label": "Room 1", "value": 1 },
                { "label": "Room 2", "value": 2 },
                { "label": "Room 3", "value": 3 }
            ]
        }
    ]
}
```