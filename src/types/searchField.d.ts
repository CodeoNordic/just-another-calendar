declare global {
    namespace JAC {
        interface SearchField {
            searchBy?: string[]; // Fields from JAC.Event

            title?: string; // Displayed over the search field
            placeholder?: string; // Placeholder text for the search field
            
            openDefault?: boolean; // Whether the search field is open by default
            value?: string; // The current search string

            script?: string; // Script to run when the search field is changed for searching in FileMaker
        }
    }
}

export {};