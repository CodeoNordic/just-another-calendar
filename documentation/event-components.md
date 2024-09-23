# Event Components
Most developers will want their events to be displayed differently
from the default setting. This is what **event components** are
responsible for.

Each event component defined in the [config](./init.md#eventcomponents-array)
should have a list of fields to display, along with optional criteria to describe
which events should use it.

## Field Definition
Each field can be defined in three separate ways:

### 1. Value
Reads the specified key from the event.

Example:
```json
{
    "value": "FirstName"
}
```

### 2. Template
Parse a string template where anything wrapper in curly brackets `{` and `}`
will inject the event's field values.

Example:
```json
{
    "template": "Full name: {FirstName} {LastName}"
}
```

There is also built-in support for converting timestamps into a readable
format:

```json
{
    "template": "Meeting start: {time:start}"
}
```

If the date and time is separated, you may (if required) use a `+` to combine them:

```json
{
    "template": "Meeting start: {time:startDate+startTime}"
}
```

### 3. Eval (JavaScript Code)
Run your own code to dynamically display a certain value.

The passed JavaScript **MUST be a valid function.**

The first parameter is the event itself, and the second parameter is the config.

Example:
```json
{
    "eval": "(event, config) => config.hidePersonalInfo? event.patientReference: event.patientName"
}
```

Because the evaluated code does not include any user input, the use of eval
should not induce a risk of code injection, granted that the developer verifies
that the JavaScript code passed is correct.

## Complete Example
```json
{
    // Config
    "resources": [
        {
            "id": "room6",
            "title": "Room 6"
        }
    ],

    "events": {
        "id": "1",
        "resourceId": "room6",

        "start": "2024-11-19T07:00:00.000Z", // 09:00 in Malmö, Sweden
        "end": "2024-11-19T08:00:00.000Z", // 10:00 in Malmö, Sweden

        // Additional custom fields to be used in an event component
        "title": "Just Another Calendar",
        "sponsor": "Andreas Haandlykken"
    },

    "defaultEventComponent": "CustomEventComponent", // The component to use by default
    "eventComponents": [
        {
            "name": "CustomEventComponent",
            "fields": [
                {
                    "value": "title",
                    "icon": "coolIcon", // Key reference to an icon in the 'icons' array (not defined here)
                    "fullWidth": true, // Ensure that the following fields are placed under this field

                    "marginBottom": "12px" // If this is a number, it will count as pixels
                },

                {
                    "template": "- {sponsor}"
                }
            ]
        }
    ]
}
```