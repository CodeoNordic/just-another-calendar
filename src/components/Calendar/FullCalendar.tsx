import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { useConfig } from '@context/Config';

import { useCreateMethod } from '@utils/createMethod';
import { v4 as randomUUID } from 'uuid';

// Import components
import Event from '@components/Calendar/Event';
import { useEventDropdown } from './Event/Dropdown';

// Import methods
import mapEvents from './mapEvents';

// Import FullCalendar
import { default as FullCalendarReact } from '@fullcalendar/react';
import { DateInput, EventDropArg, EventSourceInput } from '@fullcalendar/core';

// Import Calendar plugins
import momentPlugin from '@fullcalendar/moment';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';

import resourcePlugin, { ResourceApi } from '@fullcalendar/resource'
import resourceDayGridPlugin from '@fullcalendar/resource-daygrid';
import resourceTimeGridPlugin from '@fullcalendar/resource-timegrid';
import resourceTimelinePlugin from '@fullcalendar/resource-timeline';

// Import utils
import createMethod from '@utils/createMethod';
import dateFromString from '@utils/dateFromString';
import performScript from '@utils/performScript';
import capitalize from '@utils/capitalize';
import searchObject from '@utils/searchObject';

import NewEvent from './Event/NewEvent';
import set from 'lodash.set';
import { weekDays } from '@utils/calendarDates';
import dateToObject from '@utils/dateToObject';

interface Props {
    events?: JAC.Event[];
    date?: DateInput;
}

const FullCalendar: FC<Props> = props => {
    const calendarRef = useRef<FullCalendarReact|null>(null);
    const config = useConfig()!;

    const [creatingEvent, setCreatingEvent] = useState(false);
    const [newEvent, setNewEvent] = useState<JAC.Event | null>(null);
    const [newEventPos, setNewEventPos] = useState<{ x: number, y: number } | null>(null);

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

        (date !== api.getDate()) && api.gotoDate(date);
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

        window.debug = api;

        const cleanupSetView = createMethod('setView', view => api.changeView(view));
        const cleanupSetCurrentDate = createMethod('setCurrentDate', str => {
            const date = dateFromString(str) || new Date();
            api.gotoDate(date);
            setCurrentDate(date);
        });

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
            cleanupSetView();
            cleanupSetCurrentDate();
            api.off('resourcesSet', resourceListener);
        }
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
        [props.events]
    );

    return <div>
        <FullCalendarReact
            ref={cal => calendarRef.current = cal}
            height={'100vh'}

            // Base config
            schedulerLicenseKey={config.fullCalendarLicense}
            locale={config.locale ?? 'no-nb'}

            initialView={config.view}
            initialDate={currentDate}

            editable
            eventResourceEditable={false}
            eventStartEditable
            eventDurationEditable
            nowIndicator
            
            expandRows

            weekends={new Date(currentDate).getDay() > 5? true: (config.showWeekends || false)}

            // Add plugins
            plugins={[
                momentPlugin,
                interactionPlugin,
                dayGridPlugin,
                timeGridPlugin,

                resourcePlugin,
                resourceDayGridPlugin,
                resourceTimeGridPlugin,
                resourceTimelinePlugin
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
                component={config.defaultEventComponent}
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
            resourceOrder="title"
            eventOrder={(a, b) => {
                const eventA = (a as { event: JAC.Event }).event;
                const eventB = (b as { event: JAC.Event }).event;

                // If both events have the same 'isUrgent' value, sort by dateFinishedDisplay
                if (eventA.isUrgent === eventB.isUrgent) {
                    const dateA = new Date(eventA.dateFinishedDisplay);
                    const dateB = new Date(eventB.dateFinishedDisplay);

                    return dateA.valueOf() - dateB.valueOf()
                }

                // Otherwise, put the urgent event first
                return eventA.isUrgent? -1: 1;
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

            slotLabelFormat="HH:mm"
            slotDuration="00:15"
            slotLabelInterval={15}

            firstDay={typeof config.firstDayOfWeek === 'number' ? 
                config.firstDayOfWeek : typeof config.firstDayOfWeek === "string" ? 
                Math.max(weekDays.indexOf(config.firstDayOfWeek!.toLowerCase().substring(0,3)), 1) : 1}

            // Event handlers
            eventClick={info => {
                const root = info.el;

                // Return if the element clicked was a button
                const buttons = root.querySelectorAll('button');

                const target = info.jsEvent.target as HTMLElement;
                for (const button of buttons) {
                    if (target === button || button.contains(target)) return;
                }

                performScript('editEvent', info.event.id);
            }}

            eventChange={info => {
                const revertId = randomUUID();
                setRevertFunctions(prev => ({ ...prev, [revertId]: info.revert }));

                performScript('onEventChange', {
                    event: info.event.extendedProps.event,
                    start: info.event.start,
                    end: info.event.end,
                    oldResource: (info as EventDropArg).oldResource?.toJSON(),
                    newResource: (info as EventDropArg).newResource?.toJSON(),
                    revertId
                });
            }}

            eventMouseEnter={info => {
                const rect = info.el.getBoundingClientRect();
                const event = info.event.extendedProps.event as JAC.Event;

                if (event.type === 'backgroundEvent') return;

                const buttons = eventButtons(event);

                setDropdown(prev => ({
                    ...prev,
                    x: rect.left + rect.width,
                    // Move the dropdown up slightly if there's space for it
                    y: rect.top + rect.height - (
                    (
                        Math.min(rect.width, rect.height) >= (50) ||
                        (rect.height >= 100)
                    )? 34: 2),
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

            selectable={config.eventCreation}
            select={info => {
                if (config.scriptNames?.createEvent) {
                    const start = info.start;
                    const end = info.end;
                    return performScript("createEvent", {
                        start: {
                            ...dateToObject(start),
                            time: start.toTimeString().split(' ')[0]
                        },
                        end: {
                            ...dateToObject(end),
                            time: end.toTimeString().split(' ')[0]
                        },
                        resourceId: info.resource?.id
                    });
                    
                }
                
                document.querySelector('.calendar-highlight')?.remove();
                const arrow = document.querySelector('.create-arrow') as HTMLElement | null;
                if (arrow) {
                  arrow.style.display = "block";
                }

                let newEventTemp = {
                    id: randomUUID(),
                    start: info.startStr.split('+')[0],
                    end: info.endStr.split('+')[0],
                    resourceId: info.resource?.id || ""
                };
                
                config.newEventFields?.map(field => {
                    if (!field.default) return;

                    set(newEventTemp, field.field, field.default);
                });

                setNewEvent(newEventTemp);
                setNewEventPos({ x: info.jsEvent?.clientX || 0, y: info.jsEvent?.clientY || 0 });
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
            creatingState={[creatingEvent, setCreatingEvent]}
            pos={newEventPos}
        />}
    </div>
}

export default FullCalendar;