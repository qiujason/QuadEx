import React from 'react'
import '../stylesheets/components.scss'

const InputBox = ({ placeholder, value, onChange, width = '10rem', limit, isNumeric = false, isCentered = false, isPassword = false, error = '', onEnter = () => {} }) => {
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

    const handleKeyPress = (e) => {
        if(e.key === 'Enter') onEnter();
    }

    return (
        <div className={'input-box-container' + (isCentered ? ' centered' : '')} style={widthStyle}>
            {error.length >= 1 ? <p className='error-display'>* {value === '' ? 'Required' : error}</p> : ''}
            <input placeholder={placeholder} value={value} onKeyDown={e => handleKeyPress(e)} type={!isPassword ? 'text' : 'password'} className="input-box" onChange={e => handleChange(e)} onBlur={e => handleBlur(e)}/>
        </div>
    )
}

export default InputBox
