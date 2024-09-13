import { useConfigState } from "@context/Config";
import Collapse from "./Collapse";

const Search: FC = () => {
    const [config, setConfig] = useConfigState();

    if (!config?.searchBy) return null;

    return <div>
        <div className="divider" />
        <Collapse top={<>
            <div>{config.translations?.searchHeader ?? "Search"}</div>
        </>}
        collapsed={!config.searchOpenDefault}>
            <input type="text" placeholder={config.translations?.searchPlaceholder ?? "Search"}
                value={config.search || ""}
                onChange={e => {
                    setConfig((prev: JAC.Config | null) => ({...prev, search: e.target.value, events: [...config.events]}) as JAC.Config)
                }}
            />
        </Collapse>
    </div>
}

export default Search;