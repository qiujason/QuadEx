import React from 'react'
import { getImage } from '../helpers/Database';
import { useState, useEffect } from 'react'

const defaultImgSrc = 'https://ih1.redbubble.net/image.1297785969.6887/st,small,507x507-pad,600x600,f8f8f8.u1.jpg';

const QuadTag = ({ rank, name, dorms, num_students, points }) => {
    const [ quadPicture, setQuadPicture ] = useState(null);

    async function fetchPicture(){
        const data = await getImage(`quad_${name}`);
        setQuadPicture(data);
    }

    useEffect(() => {
        fetchPicture();
    }, []);

    return (
        <div className="quad-tag-container">
            <div className="ranking-container">
                <h1>{rank}</h1>
            </div>
            <div className="info-container">
                {quadPicture !== null ?
                    <img className='picture' src={quadPicture} alt='profile' onError={(e) => e.target.src=defaultImgSrc}/>
                : null}
                <div className="title-container">
                    <h1>{name.toUpperCase()}</h1>
                    <p>Affiliated dorms : {dorms.join(', ')}</p>
                    <p>Members: {num_students ?? 0}</p>
                </div>
            </div>
            <div className="points-container">
                <h1>{points ?? 0}</h1>
            </div>
        </div>
    )
}

export default QuadTag
