import React from 'react'
import '../stylesheets/components.scss'
import { useState } from 'react';

const InputBox = ({ placeholder, width = '10rem' }) => {
    const [ value, setValue ] = useState();

    const widthStyle = {
        width: width
    }

    return (
        <div className='input-box-container' style={widthStyle}>
            <input placeholder={placeholder} type="text" className="input-box"/>
        </div>
    )
}

export default InputBox
