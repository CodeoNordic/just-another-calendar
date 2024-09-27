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

```js

eventTemplates: [
        {
            title: "Test 1",
            backgroundColor: "#ff0000",
            textColor: "#ffffff",
            event: {
                FirstName: "Joakim",
                filterId: ['filter1', 'source1'],
                colors: {
                    background: '#ff0000',
                    border: '#ff0000'
                }
            }
        },
        {
            title: "Test 2",
            backgroundColor: "#00ff00",
            textColor: "#ffffff",
            event: {
                FirstName: "Joakim Isaksen",
                filterId: ['filter2', 'source2'],
                colors: {
                    background: '#00ff00',
                    border: '#00ff00'
                }
            }
        },
        {
            title: "Test 3",
            backgroundColor: "#0000ff",
            textColor: "#ffffff",
            event: {
                FirstName: "Joakim Isaksen +",
                filterId: ['filter2', 'source1'],
                colors: {
                    background: '#0000ff',
                    border: '#0000ff'
                }
            }
        },
        {
            title: "Test 4",
            backgroundColor: "#ff00ff",
            textColor: "#ffffff",
            event: {
                duration: "02:00",
                FirstName: "test testesen",
                filterId: ['filter3', 'source3'],
                colors: {
                    background: '#ff00ff',
                    border: '#ff00ff'
                }
            }
        },
        {
            title: "Test 5",
            backgroundColor: "#00ffff",
            textColor: "#ffffff",
            event: {
                FirstName: "Vetle :)",
                filterId: ['filter3', 'source2'],
                colors: {
                    background: '#00ffff',
                    border: '#00ffff'
                }
            }
        } 
    ]
```