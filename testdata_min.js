init(JSON.stringify({
    view: 'resourceTimeGridDay',
    resources: [
        { id: '1F', title: 'Ressurs 1' },
    ],
    events: [
        {
            id: '1',
            FirstName: "Vetle L",
            start: '2024-08-27T12:00',
            end: '2024-08-27T13:00',
            resourceId: '1F',
        }
    ],

    defaultEventComponent: 'default',
    eventComponents: [{
        name: "default",
        fields: [{
                value: "FirstName"
            }]
    }]
}))