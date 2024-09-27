import { useConfigState } from "@context/Config";
import Collapse from "./Collapse";
import performScript from "@utils/performScript";

const SearchArea: FC<{searchField: JAC.SearchField}> = props => {
    const [config, setConfig] = useConfigState();
    
    if (!config) return null

        
}


const Search: FC = () => {
    const [config, setConfig] = useConfigState();

    if (!config?.searchFields) return null;


    const setSearch = (searchField: JAC.SearchField, newSearch: string) => {
        // priority is script from filter > script from config > client side toggle
        if (searchField.script) {
            performScript(searchField.script, {
                
            });
        } else if (config.scriptNames.onEventFilterChange){
            performScript("onSearch", {
                
            });
        } else {
            setConfig(prev => {
                return {
                    ...prev, 
                    searchField: { ...searchField, search: newSearch }
                } as JAC.Config;
            });
        }
    }

    return <div>
        {config.searchFields.map(searchField => <div> <div className="divider" /> 
        <Collapse top={<>
            <div>{searchField.title ?? "Filters"}</div>
        </>}
        collapsed={searchField.openDefault !== false}>
            <input type="text" placeholder={searchField.placeholder ?? "Search"}
                value={searchField.search || ""}
                onChange={e => setSearch(searchField, e.target.value)}
            />
        </Collapse>
    </div>)}
    </div>
}

export default Search;