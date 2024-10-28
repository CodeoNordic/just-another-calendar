import { useConfigState } from "@context/Config";
import Collapse from "./Collapse";
import performScript from "@utils/performScript";

import { warn } from '@utils/log';
import fetchFromFileMaker from "@utils/fetchFromFilemaker";
import { useMemo, useState } from "react";
import ChevronDown from 'jsx:@svg/chevron-down.svg';
import CalendarIcon from 'jsx:@svg/calendar.svg';
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

    const eventList = useMemo(() => {
        return events.map(event => {
            const affectingFilters = getAffectingFilters(event, config!);
            event._affectingFilters = affectingFilters
            eventToFcEvent(event, config!);
            return event;
        });
    }, [events, config]);

    if (!props.dynamicDropdownParent.length) return <></>;

    return <div className="dropdown-child">
        {active == "events" && <div className="dropdown-child-header">
            <ChevronDown onClick={() => {
                setActive("parent")
                setError(null);    
            }} className="back-arrow"/>
            <p>{Array.isArray(props.dynamicDropdownParent[previous].title) 
                ? props.dynamicDropdownParent[previous].title?.[0] 
                : props.dynamicDropdownParent[previous].title}</p>
        </div>}
        {error ? <div className="search-error">{error}</div> :
        active == "parent" ? props.dynamicDropdownParent.map((result, i) => <div key={i} onClick={() => {
            if (result.script && !result.dynamicDropdown) performScript(result.script);
            else if (result.script && result.dynamicDropdown) {
                fetchFromFileMaker(result.script, result, undefined, true, 30000).then((value) => {
                    const result = value as any;
                    if (result && result.Status) {
                        setError(null);
                        setPrevious(i);
                        setActive("events");
                        setEvents(JSON.parse(result.EVNT_List));
                        setEventClickScript(result.Script_edit);
                        setEventShowScript(result.Script_show);
                    } else {
                        setError(props.noResults || 'No results found');
                        setPrevious(i);
                        setActive("events");
                    }
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

    return <div className="search-dropdown">
        <input type="text" placeholder={searchField.placeholder ?? "Search"}
            value={searchField.value || ""}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={(e) => {
                if (e.key === 'Enter' && !searching && (e.target as HTMLInputElement).value.length > 2) {
                    setSearching(true);
                    fetchFromFileMaker(searchField.script!, {
                        searchField, searchValue: searchField.value, index
                    }, undefined, true, 30000).then((result) => {
                        setSearching(false);
                        if (result) {
                            setDynamicDropdownParent(result as JAC.SearchResult[])
                            setError(null);
                        } else {
                            setDynamicDropdownParent([]);
                            setError(searchField.noResults || 'No results found');
                        }
                    }).catch((error) => {
                        console.error(error);
                        setDynamicDropdownParent([]);
                        setError(searchField.noResults || 'No results found');
                        setSearching(false);
                    });
                }
            }}
        />
        {error ? <div className="search-error">{error}</div>
        : <SearchDropdownItems dynamicDropdownParent={dynamicDropdownParent} noResults={searchField.noResults} />}
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