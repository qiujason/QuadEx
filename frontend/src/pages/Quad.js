import React from 'react'
import { useState, useEffect } from 'react'
import '../stylesheets/QuadPage.scss'

const Quad = () => {
    const [ columns, setColumns ] = useState([]);
    const dayNames = ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat'];

    useEffect(() => {
        updateColumns();
    }, []);

    const updateColumns = () => {
        var newColumns = [];
        for(let i = 0; i < 7; i++){
            const date = new Date();
            const currFirst = date.getDate() - date.getDay() + 7*14;
            console.log(currFirst);
            const newDate = new Date(date.setDate(currFirst + i));
            const newFirst = newDate.getDate();
            const newMonth = newDate.getMonth() + 1;

            newColumns.push(
                <div className='column' key={i}>
                    <h1>{dayNames[i]}</h1>
                    <p>{newMonth + '/' + newFirst}</p>
                </div>
            )
        }
        setColumns(newColumns);
    }

    return (
        <div className='quad-page'>
            <div className="calendar-container">
                <div className="title-container">
                    <h1>TITLE</h1>
                </div>
                {columns.length > 0 ?
                    columns
                : null}
            </div>
        </div>
    )
}

export default Quad
