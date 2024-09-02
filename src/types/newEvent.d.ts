declare global {
    namespace JAC {
        interface NewEventField {
            field: string;
            title?: string;
            placeholder?: string;
            type?: string;
            default?: string;
            search?: boolean;
            searchScript?: string;

            dropdown?: string;
            dropdownItems?: {
                value: string;
                label: string;
            }[] | string[];
        }
    }
}

export {}