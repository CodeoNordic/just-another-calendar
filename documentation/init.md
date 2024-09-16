# Init function
This function initialises the calendar with all the required values.

In practice, the function can be called multiple times in order to update the calendar, but optimally you should use the appropriate function listed in the [function documentation](./functions.md).

**Check the [demo file](./Demo.fmp12) and/or the [example-data.js](../example-data.js) file for examples.**

---

## JSON Structure
All configuration values should be structured into the same object, in such a way that the entire configuration can be passed as a singular JSON string.

Below is a list of all the available values that can be defined, along with its default value. (if relevant)

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
    "view": "resourceDayGrid"
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
Controls the width of the resources. Only relevant in views where resources are visible on the side.

Example:
```json
{
    "resourcesWidth": "17.5rem"
}
```

### `eventTemplates` (array)

### `eventTemplatesOpenDefault` (boolean)

### `searchBy` (array)

### `search` (string)

### `searchOpenDefault` (boolean)

### `sourceFilters` (array)

### `sourceFiltersOpenDefault` (boolean)

### `contrastCheck` (boolean)

### `contrastMin` (number)

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

### `translations` (object)

### `eventTimeFormat` (string)

### `nowIndicator` (boolean)

### `eventComponents` (array)

### `defaultEventComponent` (string)


### `firstDayOfWeek` (string or number)

### `allDaySlot` (boolean)

### `showWeekends` (boolean)

### `selectableTooltips` (boolean)

### `calendarStartTime` (string)

### `calendarEndTime` (string)

### `newEventFields` (array)

### `newEventMovable` (boolean)

### `eventCreation` (boolean)

### `scriptNames` (object)

### `customCSS` (string)

### `styles` (object)

### `icons` (array)

### `eventButtons` (array)