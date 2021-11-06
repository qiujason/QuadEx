import React from 'react'
import { convertDate, convertTime, capitalize } from '../helpers/Helpers'
import { useState } from 'react'

const EventTag = ({ title, startDate, endDate, startTime, endTime, location, description, picture }) => {
    const [ hovering, setHovering ] = useState(false);

    var subText = convertDate(startDate) + ', ' + convertTime(startTime) + ' - ';
    subText += (startDate !== endDate ? convertDate(endDate) + ', ' : '');
    subText += convertTime(endTime) + ' ~ @ ' + capitalize(location);

    return (
        <div className="event-tag" onMouseEnter={() => setHovering(true)} onMouseLeave={() => setHovering(false)}>
            <div className="picture"/>
            <div className="info-container">
                <h1 className={hovering ? 'hovering' : ''}>{title.toUpperCase()}</h1>
                <p className='subtitle'>{subText}</p>
                <p>{description}</p>
            </div>
            <div className="exit-button"/>
        </div>
    )
}

export default EventTag