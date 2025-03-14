import { useRef, createContext, useContext, useState, useMemo, useEffect, useCallback } from 'react';

import { useConfig } from '@context/Config';
import clamp from '@utils/clamp';

interface Tooltip {
    eventId: string|null;
    visible: boolean;
    x: number;
    y: number;
    event: JAC.Event|null;
    eventDiv: HTMLDivElement|null;
    onPointerMove(e: React.PointerEvent<HTMLDivElement>, event: JAC.Event): void;
    onPointerLeave(): void;
    onButtonEnter(): void;
    onButtonLeave(): void;
}

const defaultState: Tooltip = {
    eventId: null,
    visible: false,
    x: 0,
    y: 0,
    event: null,
    eventDiv: null,
    onPointerMove: () => {},
    onPointerLeave: () => {},
    onButtonEnter: () => {},
    onButtonLeave: () => {}
};

const TooltipContext = createContext<State<Tooltip>>([defaultState, () => {}]);
export const useTooltip = () => useContext(TooltipContext);

const tooltipPadding = 20;

const TooltipProvider: FC = ({ children }) => {
    const divRef = useRef<HTMLDivElement|null>(null);

    const [eventHover, setEventHover] = useState<boolean>(false);
    const [tooltipHover, setTooltipHover] = useState<boolean>(false);
    const [buttonHover, setButtonHover] = useState<boolean>(false);

    const [mouseX, setMouseX] = useState<number>(0);
    const [mouseY, setMouseY] = useState<number>(0);

    const config = useConfig();
    const hoverTimeout = useRef<any>(null);

    const [tooltip, setTooltip] = useState<Tooltip>({
        eventId: null,
        visible: false,
        x: 0,
        y: 0,
        event: null,
        eventDiv: null,
        onButtonEnter: () => {
            setButtonHover(true);
            setTooltip(prev => ({ ...prev, visible: false }));
        },
        onButtonLeave: () => setButtonHover(false)
    } as Tooltip);

    const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number; }>({
        x: 0,
        y: 0
    });

    const onPointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>, event: JAC.Event) => {
        setTooltip(prev => ({
            ...prev,
            event,
            eventDiv: e.target as HTMLDivElement
        }));

        setTooltipPos({ x: e.clientX, y: e.clientY });
        setEventHover(true);

        hoverTimeout.current && clearTimeout(hoverTimeout.current);
    }, [divRef, hoverTimeout]);

    const onPointerLeave = useCallback(() => {
        setTooltip(prev => ({ ...prev, visible: false }));
        setEventHover(false);
    }, []);

    const cleanedText = useMemo(() => (tooltip.event?.tooltip
        ?.trim() ?? '')
        .replace(/\r/g, '\n'),
        [tooltip.event?.tooltip]
    );

    const textLines = useMemo(() => cleanedText
        .split(/(\n)/g),
        [cleanedText]
    );

    useEffect(() => {
        window.addEventListener('scroll', () => {
            tooltip?.visible && setTooltip(prev => ({
                ...prev,
                visible: false
            }));

            setEventHover(false);
            setTooltipHover(false);
        }, true);
    }, [tooltip.visible]);

    // Set invisible when config changes
    useEffect(() => {
        setTooltip(prev => ({
            ...prev,
            visible: false
        }));
    }, [config]);

    useEffect(() => {
        const listener = (e: MouseEvent) => {
            setMouseX(e.clientX || 0);
            setMouseY(e.clientY || 0);
        }

        window.addEventListener('mousemove', listener);
        return () => window.removeEventListener('mousemove', listener);
    }, []);

    useEffect(() => {
        const div = divRef.current;
        if (!div || !tooltip.eventDiv || !tooltip.visible) return;

        const maxX = window.innerWidth - div.offsetWidth - tooltipPadding;
        const maxY = window.innerHeight - div.offsetHeight - tooltipPadding;

        let left = clamp(tooltip.x + 1, tooltipPadding, maxX);
        let top = clamp(tooltip.y - div.clientHeight - 1, tooltipPadding, maxY);

        
        // If the tooltip goes over the mouse, move it to the bottom of the event (case: too high)
        if (divRef.current) {
            const width = divRef.current.clientWidth;
            const height = divRef.current.clientHeight;
            
            const minXPos = left - 1;
            const maxXPos = left + width;
            
            const minYPos = top + 1;
            const maxYPos = top + height;

            if (
                mouseX >= minXPos && mouseX <= maxXPos &&
                mouseY >= minYPos && mouseY <= maxYPos
            ) {
                const rect = tooltip.eventDiv.getBoundingClientRect();
                top = rect.top + rect.height;
            }
        }

        div.style.left = `${left}px`;
        div.style.top = `${top}px`;
    }, [divRef, tooltip.x, tooltip.y, tooltip.visible, tooltip.eventDiv, mouseX, mouseY]);

    useEffect(() => {
        hoverTimeout.current && clearTimeout(hoverTimeout.current);
        if ((!eventHover && !tooltipHover) || buttonHover || tooltipHover || tooltip.visible) return;

        hoverTimeout.current = setTimeout(() => {
            setTooltip(prev => ({
                ...prev,
                visible: true,
                x: tooltipPos.x,
                y: tooltipPos.y
            }));
        }, 250);
    }, [eventHover, tooltipHover, buttonHover, tooltipPos, tooltip.visible, hoverTimeout, textLines.length]);

    return <>
        {<div className="event-tooltip" ref={divRef} style={{
            // Do not display if the text is empty
            display: ((tooltip.visible || tooltipHover) && (cleanedText.length && textLines.length > 0) && !buttonHover)? 'block': 'none',
            position: 'fixed',
            color: tooltip?.event?.colors?.tooltipText || '#000',
            backgroundColor: tooltip?.event?.colors?.tooltipBackground || '#fff',
            borderColor: tooltip?.event?.colors?.tooltipBorder || '#000',
            userSelect: config?.selectableTooltips? 'text': 'none'
        }} onPointerEnter={() => setTooltipHover(true)} onPointerLeave={() => setTooltipHover(false)}>
            {textLines.map((line, i) => <div
                key={i}
                className={line === '---'? 'tooltip-divider': undefined}
            >
                {line === '---'? null: line}
            </div>)}
        </div>}

        <TooltipContext.Provider value={[{ ...tooltip, onPointerMove, onPointerLeave }, setTooltip]}>
            {children}
        </TooltipContext.Provider>
    </>
}

export default TooltipProvider;