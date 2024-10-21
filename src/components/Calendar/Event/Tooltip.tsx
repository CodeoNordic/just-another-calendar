import { useRef, createContext, useContext, useState, useMemo, useEffect, useCallback } from 'react';

import { useConfig } from '@context/Config';
import clamp from '@utils/clamp';

interface Tooltip {
    eventId: string|null;
    visible: boolean;
    x: number;
    y: number;
    event: JAC.Event|null;
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

    const config = useConfig();
    const hoverTimeout = useRef<any>(null);

    const [tooltip, setTooltip] = useState<Tooltip>({
        eventId: null,
        visible: false,
        x: 0,
        y: 0,
        event: null,

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
            event
        }));

        setTooltipPos({ x: e.clientX, y: e.clientY });
        setEventHover(true);

        hoverTimeout.current && clearTimeout(hoverTimeout.current);
    }, [divRef, hoverTimeout]);

    const onPointerLeave = useCallback(() => {
        setTooltip(prev => ({ ...prev, visible: false }));
        setEventHover(false);
    }, []);

    const cleanedText = useMemo(() => tooltip.event?.tooltip
        ?.trim()
        .replace(/(^(\n?\r?))|((\n?\r?)$)/g, '') ?? '',
        [tooltip.event?.tooltip]
    );

    const textLines = useMemo(() => cleanedText
        .split(/\n\r?/g),
        [cleanedText]
    );

    useEffect(() => {
        window.addEventListener('scroll', () => setTooltip(prev => ({
            ...prev,
            visible: false
        })), true);
    }, []);

    useEffect(() => {
        const div = divRef.current;
        if (!div) return;

        const maxX = window.innerWidth - div.offsetWidth - tooltipPadding;
        const maxY = window.innerHeight - div.offsetHeight - tooltipPadding;

        div.style.left = `${clamp(tooltip.x + 1, tooltipPadding, maxX)}px`;
        div.style.top = `${clamp(tooltip.y - div.clientHeight - 1, tooltipPadding, maxY)}px`;
    }, [divRef, tooltip.x, tooltip.y]);

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
        <div className="event-tooltip" ref={divRef} style={{
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
        </div>

        <TooltipContext.Provider value={[{ ...tooltip, onPointerMove, onPointerLeave }, setTooltip]}>
            {children}
        </TooltipContext.Provider>
    </>
}

export default TooltipProvider;