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
import { EventDropArg, EventSourceInput } from '@fullcalendar/core';

// Import Calendar plugins
import momentPlugin from '@fullcalendar/moment';
import interactionPlugin, { Draggable } from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';

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

const FullCalendar: FC = () => {
    const calendarRef = useCalendarRef();

    const [config, setConfig] = useConfigState() as State<JAC.Config>;

    const [creatingEvent, setCreatingEvent] = useState(false);
    const [newEvent, setNewEvent] = useState<JAC.Event | null>(null);
    const [createTemplate, setCreateTemplate] = useState<boolean>(false);

    const [currentDate, setCurrentDate] = useState<Date>(dateFromString(config.date) || new Date());
    //const [dateRange, setDateRange] = useState<{ start: Date; end: Date }|null>(null);
    const [resourcesTitle, setResourcesTitle] = useState<string>('');

    const [,setRevertFunctions] = useState<Record<string, Function>>({});
    const [,setDropdown] = useEventDropdown();

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

    useEffect(() => {
        setTimeout(() => {
            if (!calendarRef.current || !config?.initialScrollTime) return;
            const api = calendarRef.current.getApi();

            api.scrollToTime(config.initialScrollTime);
        }, 50);
    }, [calendarRef, config?.initialScrollTime, config?.view, config?.date]);

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
            eventStartEditable
            eventDurationEditable
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

                resourcePlugin,
                resourceDayGridPlugin,
                resourceTimeGridPlugin,
                resourceTimelinePlugin,

                listPlugin,
                multiMonthPlugin
            ]}

            // Set up views
            views={{
                resourceTimeGrid: {
                    dayHeaderContent: info => {
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

                        const firstColor = bgEvents[0]?.backgroundColor;
                        return <span style={{ color: firstColor }}>
                            {base}
                            {!!bgEvents.length && <>
                                <br />
                                ({bgEvents.map(ev => ev.extendedProps!.event!.backgroundText).join(', ')})
                            </>}
                        </span>
                    },

                    slotLabelContent: info => {
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
                    },

                    duration: { days: config.days ?? 7 },
                    dayHeaders: true,
                    datesAboveResources: true,

                    allDayContent: <div className='jac-all-day'>{config.translations?.allDaySlot ?? 'All day'}</div>,
                    allDaySlot: config.allDaySlot !== false
                }
            }}

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
                const resource = config.resources?.find(r => r.id === info.groupValue);
                
                const noEvents = !eventsBase.some(e => e.resourceIds?.includes(info.groupValue));
                const collapsed = resource?.collapsed !== undefined? resource.collapsed: noEvents;

                const expander = info.el.querySelector(`.fc-datagrid-expander:has(.fc-icon-${collapsed? 'minus':'plus'}-square)`) as HTMLButtonElement;
                expander?.click();
            }}

            // Sorting
            resourceOrder={(a, b) => {
                const resourceA = a as JAC.Resource;
                const resourceB = b as JAC.Resource;

                return (resourceA?.sort ?? Infinity) - (resourceB?.sort ?? Infinity);
            }}
            
            // Additional config values
            resourceAreaHeaderContent={() => <div className="date-header">{resourcesTitle}</div>}
            resourceAreaWidth={config.resourcesWidth || '17.5rem'}
            filterResourcesWithEvents={false}
            fixedWeekCount={false}
            slotEventOverlap={false}
            
            buttonIcons={false}
            headerToolbar={{
                left: '',//'title',
                right: ''
            }}
            
            eventTimeFormat={config.eventTimeFormat ?? 'HH:mm'}
            
            // These will be switched out for config values in the future
            slotMinTime={config.calendarStartTime || "08:00"} 
            slotMaxTime={config.calendarEndTime || "21:15"}

            slotLabelFormat={config.view?.startsWith('resourceTimeline') ? { day: 'numeric', weekday: 'short' }: { hour: '2-digit', minute: '2-digit' }}
            slotDuration={config.view?.startsWith('resourceTimeline') ? { days: 1 }: { minutes: 15 }}
            slotLabelInterval={config.view?.startsWith('resourceTimeline') ? { days: 1 }: { minutes: 15 }}

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
                const end = info.event.end!;

                const oldResource = info.oldEvent.getResources().pop();
                const newResource = info.event.getResources().pop();

                const param: RSAny = {
                    event: info.event.extendedProps.event,
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
                    const event = events?.find(ev => ev.id === info.event.id)!;

                    event.start = start.toISOString();
                    event.end = end.toISOString();

                    event.startTime = start.toTimeString().substring(0, 5);
                    event.timeStart = event.startTime;

                    event.endTime = end.toTimeString().substring(0, 5);
                    event.timeEnd = event.endTime;

                    newResource && (event.resourceId = newResource.id);

                    return {
                        ...cfg,
                        events: [...events]
                    } as JAC.Config;
                });
            }}

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
                setDropdown(prev => ({ ...prev, visible: false }))
            }}
            
            datesSet={info => {
                setResourcesTitle(info.view.title);
            }}

            dragRevertDuration={0}

            droppable
            drop={info => {
                let ev: JAC.Event|null = null;

                try {
                    ev = JSON.parse(info.draggedEl.getAttribute('data-event') || '{}');
                } catch(err) {
                    console.error(err);
                }

                if (!ev) return;
                const { id, ...event } = ev;

                //const { id, ...event } = JSON.parse(info.draggedEl.getAttribute('data-event') || '{}');
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

                if (config.eventCreation && !parsedEvent?._instant) {
                    config.newEventFields?.forEach(field => {
                        if (!field.defaultValue) return;
                        if ([undefined, null, NaN, ''].includes(parsedEvent[field.name]))
                            set(parsedEvent, field.name, field.defaultValue);
                    });
                    
                    setNewEvent(parsedEvent);
                    setCreatingEvent(true);
                }

                else {
                    setConfig(prev => prev && ({
                        ...prev,
                        events: [...(prev.events ?? []), parsedEvent]
                    }));
                    
                    setNewEvent(parsedEvent);
                }
                /*if (config.eventCreation)
                    setNewEvent(prev => ({
                        //...prev,
                        ...parsedEvent
                    }));
                else
                    setConfig(prev => prev && {
                        ...prev,
                        events: [...(prev.events ?? []), parsedEvent]
                    })*/

                setCreateTemplate(true);
                setTimeout(() => {
                    if (start.getHours() === 0) {
                        const startNew = start.toISOString(); 
                        calendarRef.current?.getApi().select({ start: startNew, end: undefined, allDay: false, resourceId: info.resource?.id });
                    } else {
                        calendarRef.current?.getApi().select({ start, end, allDay: false, resourceId: info.resource?.id });
                    }
                }, 0);
            }}

            // Can be used when dropping events
            /*eventReceive={info => {
                console.log(info);
                window._config?.events?.push(info.event.toJSON() as JAC.Event)
            }}*/
            
            selectable={
                config.eventCreation ||
                (Boolean(config.scriptNames.onRangeSelected)/* && Boolean(config.eventTemplates?.length)*/) ||
                Boolean(config.scriptNames.onEventCreated)}
            select={info => {
                const dates = newEvent && datesFromEvent(newEvent);
                console.log(dates);
                const eventParam = newEvent && {
                    ...newEvent,
                    start: dates?.start && dateToObject(dates.start),
                    end: dates?.end && dateToObject(dates.end)
                };

                if (!creatingEvent && !createTemplate && newEvent && config.scriptNames?.onEventCreated) {
                    performScript('onEventCreated', eventParam)
                }

                else if (createTemplate && (!config.eventCreation || newEvent?._instant) && config.scriptNames?.onEventCreated) {
                    performScript('onEventCreated', eventParam);
                    setCreateTemplate(false);
                }

                else if (config.scriptNames?.onRangeSelected) {
                    const start = info.start;
                    const end = info.end;
                    //console.log(newEvent);
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
                        event: createTemplate? eventParam: undefined
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
                    resourceId: info.resource?.id || ""
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
                }, { once: true });
            }}
        />

        {creatingEvent && <NewEvent
            eventState={[newEvent, setNewEvent]}
            templateState={[createTemplate, setCreateTemplate]}
            creatingState={[creatingEvent, setCreatingEvent]}
        />}
    </div>
}

export default FullCalendar;