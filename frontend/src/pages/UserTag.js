import React from 'react'
import { capitalize } from '../helpers/Helpers'

const UserTag = ({ name, netID, quad, onClick }) => {
    return (
        <div className='user-tag-container' onClick={onClick}>
            <div className="picture-container">

            </div>
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
