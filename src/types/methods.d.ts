declare global {
    interface Window {
        debug?: RSAny;

        init(data: string): void;
        onScriptResult(uuid: string, data: string): void;

        /** Add one or more records */
        addRecords(data: WithFilter<FM.DeliveryRecord>|WithFilter<FM.DeliveryRecord>[]): void;

        /** Remove one, more or all records. Limit should be set to 1 when removing a specific record */
        removeRecords(
            search?: Partial<FM.DeliveryRecord>|Partial<FM.DeliveryRecord>[],
            limit?: number
        ): void;

        /** Overwrite the record list */
        setRecords(data: FM.DeliveryRecord|FM.DeliveryRecord[]): void;

        /** Update a specific record */
        updateRecord(find: Partial<FM.DeliveryRecord>, data: FM.DeliveryRecord): void;

        /** Set a specific value in the config */
        setConfigProp<K extends string & keyof NOBS.Config>(k: K, prop: NOBS.Config[K]): void;

        /** Set the current date to show. */
        setCurrentDate(date?: string): void;

        /** Sets the minimum date. Any delivery with a dateFinished value below this will be hidden. */
        setMinDate(date?: string): void;

        /** Changes the calendar view */
        setView(view: string): void;
    }
}

export {}