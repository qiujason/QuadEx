import React from 'react'
import { FaSearch } from 'react-icons/fa'
import { useState } from 'react'

const SearchField = () => {
    const [ focused, setFocused ] = useState(false);
    const [ hovering, setHovering ] = useState(false);

    return (
        <div className="search-container">
            <input type="text" placeholder='Search for events' onMouseEnter={() => setHovering(true)} onMouseLeave={() => setHovering(false)} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}/>
            <FaSearch className={'search-btn' + (focused ? ' focused' : '') + (hovering ? ' hover' : '')}/>
        </div>
    )
}

export default SearchField
