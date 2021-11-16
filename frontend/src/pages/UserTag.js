import React from 'react'
import { capitalize } from '../helpers/Helpers'
import { useState, useEffect } from 'react';
import { getImage } from '../helpers/Database';

const UserTag = ({ name, netID, quad, onClick }) => {
    const [ imageSrc, setImageSrc ] = useState(null);

    useEffect(() => {
        async function fetchImageSrc(){
            const imgSrc = await getImage(`user_${netID}`);
            setImageSrc(imgSrc);
        }
        fetchImageSrc();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className='user-tag-container' onClick={onClick}>
            {imageSrc !== null ?
                <img className='profile-container' src={imageSrc} alt='profile'/>
            : ''}
            <div className="info-container">
                <div className="user-tag-title-container">
                    <h1>{name}</h1>
                    <p>&nbsp;: {netID}</p>
                </div>
                <p>{capitalize(quad)}</p>
            </div>
        </div>
    )
}

export default UserTag
