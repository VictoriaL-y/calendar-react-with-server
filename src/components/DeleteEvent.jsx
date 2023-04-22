import React from "react";

const DeleteEvent = ({ onDelete, onClose }) => {

    return (
        <div className='deleteEvent'>
            <h2>Confirmation  <i className="fa-solid fa-triangle-exclamation"></i></h2>
            <p>Are you sure to delete this event? You can't undo this action.</p>
            <button onClick={onDelete} id='deleteButton'>Delete</button>
            <button onClick={onClose} id='closeButton'>Cancel</button>
        </div>
    );
};

export default DeleteEvent