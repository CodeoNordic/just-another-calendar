import { useRef, createContext, useContext, useState } from 'react'

import { useConfig } from '@context/Config';
import performScript from '@utils/performScript';

import combineClasses from '@utils/combineClasses';
import Icon from '@components/Icon';

interface Dropdown {
    eventId: string|null;
    visible: boolean;
    x: number;
    y: number;
    buttons: JAC.EventButton[];
}

const defaultState: Dropdown = {
    eventId: null,
    visible: false,
    x: 0,
    y: 0,
    buttons: [],
};

const DropdownContext = createContext<State<Dropdown>>([defaultState, ()=> {}]);
export const useEventDropdown = () => useContext(DropdownContext);

const EventDropdownProvider: FC = props => {
    const config = useConfig();

    const [dropdown, setDropdown] = useState<Dropdown>(defaultState);
    const [dropdownHover, setDropdownHover] = useState<boolean>(false);

    const divRef = useRef<HTMLDivElement|null>(null);

    return <>
        <div className="event-dropdown" ref={divRef} style={{
            // Do not display if no buttons are defined
            display: ((dropdown.visible || dropdownHover) && !!dropdown.buttons?.length)? 'block': 'none',
            position: 'fixed',
            top: dropdown.y,
            left: dropdown.x
        }} onPointerEnter={() => setDropdownHover(true)} onPointerLeave={() => setDropdownHover(false)}>
            <div className={combineClasses('dropdown-buttons', `child-count-${dropdown.buttons?.length ?? 0}`)}>
                {dropdown.buttons.map((btn, i) => <button key={i} onClick={btn.script? (() => {
                    performScript(
                        btn.script!,
                        config?.records?.find(r => r.id === dropdown.eventId),
                        undefined,
                        true
                    );
                }): undefined}>
                    {btn.icon && <Icon src={btn.icon} />}
                </button>)}
            </div>
        </div>

        <DropdownContext.Provider value={[dropdown, setDropdown]}>
            {props.children}
        </DropdownContext.Provider>
    </>
}

export default EventDropdownProvider;