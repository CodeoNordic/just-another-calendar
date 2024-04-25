declare global {
    namespace NOBS {
        // Define the web config here
        interface Config {
            records: FM.ContactRecord[];

            messageFromFileMaker?: string;

            // Define valid script names here
            scriptNames: {
                onRecordClick: string;
            };
        }
    }

    // Make values accessible via window
    interface Window {
        _config?: NOBS.Config;
    }
}

export {}