declare global {
    namespace JAC {
        interface NewEventField {
            name: string;
            title?: string;
            placeholder?: string;
            type?: React.InputHTMLAttributes<HTMLInputElement>['type']|'dropdown';
            defaultValue?: string;
            search?: boolean;
            searchScript?: string;

            dropdownItems?: {
                value: string;
                label: string;
            }[] | string[];

            multiple?: boolean;
        }
    }
}

export {}