/* eslint-disable @next/next/no-img-element */
'use client';

import { Box, Button, ButtonGroup, Flex, IconButton, Text, background, color } from '@chakra-ui/react';
import { css } from '@emotion/react';
import moment from 'moment';
import { cloneElement, useCallback, useMemo, useState } from 'react';
import { EventProps, Views, momentLocalizer, Calendar } from 'react-big-calendar';
import { ArrowLeft, ArrowRight, Display } from 'react-bootstrap-icons';
import { EVENTS, RESOURCES, VIEW_OPTIONS } from './constans';
import { EventItem } from './types';
import AppointmentEvent from './AppointmentEvent';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './index.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import BlockoutEvent from './BlockoutEvent';
import 'bootstrap/dist/css/bootstrap.min.css'
import { start } from 'repl';

dayjs.locale('es');

const mapLines = (nthChild: string, width: number) => `.rbc-day-slot .rbc-time-slot:nth-child(${nthChild}):after {width: ${width}% !important;}`;

export enum TimeSlotMinutes {
    Five = 5,
    Ten = 10,
    Fifteen = 15,
    Thirty = 30
}

const timeSlotLinesMap = {
    [TimeSlotMinutes.Five]: `${mapLines('6n + 4', 25)} ${mapLines('3n + 2', 12.5)} ${mapLines('3n + 3', 12.5)}`,
    [TimeSlotMinutes.Ten]: `${mapLines('3n + 2', 12.5)} ${mapLines('3n + 3', 12.5)}`,
    [TimeSlotMinutes.Fifteen]: mapLines('2n', 25),
    [TimeSlotMinutes.Thirty]: ''
};

type Keys = keyof typeof Views;

const PRIMARY_COLOR = '#17405d';
const THREE_COLOR = '#808080'
const SECONDARY_COLOR = '#246899';

const localizer = momentLocalizer(moment)

const TimelineDemo = () => {

    const [events, setEvents] = useState([])
    const [showModal, setShowModal] = useState(false);
    const [selectDate, setSelectDate] = useState(null)
    const [eventTitle, setEventTitle] = useState('');

    const handleSelectSlot = (slotInfo:any) => {
        setShowModal(true)
        setSelectDate(slotInfo.start)
    }

    const saveEventy = () => {
        if(eventTitle && selectDate) {
            const newEvent = {
                title: eventTitle,
                start: selectDate,
                end: moment(selectDate).add(1, 'hours').toDate(),
                color: THREE_COLOR,
            };
            setEvents([...events, newEvent]);
            setShowModal(false);
            setEventTitle('');
        }
    }


    const [date, setDate] = useState<Date>(moment('2024-04-26').toDate());
    const [view, setView] = useState<(typeof Views)[Keys]>(Views.WEEK);
    const [contextMenuInfo, setContextMenuInfo] = useState<{
        xPosition: number;
        yPosition: number;
        selectedTime: string;
        resourceId: number;
    }>();

    const onPrevClick = useCallback(() => {
        if (view === Views.DAY) setDate(moment(date).subtract(1, 'd').toDate());
        if (view === Views.WEEK) setDate(moment(date).subtract(1, 'w').toDate());
        if (view === Views.MONTH) setDate(moment(date).subtract(1, 'M').toDate());
    }, [view, date]);

    const onNextClick = useCallback(() => {
        if (view === Views.DAY) setDate(moment(date).add(1, 'd').toDate());
        if (view === Views.WEEK) setDate(moment(date).add(1, 'w').toDate());
        if (view === Views.MONTH) setDate(moment(date).add(1, 'M').toDate());
    }, [view, date]);

    const [zoom, setZoom] = useState([5]);

    const dateText = useMemo(() => {
        if (view === Views.DAY) return moment(date).format('dddd, MMMM DD');
        if (view === Views.WEEK) {
            const from = moment(date)?.startOf('week');
            const to = moment(date)?.endOf('week');
            return `${from.format('MMMM DD')} to ${to.format('MMMM DD')}`;
        }
        if (view === Views.MONTH) {
            return moment(date).format('MMMM YYYY');
        }
    }, [view, date]);

    const components: any = {
        event: ({ event }: EventProps<EventItem>) => {
            const data = event?.data;
            if (data?.appointment) return <AppointmentEvent appointment={data.appointment} />;
            if (data?.blockout) return <BlockoutEvent blockout={data.blockout} />;
            return null;
        },
        // timeSlotWrapper: ({ children, value, resource }: { children: JSX.Element; value: string; resource: number }) => {
        //     return cloneElement(children, {
        //         onClick: (e: MouseEvent) => {
        //             e.preventDefault();
        //             setContextMenuInfo({
        //                 xPosition: e.clientX,
        //                 yPosition: e.clientY,
        //                 selectedTime: value,
        //                 resourceId: resource
        //             });
        //         }
        //     });
        // }
    };

    const onTodayClick = useCallback(() => {
        setDate(moment().toDate());
    }, []);

    const STEP = 5;
    const TIME_SLOTS = 60 / STEP;

    return (
        <Flex height="100vh" direction={'column'} width="100%" gap={2} p={2}>
            <Flex justifyContent={'space-between'} alignItems="center">
                <Box
                    css={css`
                        input {
                            border: 2px solid ${PRIMARY_COLOR};
                            border-radius: 24px;
                            padding: 6px;
                            padding-left: 10px;
                        }
                        z-index: 4;
                        position: relative;
                    `}
                >
                    <DatePicker selected={date} onChange={(date: Date) => setDate(date)} />
                </Box>
                <Flex gap={4}>
                    <Button onClick={onTodayClick}>Today</Button>
                    <Flex>
                        <IconButton aria-label="Previous" icon={<ArrowLeft />} onClick={onPrevClick} />
                        <Flex pl={4} pr={4} bg={PRIMARY_COLOR} color="white" alignItems={'center'} justifyContent="center" width={260}>
                            <Text fontSize={'medium'}>{dateText}</Text>
                        </Flex>
                        <IconButton aria-label="Next" icon={<ArrowRight />} onClick={onNextClick} />
                    </Flex>
                </Flex>

                <ButtonGroup gap={0} spacing={0} isAttached>
                    {VIEW_OPTIONS.map(({ id, label }) => (
                        <Button
                            onClick={() => setView(id)}
                            {...(id === view
                                ? {
                                      bg: PRIMARY_COLOR,
                                      color: 'white',
                                      _hover: {
                                          bg: SECONDARY_COLOR,
                                          color: 'white'
                                      }
                                  }
                                : {})}
                        >
                            {label}
                        </Button>
                    ))}
                </ButtonGroup>
            </Flex>
            <Box
                flex="1"
                overflow="auto"
                css={css`
                    /* Zoom CSS */
                    .rbc-timeslot-group {
                        min-height: ${zoom?.[0] * 24}px !important;
                    }
                    ${timeSlotLinesMap[STEP as TimeSlotMinutes]}
                `}
                onClick={(e) => {
                    // console.log('funciona');
                    setContextMenuInfo(undefined);
                }}
            >
                <Calendar
                    localizer={localizer}
                    events={events}
                    defaultView={'month'}
                    formats={{
                        dayHeaderFormat: (date) => {
                            return dayjs(date).format('DD/MM/YYYY');
                        }
                    }}
                    resources={view === Views.DAY ? RESOURCES : undefined}
                    components={components}
                    view={view}
                    onView={setView}
                    onNavigate={setDate}
                    date={date}
                    step={STEP}
                    timeslots={TIME_SLOTS}
                    selectable={true}
                    onSelectSlot={handleSelectSlot}
                />
                {showModal && (
                    <div className="modal" style={{display:'block', backgroundColor:'rgba(0.0.0.0.5)', position:'fixed', top:0, bottom:0, left:0, right:0 }}>
                    <div className="modal-dialog">
                      <div className="modal-content">
                        <div className="modal-header">
                          <h5 className="modal-title">Agenda una cita</h5>
                          <button type="button" className="btn-close" onClick={()=> setShowModal(false)}></button>
                        </div>
                        <div className="modal-body">
                            <label>Evento..</label>
                            <input type="text" 
                            className='form-control'
                            id='eventTitle'
                            value={eventTitle}
                            onChange={(e) => setEventTitle(e.target.value)}/>
                        </div>
                        <div className="modal-footer">
                          <button type="button" onClick={saveEventy}>Guardar</button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
            </Box>
        </Flex>
    );
};

export default TimelineDemo;
