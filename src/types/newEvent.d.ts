declare global {
    namespace JAC {
        interface NewEventField {
            field: string;
            title?: string;
            placeholder?: string;
            type?: React.InputHTMLAttributes<HTMLInputElement>['type']|'dropdown'|'startTime'|'endTime';
            default?: string;
            search?: boolean;
            searchScript?: string;

            dropdownItems?: {
                value: string;
                label: string;
            }[] | string[];
        }
    }
}

export {}