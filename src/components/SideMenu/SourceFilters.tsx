import { useConfigState } from "@context/Config";
import Collapse from "./Collapse";


const SourceFilters: FC = () => {
    const [config, setConfig] = useConfigState();

    if (!config?.sourceFilters) return null

    return <div>
        <div className="divider" />
        <Collapse top={<>
            <div>{config?.translations?.sourceHeader ?? "Filters"}</div>
        </>}>
            {
                
            }
        </Collapse>
    </div>
}

export default SourceFilters;