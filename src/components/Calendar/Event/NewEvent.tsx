import { useConfigState } from '@context/Config';
import Crossmark from 'jsx:@assets/svg/crossmark.svg';
import Checkmark from 'jsx:@assets/svg/checkmark.svg';
import get from 'lodash.get';
import set from 'lodash.set';
import performScript from '@utils/performScript';
import React, { useEffect, useRef, useState } from 'react';


interface NewEventProps {
    creatingState: State<boolean>;
    eventState: State<JAC.Event|null>;
    pos: { x: number, y: number } | null;
}

const NewEvent: FC<NewEventProps> = props => {
    const [creatingEvent, setCreatingEvent] = props.creatingState;
    const [newEvent, setNewEvent] = props.eventState;
    const eventRef = useRef<HTMLDivElement>(null);
    
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const [position, setPosition] = useState<{ x: number, y: number }>(props.pos || { x: 0, y: 0 });

    const [config, setConfig] = useConfigState();

    useEffect(() => {
        if (eventRef.current) {
            const element = eventRef.current;
            const rect = element.getBoundingClientRect();
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;

            let top = props.pos?.y || 0;
            let left = props.pos?.x || 0;

            // Adjust top
            if (top + rect.height > viewportHeight) {
                top = top - rect.height;
            }

            // Adjust left
            if (left + rect.width > viewportWidth) {
                left = left - rect.width;
            }

            setPosition({ x: left, y: top });
        }
    }, [props.pos]);

    const handleMouseDown = (e: React.MouseEvent) => {
        if (eventRef.current) {
            const rect = eventRef.current.getBoundingClientRect();
            setDragOffset({
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
            });
            setIsDragging(true);
        }
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (isDragging && eventRef.current) {
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;

            let top = e.clientY - dragOffset.y;
            let left = e.clientX - dragOffset.x;

            const rect = eventRef.current.getBoundingClientRect();

            if (top < 0) top = 0;
            if (left < 0) left = 0;
            if (top + rect.height > viewportHeight) top = viewportHeight - rect.height;
            if (left + rect.width > viewportWidth) left = viewportWidth - rect.width;

            setPosition({ x: left, y: top });
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    useEffect(() => {
        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        } else {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging]);

    if (!creatingEvent) return null;

    const fcEl = document.querySelector('.fc-timegrid-bg-harness') as HTMLElement;
    const fcElParent = fcEl?.parentElement;

    
    if (fcEl && !fcElParent?.querySelector('.calendar-highlight')) {
        const el = document.createElement('div');
        el.className = 'calendar-highlight';
        el.style.zIndex = '100';
        el.style.background = 'rgba(188, 232, 241, .3)';
        el.style.position = 'absolute';
        el.style.top = fcEl.style.top;
        el.style.bottom = fcEl.style.bottom;
        el.style.left = "0px";
        el.style.right = "0px";
        el.style.overflow = 'hidden';
        fcElParent?.appendChild(el);
    }

    return <div ref={eventRef} className='create-event' style={{
            top: position.y,
            left: position.x
        }}>
            <div className='inputs-wrapper'>
                <div 
                    className='top-inputs' 
                    style={{
                        cursor: "grab",
                        background: newEvent?.colors?.background || "#3788d8"
                    }}
                    onMouseDown={handleMouseDown}>
                    <Crossmark 
                        className='icon' 
                        onClick={() => {
                            setCreatingEvent(false)
                            document.querySelector('.calendar-highlight')?.remove()
                    }}/>
                </div>
                <div className='body-inputs'>
                    <p className='title-inputs'>{config?.translations?.eventCreationHeader ?? "New Event"}</p>
                    {config?.newEventFields?.map(value => (
                        <div key={value.field} className='input-wrapper'>
                            <p>{value.title ?? value.field}</p>
                            {value.type === "dropdown" ? <select 
                                className='dropdown-input'
                                value={get(newEvent as JAC.Event, value.field) || ""} 
                                onChange={e => {
                                    const newEventCopy = {...newEvent};
                                    set(newEventCopy, value.field, e.target.value);
                                    setNewEvent(newEventCopy as JAC.Event);
                                }}
                            >
                                {value.dropdownItems?.map(item => {
                                    return typeof item === "string" ? <option key={item} value={item}>{item}</option> : <option key={item.value} value={item.value}>{item.label}</option>;
                                })}
                            </select>
                            : <input 
                                lang={config?.locale ?? "en"}
                                type={value.type ?? "string"} 
                                className={value.type ? `${value.type}-input` : "string-input"}
                                value={value.type === "time" 
                                    ? get(newEvent as JAC.Event, value.field)?.toString().split("T")[1] || ""
                                    : get(newEvent as JAC.Event, value.field) || ""}
                                placeholder={value.placeholder ?? ""}     
                                onChange={e => {
                                    let inputValue = e.target.value as string | number | boolean;
                                    if (e.target.type === "checkbox") {
                                        inputValue = e.target.checked;
                                    } else if (e.target.type === "time") {
                                        const datePart = get(newEvent as JAC.Event, value.field)?.toString().split("T")[0] || "";
                                        inputValue = `${datePart}T${e.target.value}`;
                                    }
                                    const newEventCopy = {...newEvent};
                                    set(newEventCopy, value.field, inputValue);
                                    setNewEvent({...newEventCopy} as JAC.Event);
                                }} 
                            />}
                        </div>
                    ))}
                </div>
            </div>
            <div className='buttons-wrapper'>
                <button onClick={() => {
                    document.querySelector('.calendar-highlight')?.remove();
                    setCreatingEvent(false);
                    setNewEvent(null);
                }}><Crossmark className='icon'/>{config?.translations?.eventCreationCancel ?? "Discard"}</button>
                <button onClick={() => {
                    setConfig((prev: JAC.Config | null) => ({...prev, events: [...config!.events, newEvent]} as JAC.Config));
                    config?.scriptNames.createEvent && performScript(config?.scriptNames.eventCreated as string, newEvent);
                    document.querySelector('.calendar-highlight')?.remove();
                    setCreatingEvent(false);
                    setNewEvent(null);
                }}><Checkmark className='icon'/>{config?.translations?.eventCreationConfirm ?? "Save"}</button>
            </div>
        </div>
}

export default NewEvent;