import { useConfigState } from "@context/Config";
import Collapse from "./Collapse";
import performScript from "@utils/performScript";

import { warn } from '@utils/log';
import fetchFromFileMaker from "@utils/fetchFromFilemaker";
import { useState } from "react";

const SearchDropdownItems: FC<{dynamicDropdownParent: JAC.SearchResult[]}> = (props) => {
    const [dynamicDropdowns, setDynamicDropdowns] = useState<(JAC.SearchResult & { parent?: { first: number, second: number } })[][]>([props.dynamicDropdownParent]);
    const [active, setActive] = useState<number>(0);

    return <div>
        {dynamicDropdowns[active].map((result, i) => <div key={i} onClick={() => {
            if (result.script) performScript(result.script);
            else if (result.dynamicDropdown && result.script) {
                fetchFromFileMaker(result.script, result).then((value) => {
                    const result = value as JAC.SearchResult[];
                    if (result) {
                        setDynamicDropdowns([...dynamicDropdowns, result.map((r) => ({ ...r, parent: { first: active, second: i } }))]);
                        setActive(dynamicDropdowns.length);
                    }
                });
            }
        }}>
            {result.parent && <div><div onClick={() => setActive(result.parent?.first!)}>{"<"}</div>{dynamicDropdowns[result.parent.first]?.[result.parent.second]?.title?.[0] || dynamicDropdowns[result.parent.first]?.[result.parent.second]?.title}</div>}
            <div>{Array.isArray(result.title) ? result.title.map(title => <div>{title}</div>) : result.title}</div>
        </div>)}
    </div>
}

const SearchDropdownField: FC<{searchField: JAC.SearchField, index: number}> = (props) => {
    const [, setConfig] = useConfigState();
    const [dynamicDropdownParent, setDynamicDropdownParent] = useState<JAC.SearchResult[]>([]);
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
            fetchFromFileMaker(searchField.script!, {
                searchField, searchValue: searchField.value, index
            }).then((result) => {
                setDynamicDropdownParent(result as JAC.SearchResult[]);
            });

        }
    });

    return <div>
        <input id="search-dynamic-input" type="text" placeholder={searchField.placeholder ?? "Search"}
            value={searchField.value || ""}
            onChange={e => setSearch(e.target.value)}
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