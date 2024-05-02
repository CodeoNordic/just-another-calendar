declare global {
    interface Window {
        init(data: string): void;
        onScriptResult(uuid: string, data: string): void;

        /** Add one or more records */
        addRecords(data: FM.DeliveryRecord|FM.DeliveryRecord[]): void;

        /** Remove one, more or all records. Limit should be set to 1 when removing a specific record */
        removeRecords(
            search?: Partial<FM.DeliveryRecord>|Partial<FM.DeliveryRecord>[],
            limit?: number
        ): void;

        updateRecord(find: Partial<FM.DeliveryRecord>, data: FM.DeliveryRecord): void;
    }
}

export {}