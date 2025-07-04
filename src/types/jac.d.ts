declare global {    
    namespace JAC {
        interface Resource {
            id: string;
            groupId?: string;

            title?: string;
            disabled?: boolean;

            sort?: number;
        }
        
        interface TextStyle {
            font?: string;
            size?: string;
            style?: string; // E.G 'italic'
    
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
            type?: 'text'|'button'|'time'|'date'|'divider';

            /** An icon to be used alongside the field value. If the icon starts with < it is assumed to be injectable HTML */
            icon?: string|WithFilter<{ icon: string }>|WithFilter<{ icon: string }>[];
            iconPosition?: 'left'|'right';
            iconThickness?: string|number;
            iconWidth?: string|number;
            iconHeight?: string|number;

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

            textStyle?: TextStyle;

            /** By default, the field will not be displayed if the value is empty */
            showIfEmpty?: boolean;

            /** Whether or not the field should take up as much horizontal space as possible */
            fullWidth?: boolean;

            /** Whether or not the field should include a line break at the start */
            lineBreakStart?: boolean,
            /** Whether or not the field should include a line break at the end */
            lineBreakEnd?: boolean,

            /** Optional color for the field */
            color?: string;

            /** Optional CSS class for custom styling */
            cssClass?: string;

            /** Should be defined if type is 'button' */
            script?: string;

            /** Passed to CSS 'marginTop' */
            marginTop?: string|number;

            /** Passed to CSS 'marginBottom' */
            marginBottom?: string|number;

            /** Passed to CSS 'marginLeft' */
            marginLeft?: string|number;

            /** Passed to CSS 'marginRight' */
            marginRight?: string|number;

            /** Passed to CSS 'paddingTop' */
            paddingTop?: string|number;

            /** Passed to CSS 'paddingBottom' */
            paddingBottom?: string|number;

            /** Passed to CSS 'paddingLeft' */
            paddingLeft?: string|number;

            /** Passed to CSS 'paddingRight' */
            paddingRight?: string|number;

            /** Passed to CSS 'flex-grow' */
            grow?: number;
        }>;

        type EventComponent = WithFilter<{
            name: string;
            fields?: EventField[];
            htmlTemplate?: string;
        }>;

        interface Area {
            name: string;
            title?: string;
            open?: boolean;
            sort?: number;
            hidden?: boolean;
        }

        interface ResourceGroup {
            id: string;
            title?: string;
            collapsed?: boolean;
        }
    }
}

export {};