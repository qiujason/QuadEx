import React from 'react'
import { convertDate, convertTime, capitalize } from '../helpers/Helpers'
import { useState } from 'react'
import { GiRoundStar } from 'react-icons/gi'
import { MdDeleteForever, MdEdit } from 'react-icons/md'
import { useEffect } from 'react'
//import { getImage } from '../helpers/Database'

const defaultImgSrc = 'https://www.housingeurope.eu/image/167/sectionheaderpng/events.png';

const EventTag = ({ isAdmin, highlight, title, startDate, endDate, startTime, endTime, location, description, picture, initialFavoriteState, onClick, onFavBtnClick, onDelBtnClick, onEditBtnClick }) => {
    const [ hovering, setHovering ] = useState(false);
    const [ exitHovering, setExitHovering ] = useState(false);
    const [ isFavorited, setIsFavorited ] = useState(initialFavoriteState);
    
    const [ imgSrc, setImgSrc ] = useState(null);
    useEffect(() => {
        async function fetchImage(){
            //const newSrc = await getImage('user_dp239'); // temporary event image
            //setImgSrc(newSrc);
            setImgSrc(defaultImgSrc);
        }
        fetchImage();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    var subText = convertDate(startDate) + ', ' + convertTime(startTime) + ' - ';
    subText += (startDate !== endDate ? convertDate(endDate) + ', ' : '');
    subText += convertTime(endTime) + (location !== null ? ' ~ @ ' + capitalize(location) : '');

    return (
        <div className={"event-tag" + (highlight ? ' highlight' : '')} onClick={onClick} onMouseMove={() => setHovering(true)} onMouseLeave={() => setHovering(false)}>
            <img className="picture" src={imgSrc} alt='event' onError={(e) => e.target.src=defaultImgSrc}/>
            <div className="info-container">
                <h1 className={hovering ? 'hovering' : ''}>{title.toUpperCase()}</h1>
                <p className={'subtitle' + (hovering ? ' hovering' : '')}>{subText}</p>
                <p style={{whiteSpace: 'pre-wrap', textOverflow: 'ellipsis'}}>{description}</p>
            </div>
            <p className={"favorite-indicator" + (exitHovering ? ' hovering' : '') + (isFavorited ? ' favorited' : '')}>{isFavorited ? 'Unfavorite' : 'Favorite'}</p>
            <GiRoundStar className={"favorite-btn" + (isFavorited ? ' favorited' : '')} onClick={() => {
                onFavBtnClick(!isFavorited);
                setIsFavorited(!isFavorited);
            }} onMouseEnter={() => setExitHovering(true)} onMouseLeave={() => setExitHovering(false)}/>
            {isAdmin ?
            <>
                <MdDeleteForever className={'btn delete-btn' + (hovering ? ' btn-visible' : '')} onClick={onDelBtnClick}/> 
                <MdEdit className={'btn edit-btn' + (hovering ? ' btn-visible' : '')} onClick={onEditBtnClick}/> 
            </>
            : ''}
        </div>
    )
}

export default EventTag