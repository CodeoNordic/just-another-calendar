declare global {
    namespace NOBS {
        // Define the web config here
        interface Config {
            records: FM.Record[]|null;

            messageFromFileMaker?: string;

            // Define valid script names here
            scriptNames: {
                onRecordClick: string;
            };
        }
    }

    // Make values and functions accessible via window
    interface Window {
        init(data: string): void;
        config?: NOBS.Config;
    }
}

export {}