declare global {
    namespace JAC {
        interface EventTemplate {
            areaName?: string;
            title: string;
            backgroundColor?: string;
            textColor?: string;
            event: JAC.Event;
            locked?: boolean;
            sort?: number;
            instant?: boolean;
            icon?: string;
            hidden?: boolean;
        }
    }
}

export {};