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
                value={config?.search || ""}
                onChange={e => {
                    setConfig((prev: JAC.Config | null) => ({...prev, search: e.target.value, records: [...config.records]}) as JAC.Config)
                }}
            />
        </Collapse>
    </div>
}

export default Search;