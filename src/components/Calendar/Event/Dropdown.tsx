import { useEffect, useRef, createContext, useContext, useState, useCallback } from 'react'

// Import icons
import ArrivedIcon from 'jsx:@svg/checkmark.svg';
import LateIcon from 'jsx:@svg/clock.svg';
import DidNotArriveIcon from 'jsx:@svg/minus.svg';
import CheckoutIcon from 'jsx:@svg/checkout.svg';

import combineClasses from '@utils/combineClasses';

export interface DropdownButton {
    icon: 'arrived'|'late'|'didNotArrive'|'checkout',
    onClick: () => void;
}

interface Dropdown {
    eventId: string|null;
    visible: boolean;
    x: number;
    y: number;
    buttons: DropdownButton[];
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
    const [dropdown, setDropdown] = useState<Dropdown>(defaultState);
    const [dropdownHover, setDropdownHover] = useState<boolean>(false);

    const divRef = useRef<HTMLDivElement|null>(null);

    return <>
        <div className="event-dropdown" ref={divRef} style={{
            display: ((dropdown.visible || dropdownHover) && !!dropdown.buttons?.length)? 'block': 'none',
            position: 'fixed',
            top: dropdown.y,
            left: dropdown.x
        }} onPointerEnter={() => setDropdownHover(true)} onPointerLeave={() => setDropdownHover(false)}>
            <div className={combineClasses('dropdown-buttons', `child-count-${dropdown.buttons?.length ?? 0}`)}>
                {dropdown.buttons.map((btn, i) => <button key={i} onClick={btn.onClick}>
                    {btn.icon === 'arrived'
                        ? <ArrivedIcon />
                    :btn.icon === 'late'
                        ? <LateIcon />
                    :btn.icon === 'didNotArrive'
                        ? <DidNotArriveIcon />
                    : <CheckoutIcon />}
                </button>)}
            </div>
        </div>

        <DropdownContext.Provider value={[dropdown, setDropdown]}>
            {props.children}
        </DropdownContext.Provider>
    </>
}

export default EventDropdownProvider;