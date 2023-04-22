import React from "react";

/* Event strikethrough button  */
const StrikeOutEventBtn = ({ onStrikeOut }) => {

    return (
        <button
            onClick={(e) => {
                e.stopPropagation();
                onStrikeOut();
            }}
            className="strikeThroughBtn">
            <i className="fa-solid fa-check strikeThroughBtn"></i>
        </button>
    )
}

export default StrikeOutEventBtn