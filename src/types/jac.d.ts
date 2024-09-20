declare global {    
    namespace JAC {
        interface Resource {
            id: string;
            title?: string;
            collapsed?: boolean;
            disabled?: boolean;
        }
    
        /**
         * Use clientOnly and _filter if the filter should be handled only in the web component.
         * Otherwise, 'onEventFilterChange' will be ran.
        */
        type EventFilter = WithFilter<{
            id: string;
            title?: string;
            color?: string;

            /** Whether the filter is currently being used or not */
            enabled?: boolean;

            /** Whether the filter's on/off state can be changed by the user */
            locked?: boolean;

            /** The order in which the filters should be displayed */
            sort?: number;
    
            /** If the filter is client only, _filter must be defined, as it will filter locally */
            clientOnly?: boolean;
        }>;

        interface SourceFilter {
            id: string
            title?: string;
            color?: string;

            enabled?: boolean;

            locked?: boolean;

            sort?: number;

            clientOnly?: boolean;
        }
    
        interface TextStyle {
            font?: string;
            size?: string;
    
            weight?: string;
            boldness?: string; // alias for weight
    
            margin?: string;
            padding?: string;
    
            color?: string;
            textColor?: string; // alias for color
    
            background?: string;
            backgroundColor?: string; // alias for background
    
            alignment?: 'left'|'center'|'right';
        }
    
        type EventButton = WithFilter<{
            /** Either a key of config.icons, or <svg> code */
            icon?: string;
    
            /** Either a script name key, or a direct script name */
            script?: string;
        }>;

        interface EventDropdown {
            eventId: string|null;
            visible: boolean;
            x: number;
            y: number;
            buttons: EventButton[];
        }

        type EventField = WithFilter<{
            /** The field type. Defaults to 'text' */
            type?: 'text'|'button'|'time'|'date';

            /** An icon to be used alongside the field value. If the icon starts with < it is assumed to be injectable HTML */
            icon?: string;

            /** The key of the value to display, E.G "FirstName". Supports lodash.get syntax such as "NestedObject.FirstName" or "NestedArray[0]" */
            value?: string;

            /** Optional HTML template. Will be prioritized over "template" and "value" */
            htmlTemplate?: string;

            /**
             * Optional value template. Will be prioritized over "value"
             * @example
             * ```js
             * template: '{FirstName} {LastName}'
             * template: '{Date:timestampStart} - {Date:timestampEnd}'
             * template: '{Time:timestampStart} - {Time:timestampEnd}'
             * 
             * // eval can also be used, but curly brackets in the code must be preceded by a double backslash
             * template: '{Date:timestampStart} - {Eval:(event, config) => new Date(event.timestampStart).toLocaleTimeString(config.locale)}'
             * templace: '{Eval:event => \\{ if (event.arrived) return "ARRIVED"; \\}}'
             * ```
            */
            template?: string;

            /**
             * Optional JS function to return a value. Will be prioritized over 'template' and 'value'
             * 
             * undefined, null or an empty string is considered an empty value
             * @example
             * ```js
             * eval: 'event => `${event.FirstName} ${event.LastName}`'
             * eval: 'function(event) { return event.FirstName + ' ' + event.LastName }'
             * eval: 'event => event.Arrived? "ARRIVED": null'
             * ```
            */
            eval?: string;

            /** By default, the field will not be displayed if the value is empty */
            showIfEmpty?: boolean;

            /** Whether the field should take up as much horizontal space as possible */
            fullWidth?: boolean;

            /** Optional color for the field */
            color?: string;

            /** Optional CSS class for custom styling */
            cssClass?: string;

            /** Should be defined if type is 'button' */
            script?: string;
        }>;

        type EventComponent = WithFilter<{
            name: string;
            fields?: EventField[];
            htmlTemplate?: string;
        }>;
    }
}

export {};