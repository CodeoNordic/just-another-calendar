# Event Filters
In a calendar with a lot of events, it may be difficult to find what you
are looking for. Event filters allow the user to only display the events
they want, based on developer-defined criteria.

Each time a filter is clicked, a call to the `eventFilterChanged` script will be made,
unless the filter has its own `script` value, or its `clientOnly` value is set to `true`,
in which case the filter will be handled in the web viewer, without any script calls.

If a filter does not have the `clientOnly` value set to `true`, AND the filter does
not have a `script` value, the `onFilterChange` script defined in the [config scriptnames](./init.md)
will be used.

Filters can also have an `enabled` value. This value tells
the calendar whether or not the filter is currently switched on.

A `locked` value controls whether or not the user can turn this filter on/off,
indicated by a padlock icon for locked filters. This can be used to temporarily
or permanently disable the user's access to control the filters, E.G whenever
changes are being made, or the calendar is fetching data.

## Client-only filters
For `clientOnly` filters, a [`_filter`](./_filter.md) value should be passed to specify which events
should be displayed when the filter is enabled. An event will be displayed if any of the currently
enabled filters' criteria are fulfilled.

> If you are using the [`filterId`](#filtering-by-pre-determining-the-filter-id-optional) value,
a [`_filter`](./_filter.md) value is not needed, but passing it will still work.

In very specific cases, you may want to combine this with calls to a FileMaker script.
The way this works is tat the client filter will run simultaneously whilst calling the
FileMaker script.

```json
{
    // Config
    "events": [
        {
            "id": "abcd-efgh-ijkl-mnop",

            "start": "2024-11-19T07:00:00.000Z",
            "end": "2024-11-19T08:00:00.000Z",

            "YourCustomEventType": "meeting"
        },

        {
            "id": "ponm-lkji-hgfe-dcba",

            "start": "2024-11-19T07:00:00.000Z",
            "end": "2024-11-19T08:00:00.000Z",

            "YourCustomEventType": "consulting"
        }
    ],

    "eventFilters": [
        // Client only filter
        {
            "id": "filter1",
            "title": "Meeting",

            "color": "#aaeeaa",

            "enabled": true,
            "locked": false,

            "clientOnly": true,
            "_filter": {
                "YourCustomEventType": "==meeting"
            }
        },

        // Runs a FileMaker script
        {
            "id": "filter2",
            "title": "Consulting",

            "color": "#4499cc",

            "enabled": true,
            "locked": false,

            "script": "[TRG] = Enable/Disable Consulting"
        }
    ]
}
```

## Filtering by pre-determining the filter ID (optional)
Each event can have a `filterId` value. This can be either a string or an array which specifies
which filters the event is controlled by. The purpose of doing this, is that it eliminates the
need for complex [`_filter`](./_filter.md) objects.

This can also be combined with client-only filters, but in most cases this isn't necessary.

---

In the following example, the first event will be hidden if `filter1` is disabled, whilst
the second event will be hidden only when both filters are disabled.

```json
{
    // Config
    "events": [
        {
            "id": "abcd-efgh-ijkl-mnop",

            "start": "2024-11-19T07:00:00.000Z",
            "end": "2024-11-19T08:00:00.000Z",

            "filterId": "filter1" // Can also be an array, E.G ["filter1"]
        },

        {
            "id": "ponm-lkji-hgfe-dcba",

            "start": "2024-11-19T07:00:00.000Z",
            "end": "2024-11-19T08:00:00.000Z",

            "filterId": ["filter1", "filter2"]
        }
    ],

    "eventFilters": [
        // Client-only
        {
            "id": "filter1",
            "title": "Filter 1",
            "color": "#aaeeaa",

            "clientOnly": true
        },

        // Not client-only, will run a FileMaker script
        {
            "id": "filter2",
            "title": "Filter 2",
            "color": "#4499cc",

            "script": "[TRG] = Enable/Disable Filter2"
        }
    ]
}
```

---

## Grouping event filters into areas
If you have many filters of varying categories, you may group these by specifying an `areaName` per filter.
These areas must already be defined in the [config](./init.md#eventfilterareas-array).

> If no event filter areas are specified, a default one will be created with the name "Event Filters"

By default, the filters will be ordered depending on their placement in the array, but this can be overwritten
by specifying a `sort` number for one or more filters.

```json
{
    "eventFilterAreas": [
        {
            "id": "meeting",
            "title": "Meeting",
            "openDefault": true
        },

        {
            "id": "consulting",
            "title": "Consulting",
            "openDefault": false
        }
    ],

    "eventFilters": [
        {
            "id": "filter1",
            "title": "Urgent Meetings",
            "color": "#ff4444",
            "enabled": true,

            "areaName": "meeting"
        },

        {
            "id": "filter2",
            "title": "Daily Meetings",
            "color": "#8888ff",
            "enabled": false,

            "areaName": "meeting"
        },

        {
            "id": "filter3",
            "title": "Customer Consulting",
            "color": "#aaff88",
            "enabled": true,
            
            "areaName": "consulting"
        },

        {
            "id": "filter4",
            "title": "Partner Consulting",
            "color": "#ffdd88",
            "enabled": true,

            "areaName": "consulting",
            "sort": 1 // Will be ordered before "Customer Consulting"
        }
    ]
}
```


# Event Filters
In a calendar with a lot of events, it may be difficult to find what you
are looking for. Event filters allow the user to only display the events
they want, based on developer-defined criteria.

Each time a filter is clicked, the filter will either use `filterId` from the events, do a call to the `onFilterChange` script defined in the [config scriptnames](./script-names.md), 
or the `script` value from the filter. The priority goes `script` > `eventFilterChanged` > `filterId`.

Filters can also have an `enabled` value. This value tells
the calendar whether or not the filter is currently switched on.

A `locked` value controls whether or not the user can turn this filter on/off,
indicated by a padlock icon for locked filters. This can be used to temporarily
or permanently disable the user's access to control the filters, E.G whenever
changes are being made, or the calendar is fetching data.

The filters can also have a `sort` value. This controls the order that the filters appers, with the lowest numbers first and the ones without at the end. 

The last value a filter can have is `divider`. This makes the filter a divider instead, if you want clearer separation between two filters.

## Filtering in the calendar with filterId
Each event can have a `filterId` value. This can be either a string or an array which specifies
which filters the event is controlled by. This is the easiest filtering to set up, and is recommended for most cases.

---

In the following example, the first event will be hidden if `filter1` is disabled, whilst
the second event will be hidden only when both filters are disabled.

```json
{
    // Config
    "events": [
        {
            "id": "abcd-efgh-ijkl-mnop",

            "start": "2024-11-19T07:00:00.000Z",
            "end": "2024-11-19T08:00:00.000Z",

            "filterId": "filter1" // Can also be an array, E.G ["filter1"]
        },

        {
            "id": "ponm-lkji-hgfe-dcba",

            "start": "2024-11-19T07:00:00.000Z",
            "end": "2024-11-19T08:00:00.000Z",

            "filterId": ["filter1", "filter2"]
        }
    ],

    "eventFilters": [
        {
            "id": "filter1",
            "title": "Filter 1",
            "color": "#aaeeaa"
        },

        {
            "divider": true // will show up as an divider instead
        }

        {
            "id": "filter2",
            "title": "Filter 2",
            "color": "#4499cc",
            "sort": 1 // Will be ordered before "filter 1"
        }
    ]
}
```

## Grouping event filters into areas
If you have many filters of varying categories, you may group these by specifying an `areaName` per filter.
These areas must already be defined in the [config](./init.md#eventfilterareas-array).

```json
{
    "eventFilterAreas": [
        {
            "id": "meeting",
            "title": "Meeting",
            "openDefault": true
        },

        {
            "id": "consulting",
            "title": "Consulting",
            "openDefault": false
        }
    ],

    "eventFilters": [
        {
            "id": "filter1",
            "title": "Urgent Meetings",
            "color": "#ff4444",
            "enabled": true,

            "areaName": "meeting"
        },

        {
            "id": "filter2",
            "title": "Daily Meetings",
            "color": "#8888ff",
            "enabled": false,

            "areaName": "meeting"
        },

        {
            "id": "filter3",
            "title": "Customer Consulting",
            "color": "#aaff88",
            "enabled": true,
            
            "areaName": "consulting"
        },

        {
            "id": "filter4",
            "title": "Partner Consulting",
            "color": "#ffdd88",
            "enabled": true,

            "areaName": "consulting"
        }
    ]
}
```

## Filtering in other ways
The other ways of filtering is [`_filter`](./_filter.md) in the filters, `script` in the filters and the `onFilterChange` script defined in the [config scriptnames](./script-names.md).

here is an example of both [`_filter`](./_filter.md) and `script` being used.

```json
{
    // Config
    "events": [
        {
            "id": "abcd-efgh-ijkl-mnop",

            "start": "2024-11-19T07:00:00.000Z",
            "end": "2024-11-19T08:00:00.000Z",

            "YourCustomEventType": "meeting"
        },

        {
            "id": "ponm-lkji-hgfe-dcba",

            "start": "2024-11-19T07:00:00.000Z",
            "end": "2024-11-19T08:00:00.000Z",

            "YourCustomEventType": "consulting"
        }
    ],

    "eventFilters": [
        // Client only filter
        {
            "id": "filter1",
            "title": "Meeting",

            "color": "#aaeeaa",

            "enabled": true,
            "locked": false,

            "_filter": {
                "YourCustomEventType": "==meeting"
            }
        },

        // Runs a FileMaker script
        {
            "id": "filter2",
            "title": "Consulting",

            "color": "#4499cc",

            "enabled": true,
            "locked": false,

            "script": "[TRG] = Enable/Disable Consulting"
        }
    ]
}
```