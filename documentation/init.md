# Init function
This function initialises the calendar with all the required values.

In practice, the function can be called multiple times in order to update the calendar, but optimally you should use the appropriate function listed in the [function documentation](./functions.md).

**Check the [demo file](./Demo.fmp12) and/or the [example-data.js](../example-data.js) file for examples.**

---

## JSON Structure
All configuration values should be structured into the same object, in such a way that the entire configuration can be passed as a singular JSON string.

Below is a list of all the available values that can be defined, along with its default value. (if relevant)

If a value is followed by an asterisk \* it is required.

### `date` (string)
Controls which date is currently selected. If multiple days are shown, the currently selected date will be the first date in the range.

Example:
```json
{
    "date": "19.11.2024"
}
```

**Default value:** `[Current Date]`

### `days` (number)
Controls how many days to display at once in the calendar. Certain calendar views will not use this value.

Example:
```json
{
    "days": 3 // shows 3 days at once
}
```

### `view` (string)
Controls which [FullCalendar view](https://fullcalendar.io/docs/initialView) should be used.
Although FullCalendar has an `initialView` value, this calendar will automatically update the
view if the value is changed in the config through E.G [`setConfigValue`](./functions.md#setconfigvaluekey-value)

Example:
```json
{
    "view": "resourceDayGrid" // The view most commonly used by Codeo
}
```

### `events` (array)
The list of events to display in the calendar.

Example:
```json
{
    "events": [
        {
            "id": "1",
            // ...
        }
    ]
}
```

Check the [events definition](./events.md) for more information.

### `resources` (array)
The list of resources to use in the calendar.

Example:
```json
{
    "resources": [
        {
            "id": "1",
            "title": "Room 6"
        }
    ]
}
```

### `resourcesWidth` (string)
Controls the width of the resources. Only relevant in views where resources are visible on the side. **Must be a valid CSS unit.**

Example:
```json
{
    "resourcesWidth": "360px"
}
```

**Default value:** `17.5rem`

### `eventTemplates` (array)
Displays a list of event templates in the sidemenu that can be dragged
into the calendar to automatically create an event with a certain set
of values.

Useful for granting the ability to easily create specific types of
events, or to assign a date/time for an event that isn't currently
in the calendar.

Check the [event templates definition](./event-templates.md) for more information.

### `eventTemplatesOpenDefault` (boolean)
Controls whether the event templates area should be open or collapsed by default.

Example:
```json
{
    "eventTemplatesOpenDefault": true
}
```

**Default value:** `true`

### `eventFilters` (array)
The list of available event filters.

Check the [event filters definition](./event-filters.md) for more information.

### `eventFiltersOpenDefault` (boolean)
Controls whether the event filters area should be open or collapsed by default.

Example:
```json
{
    "eventFiltersOpenDefault": true
}
```

### `eventFilterAreas` (array)
The list of areas that [event filters](./event-filters.md) can be grouped into.

Example:
```json
{
    "eventFilterAreas": [
        {
            "name": "area1", // Unique name
            "title": "Area 1", // Title displayed in the menu
            "openDefault": true // Whether the area should be opened or collapsed by default
        }
    ]
}
```

**Default value:** `true`

### `search` (string)
Controls the currently set search text. Useful for resetting the search.

Example:
```json
{
    "search": "Joakim"
}
```

### `searchBy` (array)
Controls which values to use from an event when searching.

Example:
```json
{
    "searchBy": ["title", "tooltip"]
}
```

### `searchOpenDefault` (boolean)
Controls whether the search area is open by default.

Example:
```json
{
    "searchOpenDefault": true
}
```

**Default value:** `true`

### `contrastCheck` (boolean)
Controls whether or not the built-in contrast checker should be used when displaying certain elements,
such as the event and source filters, to try and optimize accessibility.

Example:
```json
{
    "contrastCheck": true
}
```

### `contrastMin` (number)
Sets the level of contrast that is required for the contrast check to activate.

Example:
```json
{
    "contrastMin": 2    
}
```

### `fullCalendarLicense` (string)
Your developer license to fullcalendar, if needed.

**This is not required if you are using the original, non-modified version of the calendar.**

Codeo Norge AS owns a FullCalendar developer license applicable for the original version of "Just Another Calendar", which is automatically passed into the module.

Example:
```json
{
    "fullCalendarLicense": "xxxx-xxxx-xxxx-xxxx"
}
```

### `locale` (string)
Controls which language preset should be used by the calendar.
Used by FullCalendar along with certain date/time related areas of the calendar.

Example:
```json
{
    "locale": "en-us"
}
```

### `translations` (object)
Translation table for various labels in the calendar.

Example:
```json
{
    "weekNumberHeader": "U", // Defaults to 'W' for 'Week'
    
    "searchHeader": "Søk", // Defaults to 'Search'
    "searchPlaceholder": "Søk", // Defaults to 'Search'

    "eventTemplatesHeader": "Avtalemaler", // Defaults to 'Event Templates'

    "eventCreationHeader": "Ny avtale", // Defaults to 'New Event'
    "eventCreationConfirm": "Lagre", // Defaults to 'Save'
    "eventCreationCancel": "Avbryt" // Defaults to 'Discard'
}
```

### `eventTimeFormat` (string)
Passes into FullCalendar's [`eventTimeFormat`](https://fullcalendar.io/docs/eventTimeFormat) value.

This value does mostly nothing, as the event display is controlled by the [event component](./event-components.md).

### `nowIndicator` (boolean)
Controls whether or not an "now indicator" should be displayed in the calendar.

Example:
```json
{
    "nowIndicator": true
}
```

**Default value:** `true`

### `eventComponents` (array)
The list of event components used for displaying events.

Check the [event component definition](./event-components.md) for more information.

### `defaultEventComponent` (string)
Controls which [event component](#eventcomponents-array) should be used by default
for events that don't match the criteria of any component.

If a default event component isn't defined, and the event does not match any
component criteria, the event will not be displayed, and a warning will be shown
in the web console.

Example:
```json
{
    "eventComponents": [
        {
            "name": "exampleComponent",
            // ...
        }
    ],

    "defaultEventComponent": "exampleComponent"
}
```

### `firstDayOfWeek` (string or number)
Controls which weekday is considered the start of a week, where 0 = sunday, 1 = monday, etc.
This is respected by both FullCalendar, and the date picker in the side-menu.

Can also be written as a string, E.G `"mon"`, `"tuesday"` etc. These must be written in English.

Example:
```json
{
    "firstDayOfWeek": 1 // Monday
}

{
    "firstDayOfWeek": "sun" // Sunday
}
```

**Default value:** `1 (monday)`

### `allDaySlot` (boolean)
Controls whether or not "all day" events should be displayed or not. Passes into FullCalendar's [`allDaySlot`](https://fullcalendar.io/docs/allDaySlot) value.

Example:
```json
{
    "allDaySlot": true
}
```

**Default value:** `true`

### `showWeekends` (boolean)
Controls whether or not weekends should be displayed or not. Passes into FullCalendar's [`weekends`](https://fullcalendar.io/docs/weekends) value.

Example:
```json
{
    "showWeekends": true
}
```

**Default value:** `false`

### `selectableTooltips` (boolean)
Controls whether or not event tooltips can be highlighted or not.

Example:
```json
{
    "selectableTooltips": true
}
```

**Default value:** `false`

### `calendarStartTime` (string) and `calendarEndTime` (string)
Sets the earliest and latest visible times in the calendar. Useful for defining working hours.

It is recommended to add 15 minutes to the end time, as the end time will not have a label.

Example:
```json
{
    "calendarStartTime": "08:00",
    "calendarEndTime": "16:15"
}
```

**Default value:** `08:00` and `21:15`

### `eventCreation` (boolean)
Controls whether or not the built-in

### `newEventFields` (array)
Controls which input fields to display in the built-in event-creation popup.

Check the [event creation documentation](./event-creation.md) for more information.

### `newEventMovable` (boolean)
Controls whether the new event popup can be moved around in the web viewer.

Example:
```json
{
    "newEventMovable": true
}
```

**Default value:** `true`


### `scriptNames` (object)
An object used to map FileMaker scripts to the calendar.

Check the [script names definition](./script-names.md) for more information.

### `customCSS` (string)
Injects custom CSS-styling into the web viewer's `<head>` element.

Example:
```json
{
    "customCSS": "body { background: red; }"
}
```

### `styles` (object)
Applies custom styling to specific parts of the calendar, such as events, or weekday labels.

Strings must be valid CSS-values.

Each style object is as follows:
```json
{
    "font": "...", // Sets 'font-family'
    "size": "...", // Sets 'font-size'

    "weight": "...", // Sets 'font-weight'. "boldness" can also set this (aliased)

    "margin": "...", // Sets 'margin'
    "padding": "...", // Sets 'padding'

    "color": "...", // Sets 'color'. "textColor" can also set this (aliased)
    "background": "...", // Sets 'backgroundColor'. "backgroundColor" can also set this (aliased)

    "aligment": "..." // Sets 'text-alignment'
}
```

Example:
```json
{
    "styles": {
        "base": {
            "font": "Sans-serif", // Overwrite the base font
            "size": "1.5rem" // Overwrite the base font size
        },

        "tooltip": {
            "font": "Arial",
            "weight": "bold"
        }
    }
}
```

### `icons` (array)
The list of reusable SVG-icons.

Check the [icon definition](./icons.md) for more information.

### `eventButtons` (array)
The list of available popup-buttons to display when hovering over events.

Check the [event button definition](./event-buttons.md) for more information.