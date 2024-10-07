declare global {
    namespace JAC {
        /**
         * Use filterId or _filter if the filter should be handled only in the web component.
         * Otherwise, 'onEventFilterChange' will be ran.
        */
        type EventFilter = WithFilter<{
            id?: string;
            title?: string;
            areaName?: string;
            color?: string;

            /** Whether the filter is a divider instead of a normal filter */
            divider?: boolean;

            /** Whether the filter is currently being used or not */
            enabled?: boolean;

            /** Whether the filter's on/off state can be changed by the user */
            locked?: boolean;

            /** The order in which the filters should be displayed */
            sort?: number;

            /** Used when "reverse parsing" the index */
            _initialIndex?: number;

            /** script for own filtering */
            script?: string;
        }>;
    }
}

export {};