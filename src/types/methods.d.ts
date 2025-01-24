declare global {
    interface Window {
        onScriptResult(uuid: string, data: string): void;

        /** Initialize the component */
        init(config: string): void;

        /** Set a specific value in the config */
        setConfigValue<K extends string & keyof JAC.Config>(k: K, prop: JAC.Config[K], type?: number): void;


        /** Add one or more events */
        addEvents(data: WithFilter<JAC.Event>|WithFilter<JAC.Event>[]): void;
        addEvent(data: WithFilter<JAC.Event>|WithFilter<JAC.Event>[]): void;

        /** Remove one, more or all events. Limit should be set to 1 when removing a specific event. If a string is passed, it is considered as the event ID. */
        removeEvents(
            search?: Partial<JAC.Event>|((Partial<JAC.Event>|string)[])|string,
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
        updateEvent(search: Partial<JAC.Event>|string, data: JAC.Event, autocreate?: boolean): void;

        /**
         * Update a specific event filter
         * @param find Either the array index of the filter, its ID, or values of the filter object
         * @param data The values of the filter to update
         * @example ```ts
         * // Lock the first filter
         * updateEventFilter(0, JSON.stringify({locked: true}));
         * ```
         */
        updateEventFilter(find: string|number|Partial<JAC.EventFilter>, data: Partial<JAC.EventFilter>): void;

        /** Revert changes to an event */
        revert(id: string): void;

        /** Scrolls to a specific time in the calendar */
        scrollToTime(time: string): void;

        /** Debug helper to get an event's data */
        getEvent(id: string): JAC.Event|undefined;

        /** Re-renders the calendar, as some values may not automatically update the calendar upon changing */
        render(): void;
    }
}

export {}