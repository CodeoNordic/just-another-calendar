# Event Filters
In a calendar with a lot of events, it may be difficult to find what you
are looking for. Event filters allow the user to only display the events
they want, based on developer-defined criteria.

Each time a filter is clicked, a call to the `eventFilterChanged` script will be made,
unless the filter has its own `script` value, or its `clientOnly` value is set to `true`,
in which case the filter will be handled in the web viewer, without any script calls.