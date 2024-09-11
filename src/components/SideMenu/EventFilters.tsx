import { useMemo } from "react";

import Collapse from "./Collapse";
import { useConfigState } from "@context/Config";
import calculateContrast from "@utils/contrast";
import performScript from "@utils/performScript";

import Padlock from "jsx:@svg/padlock.svg";
import Checkmark from "jsx:@svg/checkmark.svg";
import Crossmark from "jsx:@svg/crossmark.svg";

const EventFilters: FC = () => {
    const [config, setConfig] = useConfigState();

    if (!config?.eventFilters) return null

    const toggleFilter = (filter: JAC.EventFilter) => {
        if (filter.clientOnly) {
            return setConfig(prev => {
                const newFilters = prev?.eventFilters?.map(f => {
                    if (f.id === filter.id) {
                        f.enabled = !f.enabled;
                    }
                    return f;
                });

                return {
                    ...prev, 
                    eventFilters: newFilters,
                    events: [...config.events]
                } as JAC.Config;
            });
        }

        performScript("onFilterChange", {
            ...filter,
            enabled: !filter.enabled || false
        });
    }

    const sortedFilters = useMemo(() => {
        const copy = [...config.eventFilters || []];
        copy.sort((a, b) => (a.sort || 0) - (b.sort || 0));
        return copy;
    }, [config.eventFilters]);

    return <div>
        <div className="divider" />
        <Collapse top={<>
            <div>{config.translations?.filtersHeader ?? "Filters"}</div>
        </>}
        collapsed={!config.eventFiltersOpenDefault}>
            {sortedFilters?.map((filter) => {
                const notEnoughContrast = !calculateContrast(filter.color || "#3788d8", undefined /*Maybe add actual background later*/, config.contrastMin) 
                    && config.contrastCheck !== false;

                return (<div 
                    className="filter-item" 
                    key={filter.id}  
                    onClick={() => !filter.locked && toggleFilter(filter)}
                    style={{
                        opacity: (filter.enabled && !filter.locked) ? 1 : 0.5,
                        cursor: filter.locked ? "not-allowed" : "pointer"
                    }}
                >
                    {filter.enabled ? 
                    <Checkmark className="filter-checkbox" style={{
                        backgroundColor: filter.color || "#3788d8",
                        border:  notEnoughContrast 
                            ? "1px solid #000" 
                            : `1px solid ${filter.color || "#3788d8"}`,   
                        fill: notEnoughContrast ? "#000" : "#fff"
                    }}/> :
                    <Crossmark className="filter-checkbox" style={{
                        backgroundColor: filter.color || "#3788d8",
                        border: notEnoughContrast 
                            ? "1px solid #000" 
                            : `1px solid ${filter.color || "#3788d8"}`,
                        fill: notEnoughContrast ? "#000" : "#fff"
                    }}/>}
                    
                    <p style={{
                        color: notEnoughContrast ? "#000" : filter.color || "#3788d8"
                    }}>{filter.title}</p>
                    {filter.locked && <Padlock className="filter-lock"/>}
                </div>
            )})}
        </Collapse>
    </div>
}

export default EventFilters;