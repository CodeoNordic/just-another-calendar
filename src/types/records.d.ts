declare global {
    namespace FM {
        // Define all record interfaces here
        type DeliveryRecord = FM.Record<{
            id: string;
            resourceId: string;

            dateStart: string;
            dateFinishedDisplay: string;

            orderNumber: string;
            orderId: string;
            orderCategory: string;

            nomenklatur: string;

            responsibleNextTask?: string;
            responsibleNextTaskInitials?: string;

            tooltip?: string;
            isUrgent?: boolean;

            patientFullName: string;
            patientId: string;

            colors?: {
                text?: string;
                background?: string;
                border?: string;

                date?: string;
                urgentIcon?: string;

                patient?: string;

                buttonHover?: string;
                buttonClick?: string;
            }
        }>
    }
}

export {}