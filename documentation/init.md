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

**Note:** The date picker in the side-menu will automatically update this value UNLESS the scriptname `onDateSelected` is defined,
in which case you should manually set this value using [`setConfigValue('date', ...)`](./functions.md#setconfigvaluekey-value).

```json
{
    "date": "19.11.2024"
}
```

**Default value:** `[Current Date]`

### `days` (number)
Controls how many days to display at once in the calendar. Certain calendar views will not use this value.

```json
{
    "days": 3 // shows 3 days at once
}
```

### `view` (string)
Controls which [FullCalendar view](https://fullcalendar.io/docs/initialView) should be used.
Although FullCalendar has an `initialView` value, this calendar will automatically update the
view if the value is changed in the config through E.G [`setConfigValue`](./functions.md#setconfigvaluekey-value)

#### All Different Views

**Time Grid**
- `timeGridDay`
- `timeGridWeek`
- `resourceTimeGridDay`
- `resourceTimeGridWeek`

**Day Grid**
- `dayGridDay`
- `dayGridWeek`
- `dayGridMonth`
- `dayGridYear`
- `resourceDayGridDay`
- `resourceDayGridWeek`
- `resourceDayGridMonth`

**List**
- `listDay`
- `listWeek`
- `listMonth`
- `listYear`

**Timeline**
- `timeline`
- `timelineDay`
- `timelineWeek`
- `timelineMonth`
- `timelineYear`
- `resourceTimeline`
- `resourceTimelineDay`
- `resourceTimelineWeek`
- `resourceTimelineMonth`
- `resourceTimelineYear`

**Other**
- `multiMonthYear`

```json
{
    "view": "resourceDayGrid" // The view most commonly used by Codeo
}
```

**Default value:** `timeGridWeek`

### `events` (array)
The list of events to display in the calendar.

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

### `eventTemplateAreas` (array)
The list of areas that [event templates](./event-templates.md) can be grouped into. The only required field is `name`.

```json
{
    "eventTemplateAreas": [
        {
            "name": "area1", // Unique name
            "title": "Area 1", // Title displayed in the menu
            "open": true, // Whether the area should be opened or collapsed
            "sort": 1 // the order the area appears in the side menu
        }
    ]
}
```

### `eventFilters` (array)
The list of available event filters.

Check the [event filters definition](./event-filters.md) for more information.

### `eventFilterAreas` (array)
The list of areas that [event filters](./event-filters.md) can be grouped into. The only required field is `name`.

```json
{
    "eventFilterAreas": [
        {
            "name": "area1", // Unique name
            "title": "Area 1", // Title displayed in the menu
            "open": true, // Whether the area should be opened or collapsed
            "sort": 3 // the order the area appears in the side menu
        }
    ]
}
```

### `eventFilterBehavior` (string)
Controls how [event filters](./event-filters.md) behave in relation to one another.

```json
{
    "eventFilterBehavior": "any"
}
```

**Default value:** `groupedAny`

### `searchFields` (array)
A list of search  fields that should be available in the side-menu.

Check the [searching definition](./searching.md) for more information.

### `contrastCheck` (boolean)
Controls whether or not the built-in contrast checker should be used when displaying certain elements,
such as the events and filters, to try and optimize accessibility.

```json
{
    "contrastCheck": true
}
```

**Default value:** `true`

### `contrastMin` (number)
Sets the level of contrast that is required for the contrast check to activate.

```json
{
    "contrastMin": 3.5    
}
```

**Default value:** `2`

### `fullCalendarLicense` (string)
Your developer license to fullcalendar, if needed.

**This is not required if you are using the original, non-modified version of the calendar, unless you explicitly wish to use your own license.**

Codeo Norge AS owns a FullCalendar developer license applicable for the original version of "Just Another Calendar", which is automatically passed into the module.

```json
{
    "fullCalendarLicense": "xxxx-xxxx-xxxx-xxxx"
}
```

### `locale` (string)
Controls which language preset should be used by the calendar.
Used by FullCalendar along with certain date/time related areas of the calendar.

```json
{
    "locale": "en-us"
}
```

**Default value:** `en`

### `translations` (object)
Translation table for various labels in the calendar.

```json
{
    "weekNumberHeader": "U", // Defaults to 'W' for 'Week'
    "todayButton": "I dag", // Defaults to 'Today'

    "eventTemplatesHeader": "Avtalemaler", // Defaults to 'Event Templates', only used if no areas are defined

    "eventCreationHeader": "Ny avtale", // Defaults to 'New Event'
    "eventCreationConfirm": "Lagre", // Defaults to 'Save'
    "eventCreationCancel": "Avbryt" // Defaults to 'Discard'
}
```

### `eventTimeFormat` (string)
Passes into FullCalendar's [`eventTimeFormat`](https://fullcalendar.io/docs/eventTimeFormat) value.

This value does mostly nothing, as the event display is controlled by the [event component](./event-components.md).

**Default value:** `HH:mm`

### `nowIndicator` (boolean)
Controls whether or not an "now indicator" should be displayed in the calendar.

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

```json
{
    "allDaySlot": true
}
```

**Default value:** `true`

### `showWeekends` (boolean)
Controls whether or not weekends should be displayed or not. Passes into FullCalendar's [`weekends`](https://fullcalendar.io/docs/weekends) value.

```json
{
    "showWeekends": true
}
```

**Default value:** `false`

### `selectableTooltips` (boolean)
Controls whether or not event tooltips can be highlighted/copied.

```json
{
    "selectableTooltips": true
}
```

**Default value:** `false`

### `calendarStartTime` (string) and `calendarEndTime` (string)
Sets the earliest and latest visible times in the calendar. Useful for defining working hours.

It is recommended to add 15 minutes to the end time, as the end time will not have a label.

```json
{
    "calendarStartTime": "08:00",
    "calendarEndTime": "16:15"
}
```

**Default value:** `08:00` and `21:15`

### `initialScrollTime` (string)
The initial time the calendar should scroll to upon loading.

In some cases, you may want the calendar to start at E.G 08:00, but grant the ability
to scroll up to E.G 06:00.

If this value is changed, the calendar will scroll again, but if the value is
changed to the same time, it will not scroll. Due to this, you should use the
[`scrollToTime(time)`](./functions.md#scrolltotimetime) function when
changing the position after loading.

```json
{
    "calendarStartTime": "06:00",
    "initialScrollTime": "08:00"
}
```

### `eventCreation` (boolean)
Controls whether or not events are able to be created by dragging in the calendar.

```json
{
    "eventCreation": false
}
```

**Default value:** `true`

### `heatmap` (array or boolean)

**Boolean**
- `true` - Uses all calendar events to calculate and display a heatmap in the sidebar date picker.
- `false` - Disables the heatmap.

**Array**

You can also pass an array of specific events for a custom heatmap, without sending all events to the calendar. Each entry in the array should include:

- `date` - The date of the event (e.g., "19.11.2024").
- `hours` - Event duration in hours (e.g., 3.5).
- `color` - (optional): Custom color for the event, overriding the default heatmap color.

If you have color, you dont need to set hours, as the color will be used instead of calculating with hours, and vice versa.

```json
{
    "heatmap": [
        {
            "date": "19.11.2024", // The date of the events
            "hours": 3.5, // The length of the events in hours

            "color": "#ff0000" // Color to use instead of calculating with hours
        }
    ],
    // or
    "heatmap": true // Will use the events in the calendar to calculate the heatmap
}
```

**Default value:** `true`


### `newEventFields` (array)
Controls which input fields to display in the built-in event-creation popup.

Check the [event creation documentation](./creating-events-from-calendar.md) for more information.

### `newEventMovable` (boolean)
Controls whether the new event popup can be moved around in the web viewer.

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
    "style": "...", // Sets 'font-style' E.G 'italic'

    "weight": "...", // Sets 'font-weight'. "boldness" can also set this (aliased)

    "margin": "...", // Sets 'margin'
    "padding": "...", // Sets 'padding'

    "color": "...", // Sets 'color'. "textColor" can also set this (aliased)
    "background": "...", // Sets 'backgroundColor'. "backgroundColor" can also set this (aliased)

    "aligment": "..." // Sets 'text-alignment'
}
```

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

### `nextPollMs` (number)
When this value is set, the module will run the `poll` script defined in [`scriptNames`](#scriptnames-object),
after a delay in milliseconds. Every time this number is set again, it will queue another poll.

`nextPollMs` is particularly useful for controlled polling, meaning you can account for
the time a FileMaker script takes to run, preventing cases where the script may run
before the previous script has finished.

For instance, you can set this value once, and set it again once the polling script has finished.

```json
{
    "nextPollMs": 3000
}
```

### `pollIntervalMs` (number)
Assign an interval in milliseconds for how often the module should run the `poll` script defined
in [`scriptNames`](#scriptnames-object).

This polling is continuous, meaning that if you set this value to 10 000, it will run the `poll`
script every 10 seconds.

Consider using [`nextPollMs`](#nextpollms-number) if possible, as it will likely be more consistent. 

```json
{
    "pollIntervalMs": 10000
}
```

### `sideMenuOpen` (boolean)
Controls whether or not the side menu should currently be opened. Should be used together with
the `onSideMenuOpened` and `onSideMenuClosed` scripts defined in [`scriptNames`](#scriptnames-object).

```json
{
    "sideMenuOpen": false
}
```

### `ignoreInfo` (boolean)
Supresses info logs sent to the browser console.

**Default value:** `false`

### `ignoreWarnings` (boolean)
Supresses warnings sent to the browser console.

**It is not recommended to use this, as warnings often mean that a function was used incorrectly.**

**Default value:** `false`