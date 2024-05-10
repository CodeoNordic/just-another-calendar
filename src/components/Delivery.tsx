import { useEffect, useState } from 'react';
import { useConfig } from '@context/Config';

import performScript from '@utils/performScript';

// Import SVG icons
import ProfileIcon from 'jsx:@svg/profile.svg';
import ClockIcon from 'jsx:@svg/clock.svg';
import ArrowIcon from 'jsx:@svg/arrow.svg';
import LightningIcon from 'jsx:@svg/lightning.svg';

import clamp from '@utils/clamp';

const tooltipPadding = 20;

const Delivery: FC<FM.DeliveryRecord> = props => {
    const config = useConfig();
    const selectable = config?.selectableTooltips;

    const [hoverPos, setHoverPos] = useState<{ x: number; y: number }|null>(null);
    const [tooltipHover, setTooltipHover] = useState<boolean>(false);

    const [buttonHover, setButtonHover] = useState<boolean>(false);
    useEffect(() => {
        if (buttonHover) setHoverPos(null);
    }, [buttonHover]);

    // The namespace NodeJS is not defined in Parcel
    const [, setHoverTimeout] = useState<any>(null);
    
    // Timeout system to determine if the tooltip should be displayed
    useEffect(() => {
        if (!props.tooltip || tooltipHover) return;

        if (!hoverPos || buttonHover) {
            document.querySelector('#tooltip')?.remove();
            setHoverTimeout((prev: any) => {
                prev && clearTimeout(prev);
                return null;
            });

            setTooltipHover(false);
        }

        else setHoverTimeout((prev: any) => {
            if (prev) clearTimeout(prev);

            return setTimeout(() => {
                if (document.querySelector('#tooltip')) return;
                
                const el = document.createElement('div');

                // The element has to be rendered before accessing the width/height
                document.body.appendChild(el);

                el.id = 'tooltip';

                // Sanitize the input
                el.innerHTML = props.tooltip!
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

                el.style.color = props.colors?.tooltipText || '#000';
                el.style.backgroundColor = props.colors?.tooltipBackground || '#FFF';
                el.style.borderColor = props.colors?.tooltipBorder || props.colors?.border || '#000';
                el.style.userSelect = selectable? 'text': 'none';

                // Default colors in case text is invisible
                if (el.style.color === el.style.backgroundColor) {
                    el.style.color = '#000';
                    el.style.backgroundColor = '#fff';
                }

                el.addEventListener('mouseenter', () => setTooltipHover(true));
                el.addEventListener('mouseleave', () => setTooltipHover(false));
            }, 250);
        })

        return () => setHoverTimeout((prev: any) => {
            prev && clearTimeout(prev);
            return null;
        });
    }, [
        selectable,
        tooltipHover,
        buttonHover,
        props.tooltip,
        props.colors?.tooltipBackground,
        props.colors?.tooltipText,
        props.colors?.tooltipBorder,
        hoverPos
    ]);

    return <div
        className="delivery"
        onPointerMove={ev => setHoverPos({ x: ev.clientX, y: ev.clientY })}
        onPointerLeave={() => setHoverPos(null)}
    >
        <div className="top" style={{ color: props.colors?.date }}>
            <ClockIcon />
            <span className='date'>{props.dateFinishedDisplay}</span>

            {Boolean(props.isUrgent) && <LightningIcon style={{ color: props.colors?.urgentIcon ?? '#D90B00' }} />}
            {props.responsibleNextTaskInitials && <span className="user-initials">{props.responsibleNextTaskInitials}</span>}
        </div>
        
        <div className="summary"> 
            <button
                className="order-button"
                onClick={() => {performScript('openOrder', props.orderId)}}
                onPointerMove={() => setButtonHover(true)}
                onPointerLeave={() => setButtonHover(false)}
            >
                <p className="order-text">
                    <strong>{props.orderNumber}</strong> - {props.nomenklatur}
                </p>
                
                <ArrowIcon />
            </button>
            <p>{props.orderCategory}</p>
        </div>
        
        {props.responsibleNextTask && <div className="coworker">
            <p>{props.responsibleNextTask}</p>
        </div>}
        
        <button
            className="patient"
            onClick={() => performScript('openPatient', props.patientId)}
            style={{ color: props.colors?.patient }}
            onPointerMove={() => setButtonHover(true)}
            onPointerLeave={() => setButtonHover(false)}
        >
            <ProfileIcon />

            <p>{props.patientFullName}</p>
        </button>
    </div>
}

export default Delivery;