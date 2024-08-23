declare global {
    interface Window {
        onScriptResult(uuid: string, data: string): void;

        /** Initialize the component */
        init(config: string): void;

        /** Set a specific value in the config */
        setConfigValue<K extends string & keyof JAC.Config>(k: K, prop: JAC.Config[K]): void;
        setConfigProp<K extends string & keyof JAC.Config>(k: K, prop: JAC.Config[K]): void;


        /** Add one or more records */
        addRecords(data: WithFilter<JAC.Event>|WithFilter<JAC.Event>[]): void;

        /** Remove one, more or all records. Limit should be set to 1 when removing a specific record */
        removeRecords(
            search?: Partial<JAC.Event>|(Partial<JAC.Event>[]),
            limit?: number
        ): void;

        /** Overwrite the record list */
        setRecords(data: JAC.Event|JAC.Event[]): void;

        /**
         * Update a specific record
         * @param find JSON filter to find the record
         * @param data Partial or full data to update the record with
         * @param autocreate Whether to create the record if it doesn't exist
         * @example ```ts
         * updateRecord(JSON.stringify({id: '123'}), JSON.stringify({title: 'New title'}), true);
         * ```
        */
        updateRecord(find: Partial<JAC.Event>, data: JAC.Event, autocreate?: boolean): void;

        /** Set the current date to show. */
        /** @deprecated use setConfigValue('date', value) */
        setCurrentDate(date?: string): void;

        /** Changes the calendar view */
        /** @deprecated use setConfigValue('view', value) */
        setView(view: string): void;

        /** Revert changes to an event */
        revert(id: string): void;
    }
}

export {}