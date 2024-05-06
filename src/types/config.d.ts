declare global {
    namespace NOBS {
        interface Resource {
            id: string;
            title: string;
        }

        // Define the web config here
        interface Config {
            records: FM.DeliveryRecord[];
            resources: Resource[];

            licenseKey: string;
            locale: string;
            initialView: string;
            initialDate: string;
            eventTimeFormat: string;

            // Define valid script names here
            scriptNames: {
                onJsRequest: string;
                
                openDelivery: string;
                openPatient: string;
                openOrder: string;

                onDrag: string;
            };
        }
    }

    // Make values accessible via window
    interface Window {
        _config?: NOBS.Config;
    }
}

export {}