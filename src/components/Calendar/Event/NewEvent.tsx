import { useConfigState } from '@context/Config';
import Crossmark from 'jsx:@assets/svg/crossmark.svg';
import Checkmark from 'jsx:@assets/svg/checkmark.svg';
import get from 'lodash.get';
import set from 'lodash.set';
import performScript from '@utils/performScript';
import React, { useEffect, useRef, useState } from 'react';
import { useCalendarRef } from '@context/CalendarRefProvider';
import dateFromString from '@utils/dateFromString';
import searchObject from '@utils/searchObject';
import dateToObject from '@utils/dateToObject';
import clamp from '@utils/clamp';

interface NewEventProps {
    creatingState: State<boolean>;
    templateState: State<boolean>;
    eventState: State<JAC.Event|null>;
    movedState: State<boolean>;
}

const NewEvent: FC<NewEventProps> = props => {
    const {
        creatingState: [creatingEvent, setCreatingEvent],
        templateState: [, setCreateTemplate],
        eventState: [newEvent, setNewEvent],
        movedState: [moved, setMoved],
    } = props;

    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const [position, setPosition] = useState<{ x: number, y: number }>({ x: 0, y: 0 });
    const [arrowPos, setArrowPos] = useState<{ x: number, y: number, dir: number }>({ x: 0, y: 0, dir: 0 })
    const [visible, setVisible] = useState(false);
    const [config, setConfig] = useConfigState();

    const eventRef = useRef<HTMLDivElement>(null);
    const calendarRef = useCalendarRef();

    if (!creatingEvent) return null;

    useEffect(() => {
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
        
        if (!eventRef.current || !el || moved) return;

        const rect = eventRef.current.getBoundingClientRect();
        const highlightRect = el.getBoundingClientRect();
        
        let x = highlightRect.left + highlightRect.width + 10;
        let y = highlightRect.top + (highlightRect.height / 2) - (rect.height / 2);
        let arrowPosX = highlightRect.left + highlightRect.width;
        let arrowPosY = highlightRect.top + (highlightRect.height / 2) - 10;
        let arrowDir = 0;

        if (x + rect.width > window.innerWidth - 5) {
            x = x - highlightRect.width - rect.width - 20;
            arrowPosX = arrowPosX - highlightRect.width - 10;
            arrowDir = 1;
        } else if (x < 0) {
            x = 5;
            arrowPosX = rect.width + 5;
        }

        x = clamp(x, 5, window.innerWidth - rect.width - 1);
        y = clamp(y, 5, window.innerHeight - rect.height - 5);
        arrowPosY = clamp(arrowPosY, 0, window.innerHeight - 27);

        setPosition({ x, y });
        setArrowPos({ x: arrowPosX, y: arrowPosY, dir: arrowDir });
        
        setTimeout(() => setVisible(true), 0);
    }, [creatingEvent, newEvent, eventRef, visible]);

    useEffect(() => {
        if (!isDragging) return;

        const move = (e: MouseEvent) => handleMouseMove(e);
        const stopDrag = () => setIsDragging(false);

        document.addEventListener('mousemove', move);
        document.addEventListener('mouseup', stopDrag);

        return () => {
            document.removeEventListener('mousemove', move);
            document.removeEventListener('mouseup', stopDrag);
        };
    }, [isDragging]);


    useEffect(() => {
        const tempEvent = newEvent;

        calendarRef.current?.getApi().select({start: newEvent?.start, end: newEvent?.end, allDay: newEvent?.allDay, resourceId: newEvent?.resourceId});
        const arrow = document.querySelector('.create-arrow') as HTMLElement | null;
        if (arrow) {
            moved ? arrow.style.display = "none"
                  : arrow.style.display = "block";
        }

        setNewEvent(prev => ({
            ...prev,
            ...tempEvent
        }) as JAC.Event | null);
    }, [newEvent?.start, newEvent?.end])

    const addEvent = () => {
        const eventCopy = { ...newEvent } as JAC.Event;

        config?.newEventFields?.forEach(field => {
            eventCopy[field.name] ??= field.defaultValue;
        });

        setNewEvent(eventCopy);
        setConfig((prev) => prev && ({...prev, events: [...(prev.events ?? []), eventCopy]} as JAC.Config));
        config?.scriptNames?.onEventCreated && performScript('onEventCreated', {
            ...eventCopy,
            start: newEvent?.start && dateToObject(newEvent.start),
            end: newEvent?.end && dateToObject(newEvent.end)
        });

        stopNewEvent();
        setCreateTemplate(false);
    }

    const stopNewEvent = () => {
        setMoved(false);
        setCreatingEvent(false);
        setNewEvent(null);
        document.querySelector('.calendar-highlight')?.remove();
        document.querySelector('.fc-highlight')?.remove();
        setVisible(false);
        setCreateTemplate(false);
    }

    const setNewEventField = (fieldName: string, value: string|number|boolean|Date|string[]) => {
        const newEventCopy = { ...newEvent };
        set(newEventCopy, fieldName, value);
        
        config?.newEventFields?.filter(field => field.setter !== undefined)
            .forEach(field => {
                let value: any = field.setter;

                if (field.setter instanceof Array) {
                    const setter = field.setter.find(setter =>
                        !setter._filter || searchObject(newEventCopy, setter._filter)
                    );

                    value = setter?.value;
                }

                else if (field.setter instanceof Object) {
                    value = field.setter.value;
                }

                set(newEventCopy, field.name, value);
            });

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
            let top = e.clientY - dragOffset.y;
            let left = e.clientX - dragOffset.x;

            const rect = eventRef.current.getBoundingClientRect();

            left = clamp(left, 0, window.innerWidth - rect.width - 1); // -1 is for the border
            top = clamp(top, 0, window.innerHeight - rect.height - 1);

            setPosition({ x: left, y: top });
        }
    };

    useEffect(() => {
        const fcElArr = Array.from(document.querySelectorAll('.fc-timegrid-bg-harness'));
        
        let fcEl = fcElArr.find(el => el.children[0].classList.contains('fc-highlight')) as HTMLElement;
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

    return <div style={{display: visible ? "block" : "none"}}>
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
            ></div>
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
                        backgroundColor: "rgb(240, 240, 240)",
                        borderBottom: "1px solid rgba(0, 0, 0, 0.3)"
                    }}
                    onMouseDown={handleMouseDown}
                >
                    <Crossmark className='icon' onClick={stopNewEvent}/>
                </div>
                <div className='body-inputs'>
                    <p className='title-inputs'>{config?.translations?.eventCreationHeader ?? "New Event"}</p>
                    {config?.newEventFields?.filter(field => !field.setter && (!field._filter || searchObject(newEvent!, field._filter)))?.map(field => 
                        <div key={field.name} className='input-wrapper'>
                            {field.title && <p>{field.title}</p>}
                            {field.type === "dropdown" ? <select 
                                className='dropdown-input'
                                value={field.multiple ? (get(newEvent as JAC.Event, field.name) || []) : (get(newEvent as JAC.Event, field.name) || '')}
                                onChange={e => {
                                    if (field.multiple) {
                                        const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
                                        setNewEventField(field.name, selectedOptions);
                                    } else setNewEventField(field.name, e.target.value)}}
                                multiple={field.multiple}
                            >
                                {field.dropdownItems?.map(item => typeof item === "string" 
                                        ? <option key={item} value={item}>{item}</option> 
                                        : <option key={item.value} value={item.value}>{item.label}</option>
                                )}
                            </select> : <input 
                                lang={config.locale}
                                type={field.type ?? "string"} 
                                className={`${field.type ?? "string"}-input`}
                                value={field.type === "time" 
                                    ? (() => {
                                        const date = dateFromString(get(newEvent as JAC.Event, field.name))
                                        if (!date) return ""; 
                                        date.setHours(date.getHours());
                                        
                                        return date.toTimeString().substring(0, 5)   
                                    })()
                                    : get(newEvent as JAC.Event, field.name) || ""}
                                placeholder={field.placeholder ?? ""}     
                                onChange={e => {
                                    let inputValue: string|boolean|Date = e.target.type === "checkbox" ? e.target.checked : e.target.value;

                                    if (e.target.type === "time") {
                                        const date = dateFromString(get(newEvent as JAC.Event, field.name))
                                        const [inputHour, inputMinute] = (inputValue as string).split(':');
                                        date?.setHours(Number(inputHour), Number(inputMinute));
                                        inputValue = date!.toISOString();
                                    }
                                    
                                    setNewEventField(field.name, inputValue || "");
                                }} 
                            />}
                        </div>
                    )}
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