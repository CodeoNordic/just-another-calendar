declare global {
    namespace JAC {
        // Define all event interfaces here
        type Event = FM.Event<{
            type?: 'event'|'backgroundEvent';
            _component?: string;
            _instant?: boolean;

            id: string;
            resourceId?: string|string[];

            // Various keys for defining date and time
            startDate?: string;
            endDate?: string;
            dateStart?: string;
            dateEnd?: string

            startTime?: string;
            endTime?: string;
            timeStart?: string;
            timeEnd?: string;
            
            start?: string;
            end?: string;
            timestampStart?: string;
            timestampEnd?: string;

            // For bakcground events
            backgroundTitle?: string; // Title under date
            backgroundText?: string; // Text in event

            // for filtering
            filterId?: string|string[];
            _affectingFilters?: JAC.EventFilter[];

            // for filtering by source
            source?: string|string[];

            allDay?: boolean;

            tooltip?: string;

            colors?: {
                text?: string;
                background?: string;
                border?: string;

                date?: string;
                urgentIcon?: string;

                buttonHover?: string;
                buttonClick?: string;

                tooltipBackground?: string;
                tooltipBorder?: string;
                tooltipText?: string;
            }
        }> & ({
            type: 'backgroundEvent';
            backgroundColor?: string;
            textColor?: string;
            text?: string;
        }|{});
    }
}

export {}