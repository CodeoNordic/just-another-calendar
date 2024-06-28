declare global {
    namespace FM {
        // Define all record interfaces here
        type EventRecord = FM.Record<{
            type?: 'event'|'backgroundEvent';

            id: string;
            resourceId: string|string[];
            sourceId: string|string[];

            dateStart: string;
            dateFinishedDisplay: string;
            allDay?: boolean;

            timeStart?: string;
            timeEnd?: string;

            tooltip?: string;

            title?: string;
            description?: string;
            
            patientFullName: string;
            patientId: string;
            patientReference: string;

            statusId?: string;
            statusText?: string;

            showButtons?: boolean;
            isLate?: boolean;
            didNotArrive?: boolean;
            hasArrived?: boolean;
            hasCheckedOut?: boolean;
            isRepetition?: boolean;
            
            colors?: {
                text?: string;
                background?: string;
                border?: string;

                date?: string;
                urgentIcon?: string;

                patient?: string;

                buttonHover?: string;
                buttonClick?: string;

                tooltipBackground?: string;
                tooltipText?: string;
                tooltipBorder?: string;
            }
        }> & ({
            type: 'backgroundEvent';
            backgroundColor?: string;
            backgroundText?: string;
        }|{});
    }
}

export {}