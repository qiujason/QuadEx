import React from 'react'
import { convertDate, convertTime, capitalize } from '../helpers/Helpers'
import { useState } from 'react'
import { GiRoundStar } from 'react-icons/gi'
import { MdDeleteForever } from 'react-icons/md'

const EventTag = ({ highlight, title, startDate, endDate, startTime, endTime, location, description, picture, initialFavoriteState, onClick, onBtnClick }) => {
    const [ hovering, setHovering ] = useState(false);
    const [ exitHovering, setExitHovering ] = useState(false);
    const [ isFavorited, setIsFavorited ] = useState(initialFavoriteState);

    var subText = convertDate(startDate) + ', ' + convertTime(startTime) + ' - ';
    subText += (startDate !== endDate ? convertDate(endDate) + ', ' : '');
    subText += convertTime(endTime) + (location !== null ? ' ~ @ ' + capitalize(location) : '');

    return (
        <div className={"event-tag" + (highlight ? ' highlight' : '')} onClick={onClick} onMouseEnter={() => setHovering(true)} onMouseLeave={() => setHovering(false)}>
            <div className="picture"/>
            <div className="info-container">
                <h1 className={hovering ? 'hovering' : ''}>{title.toUpperCase()}</h1>
                <p className={'subtitle' + (hovering ? ' hovering' : '')}>{subText}</p>
                <p style={{whiteSpace: 'pre-wrap', textOverflow: 'ellipsis'}}>{description}</p>
            </div>
            <p className={"favorite-indicator" + (exitHovering ? ' hovering' : '') + (isFavorited ? ' favorited' : '')}>{isFavorited ? 'Unfavorite' : 'Favorite'}</p>
            <GiRoundStar className={"favorite-btn" + (isFavorited ? ' favorited' : '')} onClick={() => {
                onBtnClick(!isFavorited);
                setIsFavorited(!isFavorited);
            }} onMouseEnter={() => setExitHovering(true)} onMouseLeave={() => setExitHovering(false)}/>
            {/* <MdDeleteForever/>  */}
        </div>
    )
}

export default EventTag