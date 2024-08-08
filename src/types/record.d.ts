declare global {
    namespace JAC {
        // Define all record interfaces here
        type Event = FM.Record<{
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
            backgroundText?: string;
        }|{});
    }
}

export {}