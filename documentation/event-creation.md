# Built-in Event Creation
Codeo uses its own FileMaker popup for creating new events.
However, the calendar has built-in support for this.

The `type` field is passed to the HTML `<input>` element, but there is also support for
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