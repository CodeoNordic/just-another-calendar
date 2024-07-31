declare global {
    namespace JAC {
        // Define the web config here
        interface Config {
            records: JAC.Event[];

            resources?: Resource[];
            resourcesWidth?: string;

            fullCalendarLicense?: string;
            locale?: string;
            
            view?: string;
            date?: string;
            
            eventTimeFormat?: string;

            eventComponent?: string;
            eventComponents: EventComponent[];

            compactFields?: (string & keyof JAC.Event)[];

            days?: number;

            showWeekends?: boolean;
            selectableTooltips?: boolean;

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

            privacyMode?: boolean;

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