import React from 'react'

const UserTag = ({ name, netID }) => {
    return (
        <div className='user-tag-container'>
            <div className="picture-container">

            </div>
            <div className="info-container">
                <h1>{name}</h1>
                <p>{netID}</p>
            </div>
        </div>
    )
}

export default UserTag
