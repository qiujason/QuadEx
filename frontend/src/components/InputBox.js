import React from 'react'
import '../stylesheets/components.scss'
import { useState } from 'react';

const InputBox = ({ placeholder, width = '10rem', onChange, limit }) => {
    const [ value, setValue ] = useState('');

    const widthStyle = {
        width: width
    }

    const handleChange = (e) => {
        if(e.target.value.length > limit) return;
        setValue(e.target.value);
        onChange(e);
    }

    const handleBlur = (e) => {
        if(limit === null || limit < 1) return;
        setValue(e.target.value !== '' ? e.target.value.padStart(limit, '0') : '');
    }

    return (
        <div className='input-box-container' style={widthStyle}>
            <input placeholder={placeholder} value={value} type="text" className="input-box" onChange={e => handleChange(e)} onBlur={e => handleBlur(e)}/>
        </div>
    )
}

export default InputBox
