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

            instant?: boolean; // Whether the search field should search on enter or on change

            emptyButton?: boolean; // Whether the search field should have a button to clear the search

            // NEW PROPERTIES
            dynamicDropdown?: boolean;
            noResults?: string; // Text to display if there is no results
        }

        // Each search result
        interface SearchResult {
            title?: string|string[]; // Text displayed for the result. If an array is passed, the strings will be separated by a line break
            event?: JAC.Event; // Event to display instead of the title
            eventEdit?: string; // Script for editing the event when clicking a button
            eventShow?: string; // Script for showing the event in the calendar when clicking a button
            script?: string; // Script to run when the result is clicked
            id?: string; // ID to send to the script 

            button?: { // Button to display next to the result
                icon: string; // name of icon from icons

                script: string; // name of script
                id?: string; // ID to send to the script
            }

            dynamicDropdown?: boolean; // "Recursive" dropdowns, allows for sub-popups 
        }
    }
}

export {};