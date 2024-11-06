import { useConfigState } from "@context/Config";
import Collapse from "./Collapse";
import performScript from "@utils/performScript";

import { warn } from '@utils/log';
import fetchFromFileMaker from "@utils/fetchFromFilemaker";
import { useEffect, useMemo, useState } from "react";
import ChevronDown from 'jsx:@svg/chevron-down.svg';
import CalendarIcon from 'jsx:@svg/calendar.svg';
import Crossmark from 'jsx:@svg/crossmark.svg';
import SearchIcon from 'jsx:@svg/search.svg';
import Event from "@components/Calendar/Event";
import calculateContrast from "@utils/contrast";
import { getAffectingFilters } from "@components/Calendar/filterEvents";
import { eventToFcEvent } from "@components/Calendar/mapEvents";

const SearchDropdownItems: FC<{dynamicDropdownParent: JAC.SearchResult[], noResults: string|undefined}> = (props) => {
    const [error, setError] = useState<{message: string, prev: number} | null>(null);
    const [config] = useConfigState();
    const [searching, setSearching] = useState<boolean>(false);
    const [children, setChildren] = useState<(JAC.SearchResult & { prevOuter?: number, prevInner?: number })[][]>([[]]);
    const [active, setActive] = useState<number>(0);

    const eventList = useMemo(() => {
        return children[active].map(child => {
            if (!child.event) return null;
            
            child.event._affectingFilters = getAffectingFilters(child.event, config!);
            eventToFcEvent(child.event, config!);
            
            return child.event;
        }).filter(event => event !== null);
    }, [children, active, config]);

    useEffect(() => {
        props.dynamicDropdownParent.length && setChildren([props.dynamicDropdownParent]);
    }, [props.dynamicDropdownParent]);
    
    const search = (searchResult: JAC.SearchResult, outer: number, inner: number) => {
        if (!searchResult.script || searching) return;
        if (!searchResult.dynamicDropdown) return performScript(searchResult.script)
        
        setSearching(true);
        fetchFromFileMaker(searchResult.script, searchResult, undefined, true, 30000).then((value: RSAny | null) => {
            const result = value as JAC.SearchResult[] | null;
            if (result && result.length) {
                setError(null);
                setChildren([...children, result.map((child) => ({ ...child, prevOuter: outer, prevInner: inner }))]);
                setActive(children.length);
            } else {
                setError({message: props.noResults || 'No results found', prev: inner});
            }
            setSearching(false);
        }).catch((error) => {
            console.error(error);
            setError({message: props.noResults || 'No results found', prev: inner});
            setSearching(false);
        })
    }

    if (!props.dynamicDropdownParent.length) return <></>;

    return <div className="dropdown-child">
        {(active !== 0 || error) && (
            <div className="dropdown-child-header" style={{
                borderBottom: error ? '1px solid rgba(0, 0, 0, 0.3)' : 'none'
            }}>
                <ChevronDown onClick={() => {
                    !error && setActive(children[active][0].prevOuter!);
                    setError(null);
                }} className="back-arrow" />
                <p>{error 
                    ? (
                        (Array.isArray(children[active][error.prev].title) && children[active][error.prev].title?.length) 
                            ? children[active][error.prev].title![0] 
                            : children[active][error.prev].title
                    ) : (
                        Array.isArray(children[children[active][0].prevOuter!][children[active][0].prevInner!].title)
                            ? children[children[active][0].prevOuter!][children[active][0].prevInner!].title?.[0]
                            : children[children[active][0].prevOuter!][children[active][0].prevInner!].title
                    )}</p>
            </div>
        )}
        {error ? <div className="search-error">{error.message}</div> : eventList.length ? eventList.map((event, i) => <div key={i} className="search-event" style={{
            border: `1px solid ${event.colors?.border || '#000'}`,
            backgroundColor: event.colors?.background || "#3788d8",
            color: config?.contrastCheck !== false ? ( 
                calculateContrast(event.colors?.text || "#fff", event.colors?.background || "#3788d8", config?.contrastMin)
                    ? event.colors?.text || "#fff" 
                    : calculateContrast("#000", event.colors?.background || "#3788d8", config?.contrastMin) ? "#000" : "#fff"
            ) : event.colors?.text || "#fff"
        }}>
            <div className="search-event-event">
                <div>{event.dateStart}</div>
                <Event {...event} />
            </div>
            <div className="search-event-icons">
                {children[active][i].eventEdit && <ChevronDown className="arrow" onClick={() => performScript(children[active][i].eventEdit!, { id: event.id, source: event.source }, undefined, true)} />}
                {children[active][i].eventShow && <CalendarIcon className="calendar" onClick={() => performScript(children[active][i].eventShow!, { resources: event.resourceId, date: event.dateStart }, undefined, true)}/>}
            </div>
        </div>) : children[active].map((result, i) => <div key={i} onClick={() => search(result, active, i)} className="dropdown-child-item">
            <div>
                {Array.isArray(result.title) ? result.title.map((title, i) => <p key={i} className="dropdown-child-title">{title}</p>) : <p className="dropdown-child-title">{result.title}</p>}
            </div>
            {(result.dynamicDropdown) && <ChevronDown className="forward-arrow" />}
        </div>)}
    </div>
}

const SearchDropdownField: FC<{searchField: JAC.SearchField, index: number}> = (props) => {
    const [, setConfig] = useConfigState();
    const [dynamicDropdownParent, setDynamicDropdownParent] = useState<JAC.SearchResult[]>([]);
    const [searching, setSearching] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
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

    const search = () => {
        if (!searching && searchField.value && searchField.value.length > 2) {
            setSearching(true);
            fetchFromFileMaker(searchField.script!, {
                searchField, searchValue: searchField.value, index
            }, undefined, true, 30000).then((result) => {
                if (result && result.length) {
                    setDynamicDropdownParent(result as JAC.SearchResult[])
                    setError(null);
                } else {
                    setDynamicDropdownParent([]);
                    setError(searchField.noResults || 'No results found');
                }
                setSearching(false);
            }).catch((error) => {
                console.error(error);
                setDynamicDropdownParent([]);
                setError(searchField.noResults || 'No results found');
                setSearching(false);
            });
        }   
    }

    return <div className="search-dropdown">
        <div className="search-field">
            <input type="text" placeholder={searchField.placeholder ?? "Search"}
                value={searchField.value || ""}
                onChange={e => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && search()}
            />
            <SearchIcon onClick={() => search()} />
            {searchField.emptyButton !== false && <Crossmark onClick={() => {
                setSearch("");
                setDynamicDropdownParent([]);    
            }} />}
        </div>
        {searching ? (
            <p className="loading-anim">Loading<span>.</span><span>.</span><span>.</span></p>
        ) : error ? (
            <div className="search-error">{error}</div>
        ) : (
            <SearchDropdownItems dynamicDropdownParent={dynamicDropdownParent} noResults={searchField.noResults} />
        )}
    </div>
}

const SearchDynamicDropdown: FC<{searchField: JAC.SearchField, index: number}> = (props) => {
    if (!props.searchField.script) {
        warn('Script is required for dynamic search dropdown, will not be used.', props.searchField);
        return null;
    };
    
    return <>
        {props.searchField.title ? <Collapse className="search" top={<>
            <div>{props.searchField.title}</div>
        </>}
        collapsed={props.searchField.open === false}>
            <SearchDropdownField searchField={props.searchField} index={props.index} />
        </Collapse> : <SearchDropdownField searchField={props.searchField} index={props.index} />}
    </>
}

export default SearchDynamicDropdown;