# Script Names
This module uses various key names for scripts, and in order to
map the right script to the right event, this object must be defined.

The following example uses Codeo's script name format:
```json
{
    "scriptNames": {
        "editEvent": "[TRG] = EVNT Edit", // When an event is clicked
        "createEvent": "[TRG] = EVNT Create", // When a new event should be created in FileMaker
        "newEventCreated": "[TRG] = EVNT New Created", // When a new event is created with the popup

        "dateSelected": "[TRG] = Date Select", // When a date is selected in the side-menu

        "eventChanged": "[TRG] = EVNT Change", // When an event changes, E.G dragged to another time range
        "onEventFilterChange": "[TRG] = Filter Change", // When an event filter is clicked

        "poll": "[TRG] = Poll Changes" // Runs multiple times depending on the polling values set in the config
    }
}
```