init(JSON.stringify({
    view: 'resourceTimeGridDay',
    resources: [
        { id: '1F', title: 'Ressurs 1' },
        { id: '2F', title: 'Ressurs 2' },
        { id: '3F', title: 'Ressurs 3' },
    ],
    date: '2024-07-16',
    icons: [
        {
            name: "clock",
            html: '<svg width="1em" height="1em" fill="none" viewBox="0 0 24 24" focusable="false" role="img"><path fill="currentColor" fill-rule="evenodd" d="M3.75 12a8.25 8.25 0 1 1 16.5 0 8.25 8.25 0 0 1-16.5 0M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25M12.75 6a.75.75 0 0 0-1.5 0v6c0 .199.079.39.22.53l2.5 2.5a.75.75 0 1 0 1.06-1.06l-2.28-2.28z" clip-rule="evenodd"></path></svg>',
        }
    ],
    events: [
        {
            id: '1',
            FirstName: "Joakim",
            Test: "TEST VALUE",
            ButtonText: "BUTTON",
            start: '2024-07-17T12:00',
            end: '2024-07-17T13:00',
            allDay: false,
            tooltip: 'TEST TOOLTIP JOAKIM',
            resourceId: '1F',
            filterId: 'filter1',
            colors: {
                background: '#000000',
                border: '#000000'
            },
            source: 'source1'
        },

        {
            id: '2',
            FirstName: "Joakim Isaksen",
            Test: "TEST VALUE 2",
            ButtonText: "BUTTON 2",
            start: '2024-07-18T12:00',
            end: '2024-07-18T13:00',
            allDay: false,
            resourceId: '2F',
            filterId: 'filter2',
            source: 'source2'
        },

        {
            id: '3',
            FirstName: "Joakim Isaksen +",
            Test: "TEST VALUE 3",
            ButtonText: "BUTTON 3",
            start: '2024-07-18T12:00',
            end: '2024-07-18T13:00',
            allDay: false,
            _component: "compact",
            resourceId: '2F',
            filterId: 'filter2',
            source: 'source1'
        },

        {
            id: '4',
            FirstName: "test testesen",
            Test: "TEST VALUE",
            ButtonText: "BUTTON",
            start: '2024-07-16T10:00',
            end: '2024-07-16T14:00',
            allDay: false,
            tooltip: 'TEST TOOLTIP JOAKIM',
            resourceId: '1F',
            filterId: 'filter3',
            source: 'source3'
        },

        {
            id: '5',
            FirstName: "Vetle :)",
            Test: "TEST VALUE 2",
            ButtonText: "BUTTON 2",
            start: '2024-07-19T9:00',
            end: '2024-07-19T9:45',
            resourceId: '3F',
            filterId: 'filter3',
            source: 'source2'
        },

        {
            id: '6',
            FirstName: "John doe",
            Test: "TEST VALUE 3",
            ButtonText: "BUTTON 3",
            start: '2024-07-22T14:00',
            end: '2024-07-22T15:30',
            allDay: true,
            _component: "compact",
            resourceId: '2F',
            filterId: 'filter1',
            source: 'source3'
        }
    ],

    eventComponent: 'default',
    eventComponents: [{
        name: "default",
        fields: [
            {
                template: "{FirstName} {Time:start}"
            },

            {
                value: "ButtonText",
                type: "button",
                icon: "clock",
                script: '[BTN] Inline test'
            }
        ]
    }, {
        name: "compact",
        fields: [{
            value: "FirstName"
        }]
    }],

    scriptNames: {},
    eventButtons: [
        {
            icon: 'clock',
            script: '[BTN] Test'
        }
    ],
    eventFilters: [
        {
          id: "filter1",
          title: "Låst filter",
          color: "#AAEEAA",
          
          enabled: true, 
          locked: true,
          
          clientOnly: true
        },
        {
          id: "filter2",
          title: "Ulåst filter",
          color: "#ff0000",
          
          enabled: true, 
          locked: false, 
          
          clientOnly: true
        },
        {
          id: "filter3",
          title: "Ulåst filter (default av)",
          color: "#0000ff",
          
          enabled: false,
          locked: false,
          
          clientOnly: true
        }
    ],
    sourceFilters: [
        {
          id: "source1",
          title: "Låst kilde",
          color: "#AAEEee",
          
          enabled: true, 
          locked: true,
          
          clientOnly: true
        },
        {
          id: "source2",
          title: "Ulåst kilde",
          color: "#ff0055",
          
          enabled: true, 
          locked: false, 
          
          clientOnly: true
        },
        {
          id: "source3",
          title: "Ulåst kilde (default av)",
          color: "#0000ff",
          
          enabled: false,
          locked: false,
          
          clientOnly: true
        }
    ],
    searchBy: ["FirstName", "start"],
    calendarStartTime: "08:00",
    calendarEndTime: "16:15",
    locale: "en",
    translations: {
        searchHeader: "Søk",
        searchPlaceholder: "Søk",
        filtersHeader: "Filtre",
        sourceHeader: "Kilder",
        allDaySlot: "Hele dagen",
        weekNumberHeader: "U",
        eventCreationHeader: "Ny Avtale",
        eventCreationCancel: "Avbryt",
        eventCreationConfirm: "Lagre"
    },
    showWeekends: false,
    firstDayOfWeek: 0,
    newEventMovable: true,
    days: 5,
    contrastMin: 3,
    newEventFields: [
    {
        field: "FirstName",
        title: "Tittel"
    },
    {
        field: "start",
        title: "Start",
        type: "time"
    },
    {
        field: "end",
        title: "Slutt",
        type: "time"
    },
    {
        field: "colors.border",
        title: "Kant-farge",
        type: "color",
        default: "#3788d8"
    },
    {
        field: "colors.background",
        title: "Bakgrunnsfarge",
        type: "color",
        default: "#3788d8"
    },
    {
        field: "filterId",
        title: "Filtrerings-id",
        default: "filter2",
        type: "dropdown",
        dropdownItems: [
            {
                value: "filter1",
                label: "Første filter",
            },
            {
                value: "filter2",
                label: "Andre filter",
            },
            {
                value: "filter3",
                label: "Tredje filter",
            }
        ]
    }]
}))