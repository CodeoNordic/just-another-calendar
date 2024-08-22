import { useConfigState } from "@context/Config";
import Collapse from "./Collapse";
import performScript from "@utils/performScript";

const EventFilters: FC = () => {
    const [config, setConfig] = useConfigState();

    const toggleFilter = (filter: JAC.EventFilter) => {
        if (filter.clientOnly) {
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

            config?.records.map((record => {
                if (record.statusId === filter.id) {
                    window.updateRecord(record, record, record.id);
                }
            }))

            return;
        }

        performScript("onFilterChange", {
            ...filter,
            enabled: !filter.enabled || false
        });
    }

    if (config?.eventFilters && config.eventFilters[0]?.sort !== undefined) {
        config.eventFilters.sort((a, b) => (a.sort !== undefined && b.sort !== undefined) ? a.sort - b.sort : 0);
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