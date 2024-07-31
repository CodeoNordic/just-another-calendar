declare global {
    namespace JAC {
        // Define all record interfaces here
        type Event = FM.Record<{
            type?: 'event'|'backgroundEvent';
            _component?: string;
            _config: JAC.Config;

            id: string;
            resourceId: string|string[];
            //sourceId: string|string[];

            timestampStart: string;
            timestampEnd: string;
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