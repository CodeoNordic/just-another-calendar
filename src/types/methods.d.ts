declare global {
    interface Window {
        onScriptResult(uuid: string, data: string): void;

        /** Initialize the component */
        init(config: string): void;

        /** Set a specific value in the config */
        setConfigValue<K extends string & keyof JAC.Config>(k: K, prop: JAC.Config[K]): void;
        setConfigProp<K extends string & keyof JAC.Config>(k: K, prop: JAC.Config[K]): void;


        /** Add one or more events */
        addEvents(data: WithFilter<JAC.Event>|WithFilter<JAC.Event>[]): void;
        addEvent(data: WithFilter<JAC.Event>|WithFilter<JAC.Event>[]): void;

        /** Remove one, more or all events. Limit should be set to 1 when removing a specific event */
        removeEvents(
            search?: Partial<JAC.Event>|(Partial<JAC.Event>[]),
            limit?: number
        ): void;

        /** Overwrite the event list */
        setEvents(data: JAC.Event|JAC.Event[]): void;

        /**
         * Update a specific event
         * @param find JSON filter to find the event
         * @param data Partial or full data to update the event with
         * @param autocreate Whether to create the event if it doesn't exist
         * @example ```ts
         * updateEvent(JSON.stringify({id: '123'}), JSON.stringify({title: 'New title'}), true);
         * ```
        */
        updateEvent(find: Partial<JAC.Event>, data: JAC.Event, autocreate?: boolean): void;

        /**
         * Update a specific filter
         * @param find Either the array index of the filter, its ID, or values of the filter object
         * @param data The values of the filter to update
         * @example ```ts
         * // Lock the first filter
         * updateFilter(0, JSON.stringify({locked: true}));
         * ```
         */
        updateFilter(find: string|number|Partial<JAC.EventFilter>, data: Partial<JAC.EventFilter>): void;

        /** Revert changes to an event */
        revert(id: string): void;
    }
}

export {}