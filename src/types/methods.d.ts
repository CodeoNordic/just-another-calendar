declare global {
    interface Window {
        init(data: string): void;
        onScriptResult(uuid: string, data: string): void;

        /** Add one or more records */
        addRecords(data: FM.ContactRecord|FM.ContactRecord[]): void;

        /** Remove one, more or all records. Limit should be set to 1 when removing a specific record */
        removeRecords(
            search?: Partial<FM.ContactRecord>|Partial<FM.ContactRecord>[],
            limit?: number
        ): void;

        updateRecord(find: Partial<FM.ContactRecord>, data: FM.ContactRecord): void;
    }
}

export {}