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
    records: [
        {
            id: '1',
            FirstName: "Joakim",
            Test: "TEST VALUE",
            ButtonText: "BUTTON",
            start: '2024-07-17T12:00',
            end: '2024-07-17T13:00',
            allDay: false,
            tooltip: 'TEST TOOLTIP JOAKIM',
            resourceId: '1'
        },

        {
            id: '2',
            FirstName: "Joakim Isaksen",
            Test: "TEST VALUE 2",
            ButtonText: "BUTTON 2",
            start: '2024-07-18',
            end: '2024-07-18',
            allDay: false,
            resourceId: '2'
        },

        {
            id: '3',
            FirstName: "Joakim Isaksen +",
            Test: "TEST VALUE 3",
            ButtonText: "BUTTON 3",
            start: '2024-07-18',
            end: '2024-07-18',
            allDay: false,
            _component: "compact",
            resourceId: '2'
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
    ]
}))