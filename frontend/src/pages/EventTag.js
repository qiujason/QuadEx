import React from 'react'
import { convertDate, convertTime, capitalize } from '../helpers/Helpers'
import { useState } from 'react'
import { GiRoundStar } from 'react-icons/gi'

const EventTag = ({ title, startDate, endDate, startTime, endTime, location, description, picture, onUnfavorite }) => {
    const [ hovering, setHovering ] = useState(false);
    const [ exitHovering, setExitHovering ] = useState(false);

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
            <p className={"unfavorite-btn" + (exitHovering ? ' hovering' : '')}>Unfavorite</p>
            <GiRoundStar className="exit-button" onClick={onUnfavorite} onMouseEnter={() => setExitHovering(true)} onMouseLeave={() => setExitHovering(false)}/>
        </div>
    )
}

export default EventTag