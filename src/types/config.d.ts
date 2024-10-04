declare global {
    namespace JAC {
        // Define the web config here
        interface Config {
            ignoreWarnings?: boolean;
            events: JAC.Event[];

            sideMenuOpen?: boolean;
            
            eventFilters?: EventFilter[];
            eventFilterAreas?: Area[];

            eventTemplates?: EventTemplate[];
            eventTemplateAreas: Area[];

            /** @deprecated use 'open' in each event template area */
            eventTemplatesOpen?: boolean;
            
            searchFields?: SearchField[];
            
            contrastCheck?: boolean;
            contrastMin?: number;
            
            resources?: Resource[];
            resourcesWidth?: string;
            
            fullCalendarLicense?: string;
            locale?: string;
            translations?: Translations;
            
            view?: string;
            date?: string;
            
            eventTimeFormat?: string;
            nowIndicator?: boolean;
            
            defaultEventComponent?: string;
            eventComponents: EventComponent[];
            
            //compactFields?: (string & keyof JAC.Event)[];

            days?: number;
            firstDayOfWeek?: string|number;
            allDaySlot?: boolean;

            showWeekends?: boolean;
            selectableTooltips?: boolean;

            calendarStartTime?: string;
            calendarEndTime?: string;


            // Fields from JAC.Event that appear when creating new events
            // Defaults to all fields in first event
            // If no title is provided, the name will be used
            newEventFields?: NewEventField[];
            newEventMovable?: boolean;
            eventCreation?: boolean;
            
            // Define valid script names here
            scriptNames: {
                /** Only used if the script result shall be returned to JS */
                onJsRequest: string;
                onJsError: string;
                
                /** Runs when an event is clicked */
                onEventClick?: string;

                /** Runs when a time range is selected in the calendar */
                onRangeSelected?: string;

                /** Runs when an event is created either with the popup or by dragging a template */
                onEventCreated?: string;

                /** Runs when a date is selected in the side-menu's date picker */
                onDateSelected?: string;

                /** Runs when E.G an event is moved */
                onEventChange?: string;

                /** Runs when an event filter without a script is changed */
                onEventFilterChange?: string;

                /** Runs when a search in the side-menu is made */
                onSearch?: string;

                poll?: string;

                //newEvent?: string; // duplicate of the old 'createEvent'

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
            } /*& Record<string & {}, string>;*/

            nextPollMs: number; // Polls once after this time
            pollIntervalMs: number; // Polls every x ms

            customCSS?: string;
            styles?: {
                tooltip?: TextStyle;

                base?: TextStyle;
                event?: TextStyle;

                resourceHeader?: TextStyle;

                dateHeader?: TextStyle;
                dayHeader?: TextStyle;
            };

            icons?: {
                name: string;
                html: string;
            }[];

            eventButtons?: EventButton[];
        }
    }

    // Make values accessible via window
    interface Window {
        _config?: JAC.Config;
    }
}

export {}