import { Fragment } from "react";

import Collapse from "./Collapse";
import { useConfigState } from "@context/Config";
import calculateContrast from "@utils/contrast";
import performScript from "@utils/performScript";

import Padlock from "jsx:@svg/padlock.svg";
import Checkmark from "jsx:@svg/checkmark.svg";
import Crossmark from "jsx:@svg/crossmark.svg";

const EventFilter: FC<JAC.Area & {filters: JAC.EventFilter[]; index?: number}> = props => {
    const [config, setConfig] = useConfigState();
    if (!config) return null;

    const toggleFilter = (filter: JAC.EventFilter) => {
        const { _initialIndex, enabled, ...rest } = filter;

        const param = {
            ...rest,
            index: _initialIndex,
            enabled: !enabled || false
        }

        // priority is script from filter > script from config > client side toggle
        if (filter.script) {
            performScript(filter.script, param);
        } else if (config.scriptNames.onEventFilterChange){
            performScript("onEventFilterChange", param);
        } else {
            setConfig(prev => {
                const newFilters = prev?.eventFilters?.map(f => {
                    // Same object reference
                    if (filter === f) {
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

    return <Collapse top={<>
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

            return <Fragment key={index}>
                <div 
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
            </Fragment>
        })}
    </Collapse>
}

export default EventFilter;