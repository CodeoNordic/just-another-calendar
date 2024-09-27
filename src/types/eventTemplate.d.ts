declare global {
    namespace JAC {
        interface EventTemplate {
            title: string;
            backgroundColor?: string;
            textColor?: string;
            event: JAC.Event;
            locked?: boolean;
        }
    }
}

export {}