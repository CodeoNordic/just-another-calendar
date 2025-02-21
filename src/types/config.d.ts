declare global {
    namespace JAC {
        // Define the web config here
        interface Config {
            ignoreWarnings?: boolean;
            ignoreInfo?: boolean;

            events: JAC.Event[];
            groups?: JAC.Group[];

            heatmap?: {
                date: string; // Date in format 'YYYY-MM-DD'
                hours?: number; // Hours occupied by events

                color?: string; // Color to be used instead of calculating one from hours
            }[] | boolean; // If true, will use events to calculate heatmap instead

            sideMenuOpen?: boolean;
            sideMenuDisabled?: boolean;

            hideTimeLabels?: boolean;

            datePickerDisabled?: boolean;
            
            eventFilters?: EventFilter[];
            eventFilterAreas?: Area[];
            eventFilterBehaviour?: 'all' | 'groupedAll' | 'groupedAny' | 'any';
            eventFiltersHidden?: boolean;

            eventTemplates?: EventTemplate[];
            eventTemplateAreas: Area[];
            eventTemplatesHidden?: boolean;

            searchFields?: SearchField[];
            searchFieldsHidden?: boolean;
            
            contrastCheck?: boolean;
            contrastMin?: number;
            
            dayMinWidth?: number;
            resources?: Resource[];
            resourcesWidth?: string;
            resourceGroupField?: string;
            eventResourceEditable?: boolean;

            /** Whether or not events can be created by double clicking */
            eventCreationDoubleClick?: boolean;

            /** Whether or not events can be moved */
            eventStartEditable?: boolean;

            /** Whether or not events can have their length changed */
            eventDurationEditable?: boolean;
            
            /** FullCalendar premium license */
            fullCalendarLicense?: string;

            /** The language to format dates, days and times in */
            locale?: string;

            /** Object of translation strings for various labels in the calendar, such as the week number label */
            translations?: Translations;
            
            /** The FullCalendar view to use */
            view?: string;

            /** The calendar's starting date */
            date?: string;
            /** Forces every event before the time range into the calendar. Useful for views where the date is irrelevant */
            clampStartDates?: boolean;
            /** Forces every event outside the time range into the calendar. Useful for views where the date is irrelevant */
            clampEndDates?: boolean;

            /** The format to display dates in */
            dateFormat?: string;
            
            eventTimeFormat?: string;
            nowIndicator?: boolean;
            
            defaultEventComponent?: string;
            eventComponents: EventComponent[];
            
            //compactFields?: (string & keyof JAC.Event)[];

            /** Amount of days to show */
            days?: number;
            /** Specify which day of the week is the first day. 0|'monday', 1|'tuesday' etc. */
            firstDayOfWeek?: string|number;
            /** Whether or not there should be a dedicated section for all day events */
            allDaySlot?: boolean;

            /** Whether or not weekends should be displayed in the calendar */
            showWeekends?: boolean;
            /** Whether or not tooltips can be highlighted */
            selectableTooltips?: boolean;

            calendarStartTime?: string;
            calendarEndTime?: string;
            initialScrollTime?: string;

            slotLabelFormat?: import('@fullcalendar/core').FormatterInput;
            slotDuration?: import('@fullcalendar/core').DurationInput;
            slotLabelInterval?: import('@fullcalendar/core').DurationInput;

            // Fields from JAC.Event that appear when creating new events
            // Defaults to all fields in first event
            // If no title is provided, the name will be used
            newEventFields?: NewEventField[];
            newEventMovable?: boolean;
            eventCreation?: boolean;
            
            // Define valid script names here
            scriptNames: ScriptNames; /*& Record<string & {}, string>;*/

            nextPollMs?: number; // Polls once after this time
            pollIntervalMs?: number; // Polls every x ms

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