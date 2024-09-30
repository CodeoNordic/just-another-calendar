import { useConfigState } from "@context/Config";
import Collapse from "./Collapse";
import performScript from "@utils/performScript";

const Search: FC = () => {
    const [config, setConfig] = useConfigState();

    if (!config?.searchFields) return null;


    const setSearch = (searchField: JAC.SearchField, newValue: string, index: number) => {
        // priority is script from filter > script from config > client side toggle 
        if (typeof searchField.eval === 'string' && searchField.eval.length > 0) {
            return;
        } else if (searchField.script) {
            performScript(searchField.script, {
                searchField, newValue, index
            });
        } else if (config.scriptNames.onSearch){
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

    return <div>
        {config.searchFields.map((searchField, index) => {
            if (!searchField.searchBy && !searchField.eval && !searchField.script) {
                console.warn('Search field is missing searchBy, eval and script, will not be used.', searchField);
                return null;
            };
            
            return <div key={index}> <div className="divider" /> 
        {searchField.title ? <Collapse top={<>
            <div>{searchField.title}</div>
        </>}
        collapsed={searchField.openDefault === false}>
            <input type="text" placeholder={searchField.placeholder ?? "Search"}
                value={searchField.value || ""}
                onChange={e => setSearch(searchField, e.target.value, index)}
            />
        </Collapse> : <input type="text" placeholder={searchField.placeholder ?? "Search"}
                value={searchField.value || ""}
                onChange={e => setSearch(searchField, e.target.value, index)}
            />}
    </div>})}
    </div>
}

export default Search;