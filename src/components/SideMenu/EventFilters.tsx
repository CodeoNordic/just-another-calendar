import { useMemo } from "react";

import Collapse from "./Collapse";
import { useConfigState } from "@context/Config";
import calculateContrast from "@utils/contrast";
import performScript from "@utils/performScript";

import Padlock from "jsx:@svg/padlock.svg";
import Checkmark from "jsx:@svg/checkmark.svg";
import Crossmark from "jsx:@svg/crossmark.svg";

const EventFilterArea: FC<{filters: JAC.EventFilter[], header?: string, openDefault?: boolean}> = props => {
    const [config, setConfig] = useConfigState();
    
    if (!config) return null

    const toggleFilter = (filter: JAC.EventFilter) => {
        // priority is script from filter > script from config > client side toggle
        if (filter.script) {
            performScript(filter.script, {
                ...filter,
                enabled: !filter.enabled || false
            });
        } else if (config.scriptNames.onEventFilterChange){
            performScript("onEventFilterChange", {
                ...filter,
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
        <div className="divider" /> 
        <Collapse top={<>
            <div>{props.header ?? "Filters"}</div>
        </>}
        collapsed={props.openDefault === false}>
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
    const [config, ] = useConfigState();

    if (!config?.eventFilters) return null

    const sortedFilters = useMemo(() => {
        const copy = [...(config.eventFilters || [])];
        copy.sort((a, b) => {
            const sortA = a.sort !== undefined ? a.sort : Infinity;
            const sortB = b.sort !== undefined ? b.sort : Infinity;
            return sortA - sortB;
        });
        return copy;
    }, [config.eventFilters]);

    return <div>        
        {config.eventFilterAreas && config.eventFilterAreas?.map((area) => 
            <EventFilterArea key={area.name} filters={sortedFilters?.filter((filter) => filter.areaName === area.name)} header={area.title || "Filter"} openDefault={area.openDefault}/>
        ) || <EventFilterArea filters={sortedFilters} />}
    </div>
}

export default EventFilters;