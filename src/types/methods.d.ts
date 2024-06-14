declare global {
    interface Window {
        debug?: RSAny;

        init(data: string): void;
        onScriptResult(uuid: string, data: string): void;

        /** Add one or more records */
        addRecords(data: WithFilter<FM.EventRecord>|WithFilter<FM.EventRecord>[]): void;

        /** Remove one, more or all records. Limit should be set to 1 when removing a specific record */
        removeRecords(
            search?: Partial<FM.EventRecord>|Partial<FM.EventRecord>[],
            limit?: number
        ): void;

        /** Overwrite the record list */
        setRecords(data: FM.EventRecord|FM.EventRecord[]): void;

        /** Update a specific record */
        updateRecord(find: Partial<FM.EventRecord>, data: FM.EventRecord): void;

        /** Set a specific value in the config */
        setConfigProp<K extends string & keyof NOBS.Config>(k: K, prop: NOBS.Config[K]): void;

        /** Set the current date to show. */
        setCurrentDate(date?: string): void;

        /** Sets the minimum date. Any delivery with a dateFinished value below this will be hidden. */
        setMinDate(date?: string): void;

        /** Changes the calendar view */
        setView(view: string): void;

        /** Revert changes to an event */
        revert(id: string): void;
    }
}

export {}