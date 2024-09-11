declare global {
    namespace JAC {
        // Define all event interfaces here
        type Event = FM.Event<{
            type?: 'event'|'backgroundEvent';
            _component?: string;

            id: string;
            resourceId: string|string[];
            //sourceId: string|string[];

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

            // for filtering
            filterId?: string|string[];

            // for filtering by source
            source?: string;

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