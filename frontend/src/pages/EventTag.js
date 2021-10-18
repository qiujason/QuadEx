import React from 'react'
import { convertDate, convertTime, capitalize } from '../helpers/Helpers';

const EventTag = ({ title, startDate, endDate, startTime, endTime, location, description, picture }) => {
    var subText = convertDate(startDate) + ', ' + convertTime(startTime) + ' - ';
    subText += (startDate !== endDate ? convertDate(endDate) + ', ' : '');
    subText += convertTime(endTime) + ' ~ @ ' + capitalize(location);
    
    return (
        <div className="event-tag">
            <div className="picture"/>
                <div className="info-container">
                <h1>{title.toUpperCase()}</h1>
                <p className='subtitle'>{subText}</p>
                <p>{description}</p>
            </div>
            <div className="exit-button"/>
        </div>
    )
}

export default EventTag
