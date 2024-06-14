declare global {
    namespace FM {
        // Define all record interfaces here
        type EventRecord = FM.Record<{
            type?: 'event'|'backgroundEvent';

            id: string;
            resourceId: string|string[];

            dateStart: string;
            dateFinishedDisplay: string;

            orderNumber: string;
            orderId: string;
            orderCategory: string;

            nomenklatur: string;
            
            responsibleNextTask?: string;
            responsibleNextTaskInitials?: string;
            
            tooltip?: string;
            statusText?: string;
            
            isUrgent?: boolean;
            
            patientFullName: string;
            patientId: string;
            patientReference: string;
            
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