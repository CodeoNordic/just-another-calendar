// Copy and paste this into the browser console
init(JSON.stringify({
    date: '2024-11-19',
    view: 'resourceTimeGridDay',
    days: 1,

    calendarStartTime: '06:00',
    calendarEndTime: '19:00',
    initialScrollTime: '08:00',
    
    locale: 'en-uk',
    firstDayOfWeek: 'mon',

    resources: [
        { id: 'room1', title: 'Room 1' },
        { id: 'room2', title: 'Room 2' },
        { id: 'room3', title: 'Room 3' },
        { id: 'room6', title: 'Room 6' },
        { id: 'other', title: 'Other' }
    ],

    events: [
        {
            id: '001',
            resourceId: 'room1',

            dateStart: '2024-11-19',
            dateEnd: '2024-11-19',
            timeStart: '09:00',
            timeEnd: '10:00',

            // Custom values
            Title: 'Example Event',
            Speaker: 'Speaker Lastname',
            EventType: 'technical'
        },

        {
            id: '002',
            resourceId: 'room6',

            dateStart: '2024-11-19',
            dateEnd: '2024-11-19',
            timeStart: '09:00',
            timeEnd: '10:00',

            // Custom values
            Title: 'Just another Calendar',
            Speaker: 'Andreas Haandlykken',
            EventType: 'sponsor'
        },

        {
            id: '003',
            resourceId: 'other',

            dateStart: '2024-11-19',
            dateEnd: '2024-11-19',
            timeStart: '10:00',
            timeEnd: '10:30',

            Title: 'Break',
            EventType: 'break'
        }
    ],

    icons: [
        {
            name: 'tools',
            html: '<span>T</span>'
        },

        {
            name: 'handshake',
            html: '<span>H</span>'
        },

        {
            name: 'food',
            html: '<span>F</span>'
        }
    ],

    defaultEventComponent: 'example',
    eventComponents: [
        {
            name: 'example',
            fields: [
                {
                    value: 'Title',
                    icon: [
                        {
                            icon: 'tools',
                            _filter: {
                                EventType: '==technical'
                            }
                        },
                        
                        {
                            icon: 'handshake',
                            _filter: {
                                EventType: '==sponsor'
                            }
                        },

                        {
                            icon: 'food',
                            _filter: {
                                EventType: '==break'
                            }
                        }
                    ],
                    fullWidth: true
                },

                {
                    template: '- {Speaker}',
                    marginTop: '8px',
                    _filter: {
                        Speaker: '*'
                    }
                }
            ]
        }
    ]
}));