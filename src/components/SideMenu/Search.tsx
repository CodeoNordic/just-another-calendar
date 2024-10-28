import { useConfigState } from "@context/Config";
import Collapse from "./Collapse";
import performScript from "@utils/performScript";
import SearchIcon from 'jsx:@svg/search.svg';
import Crossmark from 'jsx:@svg/crossmark.svg';

import { warn } from '@utils/log';
import { useState } from "react";

const SearchField: FC<{searchField: JAC.SearchField, index: number}> = (props) => {
    const [altSearch, setAltSearch] = useState<string | null>(null);
    const [config, setConfig] = useConfigState();

    const setSearch = (newValue: string) => {
        // priority is script from filter > script from config > client side toggle 
        if (props.searchField.script) {
            performScript(props.searchField.script, {
                searchField: props.searchField, newValue, index: props.index
            });
        } else if (config!.scriptNames.onSearch){
            performScript("onSearch", {
                searchField: props.searchField, newValue, index: props.index
            });
        } else {
            setConfig(prev => {
                return {
                    ...prev,
                    searchFields: prev?.searchFields?.map((field, i) => 
                        i === props.index ? { ...field, value: newValue } : field
                    )
                } as JAC.Config;
            });
        }
    }

    return <div className="search-field">
        <input type="text" placeholder={props.searchField.placeholder ?? "Search"}
            value={(props.searchField.instant === false ? altSearch : props.searchField.value) || ""}
            onChange={e => {
                if (props.searchField.instant === false) {
                    e.target.value.length == 0 && setSearch("");
                    setAltSearch(e.target.value);
                } else setSearch(e.target.value);
            }}
            onKeyDown={(e) => {
                if (e.key === 'Enter' && props.searchField.instant === false) {
                    setSearch((props.searchField.instant === false ? altSearch : props.searchField.value) || "");
                }
            }}
        />
        {props.searchField.instant === false && <SearchIcon 
            onClick={() => setSearch((props.searchField.instant === false ? altSearch : props.searchField.value) || "")}
        />}
        {props.searchField.emptyButton !== false && <Crossmark onClick={() => {
            setSearch(""); 
            setAltSearch("");
        }} />}
    </div>
}

const Search: FC<{searchField: JAC.SearchField, index: number}> = (props) => {

    if (!props.searchField.searchBy && !props.searchField.eval && !props.searchField.script) {
        warn('Search field is missing searchBy, eval and script, will not be used.', props.searchField);
        return null;
    };
    
    return <>
        {props.searchField.title ? <Collapse className="search" top={<>
            <div>{props.searchField.title}</div>
        </>}
        collapsed={props.searchField.open === false}>
            <SearchField searchField={props.searchField} index={props.index} />
        </Collapse> : <SearchField searchField={props.searchField} index={props.index} />}
    </>
}

export default Search;