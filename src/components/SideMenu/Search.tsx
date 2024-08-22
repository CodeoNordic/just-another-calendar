import { useConfigState } from "@context/Config";
import Collapse from "./Collapse";

const Search: FC = () => {
    const [config, setConfig] = useConfigState();

    if (!config?.searchBy) return null;

    return <div>
        <Collapse top={<>
            <div>Søk</div>
        </>}>
            <input type="text" placeholder="Søk"
                value={config?.search}
                onChange={e => {
                    setConfig((prev: JAC.Config | null) => ({...prev, search: e.target.value}) as JAC.Config)
                    config?.records.map((record => {
                        window.updateRecord(record, record, record.id);
                    }))                    
                }}
            />
        </Collapse>
    </div>
}

export default Search;