import Collapse from "./Collapse";
import { useConfigState } from "@context/Config";
import calculateContrast from "@utils/contrast";
import performScript from "@utils/performScript";

import Padlock from "jsx:@svg/padlock.svg";
import Crossmark from "jsx:@svg/crossmark.svg";
import Checkmark from "jsx:@svg/checkmark.svg";

const SourceFilters: FC = () => {
    const [config, setConfig] = useConfigState();
    
    if (!config?.sourceFilters) return null

    const toggleFilter = (filter: JAC.SourceFilter) => {
        if (filter.clientOnly) {
            return setConfig(prev => {
                const newFilters = prev?.sourceFilters?.map(f => {
                    if (f.id === filter.id) {
                        f.enabled = !f.enabled;
                    }
                    return f;
                });

                return {
                    ...prev, 
                    sourceFilters: newFilters,
                    events: [...config.events || []]
                } as JAC.Config;
            });
        }

        performScript("onSourceFilterChange", {
            ...filter,
            enabled: !filter.enabled || false
        });
    }

    return <div>
        <div className="divider" />
        <Collapse top={<>
            <div>{config.translations?.sourceHeader ?? "Filters"}</div>
        </>}
        collapsed={!config.sourceFiltersOpenDefault}>
            {config.sourceFilters.map(filter => {
                const notEnoughContrast = !calculateContrast(filter.color || "#3788d8", undefined /*Maybe add actual background later*/, config.contrastMin) && config.contrastCheck !== false;
                
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
                </div>)
            })}
        </Collapse>
    </div>
}

export default SourceFilters;