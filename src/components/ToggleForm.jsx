import React, { useState, useEffect, useRef } from "react";
import CheckOutsideClick from "./CheckOutsideClick";
import TimePicker from 'react-time-picker';

const ToggleForm = ({ onSave, editId, onOpen, setOnOpen, setEditId, events, clicked, setEvents }) => {
    const [startingTime, setStartingTime] = useState('');
    const [endingTime, setEndingTime] = useState('');
    const [title, setTitle] = useState('');
    const [errorTitle, setErrorTitle] = useState(false);
    const [errorStartingTime, setErrorStartingTime] = useState(false);
    const [errorEndingTime, setErrorEndingTime] = useState(false);
    const [show, setShow] = useState(false);
    // after pressed a button get focused on the event's name input field
    const inputRef = useRef(null);
    const toggle = () => {
        // get away error classes from inout forms
        setErrorTitle(false);
        setErrorStartingTime(false);
        setErrorEndingTime(false);

        if (onOpen === true) {
            setShow(false);
            setOnOpen(!onOpen);
        } else {
            //clean all the input in the toggle form
            setTitle("");
            setStartingTime('00:00');
            setEndingTime('00:00');
            //close the toggle form and clear the id of the clicked and editing event
            setShow(!show);
            setOnOpen(false);
            setEditId(undefined);
        }
    };

    // close toggle form when click outside
    const handleClose = () => {
        setShow(false);
        setOnOpen(false);
    };

    const handleStartingTime = (startsTime) => {
        setStartingTime(startsTime);
    };

    const handleEndingTime = (endsTime) => {
        setEndingTime(endsTime);
    };

    // if we've clicked on the event, which we want to edit, and the toggle form has opened
    useEffect(() => {
        if (onOpen && editId !== undefined) {
            const editEvent = events.find((e) => e.id === editId);
            setErrorTitle(false);
            setErrorStartingTime(false);
            setErrorEndingTime(false);
            setTitle(editEvent.title);
            setStartingTime(editEvent.start);
            setEndingTime(editEvent.end);
        }
    }, [onOpen]);

    // save the event
    const handleOnSave = () => {

        // check all 3 inputs
        if ((!title || /^\s*$/.test(title)) || !startingTime || !endingTime) {

            if ((!title || /^\s*$/.test(title)) && !startingTime && !endingTime) {
                setErrorTitle(true);
                setErrorStartingTime(true);
                setErrorEndingTime(true);
                return;

            } else if ((!title || /^\s*$/.test(title)) && !startingTime) {
                setErrorTitle(true);
                setErrorStartingTime(true);
                return;

            } else if ((!title || /^\s*$/.test(title)) && !endingTime) {
                setErrorTitle(true);
                setErrorEndingTime(true);
                return;

            } else if (!startingTime && !endingTime) {
                setErrorStartingTime(true);
                setErrorEndingTime(true);
                return;

            } else if (!title || /^\s*$/.test(title)) {
                setErrorTitle(true);
                return;

            } else if (!startingTime) {
                setErrorStartingTime(true);
                return;

            } else if (!endingTime) {
                setErrorEndingTime(true);
                return;
            }

        } else if (title && startingTime && endingTime) {

            // we are editing the event (we clicked before on the event, which we want to edit)
            if (editId !== undefined) {
                const editEvent = events.find((e) => e.id === editId);
                const updatedEvent = events.map((e) =>
                    e.id === editEvent.id
                        ? (e = {
                            id: e.id,
                            date: e.date,
                            title: title,
                            start: startingTime,
                            end: endingTime,
                            status: e.status
                        })
                        : {
                            id: e.id,
                            date: e.date,
                            title: e.title,
                            start: e.start,
                            end: e.end,
                            status: e.status
                        }
                );
                setEvents(updatedEvent);
                setTimeout(() => {
                    setEditId(undefined);
                }, 400);

            } else {

                // create new event
                const newEvent = {
                    id: Math.random() * (10 ** 17),
                    date: clicked,
                    title,
                    start: startingTime,
                    end: endingTime,
                    status: false
                }
                onSave(newEvent);
            }

            setErrorTitle(false);
            setErrorStartingTime(false);
            setErrorEndingTime(false);
            setTitle("")
            setStartingTime('')
            setEndingTime('')
            toggle()
        }
    }

    return (
        <CheckOutsideClick onClickOutside={handleClose}>

            <button id="buttAddEvent" onClick={() => {
                toggle();
                if (!show || !onOpen) {
                    inputRef.current.focus();
                }
            }}>
                <i className="fa-regular fa-square-plus"></i>
            </button>

            <div className={(show || onOpen) ? "add-event-wrapper active" : "add-event-wrapper"}>
                <div className="add-event-header">
                    <div className="title">{(editId !== undefined) ? "Edit Event" : "New Event"}</div>
                    <i onClick={toggle} className="fas fa-times close"></i>
                </div>
                <div className="add-event-body">
                    <div className="add-event-input">
                        <input ref={inputRef} value={title} onChange={e => setTitle(e.target.value)} type="text"
                            placeholder="Event Name" className={`event-name ${(errorTitle) ? 'error' : ''}`} />
                    </div>
                    <div className="add-event-input">
                        < TimePicker onChange={handleStartingTime} value={startingTime} clockIcon={null} disableClock format={'H:m'} className={errorStartingTime ? 'error' : ''} />
                    </div>
                    <div className="add-event-input">
                        < TimePicker onChange={handleEndingTime} value={endingTime} clockIcon={null} disableClock format={'H:m'} className={errorEndingTime ? 'error' : ''} />
                    </div>
                </div>

                <div className="add-event-footer">
                    <button onClick={() => { handleOnSave(); }} className="add-event-btn">{(editId !== undefined) ? "Submit" : "Add Event"}</button>
                </div>
            </div>

        </CheckOutsideClick>
    )
}



export default ToggleForm