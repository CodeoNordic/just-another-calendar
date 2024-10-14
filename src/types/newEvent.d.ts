declare global {
    namespace JAC {
        type NewEventField = WithFilter<{
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

            // TODO Set the value to undefined if hidden by _filter
            unsetIfHidden?: boolean;

            // Setter functionality, hides the field
            setter?: WithFilter<{ value: any }>[]|{ value: any }|string|number|boolean|null;
        }>;
    }
}

export {}