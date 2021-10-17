import React from 'react'
import '../stylesheets/components.scss'

const InputBox = ({ placeholder }) => {
    return (
        <div className='input-box-container'>
            <input placeholder={placeholder} type="text" className="input-box"/>
        </div>
    )
}

export default InputBox
