import { useConfigState } from "@context/Config";
import Collapse from "./Collapse";
import performScript from "@utils/performScript";

import { warn } from '@utils/log';
import fetchFromFileMaker from "@utils/fetchFromFilemaker";
import { useEffect, useState } from "react";
import ChevronDown from 'jsx:@svg/chevron-down.svg';

const SearchDropdownItems: FC<{dynamicDropdownParent: JAC.SearchResult[]}> = (props) => {
    const [dynamicDropdowns, setDynamicDropdowns] = useState<(JAC.SearchResult & { parent?: { first: number, second: number } })[][]>([[]]);
    const [active, setActive] = useState<number>(0);

    useEffect(() => {
        setDynamicDropdowns([props.dynamicDropdownParent]);
        setActive(0);
    }, [props.dynamicDropdownParent]);

    return <div>
        {dynamicDropdowns[active][0]?.parent && <div className="dropdown-child-header">
            <ChevronDown onClick={() => setActive(dynamicDropdowns[active][0].parent!.first)} className="back-arrow"/>
            <p>{Array.isArray(dynamicDropdowns[dynamicDropdowns[active][0].parent.first][dynamicDropdowns[active][0].parent.second].title) 
                ? dynamicDropdowns[dynamicDropdowns[active][0].parent.first][dynamicDropdowns[active][0].parent.second].title?.[0] 
                : dynamicDropdowns[dynamicDropdowns[active][0].parent.first][dynamicDropdowns[active][0].parent.second].title}</p>
        </div>}
        {dynamicDropdowns[active].map((result, i) => <div key={i} onClick={() => {
            if (result.script && !result.dynamicDropdown) performScript(result.script);
            else if (result.dynamicDropdown && result.script) {
                const params = dynamicDropdowns[active][i].scriptParam ? { ...JSON.parse(dynamicDropdowns[active][i].scriptParam), result: result } : { result: result };
                fetchFromFileMaker(result.script, params, undefined, true).then((value) => {
                    const result = value as JAC.SearchResult[];
                    if (result) {
                        setDynamicDropdowns([...dynamicDropdowns, result.map((r) => ({ ...r, parent: { first: active, second: i } }))]);
                        setActive(dynamicDropdowns.length);
                    }
                });
            }
        }} className="dropdown-child-item">
            {Array.isArray(result.title) ? result.title.map(title => <p className="dropdown-child-title">{title}</p>) : <p className="dropdown-child-title">{result.title}</p>}
        </div>)}
    </div>
}

const SearchDropdownField: FC<{searchField: JAC.SearchField, index: number}> = (props) => {
    const [, setConfig] = useConfigState();
    const [dynamicDropdownParent, setDynamicDropdownParent] = useState<JAC.SearchResult[]>([]);
    const [searching, setSearching] = useState<boolean>(false);
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

    return <div className="search-dropdown">
        <input type="text" placeholder={searchField.placeholder ?? "Search"}
            value={searchField.value || ""}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={(e) => {
                if (e.key === 'Enter' && !searching) {
                    setSearching(true);
                    fetchFromFileMaker(searchField.script!, {
                        searchField, searchValue: searchField.value, index
                    }, undefined, true).then((result) => {
                        setSearching(false);
                        if (result) setDynamicDropdownParent(result as JAC.SearchResult[]);
                    });
        
                }
            }}
        />
        <SearchDropdownItems dynamicDropdownParent={dynamicDropdownParent} />
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
            <SearchDropdownField searchField={searchField} index={index} />
        </Collapse> : <SearchDropdownField searchField={searchField} index={index} />}
    </>
}

export default SearchDynamicDropdown;