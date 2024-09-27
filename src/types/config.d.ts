declare global {
    namespace JAC {
        // Define the web config here
        interface Config {
            events: JAC.Event[];

            sideMenuOpen?: boolean;

            eventTemplates?: EventTemplate[];
            eventTemplatesOpenDefault?: boolean;
            
            eventFilters?: EventFilter[];
            eventFilterAreas?: [{
                name: string;
                title: string;
                openDefault?: boolean;
            }];
            
            // fields in event that should be searched
            searchBy?: string[];
            search?: string;
            searchOpenDefault?: boolean;
            
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
                
                editEvent: string;
                createEvent: string;
                
                onDateSelected: string;
                onEventChange: string;
                onEventFilterChange: string;
                onSourceFilterChange: string;

                poll: string;

                newEvent?: string;
                eventCreated?: string;
            };

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