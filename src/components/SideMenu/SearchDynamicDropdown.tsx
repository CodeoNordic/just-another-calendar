import { useConfigState } from "@context/Config";
import Collapse from "./Collapse";
import performScript from "@utils/performScript";

import { warn } from '@utils/log';

const SearchDynamicDropdownContent: FC<{searchField: JAC.SearchField, index: number}> = (props) => {
    const [config, setConfig] = useConfigState();
    const searchField = props.searchField;
    const index = props.index;

    const setSearch = (newValue: string) => {
        setConfig(prev => {
            return {
                ...prev,
                searchFields: prev?.searchFields?.map((field, i) => 
                    i === index ? { ...field, value: newValue } : field
                )
            } as JAC.Config;
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && document.activeElement?.id === 'search-dynamic-input') {
            performScript(searchField.script!, {
                searchField, newValue: searchField.value, index
            });
        }
    });

    return <div>
        <input id="search-dynamic-input" type="text" placeholder={searchField.placeholder ?? "Search"}
            value={searchField.value || ""}
            onChange={e => setSearch(e.target.value)}
        />
    </div>
}

const SearchDynamicDropdown: FC<{searchField: JAC.SearchField, index: number}> = (props) => {
    const searchField = props.searchField;
    const index = props.index;
    
    if (!searchField.script) {
        warn('Script is required for dynamic search dropdown, will not be used.', searchField);
        return null;
    };
    
    return <>
        {searchField.title ? <Collapse className="search" top={<>
            <div>{searchField.title}</div>
        </>}
        collapsed={searchField.open === false}>
            <SearchDynamicDropdownContent searchField={searchField} index={index} />
        </Collapse> : <SearchDynamicDropdownContent searchField={searchField} index={index} />}
    </>
}

export default SearchDynamicDropdown;