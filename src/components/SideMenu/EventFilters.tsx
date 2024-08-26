import { useConfigState } from "@context/Config";
import Collapse from "./Collapse";
import performScript from "@utils/performScript";
import Checkmark from "jsx:@svg/checkmark.svg";
import Crossmark from "jsx:@svg/crossmark.svg";
import Padlock from "jsx:@svg/padlock.svg";
import calculateContrast from "@utils/contrast";
import { useMemo } from "react";

const EventFilters: FC = () => {
    const [config, setConfig] = useConfigState();

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
                    records: [...config?.records || []]
                } as JAC.Config;
            });
        }

        performScript("onFilterChange", {
            ...filter,
            enabled: !filter.enabled || false
        });
    }

    const sortedFilters = useMemo(() => {
        const copy = [...config?.eventFilters || []];
        copy.sort((a, b) => (a.sort || 0) - (b.sort || 0));
        return copy;
    }, [config?.eventFilters]);

    return <div>
        <Collapse top={<>
            <div>{config?.translations?.filtersHeader ?? "Filters"}</div>
        </>}>
            {
                sortedFilters?.map((filter) => (
                    <div 
                        className="filter-item" 
                        key={filter.id}  
                        onClick={!filter.locked ? () => {
                            toggleFilter(filter)} : undefined}
                        style={{
                            opacity: (filter.enabled && !filter.locked) ? 1 : 0.5,
                            cursor: filter.locked ? "not-allowed" : "pointer"
                        }}
                    >
                        {filter.enabled ? 
                        <Checkmark className="filter-checkbox" style={{
                            backgroundColor: filter.color || "#3788d8",
                            border:  (config?.contrastCheck !== false && !calculateContrast(filter.color || "#3788d8")) ? 
                                "1px solid #000" :
                                `1px solid ${filter.color || "#3788d8"}`,   
                            fill: (config?.contrastCheck !== false && !calculateContrast(filter.color || "#3788d8")) ? "#000" : "#fff"
                        }}/> :
                        <Crossmark className="filter-checkbox" style={{
                            backgroundColor: filter.color || "#3788d8",
                            border: (config?.contrastCheck !== false && !calculateContrast(filter.color || "#3788d8")) ? 
                                "1px solid #000" :
                                `1px solid ${filter.color || "#3788d8"}`,
                            fill: (config?.contrastCheck !== false && !calculateContrast(filter.color || "#3788d8")) ? "#000" : "#fff"
                        }}/>}
                        
                        <p style={{
                            color: (config?.contrastCheck !== false && !calculateContrast(filter.color || "#3788d8")) ? 
                                "#000" : filter.color || "#3788d8"
                        }}>{filter.title}</p>
                        {filter.locked && <Padlock className="filter-lock"/>}
                    </div>
                ))
            }
        </Collapse>
    </div>
}

export default EventFilters;