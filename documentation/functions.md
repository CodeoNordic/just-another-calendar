# Callable Functions from FileMaker Pro
This is a list of all the callable functions in the calendar module. The purpose of all these functions is to prevent the need for a complete refresh of the module, improving performance, whilst also making the experience more seamless.

### init (config)
Initialise the calendar with one singular configuration object. (JSON)

Check the [init documentation](./init.md) for more information.

### setConfigValue(key, value)
Change a specific value in the config. The key can be any of the values mentioned in the [configuration](./init.md). This function should be used when changing e.g the `date` or `view` of the calendar.

Example:
```js
// Change the displayed date to November 19th 2024
setConfigValue('date', '2024-11-19'); // The European date format can also be passed here (19.11.2024)

// Change the FullCalendar view
setConfigValue('view', 'resourceTimeGridDay');
```

### addEvents(events) (alias: addEvent)
Add one or more events to the calendar.

### removeEvents(search, [limit])
Remove one or more events from the calendar, specified by one or more searches, with an optional limit on how many events can be removed at once.

Example:
```js
// Removes one event with a matching id
removeEvents(
    JSON.stringify({
        id: "==abcd-efgh-ijkl-mnop"
    }),
    1
);

// Removes any event where the 'dateStart' is before November 19th 2024
removeEvents(
    JSON.stringify({
        dateStart: "<2024-11-19"
    })
);

// Removes the events with the matching id's
removeEvents(
    JSON.stringify([
        { id: "==abcd-efgh-ijkl-mnop" },
        { id: "==ponm-lkji-hgfe-dcba" }
    ]),
    2
);
```

If a limit is not defined, the function will remove any event that matches the search.

**For reliability, it is highly recommended to set a limit anytime you are removing specific events.**

### setEvents(events)
Overwrite the list of events.

Example:
```js
// Overwrite with a list of events
setEvents(
    JSON.stringify([
        { id: "abcd-efgh-ijkl-mnop", /* ... */ },
        { id: "ponm-lkji-hgfe-dcba", /* ... */ }
    ])
);
```

### updateEvent(search, data, autocreate)
Update a specific event in the calendar, specified by a search, and the data to set. Optionally, a boolean can be passed to automatically create the event, in case it is not found in the list.

Example:
```js
// Update the event with the matching id, changing the time
updateEvent(
    JSON.stringify({ id: "==abcd-efgh-ijkl-mnop" }),
    JSON.stringify({
        timeStart: "10:00",
        timeEnd: "11:30"
    })
);

// Update the event with the matching id, changing the tooltip
updateEvent(
    JSON.stringify({ id: "==abcd-efgh-ijkl-mnop" }),
    JSON.stringify({
        tooltip: "Updated tooltip"
    })
);
```

If the search returns more than one event, a warning will be logged to the console, and the change will not be performed.

**The entire event's JSON can be passed as the second parameter**, meaning that updating an event in the calendar is very simple.

### revert(id)
Revert/undo an action made in the web viewer, such as moving an event.