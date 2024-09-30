# Event Templates
A powerful feature of this calendar is the ability to drag an event in
from the side-menu, by using **templates**. This can be used for creating specific types
of events, but also for assigning a time to future events in a waiting list.

When a template is dragged into the calendar, an ID is automatically created using the
`uuid` format. However, if an ID is already specified in the `event` value of a template,
this will be used.

Each event template may also include a `locked` value, which controls whether or not the user can
drag the template into the calendar. This is useful if you want to prevent dragging E.G an event from
a waiting-list twice.

```json
{
    // Config
    "eventTemplates": [
        // Consulting
        {
            "title": "Consulting",
            "backgroundColor": "#4499cc",
            "textColor": "#ffffff",

            "event": {
                "colors": {
                    "background": "#4499cc",
                    "textColor": "#ffffff"
                },

                "YourCustomEventType": "consulting"
            }
        },

        // Meeting
        {
            "title": "Meeting",
            "backgroundColor": "#aaeeaa",
            "textColor": "#000000",

            "event": {
                "colors": {
                    "background": "#aaeeaa",
                    "textColor": "#000000"
                },

                "YourCustomEventType": "meeting"
            }
        },

        // E.G An event without a set time
        {
            "title": "P-001 Joakim Isaksen",
            "backgroundColor": "#777799",
            "textColor": "#ffffff",

            "event": {
                // Pre-determined ID
                "id": "abcd-efgh-ijkl-mnop",

                "colors": {
                    "background": "#777799",
                    "textColor": "#ffffff"
                },

                "YourCustomEventType": "consulting"
            }
        }
    ]
}
```