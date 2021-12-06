import React from 'react'
import { capitalize } from '../helpers/Helpers'
import { useState, useEffect } from 'react';
import { getImage } from '../helpers/Database';

const defaultImgSrc = 'https://ih1.redbubble.net/image.1297785969.6887/st,small,507x507-pad,600x600,f8f8f8.u1.jpg';

const UserTag = ({ name, netID, quad, onClick, isNameOnly, isAdmin }) => {
    const [ imageSrc, setImageSrc ] = useState(null);

    async function fetchImageSrc(){
        const imgSrc = await getImage(`user_${netID}`);
        setImageSrc(imgSrc);
    }

    useEffect(() => {
        fetchImageSrc();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className='user-tag-container' onClick={onClick}>
            {imageSrc !== null ?
                <img className='profile-container' src={imageSrc} alt='' onError={(e) => e.target.src=defaultImgSrc}/>
            : ''}
            <div className="info-container">
                <div className="user-tag-title-container">
                    <h1>{name}</h1>
                    {!isNameOnly ? <p>&nbsp;: {isAdmin ? `${netID}@duke.edu` : netID}</p> : null}
                </div> 
                {!isNameOnly ? <p>{capitalize(quad)}</p> : null}
            </div>
        </div>
    )
}

export default UserTag
