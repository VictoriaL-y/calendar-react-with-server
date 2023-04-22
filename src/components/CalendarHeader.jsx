import React from "react";

export const CalendarHeader = ({ onNext, onBack, dateDisplay }) => {

    return (
        <div id="headerMonth" className="container-fluid">
            <button onClick={onBack} id="buttPrev">
                <i className="fa-solid fa-chevron-left"></i>
            </button>

            {dateDisplay}
            
            <button onClick={onNext} id="buttNext">
                <i className="fa-solid fa-chevron-right"></i>
            </button>
        </div>
    )
}

export default CalendarHeader;