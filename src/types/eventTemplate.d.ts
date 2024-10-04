declare global {
    namespace JAC {
        interface EventTemplate {
            areaName?: string;
            title: string;
            backgroundColor?: string;
            textColor?: string;
            event: JAC.Event;
            locked?: boolean;
        }
    }
}

export {}