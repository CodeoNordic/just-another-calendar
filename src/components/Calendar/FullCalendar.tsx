// Import hooks
import { useEffect, useState, useMemo, useCallback } from 'react';
import { useConfigState } from '@context/Config';

import { useCalendarRef } from '@context/CalendarRefProvider';
import { useCreateMethod } from '@utils/createMethod';
import { useEventDropdown } from './Event/Dropdown';

// Import components
import Event from '@components/Calendar/Event';
import NewEvent from './Event/NewEvent';

// Import methods
import mapEvents, { eventToFcEvent } from './mapEvents';

// Import FullCalendar
import { default as FullCalendarReact } from '@fullcalendar/react';
import { EventSourceInput, DayHeaderContentArg, SlotLabelContentArg } from '@fullcalendar/core';

// Import Calendar plugins
import momentPlugin from '@fullcalendar/moment';
import interactionPlugin, { Draggable } from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import scrollGridPlugin from '@fullcalendar/scrollgrid';

import resourcePlugin, { ResourceApi } from '@fullcalendar/resource'
import resourceDayGridPlugin from '@fullcalendar/resource-daygrid';
import resourceTimeGridPlugin from '@fullcalendar/resource-timegrid';
import resourceTimelinePlugin from '@fullcalendar/resource-timeline';
import multiMonthPlugin from '@fullcalendar/multimonth'
import listPlugin from '@fullcalendar/list';

// Import utils
import performScript from '@utils/performScript';
import dateFromString from '@utils/dateFromString';
import capitalize from '@utils/capitalize';
import searchObject from '@utils/searchObject';
import dateToObject from '@utils/dateToObject';

import { isWeekendDay, weekDays } from '@utils/calendarDates';
import clamp from '@utils/clamp';

import { v4 as randomUUID } from 'uuid';
import set from 'lodash.set';
import datesFromEvent from '@utils/datesFromEvent';
import tinycolor from 'tinycolor2';
import combineClasses from '@utils/combineClasses';

import { info as logInfo } from '@utils/log';

const FullCalendar: FC = () => {
    //console.log('FC Render');
    const calendarRef = useCalendarRef();

    const [config, setConfig] = useConfigState() as State<JAC.Config>;

    const [creatingEvent, setCreatingEvent] = useState(false);
    const [newEvent, setNewEvent] = useState<JAC.Event | null>(null);
    const [createTemplate, setCreateTemplate] = useState<boolean>(false);
    const [moved, setMoved] = useState<boolean>(false);

    const [currentDate, setCurrentDate] = useState<Date>(dateFromString(config.date) || new Date());
    //const [dateRange, setDateRange] = useState<{ start: Date; end: Date }|null>(null);
    const [calendarTitle, setCalendarTitle] = useState<string>('');

    const [,setRevertFunctions] = useState<Record<string, Function>>({});
    const setDropdown = useEventDropdown();

    // Determine dropdown buttons for each event
    const eventButtons = useCallback((r: JAC.Event) => {
        if (!config.eventButtons) return [];
        return config.eventButtons?.filter(btn => !btn._filter || searchObject(r, btn._filter));
    }, [config.eventButtons]);
    
    // Automatically change date
    useEffect(() => {
        const date = config.date && dateFromString(config.date);
        if (!calendarRef.current || !date) return;
        const api = calendarRef.current.getApi();

        (date !== api.getDate()) && setTimeout(() => api.gotoDate(date), 0);
        config.date && setCurrentDate(date);
    }, [calendarRef, config!.date]);

    // Automatically change view
    useEffect(() => {
        if (!calendarRef.current || !config.view) return;
        const api = calendarRef.current.getApi();
        config.view && (config.view !== api.view.type) && setTimeout(() => api.changeView(config.view!), 0);
    }, [calendarRef, config!.view]);

    useEffect(() => {
        if (!calendarRef.current) return;

        const api = calendarRef.current.getApi();
        window.fullCalendar = api;

        // Automatically open/close resource groups on update
        const resourceListener = (resources: ResourceApi[]) => {
            resources.forEach(resource => {
                const parent = document.querySelector(`.resource-group-label-${resource.id}`);
                const noEvents = !resource.getEvents()?.length;

                const collapsed = Boolean(resource.extendedProps.initiallyCollapsed) || noEvents;

                const expander = parent?.querySelector(`.fc-datagrid-expander:has(.fc-icon-${collapsed? 'minus':'plus'}-square)`) as HTMLButtonElement;
                expander?.click();
            })
        }
        
        api.on('resourcesSet', resourceListener);
        return () => {
            api.off('resourcesSet', resourceListener);
        }
    }, [calendarRef]);

    useCreateMethod('scrollToTime', time => {
        if (!calendarRef.current || !time) return;
        const api = calendarRef.current.getApi();

        api.scrollToTime(time);
    }, [calendarRef]);

    useCreateMethod('revert', id => {
        setRevertFunctions(prev => {
            const { [id]: func, ...funcs } = prev;
            func?.();
            return funcs;
        });
    });

    const eventsBase: EventSourceInput = useMemo(
        () => mapEvents(config),
        [config.events, config.eventFilters, config.searchFields]
    );

    useEffect(() => {
        const containerEl = document.querySelector('.insertable-events') as HTMLElement | null;
        if (containerEl) {
            new Draggable(containerEl, {
                itemSelector: '.insertable-event',
                eventData: (elem) => {
                    let event: JAC.Event|null = null;

                    try {
                        event = JSON.parse(elem.getAttribute('data-event')!);
                    } catch(err) {
                        console.error(err);
                    }

                    return {
                        create: false,
                        ...eventToFcEvent(event!, config, 0, true)
                    };
                }
            });
        }
    }, []);

    useEffect(() => {
        if (!createTemplate || !newEvent) return;
        if (!config.scriptNames?.onRangeSelected && !newEvent._instant) setCreatingEvent(true);

        const start = newEvent?.start ? new Date(newEvent.start) : new Date();
        const end = newEvent?.end ? new Date(newEvent.end) : new Date();

        if (start.getHours() === 0) {
            const startNew = start.toISOString(); 
            calendarRef.current?.getApi().select({ start: startNew, end: undefined, allDay: false, resourceId: newEvent.resourceId });
        } else {
            calendarRef.current?.getApi().select({ start, end, allDay: false, resourceId: newEvent.resourceId });
        }
            
        setCreateTemplate(false);
    }, [createTemplate, newEvent]);

    const slotLabelContent = (info: SlotLabelContentArg) => {
        const str = info.date.toLocaleTimeString(
            config.locale,
            {
                hour: '2-digit',
                minute: '2-digit'
            }
        );

        const isHourly = str.toLowerCase().match(/00 *(am|pm)?$/);

        return <span className={isHourly? 'timeslot-large': 'timeslot-small'}>
            {isHourly? str: str.substring(3, 5)}
        </span>
    };

    const dayHeaderContent = (info: DayHeaderContentArg) => {
        const base = capitalize(info.date.toLocaleDateString(config.locale, {
            weekday: 'long',
            day: '2-digit',
            month: 'long'
        }), true);
        
        const bgEvents = eventsBase.filter(ev => {
            if (ev.extendedProps!.event.type !== 'backgroundEvent') return false;

            const start = new Date(ev.start as number);
            const current = new Date(info.date);

            start.setHours(0, 0, 0, 0);
            current.setHours(0, 0, 0, 0);

            return start.valueOf() === current.valueOf();
        });

        const text = bgEvents
            .map(ev => {
                const event = ev.extendedProps?.event;
                return event?.backgroundTitle || null;
            })
            .filter(title => title !== null)
            .join(', ');

        const color = tinycolor(bgEvents.find(ev => ev.extendedProps?.event?.backgroundTitle != undefined)?.extendedProps?.event.colors?.background || '#eaa').setAlpha(1);
        
        return <span
            onClick={() => performScript('onDateHeaderClick', dateToObject(info.date))}
            className={
                combineClasses(
                    (typeof config.scriptNames?.onDateHeaderClick === 'string') && 'jac-clickable-date-header',
                    !!text && 'jac-date-header-with-bg-event'
                )
            }
            style={!!text? {
                color: !!text ? `${color.toRgbString()}` : "",
                textDecoration: 'none'
            }: undefined}
        >
            {base}
            {!!text && <>
                <br />
                ({text}) 
            </>}
        </span>
    }

    const allDayContent = <div className='jac-all-day'>{config.translations?.allDaySlot ?? 'All day'}</div>;

    return <div>
        <FullCalendarReact
            ref={cal => calendarRef.current = cal}
            height={'100vh'}

            // Base config
            schedulerLicenseKey={config.fullCalendarLicense || window[atob('Y29kZW9GY0xpY2Vuc2U=') as keyof Window]}
            locale={config.locale ?? 'no-nb'}

            initialView={config.view}
            initialDate={currentDate}

            editable
            eventResourceEditable={[1, true].includes(config.eventResourceEditable!)}
            eventStartEditable={config.eventStartEditable}
            eventDurationEditable={config.eventDurationEditable}
            nowIndicator={config.nowIndicator}
            
            eventDisplay="block"
            expandRows

            weekends={(typeof config!.showWeekends === 'boolean')? config.showWeekends: isWeekendDay(currentDate)}

            // Add plugins
            plugins={[
                momentPlugin,
                interactionPlugin,
                dayGridPlugin,
                timeGridPlugin,
                scrollGridPlugin,

                resourcePlugin,
                resourceDayGridPlugin,
                resourceTimeGridPlugin,
                resourceTimelinePlugin,

                listPlugin,
                multiMonthPlugin
            ]}

            duration={{ days: config.days ?? 1 }}
            dayHeaderContent={(typeof config.scriptNames?.onDateHeaderClick === 'string')? (info => <span
                onClick={() => performScript('onDateHeaderClick', dateToObject(info.date))}
                className="jac-clickable-date-header"
            >
                {info.text}
            </span>): undefined}

            // Set up views
            views={{
                timeGrid: { slotLabelContent, dayHeaderContent },
                //timeline: { slotLabelContent, dayHeaderContent },

                // TODO duplicate code, reduce to reusable function
                resourceTimeline: {
                    //slotLabelContent: dayHeaderContent
                },

                resourceTimeGrid: {
                    dayHeaderContent,
                    slotLabelContent,

                    dayHeaders: true,
                    datesAboveResources: true,

                    duration: { days: config.days ?? 7 }
                }
            }}

            allDayContent={allDayContent}
            allDaySlot={config.allDaySlot !== false}

            // Add content
            resources={config.resources}
            events={eventsBase}

            // Renderer for each event
            eventContent={props => <Event
                {...(props.event.extendedProps.event ?? {}) as JAC.Event}
            />}

            resourceGroupLabelClassNames={info => `resource-group-label-${info.groupValue}`}

            // Automatically open/close resource groups on first load
            resourceGroupLabelDidMount={info => {
                const group = config.groups?.find(g => g.id === info.groupValue);
                const resource = config.resources?.find(r => (r as RSAny)[(config.resourceGroupField ?? 'groupId')] === info.groupValue);

                if (!group || !resource) return null;
                
                const noEvents = !eventsBase.some(e => (e.resourceId === group.id) || e.resourceIds?.includes(group.id));
                const collapsed = group?.collapsed !== undefined? group.collapsed: noEvents;

                const expander = info.el.querySelector(`.fc-datagrid-expander:has(.fc-icon-${collapsed? 'minus':'plus'}-square)`) as HTMLButtonElement;
                expander?.click();
            }}

            resourceGroupField={config.resourceGroupField}
            resourceGroupLabelContent={info => {
                const group = config.groups?.find(g => g.id === info.groupValue);
                const resources = config.resources?.filter(r => r.groupId === group?.id);
                
                if (!group || !resources?.length) return null;

                const events = eventsBase.filter(ev => (resources.some(r => (ev.resourceId === r.id) || ev.resourceIds?.includes(r.id))));
                return `${group?.title ?? '---'} (${events.length})`;
            }}

            // Sorting
            resourceOrder={(a, b) => {
                const resourceA = a as JAC.Resource;
                const resourceB = b as JAC.Resource;

                return (resourceA?.sort ?? Infinity) - (resourceB?.sort ?? Infinity);
            }}
            
            // Additional config values
            resourceAreaHeaderContent={() => <div className="date-header">{calendarTitle}</div>}
            resourceAreaWidth={config.resourcesWidth || '17.5rem'}
            
            filterResourcesWithEvents={false}
            fixedWeekCount={false}
            slotEventOverlap={false}
            
            buttonIcons={false}
            headerToolbar={{
                left: '',
                right: '',
                center: (config.view?.startsWith('resourceTimeGrid') && !/\d+[^\d]+\d+/.test(calendarTitle))? 'title':''
            }}

            titleFormat={{ weekday: 'long', day: 'numeric', month: 'long' }}
            scrollTime={config.initialScrollTime}

            eventTimeFormat={config.eventTimeFormat}
            
            slotMinTime={config.calendarStartTime} 
            slotMaxTime={config.calendarEndTime}

            //slotLabelFormat={/*config.view?.toLowerCase().includes('timeline') ? { day: 'numeric', weekday: 'short' }:*/ { hour: '2-digit', minute: '2-digit' }}
            slotLabelFormat={config.slotLabelFormat ?? (
                config.view?.toLowerCase().includes('timeline')? [
                    { weekday: 'short', 'day': '2-digit' },
                    { hour: '2-digit', minute: '2-digit' }
                ]: {
                    hour: '2-digit',
                    minute: '2-digit'
                }
            )}

            slotDuration={config.slotDuration ??/*config.view?.toLowerCase().includes('timeline') ? { days: 1 }:*/ { minutes: 15 }}
            slotLabelInterval={config.slotLabelInterval ??/*config.view?.toLowerCase().includes('timeline') ? { days: 1 }:*/ { minutes: 15 }}

            firstDay={typeof config.firstDayOfWeek === 'number' ? 
                clamp(config.firstDayOfWeek, 0, 6) : typeof config.firstDayOfWeek === "string" ? 
                Math.max(weekDays.indexOf(config.firstDayOfWeek!.toLowerCase().substring(0,3)), 1) : 1}

            // Event handlers
            eventClick={config.scriptNames?.onEventClick? (info => {
                const root = info.el;

                // Return if the element clicked was a button
                const buttons = root.querySelectorAll('button');

                const target = info.jsEvent.target as HTMLElement;
                for (const button of buttons) {
                    if (target === button || button.contains(target)) return;
                }

                performScript('onEventClick', info.event.extendedProps!.event);
            }): undefined}

            eventChange={info => {
                const revertId = randomUUID();
                setRevertFunctions(prev => ({ ...prev, [revertId]: info.revert }));

                const start = info.event.start!;
                let end = info.event.end;

                logInfo(`Event changed (${info.event.id})`, {
                    start,
                    end
                });

                if (!end) {
                    // TODO make default duration dynamic
                    end = new Date(start.getTime() + 1000 * 60 * 15);
                }

                const events = config.events;
                const event = events?.find(ev => ev.id === info.event.id)!;  

                const oldResource = info.oldEvent.getResources().pop();
                const newResource = info.event.getResources().pop();

                const param: RSAny = {
                    event: {
                        ...info.event.extendedProps.event,
                        allDay: info.event.allDay
                    },
                    start: dateToObject(start),
                    end: dateToObject(end),
                    revertId
                };

                if (oldResource?.id !== newResource?.id) {
                    param.oldResource = oldResource?.toJSON();
                    param.newResource = newResource?.toJSON();

                    newResource && (info.event.extendedProps.resourceId = newResource.id);
                }

                performScript('onEventChange', param);

                // Update the event dates and times
                setConfig(prev => {
                    if (!prev) return prev;

                    const { events, ...cfg } = prev;

                    event.start = start.toISOString();
                    end && (event.end = end.toISOString());

                    event.startTime = start.toTimeString().substring(0, 5);
                    event.timeStart = event.startTime;

                    end && (event.endTime = end.toTimeString().substring(0, 5));
                    event.timeEnd = event.endTime;

                    event.allDay = info.event.allDay;

                    newResource && (event.resourceId = newResource.id);

                    return {
                        ...cfg,
                        events: [...events]
                    } as JAC.Config;
                });
            }}

            dayMinWidth={typeof config.dayMinWidth === 'number'? config.dayMinWidth: undefined}
            slotMinWidth={80}

            eventMouseEnter={info => {
                const rect = info.el.getBoundingClientRect();
                const event = info.event.extendedProps.event as JAC.Event;

                if (!event || event.type === 'backgroundEvent') return;

                const buttons = eventButtons(event);

                const x = rect.left + rect.width;

                // Move the dropdown up slightly if there's space for it
                let y = rect.top + rect.height - (
                    (
                        Math.min(rect.width, rect.height) >= (50) ||
                        (rect.height >= 100)
                    )? 34: 2
                );

                // Ensure the dropdown isn't too far down on the screen
                if (y > (window.innerHeight - 32))
                    y -= 32;

                setDropdown(prev => ({
                    ...prev,
                    eventId: event?.id,
                    x,
                    y,
                    buttons,
                    visible: true
                }))
            }}

            eventMouseLeave={() => {
                setDropdown(false)
            }}
            
            datesSet={info => {
                setCalendarTitle(info.view.title);
            }}

            dragRevertDuration={0}
            slotLaneClassNames={info => {
                return (info.date?.getMinutes() === 0)? 'whole-hour':'';
            }}

            resourceLabelContent={(typeof config.scriptNames?.onResourceLabelClick === 'string')? (info => {
                return <span className="jac-clickable-resource-label" onClick={() => {
                    performScript('onResourceLabelClick', {
                        id: info.resource.id,
                        title: info.resource.title,
                        ...info.resource.extendedProps
                    })
                }}>{info.resource.title}</span>
            }): undefined}

            droppable
            drop={info => {
                //console.log('drop', info);

                const ev = JSON.parse(info.draggedEl.getAttribute('data-event') || '{}') as JAC.Event | null;

                if (!ev) return;
                const { id, ...event } = { ...ev };

                if (!Object.keys(event).length) return;

                const start = new Date(info.date);
                const [hours, minutes] = event.duration.split(':') as [string, string];

                const end = new Date(start.getTime());
                end.setMinutes(end.getMinutes() + Number(minutes) + Number(hours) * 60);

                const parsedEvent: JAC.Event = {
                    ...event,
                    id: id || randomUUID(),
                    start: start.toISOString(),
                    end: end.toISOString(),
                    resourceId: info.resource?.id,
                    _instant: info.draggedEl.getAttribute('data-instant') !== null
                };

                function getNestedValue(obj: any, path: string): any {
                    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
                }

                if (config.eventCreation && !parsedEvent?._instant) {
                    config.newEventFields?.forEach(field => {
                        if (!field.defaultValue) return;
                        const value = getNestedValue(parsedEvent, field.name);
                        if ([undefined, null, NaN, ''].includes(value)) {
                            set(parsedEvent, field.name, field.defaultValue);
                        }
                    });
                } else if (config.eventCreation && parsedEvent?._instant) {
                    setConfig(prev => prev && ({
                        ...prev,
                        events: [...(prev.events ?? []), parsedEvent]
                    }));
                }

                setNewEvent(parsedEvent);

                setCreateTemplate(true);
            }}

            // Can be used when dropping events
            /*eventReceive={info => {
                console.log(info);
                window._config?.events?.push(info.event.toJSON() as JAC.Event)
            }}*/
            
            selectable={
                config.eventCreation 
                    || (Boolean(config.scriptNames.onRangeSelected)/* && Boolean(config.eventTemplates?.length)*/) 
                    || Boolean(config.scriptNames.onEventCreated)}
            select={info => {
                const dates = newEvent && datesFromEvent(newEvent);
                const eventParam = newEvent && {
                    ...newEvent,
                    start: dates?.start && dateToObject(dates.start),
                    end: dates?.end && dateToObject(dates.end)
                };

                // check for different scripts in config
                if (!creatingEvent && !createTemplate && config.scriptNames?.onEventCreated && eventParam) {
                    performScript('onEventCreated', eventParam)
                } else if (createTemplate && (!config.eventCreation || newEvent?._instant) && config.scriptNames?.onEventCreated && eventParam) {
                    performScript('onEventCreated', eventParam);
                    setCreateTemplate(false);
                } else if (config.scriptNames?.onRangeSelected) {
                    const start = info.start;
                    const end = info.end;

                    performScript("onRangeSelected", {
                        start: {
                            ...dateToObject(start),
                            time: start.toTimeString().split(' ')[0]
                        },
                        end: {
                            ...dateToObject(end),
                            time: end.toTimeString().split(' ')[0]
                        },
                        resourceId: info.resource?.id,
                        allDay: info.allDay,
                        event: createTemplate ? eventParam : undefined
                    });
                }

                if (!config.eventCreation || createTemplate) return;

                document.querySelector('.calendar-highlight')?.remove();
                const arrow = document.querySelector('.create-arrow') as HTMLElement | null;
                if (arrow) arrow.style.display = "block";

                let newEventTemp = {
                    id: randomUUID(),
                    start: info.start.toISOString(),
                    end: info.end.toISOString(),
                    resourceId: info.resource?.id || "",
                    allDay: info.allDay,
                } as JAC.Event;
                
                config.newEventFields?.forEach(field => {
                    if (!field.defaultValue) return;
                    set(newEventTemp, field.name, field.defaultValue);
                });

                setNewEvent(newEventTemp);
                setCreatingEvent(true);

                document.addEventListener('click', e => {
                    if ((e.target as HTMLElement)?.closest('.create-event')) return;
                    document.querySelector('.calendar-highlight')?.remove();
                    setCreatingEvent(false);
                    setNewEvent(null);
                    setMoved(false);
                }, { once: true });
            }}
        />

        {creatingEvent && <NewEvent
            eventState={[newEvent, setNewEvent]}
            templateState={[createTemplate, setCreateTemplate]}
            creatingState={[creatingEvent, setCreatingEvent]}
            movedState={[moved, setMoved]}
        />}
    </div>
}

export default FullCalendar;