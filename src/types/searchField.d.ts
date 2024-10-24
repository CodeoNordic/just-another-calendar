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

            sort?: number; // The order of the search field in the side menu
        
            hidden?: boolean; // Whether the search field is hidden or not

            // NEW PROPERTIES
            dynamicDropdown?: boolean;
            noResults?: string; // Text to display if there is no results
        }

        // Each search result
        interface SearchResult {
            title?: string|string[]; // Text displayed for the result. If an array is passed, the strings will be separated by a line break
            script?: string; // Script to run when the result is clicked
            id?: string; // ID to send to the script 

            dynamicDropdown?: boolean; // "Recursive" dropdowns, allows for sub-popups 
        }
    }
}

export {};