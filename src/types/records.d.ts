declare global {
    namespace FM {
        // Define all record interfaces here
        type ContactRecord = FM.Record<{
            PrimaryKey: string;

            FirstName: string;
            LastName: string;
            FullName: string;

            Email: string;
            Phone: string;
        }>;
    }
}

export {}