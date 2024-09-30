import { useConfigState } from "@context/Config";
import Collapse from "./Collapse";
import performScript from "@utils/performScript";

const Search: FC = () => {
    const [config, setConfig] = useConfigState();

    if (!config?.searchFields) return null;


    const setSearch = (searchField: JAC.SearchField, newSearch: string, index: number) => {
        // priority is script from filter > script from config > client side toggle
        if (searchField.script) {
            performScript(searchField.script, {
                
            });
        } else if (config.scriptNames.onSearch){
            performScript("onSearch", {
                
            });
        } else {
            setConfig(prev => {
                return {
                    ...prev,
                    searchFields: prev?.searchFields?.map((field, i) => 
                        i === index ? { ...field, search: newSearch } : field
                    )
                } as JAC.Config;
            });
        }
    }

    return <div>
        {config.searchFields.map((searchField, index) => <div key={searchField.title}> <div className="divider" /> 
        <Collapse top={<>
            <div>{searchField.title ?? "Filters"}</div>
        </>}
        collapsed={searchField.openDefault === false}>
            <input type="text" placeholder={searchField.placeholder ?? "Search"}
                value={searchField.search || ""}
                onChange={e => setSearch(searchField, e.target.value, index)}
            />
        </Collapse>
    </div>)}
    </div>
}

export default Search;