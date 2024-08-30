declare global {
    namespace JAC {
        interface NewEventField {
            field: string;
            title?: string;
            type?: string;
            default?: string;
            search?: boolean;
            searchScript?: string;
        }
    }
}

export {}