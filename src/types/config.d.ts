declare global {
    namespace JAC {
        // Define the web config here
        interface Config {
            records: JAC.Event[];

            eventFilters?: EventFilter[];
            
            contrastCheck?: boolean;

            resources?: Resource[];
            resourcesWidth?: string;

            fullCalendarLicense?: string;
            locale?: string;
            translations?: Translations;
            
            view?: string;
            date?: string;
            
            eventTimeFormat?: string;

            eventComponent?: string;
            eventComponents: EventComponent[];

            compactFields?: (string & keyof JAC.Event)[];

            days?: number;
            firstDayOfWeek?: string|number;

            showWeekends?: boolean;
            selectableTooltips?: boolean;

            calendarStartTime?: string;
            calendarEndTime?: string;

            // fields in event that should be searched
            searchBy?: string[];
            search?: string;

            // Fields from JAC.Event that appear when creating new events
            // Defaults to all fields in first event
            // If no title is provided, the field name will be used
            createFields?: [{
                field: string;
                title?: string;
                type?: string;
                default?: string;
                search?: boolean;
                searchScript?: string;
            }];

            // Define valid script names here
            scriptNames: {
                /** Only used if the script result shall be returned to JS */
                onJsRequest: string;
                onJsError: string;
                
                editEvent: string;
                createEvent: string;
                
                onDateSelected: string;
                onEventChange: string;
                onFilterChange: string;
            };

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