import { useConfigState } from "@context/Config";
import Collapse from "./Collapse";
import performScript from "@utils/performScript";

import { warn } from '@utils/log';

const Search: FC<{searchField: JAC.SearchField, index: number}> = (props) => {
    const [config, setConfig] = useConfigState();
    const searchField = props.searchField;
    const index = props.index;

    const setSearch = (newValue: string) => {
        // priority is script from filter > script from config > client side toggle 
        if (searchField.script) {
            performScript(searchField.script, {
                searchField, newValue, index
            });
        } else if (config!.scriptNames.onSearch){
            performScript("onSearch", {
                searchField, newValue, index
            });
        } else {
            setConfig(prev => {
                return {
                    ...prev,
                    searchFields: prev?.searchFields?.map((field, i) => 
                        i === index ? { ...field, value: newValue } : field
                    )
                } as JAC.Config;
            });
        }
    }
    
    if (!searchField.searchBy && !searchField.eval && !searchField.script) {
        warn('Search field is missing searchBy, eval and script, will not be used.', searchField);
        return null;
    };
    
    return <>
        {searchField.title ? <Collapse className="search" top={<>
            <div>{searchField.title}</div>
        </>}
        collapsed={searchField.open === false}>
            <input type="text" placeholder={searchField.placeholder ?? "Search"}
                value={searchField.value || ""}
                onChange={e => setSearch(e.target.value)}
            />
        </Collapse> : <input type="text" placeholder={searchField.placeholder ?? "Search"}
                value={searchField.value || ""}
                onChange={e => setSearch(e.target.value)}
            />}
    </>
}

export default Search;