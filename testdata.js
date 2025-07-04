init(JSON.stringify({
    view: 'resourceTimeGridDay',
    resources: [
        { id: '1F', title: 'Ressurs 2' },
        { id: '2F', title: 'Ressurs 3' },
        { id: '3F', title: 'Ressurs 1', sort: 1 },
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
            filterId: ['filter1', 'source1'],
            colors: {
                background: '#000000',
                border: '#000000'
            }
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
            filterId: ['filter2', 'source2']
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
            filterId: ['filter2', 'source1']
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
            filterId: ['filter3', 'filter2', 'source3', 'source2']
        },

        {
            id: '5',
            FirstName: "Vetle :)",
            Test: "TEST VALUE 2",
            ButtonText: "BUTTON 2",
            start: '2024-07-19T09:00',
            end: '2024-07-19T09:45',
            resourceId: '3F',
            filterId: ['filter3', 'source2']
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
            filterId: ['source3', 'filter1']
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

    scriptNames: {
        onEventFilterAreaOpened: '[TRG] = EVNT Filter Area Opened',
        onEventFilterAreaClosed: '[TRG] = EVNT Filter Area Closed',
        onEventTemplateAreaOpened: '[TRG] = EVNT Template Area Opened',
        onEventTemplateAreaClosed: '[TRG] = EVNT Template Area Closed',
        onJsRequest: '[TRG] = EVNT JS Request'
    },
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
            areaName: "filters",

            color: "#AAEEAA",
            eventColor: "#AAEEAA",

            enabled: true,
            locked: true,
        },
        {
            id: "filter2",
            title: "Ulåst filter",
            areaName: "filters",

            color: "#ff0000",
            eventColor: "#ff0000",
            eventColorPriority: -1,

            enabled: true,
            locked: false,
        },
        {
            id: "filter3",
            title: "Ulåst filter (default av)",
            areaName: "filters",

            color: "#0000ff",

            eventColor: {
                background:"#0000ff",
                border: "#0000ff",
                text: "#ffffff"
            },
            eventColorPriority: 2,

            enabled: false,
            locked: false,
        },
        {
            id: "source1",
            title: "Kilde 1",
            areaName: "sources",
            color: "#ff0000",

            enabled: true,
            locked: false,
        },
        {
            divider: true,
            areaName: "sources",
        },
        {
            id: "source2",
            title: "Kilde 2",
            areaName: "sources",
            color: "#00ff00",

            enabled: true,
            locked: false,
        },
        {
            id: "source3",
            title: "Kilde 3",
            areaName: "sources",
            color: "#0000ff",

            enabled: true,
            locked: false,
        }
    ],
    eventFilterAreas: [
        {
            name: "filters",
            title: "Filtrer",
            open: true,
            sort: 2
        },
        {
            name: "sources",
            title: "Kilder",
            open: false,
            sort: 3,
            hidden: false
        }
    ],
    searchFields: [
        {
            searchBy: [
                "FirstName"
            ],
            placeholder: "Søk",

            open: true,
            sort: 6
        },
        {
            searchBy: [
                "FirstName"
            ],
            title: "Søk etter navn (ikke instant test)",
            placeholder: "Søk",

            instant: false,
            open: true,
            sort: 0.5
        },
        {
            searchBy: [
                "start",
                "end"
            ],

            title: "Søk etter tid",
            placeholder: "Søk",

            open: true,
            sort: 5
        },
        {
            title: "Søk etter helt navn (eval test)",
            placeholder: "Søk",

            open: true,

            eval: "(event, input, config) => event.FirstName?.toLowerCase() === input?.toLowerCase()",
            sort: 4
        },
        {
            title: "Dropdown søk test",
            placeholder: "Søk",
            open: true,
            dynamicDropdown: true,
            script: '[TRG] = Søk etter dropdown items',
            
            sort: -1
        }
    ],
    calendarStartTime: "08:00",
    calendarEndTime: "16:15",
    locale: "en",
    translations: {
        allDaySlot: "Hele dagen",
        weekNumberHeader: "U",
        eventCreationHeader: "Ny Avtale",
        eventCreationCancel: "Avbryt",
        eventCreationConfirm: "Lagre",
        eventTemplatesHeader: "Avtalemaler"
    },
    showWeekends: false,
    firstDayOfWeek: 0,
    newEventMovable: true,
    days: 5,
    contrastMin: 3,
    eventTemplates: [
        {
            title: "Test 1",
            backgroundColor: "#ff0000",
            textColor: "#ffffff",
            event: {
                FirstName: "Joakim",
                filterId: ['filter1', 'source1'],
                colors: {
                    background: '#ff0000',
                    border: '#ff0000'
                }
            }
        },
        {
            title: "Test 2",
            backgroundColor: "#00ff00",
            textColor: "#ffffff",
            event: {
                FirstName: "Joakim Isaksen",
                filterId: ['filter2', 'source2'],
                colors: {
                    background: '#00ff00',
                    border: '#00ff00'
                }
            },
            areaName: 'area1'
        },
        {
            title: "Test 3",
            backgroundColor: "#0000ff",
            textColor: "#ffffff",
            event: {
                FirstName: "Joakim Isaksen +",
                filterId: ['filter2', 'source1'],
                colors: {
                    background: '#0000ff',
                    border: '#0000ff'
                }
            },
            areaName: 'area1'
        },
        {
            title: "Test 4",
            backgroundColor: "#ff00ff",
            textColor: "#ffffff",
            event: {
                duration: "02:00",
                FirstName: "test testesen",
                filterId: ['filter3', 'source3'],
                colors: {
                    background: '#ff00ff',
                    border: '#ff00ff'
                }
            },
            areaName: 'area2'
        },
        {
            title: "Test 5",
            backgroundColor: "#00ffff",
            textColor: "#ffffff",
            event: {
                FirstName: "Vetle :)",
                filterId: ['filter3', 'source2'],
                colors: {
                    background: '#00ffff',
                    border: '#00ffff'
                }
            },
            areaName: 'area2'
        }
    ],
    eventTemplateAreas: [
        {
            name: 'area1',
            title: 'Template area 1',
            open: true,
            sort: 0
        },
        {
            name: 'area2',
            title: 'Template area 2',
            open: false,
            sort: 1
        }
    ],
    heatmap: true,
    newEventFields: [
        {
            name: "FirstName",
            title: "Tittel"
        },
        {
            name: "start",
            title: "Start",
            type: "time"
        },
        {
            name: "end",
            title: "Slutt",
            type: "time"
        },
        {
            name: "colors.border",
            title: "Kant-farge",
            type: "color",
            defaultValue: "#3788d8"
        },
        {
            name: "colors.background",
            title: "Bakgrunnsfarge",
            type: "color",
            defaultValue: "#3788d8"
        },
        {
            name: "filterId",
            title: "Filtrerings-id",
            defaultValue: "filter2",
            type: "dropdown",
            multiple: true,
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