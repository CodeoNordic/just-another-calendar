import { useConfig } from '@context/Config';
import { useEffect, useRef, useState, PointerEvent } from 'react';

import clamp from '@utils/clamp';
const tooltipPadding = 20;

export default function useTooltip(tooltip?: string, colors?: JAC.Event['colors']) {
    const config = useConfig();
    const selectable = config?.selectableTooltips;

    const hoverTimeout = useRef<any>(null);

    const [hoverPos, setHoverPos] = useState<{ x: number; y: number }|null>(null);
    const [tooltipHover, setTooltipHover] = useState<boolean>(false);

    const [buttonHover, setButtonHover] = useState<boolean>(false);
    useEffect(() => {
        if (buttonHover) setHoverPos(null);
    }, [buttonHover]);

    useEffect(() => {
        if (!tooltip || (tooltip === '\\r') || /^\s+$/.test(tooltip) || tooltipHover) return;
        if (!hoverPos || buttonHover) {
            document.querySelector('#tooltip')?.remove();
            hoverTimeout.current && clearTimeout(hoverTimeout.current);

            setTooltipHover(false);
        }

        else {
            hoverTimeout.current && clearTimeout(hoverTimeout.current);

            hoverTimeout.current = setTimeout(() => {
                if (document.querySelector('#tooltip')) return;
                const el = document.createElement('div');

                // The element has to be rendered before accessing the width/height
                document.body.appendChild(el);

                el.id = 'tooltip';

                // Sanitize the input
                el.innerHTML = tooltip!
                    .trim()
                    .replace(/^<br>/, '')
                    .split(/<br>/)
                    .map(str => str.replace('<', '&lt;').replace('>', '&gt;'))
                    .join('<br>')
                
                const maxX = window.innerWidth - el.offsetWidth - tooltipPadding;
                const maxY = window.innerHeight - el.offsetHeight - tooltipPadding;

                el.style.position = 'fixed';
                el.style.left = `${clamp(hoverPos.x + 1, tooltipPadding, maxX)}px`
                el.style.top = `${clamp(hoverPos.y - el.clientHeight - 1, tooltipPadding, maxY)}px`;

                el.style.color = colors?.tooltipText || '#000';
                el.style.backgroundColor = colors?.tooltipBackground || '#FFF';
                el.style.borderColor = colors?.tooltipBorder || colors?.border || '#000';
                el.style.userSelect = selectable? 'text': 'none';

                // Default colors in case text is invisible
                if (el.style.color === el.style.backgroundColor) {
                    el.style.color = '#000';
                    el.style.backgroundColor = '#fff';
                }

                el.addEventListener('mouseenter', () => setTooltipHover(true));
                el.addEventListener('mouseleave', () => setTooltipHover(false));
            }, 250)
        }
    }, [
        tooltip,
        selectable,
        tooltipHover,
        buttonHover,
        colors,
        hoverPos
    ]);

    if (!tooltip) return {};
    return {
        onPointerMove: (e: PointerEvent<HTMLDivElement>) => setHoverPos({ x: e.clientX, y: e.clientY }),
        onPointerLeave: () => setHoverPos(null),

        onButtonEnter: () => setButtonHover(true),
        onButtonLeave: () => setButtonHover(false)
    }
}