declare global {
    namespace JAC {
        interface SearchField {
            searchBy?: string|string[]; // Fields from JAC.Event

            title?: string; // Displayed over the search field
            placeholder?: string; // Placeholder text for the search field
            
            open?: boolean; // Whether the search field is open or not
            value?: string; // The current search string

            eval?: string; // JavaScript to run when the search field is changed

            script?: string; // Script to run when the search field is changed for searching in FileMaker

            order?: number; // The order of the search field in the side menu
        }
    }
}

export {};