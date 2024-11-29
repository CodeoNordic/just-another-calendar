declare global {
    namespace JAC {
        interface ScriptNames {
            /** Only used if the script result shall be returned to JS */
            onJsRequest?: string;
            onJsError?: string;
            
            /** Runs when an event is clicked */
            onEventClick?: string;

            /** Runs when a time range is selected in the calendar */
            onRangeSelected?: string;

            /** Runs when an event is created either with the popup or by dragging a template */
            onEventCreated?: string;

            /** Runs when a date is selected in the side-menu's date picker */
            onDateSelected?: string;

            /** Runs when a date header is clicked */
            onDateHeaderClick?: string;

            /** Runs when a resource label is clicked */
            onResourceLabelClick?: string;

            /** Runs when E.G an event is moved */
            onEventChange?: string;

            /** Runs when an event filter without a script is changed */
            onEventFilterChange?: string;

            /** Runs when a search in the side-menu is made */
            onSearch?: string;

            poll?: string;

            /** Runs when the side-menu is opened */
            onSideMenuOpened?: string;

            /** Runs when the side-menu is closed */
            onSideMenuClosed?: string;

            /** Runs when an event filter area is opened */
            onEventFilterAreaOpened?: string;

            /** Runs when an event filter area is closed */
            onEventFilterAreaClosed?: string;

            /** Runs when an event template area is opened */
            onEventTemplateAreaOpened?: string;

            /** Runs when an event template area is closed */
            onEventTemplateAreaClosed?: string;

            /** Runs when the month in the DatePicker is changed */
            onMonthChange?: string;
        }
    }
}

export {};