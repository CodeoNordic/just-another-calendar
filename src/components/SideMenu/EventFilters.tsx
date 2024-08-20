import { useConfigState } from "@context/Config";
import Collapse from "./Collapse";
import performScript from "@utils/performScript";

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
                    eventFilters: newFilters
                } as JAC.Config;
            });
        }

        performScript("onFilterChange", {
            ...filter,
            enabled: !filter.enabled || false
        });
    }

    return <div>
        <Collapse top={<>
            <div>Filtre</div>
        </>}>
            {
                config?.eventFilters?.map((filter) => (
                    <div 
                        className="filter-item" 
                        key={filter.id}  
                        onClick={() => {
                            !filter.locked && toggleFilter(filter)}}
                        style={{backgroundColor: filter.enabled ? "lightgrey" : "inherit"}}
                    >
                        <div className="filter-color" style={{backgroundColor: filter.color ? filter.color : "#3788d8"}}></div>
                        {filter.title}
                        {filter.locked && <span className="lock-icon">🔒</span>}
                    </div>
                ))
            }
        </Collapse>
    </div>
}

export default EventFilters;