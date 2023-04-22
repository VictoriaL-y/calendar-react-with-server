import React, { useEffect, useState } from "react";
import CalendarHeader from "./CalendarHeader";
import ToggleForm from "./ToggleForm";
import DeleteEvent from "./DeleteEvent";
import CheckOutsideClick from "./CheckOutsideClick";
import StrikeOutEventBtn from "./StrikeOutEventBtn";

const Calendar = () => {
    let monthsOfYear = [
        'January',
        'February',
        'March',
        'April',
        'Mai',
        'Juni',
        'Juli',
        'August',
        'September',
        'October',
        'November',
        'December',
    ]

    let weekdays = [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday'
    ];

    let weekdaysShort = [
        'Mon',
        'Tue',
        'Wed',
        'Thu',
        'Fri',
        'Sat',
        'Sun'
    ];

    let currentDate = new Date().toLocaleString().split(",")[0];
    let currentMonthAndYear = monthsOfYear[new Date().getMonth()] + " " + new Date().getFullYear();
    let currentWeekdayNum = new Date().getDay()
    if (currentWeekdayNum === 0) {
        currentWeekdayNum = 6
    } else {
        currentWeekdayNum--;
    }

    let currentWeekday = weekdaysShort[currentWeekdayNum]

    const [nav, setNav] = useState(0);
    const [days, setDays] = useState([]);
    const [dateDisplay, setDateDisplay] = useState('');
    const [clicked, setClicked] = useState(currentDate);
    const [events, setEvents] = useState([]);
    const [isActive, setActive] = React.useState(-1);
    const toggleClass = index => setActive(index)
    const [activeDay, setActiveDay] = useState();
    const [activeMonthAndYear, setActiveMonthAndYear] = useState();
    const [activeWeekday, setActiveWeekday] = useState();
    const [show, setShow] = useState(false);
    const [onOpen, setOnOpen] = useState(false);

    // get id of the event, which we're going to delete/strike out
    const [eventId, setEventId] = useState();
    const [selectedEvents, setSelectedEvents] = useState([]);

    // get id of the event, which we're going to edit
    const [editId, setEditId] = useState();

    // open and close deleteEvent component (pop up window)
    const handleClickOpen = () => {
        setShow(true);
    };
    const handleClose = () => {
        setShow(false);
    };

    const updateEvents = (events) => {
        setEvents(events);
    }

    const handleEventsChange = (newEvent) => {
        setEvents([...events, newEvent]);
    };

    // getting id of the event, which we want to edit
    const handleEditId = (id) => {
        setEditId(id);
    };

    // open toggle form to edit the clicked event
    const handleEditForm = (isOpen) => {
        setOnOpen(isOpen);
    }

    const eventForDate = date => events.find(e => e.date === date);

    useEffect(() => {
        const myevents = JSON.parse(localStorage.getItem('events'));

        if (myevents) {
            if (Array.isArray(myevents)) {
                setEvents(myevents);
            }
        }

        const completedEvents = JSON.parse(localStorage.getItem('selectedEvents'));

        if (completedEvents) {
            if (Array.isArray(completedEvents)) {
                setSelectedEvents(completedEvents);
            }
        }
    }, []);

    useEffect(() => {

        if (events.length > 0) {
            localStorage.setItem('events', JSON.stringify(events));
        }
        else if (events.length === 0) {
            localStorage.setItem('events', JSON.stringify(''));
        }

        if (selectedEvents.length > 0) {
            localStorage.setItem('selectedEvents', JSON.stringify(selectedEvents));
        }
        else if (selectedEvents.length === 0) {
            localStorage.setItem('selectedEvents', JSON.stringify(''));
        }


    }, [events, selectedEvents]);

    useEffect(() => {
        const dt = new Date();

        if (nav !== 0) {
            dt.setMonth(new Date().getMonth() + nav);
        }

        const day = dt.getDate();
        const month = dt.getMonth();
        const year = dt.getFullYear();
        const firstDayOfMonth = new Date(year, month, 1);
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const dateString = firstDayOfMonth.toLocaleDateString('en-us', {
            weekday: "long",
            year: "numeric",
            month: 'numeric',
            day: "numeric",
        });

        setDateDisplay(`${dt.toLocaleDateString('en-us', { month: 'long' })} ${year}`);

        const paddingDays = weekdays.indexOf(dateString.split(', ')[0]);

        const daysArr = [];

        for (let i = 1; i <= paddingDays + daysInMonth; i++) {
            const dayString = `${month + 1}/${i - paddingDays}/${year}`;

            if (i > paddingDays) {
                daysArr.push({
                    value: i - paddingDays,
                    event: eventForDate(dayString),
                    isCurrentDay: i - paddingDays === day && nav === 0,
                    date: dayString,
                });

            } else {
                daysArr.push({
                    value: 'padding',
                    event: null,
                    isCurrentDay: false,
                    date: '',
                });
            }
        }

        setDays(daysArr);
    }, [events, nav]);

    return (
        <>
            <div className="row">
                <div id="calendar-table" className="col-lg-8 p-0">

                    <CalendarHeader
                        dateDisplay={dateDisplay}
                        onBack={() =>
                            setNav(nav - 1)}
                        onNext={() => setNav(nav + 1)}
                    />
                    <div id="weekdays">
                        <div>Mon</div>
                        <div>Tue</div>
                        <div>Wed</div>
                        <div>Thu</div>
                        <div>Fri</div>
                        <div>Sat</div>
                        <div>Sun</div>
                    </div>

                    <div id="calendarBody">
                        {/* Create all the Calendar's cells */}
                        {days.map((d, index) => (
                            (activeMonthAndYear === undefined && d.isCurrentDay ? (
                                <div
                                    key={index}
                                    day={d}
                                    className={`day today active ${(d.date === currentDate && d.event) ? "event" : ''}`}>
                                    {d.value === 'padding' ? '' : d.value}
                                </div>
                            ) : (
                                <div
                                    key={index}
                                    day={d}
                                    className={`day ${d.value === 'padding' ? 'padding' : ''} 
                                                    ${d.isCurrentDay ? 'today' : ''} 
                                                    ${d.event ? 'event' : ''}
                                                    ${(isActive === index
                                            && (activeMonthAndYear === dateDisplay))
                                        && 'active'}`}

                                    onClick={() => {

                                        if (d.value !== 'padding') {
                                            toggleClass(index);
                                            setClicked(d.date);
                                            setActiveDay(d.value);
                                            setActiveMonthAndYear(dateDisplay)
                                            let choosedDate = new Date(d.date);
                                            let weekdayNum = choosedDate.getDay()
                                            if (weekdayNum === 0) {
                                                weekdayNum = 6
                                            } else {
                                                weekdayNum--;
                                            }

                                            setActiveWeekday(weekdaysShort[weekdayNum])

                                        }
                                    }}
                                >
                                    {d.value === 'padding' ? '' : d.value}
                                </div>
                            ))
                        ))}
                    </div>
                </div>

                <div className="col-lg-4 notes">
                    <div className="today-date">
                        <div className="event-day">
                            {(activeDay === undefined && activeMonthAndYear === undefined) ? currentWeekday : activeWeekday}
                        </div>
                        <div className="event-date">
                            {activeDay !== undefined ? (activeDay + " " + activeMonthAndYear) : ''}
                            {(activeDay === undefined && activeMonthAndYear === undefined) ? currentMonthAndYear : ""}
                        </div>
                    </div>

                    <div className="events">
                        {/* Create all the events */}
                        {events.map((event, index) => (

                            (event.date === clicked) ? (
                                <div
                                    key={index}
                                    event={event}
                                    onClick={() => {
                                        handleEditId(event.id);
                                        handleEditForm(true);
                                    }}
                                    className={`event ${(event.status === true)
                                        ? "strikeOut" : ""}`}
                                >

                                    <div className="title">
                                        {(onOpen && event.id === editId) ? <i className="fa-solid fa-gear"></i>
                                            : <i className="fas fa-circle circle"></i>}
                                        <h3 className="event-title">{event.title}</h3>
                                    </div>
                                    <div className="event-time">
                                        <span className="event-time">{event.start} - {event.end}</span>
                                    </div>

                                    {/* Event strikethrough button */}
                                    < StrikeOutEventBtn
                                        onStrikeOut={() => {

                                            if (selectedEvents.find(e => e === event.id) !== undefined) {
                                                setSelectedEvents(selectedEvents.filter(e => e !== event.id));
                                                event.status = false;
                                                console.log(event)
                                            } else {
                                                setSelectedEvents(selectedEvents => [...selectedEvents, event.id]);
                                                event.status = true;
                                                console.log(event)
                                            }
                                        }} />

                                    {/* Button for deleting an event */}
                                    <button
                                        className="deleteEventBtn"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleClickOpen();
                                            setEventId(event.id);
                                        }}
                                    >
                                        <i className="fa-solid fa-xmark deleteEventBtn"></i>
                                    </button>
                                </div>) : "")
                        )}

                        {/* If there is no event on the clicked day */}
                        {!(events.find(e => e.date === clicked)) ? (
                            <div className="no-event">
                                <h3>No Events</h3>
                            </div>
                        ) : ''}
                    </div>

                    {/* Toggle fowm for editing and adding event */}
                    <ToggleForm
                        clicked={clicked}
                        onSave={handleEventsChange}
                        events={events}
                        setEvents={updateEvents}
                        editId={editId}
                        setEditId={handleEditId}
                        onOpen={onOpen}
                        setOnOpen={handleEditForm}
                    />
                </div>
            </div>

            {/* Event delete pop up window  */}
            <CheckOutsideClick onClickOutside={handleClose}>
                {show === true &&
                    < DeleteEvent
                        show={show}
                        onDelete={() => {
                            setEvents(events.filter(e => e.id !== eventId));
                            setSelectedEvents(selectedEvents.filter(e => e !== eventId));
                            handleClose();
                        }}
                        onClose={handleClose}
                    />
                }
            </CheckOutsideClick>
        </>
    )
}

export default Calendar;