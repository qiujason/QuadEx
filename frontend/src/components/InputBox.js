import React from 'react'
import '../stylesheets/components.scss'

const InputBox = ({ placeholder, value, onChange, width = '10rem', limit, isNumeric = false }) => {
    const widthStyle = {
        width: width
    }

    const handleChange = (e) => {
        if(isNumeric && !(/^[0-9\b]+$/.test(e.target.value) || e.target.value === '')) return;
        onChange(e.target.value.substring(0, limit));
    }

    const handleBlur = (e) => {
        if(limit === null || limit < 1) return;
        onChange(e.target.value !== '' ? e.target.value.padStart(limit, '0') : '');
    }

    return (
        <div className='input-box-container' style={widthStyle}>
            <input placeholder={placeholder} value={value} type="text" className="input-box" onChange={e => handleChange(e)} onBlur={e => handleBlur(e)}/>
        </div>
    )
}

export default InputBox
