import { useRef, createContext, useContext, useState, useEffect, useCallback } from 'react'

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

const DropdownContext = createContext<(v: boolean|((d: Dropdown) => Dropdown)) => void>(()=> {});
export const useEventDropdown = () => useContext(DropdownContext);

const EventDropdownProvider: FC = props => {
    const config = useConfig();

    const [dropdown, setDropdown] = useState<Dropdown>(defaultState);
    const [dropdownHover, setDropdownHover] = useState<boolean>(false);

    const divRef = useRef<HTMLDivElement|null>(null);

    const setVisibleCallback = useCallback((v: boolean|((d: Dropdown) => Dropdown)) => {
        setDropdown(prev => (typeof v === 'boolean')? {
            ...prev,
            visible: v
        }: v(prev));
    }, []);

    useEffect(() => {
        const listener = () => {
            dropdown?.visible && setDropdown(prev => ({
                ...prev,
                visible: false
            }));
        }

        window.addEventListener('scroll', listener, true);
        return () => window.removeEventListener('scroll', listener);
    }, [dropdown.visible]);

    // Set invisible when config changes
    useEffect(() => {
        setDropdown(prev => ({
            ...prev,
            visible: false
        }))
    }, [config]);

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
                        config?.events?.find(r => r.id === dropdown.eventId),
                        undefined,
                        true
                    );
                }): undefined}>
                    {btn.icon && <Icon src={btn.icon} />}
                </button>)}
            </div>
        </div>

        {/* TODO pass callback to prevent renders (add usecallback) */}
        <DropdownContext.Provider value={setVisibleCallback}>
            {props.children}
        </DropdownContext.Provider>
    </>
}

export default EventDropdownProvider;