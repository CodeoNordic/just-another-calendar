# Built-in Event Creation
Codeo uses its own FileMaker popup for creating new events.
However, the calendar has built-in support for this.

You are able to define a list of fields to be displayed
upon selecting a time range for a new event.

**Note:** The `start` and `end` field-names will be automatically
filled in with the selected time-range. If you wish to use these,
the fields must be of the type `datetime`.

The `type` value is passed to the HTML `<input>` element, but there is also custom support for
a `dropdown` type, used for selection.

Example:
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