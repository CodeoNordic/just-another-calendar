import { useMemo } from "react";

import Collapse from "./Collapse";
import { useConfig, useConfigState } from "@context/Config";
import calculateContrast from "@utils/contrast";
import performScript from "@utils/performScript";

import Padlock from "jsx:@svg/padlock.svg";
import Checkmark from "jsx:@svg/checkmark.svg";
import Crossmark from "jsx:@svg/crossmark.svg";

const EventFilterArea: FC<JAC.Area & {filters: JAC.EventFilter[]; index?: number}> = props => {
    const [config, setConfig] = useConfigState();
    if (!config) return null;

    const toggleFilter = (filter: JAC.EventFilter) => {
        const { _initialIndex, ...rest } = filter;

        // priority is script from filter > script from config > client side toggle
        if (filter.script) {
            performScript(filter.script, {
                ...filter,
                index: _initialIndex,
                enabled: !filter.enabled || false
            });
        } else if (config.scriptNames.onEventFilterChange){
            performScript("onEventFilterChange", {
                ...filter,
                index: _initialIndex,
                enabled: !filter.enabled || false
            });
        } else {
            setConfig(prev => {
                const newFilters = prev?.eventFilters?.map(f => {
                    if (f.id === filter.id) {
                        f.enabled = !f.enabled;
                    }
                    return f;
                });

                return {
                    ...prev, 
                    eventFilters: newFilters
                } as JAC.Config;
            });
        }
    }

    return <div>
        {!config!.datePickerDisabled && <div className="divider" />}
        <Collapse top={<>
            <div>{props.title ?? "Filters"}</div>
        </>}
        onChange={collapsed => {
            const param = {
                title: props.title,
                name: props.name,
                open: !collapsed,
                filters: props.filters,
                index: props.index
            };

            if (!collapsed && config!.scriptNames!.onEventFilterAreaOpened)
                performScript('onEventFilterAreaOpened', param);
            else if (collapsed && config!.scriptNames!.onEventFilterAreaClosed)
                performScript('onEventFilterAreaClosed', param);
        }}
        collapsed={props.open === false}>
            {props.filters?.map((filter, index) => {
                const notEnoughContrast = !calculateContrast(filter.color || "#3788d8", "#f5f5f5", config.contrastMin) 
                    && config.contrastCheck !== false;
                
                const iconStyles = {
                    backgroundColor: filter.color || "#3788d8",
                    border: notEnoughContrast 
                        ? "1px solid #000" 
                        : `1px solid ${filter.color || "#3788d8"}`,
                    fill: notEnoughContrast ? "#000" : "#fff"
                }

                if (filter.divider) return <div key={index} className="filter-divider" />;

                return (<div 
                    className="filter-item" 
                    key={index}  
                    onClick={() => !filter.locked && toggleFilter(filter)}
                    style={{
                        opacity: (filter.enabled && !filter.locked) ? 1 : 0.5,
                        cursor: filter.locked ? "not-allowed" : "pointer"
                    }}
                >
                    {filter.enabled ? 
                    <Checkmark className="filter-checkbox" style={iconStyles}/> :
                    <Crossmark className="filter-checkbox" style={iconStyles}/>}
                    
                    <p style={{
                        color: notEnoughContrast ? "#000" : filter.color || "#3788d8"
                    }}>{filter.title}</p>
                    {filter.locked && <Padlock className="filter-lock"/>}
                </div>
            )})}
        </Collapse>
    </div>
}

const EventFilters: FC = () => {
    const config = useConfig()!;

    const sortedFilters = useMemo(() => {
        if (!config.eventFilters) return null;

        return [...(config.eventFilters || [])]
            .map((f, i) => {
                f._initialIndex = i;
                return f;
            })
            .sort((a, b) => (a.sort || Infinity) - (b.sort || Infinity));
    }, [config.eventFilters]);

    const mappedAreas = useMemo<(JAC.Area & { filters: JAC.EventFilter[] })[]|null>(() => {
        if (!config.eventFilterAreas?.length || !sortedFilters?.length) return null;

        return config.eventFilterAreas.map(area => ({
            ...area,
            filters: sortedFilters.filter(f => f.areaName === area.name)
        })).filter(area => !!area.filters?.length);
    }, [config.eventFilterAreas, sortedFilters]);

    if (!sortedFilters?.length) return null;

    return <div>        
        {mappedAreas?.map((area, i) => 
            <EventFilterArea key={i} index={i} name={area.name} filters={area.filters} title={area.title || "Filter"} open={area.open}/>
        ) || <EventFilterArea index={0} name="default" title={config!.translations?.eventFiltersHeader ?? "Filters"} filters={sortedFilters} />}
    </div>
}

export default EventFilters;