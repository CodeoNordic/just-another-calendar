declare global {
    namespace NOBS {
        interface Resource {
            id: string;
            title: string;
            initiallyCollapsed?: boolean;
        }

        interface EventSource {
            id: string;
            title: string;
            color: string;
            enabled?: boolean;
        }

        interface TextStyle {
            font?: string;
            size?: string;

            weight?: string;
            boldness?: string; // alias for weight

            padding?: string;

            color?: string;
            background?: string;

            verticalAlignment?: 'top'|'center'|'bottom';
            horizontalAlignment?: 'left'|'center'|'right';
        }

        // Define the web config here
        interface Config {
            records: FM.EventRecord[];

            resources?: Resource[];
            resourcesWidth?: string;

            licenseKey?: string;
            locale?: string;
            initialView?: string;
            initialDate?: string;
            eventTimeFormat?: string;

            eventComponent?: 'compact';
            compactFields?: (string & keyof FM.EventRecord)[];

            //minDate?: string;
            days?: number;

            showWeekends?: boolean;
            selectableTooltips?: boolean;

            // Define valid script names here
            scriptNames: {
                onJsRequest: string;
                onJsError: string;
                
                selectDate: string;

                openEvent: string;
                openPatient: string;

                patientHasArrived: string;
                patientIsLate: string;
                patientDidNotArrive: string;
                eventCheckout: string;

                onDrag: string;
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
            }
        }
    }

    // Make values accessible via window
    interface Window {
        _config?: NOBS.Config;
    }
}

export {}