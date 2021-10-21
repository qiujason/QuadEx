import React from 'react'
import { FaSearch } from 'react-icons/fa'
import { useState } from 'react'

const SearchField = ({ placeholder, onChange }) => {
    const [ focused, setFocused ] = useState(false);
    const [ hovering, setHovering ] = useState(false);

    const onKeyDown = (e) => {
        if(e.key === 'Enter'){
            e.target.blur();
        }
    }

    return (
        <div className="search-container">
            <input type="text" placeholder={placeholder} onChange={e => onChange(e.target.value)} onKeyDown={e => onKeyDown(e)} onMouseEnter={() => setHovering(true)} onMouseLeave={() => setHovering(false)} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}/>
            <FaSearch className={'search-btn' + (focused ? ' focused' : '') + (hovering ? ' hover' : '')}/>
        </div>
    )
}

export default SearchField
