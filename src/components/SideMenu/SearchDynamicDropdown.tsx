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
import { eventToFcEvent } from "@components/Calendar/mapEvents";
import { getAffectingFilters } from "@components/Calendar/filterEvents";

const SearchDropdownItems: FC<{dynamicDropdownParent: JAC.SearchResult[], noResults: string|undefined}> = (props) => {
    const [active, setActive] = useState<'parent'|'events'>('parent');
    const [previous, setPrevious] = useState<number>(0);
    const [error, setError] = useState<string | null>(null);
    const [config] = useConfigState();

    const [events, setEvents] = useState<JAC.Event[]>([]);
    const [eventClickScript, setEventClickScript] = useState<string | undefined>(undefined);
    const [eventShowScript, setEventShowScript] = useState<string | undefined>(undefined);
    const [searching, setSearching] = useState<boolean>(false);

    const eventList = useMemo(() => {
        return events.map(event => {
            const affectingFilters = getAffectingFilters(event, config!);
            event._affectingFilters = affectingFilters
            eventToFcEvent(event, config!);
            console.log(event);
            return event;
        });
    }, [events, config]);

    console.log(eventList);

    if (!props.dynamicDropdownParent.length) return <></>;

    return <div className="dropdown-child">
        {active == "events" && <div className="dropdown-child-header">
            <ChevronDown onClick={() => {
                setActive("parent");
                setError(null);    
            }} className="back-arrow"/>
            <p>{Array.isArray(props.dynamicDropdownParent[previous].title) 
                ? props.dynamicDropdownParent[previous].title?.[0] 
                : props.dynamicDropdownParent[previous].title}</p>
        </div>}
        {error ? <div className="search-error">{error}</div> :
        active == "parent" ? props.dynamicDropdownParent.map((result, i) => <div key={i} onClick={() => {
            if (result.script && !result.dynamicDropdown) performScript(result.script);
            else if (result.script && result.dynamicDropdown && !searching) {
                setSearching(true);
                fetchFromFileMaker(result.script, result, undefined, true, 30000).then((value: any) => {
                    if (value) {
                        setError(null);
                        setPrevious(i);
                        setActive("events");
                        setEvents(JSON.parse(value.EVNT_List));
                        setEventClickScript(value.Script_edit);
                        setEventShowScript(value.Script_show);
                    } else {
                        setError(props.noResults || 'No results found');
                        setPrevious(i);
                        setActive("events");
                    }
                    setSearching(false);
                }).catch((error) => {
                    console.error(error);
                    setError(props.noResults || 'No results found');
                    setSearching(false);
                });
            }
        }} className="dropdown-child-item">            
            <div>
                {Array.isArray(result.title) ? result.title.map(title => <p className="dropdown-child-title">{title}</p>) : <p className="dropdown-child-title">{result.title}</p>}
            </div>
            {(result.dynamicDropdown) && <ChevronDown className="forward-arrow" />}
        </div>) : eventList.map((event, i) => <div key={i} className="search-event" style={{
            border: `1px solid ${event.colors?.border || '#000'}`,
            backgroundColor: event.colors?.background || "#3788d8",
            color: (config?.contrastCheck !== false && !calculateContrast(event.colors?.text || "#fff", event.colors?.background || "#3788d8", config!.contrastMin)) ? 
                (calculateContrast("#000", event.colors?.background || "#3788d8", config!.contrastMin) ? "#000" : "#fff") : event.colors?.text
        }}>
            <div className="search-event-event">
                <div>{event.dateStart}</div>
                <Event {...event} />
            </div>
            <div className="search-event-icons">
                <ChevronDown className="arrow" onClick={() => eventClickScript && performScript(eventClickScript, { id: event.id, source: event.source }, undefined, true)} />
                <CalendarIcon className="calendar" onClick={() => eventShowScript && performScript(eventShowScript, { resources: event.resourceId, date: event.dateStart }, undefined, true)}/>
            </div>
        </div>)}
    </div>
}

const getDebugData = (): JAC.SearchResult[] => {
    const data: JAC.SearchResult[] = [
        {
            event: {
                id: '1',
                FirstName: "Joakim",
                Test: "TEST VALUE",
                ButtonText: "BUTTON",
                start: '2024-07-17T12:00',
                end: '2024-07-17T13:00',
                allDay: false,
                tooltip: 'TEST TOOLTIP JOAKIM',
                resourceId: '1F',
                filterId: ['filter1', 'source1'],
                colors: {
                    background: '#0000ff',
                    border: '#000000'
                }
            },
            script: "exampleScript1",
            dynamicDropdown: true,
        },
        {
            event: {
                id: '1',
                FirstName: "Joakim",
                Test: "TEST VALUE",
                ButtonText: "BUTTON",
                start: '2024-07-17T12:00',
                end: '2024-07-17T13:00',
                allDay: false,
                tooltip: 'TEST TOOLTIP JOAKIM',
                resourceId: '1F',
                filterId: ['filter1', 'source1'],
                colors: {
                    background: '#ff0000',
                    border: '#000000'
                }
            },
            script: "exampleScript2",
            dynamicDropdown: true,
        },
        {
            event: {
                id: '1',
                FirstName: "Joakim",
                Test: "TEST VALUE",
                ButtonText: "BUTTON",
                start: '2024-07-17T12:00',
                end: '2024-07-17T13:00',
                allDay: false,
                tooltip: 'TEST TOOLTIP JOAKIM',
                resourceId: '1F',
                filterId: ['filter1', 'source1'],
                colors: {
                    background: '#00ff00',
                    border: '#000000'
                }
            },
            script: "exampleScript3",
            dynamicDropdown: true,
        }
    ];

    // Shuffle the array
    for (let i = data.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [data[i], data[j]] = [data[j], data[i]];
    }

    // Select a random length for the array
    const randomLength = Math.floor(Math.random() * data.length) + 1;
    return data.slice(0, randomLength);
};

const SearchDropdownItemsNew: FC<{dynamicDropdownParent: JAC.SearchResult[], noResults: string|undefined}> = (props) => {
    const [error, setError] = useState<string | null>(null);
    const [config] = useConfigState();
    const [searching, setSearching] = useState<boolean>(false);
    const [children, setChildren] = useState<(JAC.SearchResult & { prevOuter?: number, prevInner?: number })[][]>([[]]);
    const [active, setActive] = useState<number>(0);

    const eventList = useMemo(() => {
        return children[active].map(child => {
            if (!child.event) {
                return null;
            }
            const affectingFilters = getAffectingFilters(child.event, config!);
            child.event._affectingFilters = affectingFilters
            console.log(eventToFcEvent(child.event, config!))
            return child.event;
        }).filter(event => event !== null);
    }, [children, active, config]);

    console.log(eventList);

    useEffect(() => {
        if (props.dynamicDropdownParent.length) {
            setChildren([props.dynamicDropdownParent]);
        }
    }, [props.dynamicDropdownParent]);
    
    const search = (searchResult: JAC.SearchResult, outer: number, inner: number) => {
        const result = getDebugData();
        setError(null);
        setChildren([...children, result.map((child) => ({ ...child, prevOuter: outer, prevInner: inner }))]);
        setActive(children.length); 
        if (1 == 1) return;

        if (searchResult.script && !searching) {
            if (searchResult.dynamicDropdown) {
                setSearching(true);
                fetchFromFileMaker(searchResult.script, searchResult, undefined, true, 30000).then((value: RSAny | null) => {
                    const result = value as JAC.SearchResult[] | null;
                    console.log(result);
                    if (result) {
                        setError(null);
                        setChildren([...children, result.map((child) => ({ ...child, outer, inner }))]);
                    } else {
                        setError(props.noResults || 'No results found');
                    }
                    setSearching(false);
                }).catch((error) => {
                    console.error(error);
                    setError(props.noResults || 'No results found');
                    setSearching(false);
                })
            } else performScript(searchResult.script)    
        }
    }

    if (!props.dynamicDropdownParent.length) return <></>;

    return <div className="dropdown-child">
        {active !== 0 && (
            <div className="dropdown-child-header">
                <ChevronDown onClick={() => {
                    setActive(children[active][0].prevOuter!);
                    setError(null);
                }} className="back-arrow" />
                <p>{Array.isArray(children[children[active][0].prevOuter!][children[active][0].prevInner!].title)
                    ? children[children[active][0].prevOuter!][children[active][0].prevInner!].title?.[0]
                    : children[children[active][0].prevOuter!][children[active][0].prevInner!].title}</p>
            </div>
        )}
        {error ? <div className="search-error">{error}</div> : eventList.length ? eventList.map((event, i) => <div key={i} className="search-event" style={{
            border: `1px solid ${event.colors?.border || '#000'}`,
            backgroundColor: event.colors?.background || "#3788d8",
            color: (config?.contrastCheck !== false && !calculateContrast(event.colors?.text || "#fff", event.colors?.background || "#3788d8", config!.contrastMin)) ?
                (calculateContrast("#000", event.colors?.background || "#3788d8", config!.contrastMin) ? "#000" : "#fff") : event.colors?.text
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
        const result = getDebugData();
        setDynamicDropdownParent(result);
        setError(null);
        if (1 == 1) return;

        if (!searching && searchField.value && searchField.value.length > 2) {
            setSearching(true);
            fetchFromFileMaker(searchField.script!, {
                searchField, searchValue: searchField.value, index
            }, undefined, true, 30000).then((result) => {
                if (result) {
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
            <SearchDropdownItemsNew dynamicDropdownParent={dynamicDropdownParent} noResults={searchField.noResults} />
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