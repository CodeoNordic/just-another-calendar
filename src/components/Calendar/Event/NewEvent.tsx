import { useConfigState } from '@context/Config';
import Crossmark from 'jsx:@assets/svg/crossmark.svg';
import Checkmark from 'jsx:@assets/svg/checkmark.svg';
import get from 'lodash.get';
import set from 'lodash.set';
import performScript from '@utils/performScript';
import React, { useEffect, useRef, useState } from 'react';
import { useCalendarRef } from '@context/CalendarRefProvider';
import dateFromString from '@utils/dateFromString';


interface NewEventProps {
    creatingState: State<boolean>;
    eventState: State<JAC.Event|null>;
}

const NewEvent: FC<NewEventProps> = props => {
    const [creatingEvent, setCreatingEvent] = props.creatingState;
    const [newEvent, setNewEvent] = props.eventState;
    const eventRef = useRef<HTMLDivElement>(null);
    
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const [position, setPosition] = useState<{ x: number, y: number }>({ x: 0, y: 0 });
    const [arrowPos, setArrowPos] = useState<{ x: number, y: number, dir: number }>({ x: 0, y: 0, dir: 0 })
    const [visible, setVisible] = useState(false);
    const [moved, setMoved] = useState(false);

    const calendarRef = useCalendarRef();

    const [config, setConfig] = useConfigState();

    if (!creatingEvent) return null;

    useEffect(() => {
        if (!creatingEvent) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            e.key === "Escape" && stopNewEvent();
            e.key === "Enter" && addEvent();
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [creatingEvent, newEvent]);

    useEffect(() => {
        let el = document.querySelector('.calendar-highlight') as HTMLElement;
        if (!el) el = document.querySelector('.fc-highlight') as HTMLElement
        
        if (eventRef.current && el) {
            const rect = eventRef.current.getBoundingClientRect();
            const highlightRect = el.getBoundingClientRect();
            
            let x = highlightRect.left + highlightRect.width + 10;
            let y = highlightRect.top + (highlightRect.height / 2) - (rect.height / 2);
            let arrowPosX = highlightRect.left + highlightRect.width;
            let arrowPosY = highlightRect.top + (highlightRect.height / 2) - 10;
            let arrowDir = 0;
    
            if (x + rect.width > window.innerWidth) {
                x = x - highlightRect.width - rect.width - 20;
                arrowPosX = arrowPosX - highlightRect.width - 10;
                arrowDir = 1;
            }
    
            if (y + rect.height > window.innerHeight) {
                y = window.innerHeight - rect.height - 5;
            } else if (y < 0) {
                y = 5;
            }
    
            if (arrowPosY + 20 > window.innerHeight) {
                arrowPosY = window.innerHeight - 27;
            }

            setPosition({ x, y });
            setArrowPos({ x: arrowPosX, y: arrowPosY, dir: arrowDir });
            
            setTimeout(() => {
                setVisible(true)
            }, 0);
        }
    }, [visible, newEvent]);

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

    useEffect(() => {
        const tempEvent = newEvent;

        calendarRef.current?.getApi().select({start: newEvent?.start, end: newEvent?.end, allDay: newEvent?.allDay, resourceId: newEvent?.resourceId});
        const arrow = document.querySelector('.create-arrow') as HTMLElement | null;
        if (arrow) arrow.style.display = "block";

        setNewEvent(prev => ({
            ...prev,
            ...tempEvent
        }) as JAC.Event | null);
    }, [newEvent?.start, newEvent?.end])

    const addEvent = () => {
        setConfig((prev) => ({...prev, events: [...config!.events, newEvent]} as JAC.Config));
        config?.scriptNames?.eventCreated && performScript(config.scriptNames.eventCreated, newEvent);
        stopNewEvent();
    }

    const stopNewEvent = () => {
        setCreatingEvent(false);
        setNewEvent(null);
        document.querySelector('.calendar-highlight')?.remove();
        document.querySelector('.fc-highlight')?.remove();
        setVisible(false);
    }

    const setNewEventField = (field: string, value: string|number|boolean|Date) => {
        const newEventCopy = { ...newEvent };
        set(newEventCopy, field, value);
        setNewEvent(newEventCopy as JAC.Event);
    }

    const handleMouseDown = (e: React.MouseEvent) => {
        if (eventRef.current && config?.newEventMovable) {
            const arrow = document.querySelector('.create-arrow') as HTMLElement;
            arrow.style.display = "none";

            const rect = eventRef.current.getBoundingClientRect();
            setDragOffset({
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
            });
            setIsDragging(true);
            setMoved(true);
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
            if (top + rect.height > viewportHeight - 1) top = viewportHeight - rect.height - 1; // -1 is for the border
            if (left + rect.width > viewportWidth - 1) left = viewportWidth - rect.width - 1;

            setPosition({ x: left, y: top });
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    useEffect(() => {
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
    
    }, [newEvent, position]);

    return <div style={{
        display: visible ? "block" : "none"
    }}>
        <div
            className='create-arrow'
            style={{
                top: arrowPos.y,
                left: arrowPos.x + (arrowPos.dir == 0 ? 1 : -1),
                borderRight: arrowPos.dir == 0 ? "10px solid rgba(0, 0, 0, .3)" : "none",
                borderLeft: arrowPos.dir == 1 ? "10px solid rgba(0, 0, 0, .3)" : "none",
            }}
        >
            <div
            className='create-arrow-inner'
            style={{
                marginLeft: arrowPos.dir == 0 ? 1 : -11, 
                borderRight: arrowPos.dir == 0 ? "10px solid white" : "none",
                borderLeft: arrowPos.dir == 1 ? "10px solid white" : "none",
            }}
            >

            </div>
        </div>
        <div ref={eventRef} className='create-event' style={{
                top: position.y,
                left: position.x
            }}>
            <div className='inputs-wrapper'>
                <div 
                    className='top-inputs' 
                    style={{
                        cursor: config?.newEventMovable ? "grab" : "default",
                        background: newEvent?.colors?.background || "#3788d8"
                    }}
                    onMouseDown={handleMouseDown}>
                    <Crossmark className='icon' onClick={stopNewEvent}/>
                </div>
                <div className='body-inputs'>
                    <p className='title-inputs'>{config?.translations?.eventCreationHeader ?? "New Event"}</p>
                    {config?.newEventFields?.map(value => {
                        return <div key={value.field} className='input-wrapper'>
                            <p>{value.title ?? value.field}</p>
                            {value.type === "dropdown" ? <select 
                                className='dropdown-input'
                                value={get(newEvent as JAC.Event, value.field)} 
                                onChange={e => setNewEventField(value.field, e.target.value)}
                            >
                                {value.dropdownItems?.map(item => {
                                    return typeof item === "string" 
                                        ? <option key={item} value={item}>{item}</option> 
                                        : <option key={item.value} value={item.value}>{item.label}</option>;
                                })}
                            </select>
                            : <input 
                                lang={config?.locale ?? "en"}
                                type={value.type ?? "string"} 
                                className={value.type ? `${value.type}-input` : "string-input"}
                                value={value.type === "time" 
                                    ? (() => {
                                        const date = dateFromString(get(newEvent as JAC.Event, value.field))
                                        if (!date) return ""; 
                                        date.setHours(date.getHours());
                                        
                                        return date.toTimeString().substring(0, 5)   
                                    })()
                                    : get(newEvent as JAC.Event, value.field) || ""}
                                placeholder={value.placeholder ?? ""}     
                                onChange={e => {
                                    let inputValue: string|boolean|Date = e.target.type === "checkbox" ? e.target.checked : e.target.value;

                                    if (e.target.type === "time") {
                                        const date = dateFromString(get(newEvent as JAC.Event, value.field))
                                        const [inputHour, inputMinute] = (inputValue as string).split(':');
                                        date?.setHours(Number(inputHour), Number(inputMinute));
                                        inputValue = date!.toISOString();

                                        
                                    }
                                    
                                    setNewEventField(value.field, inputValue || "");
                                }} 
                            />}
                        </div>
                })}
                </div>
            </div>
            <div className='buttons-wrapper'>
                <button onClick={stopNewEvent}><Crossmark className='icon'/>{config?.translations?.eventCreationCancel ?? "Discard"}</button>
                <button onClick={addEvent}><Checkmark className='icon'/>{config?.translations?.eventCreationConfirm ?? "Save"}</button>
            </div>
        </div>
    </div>
}

export default NewEvent;