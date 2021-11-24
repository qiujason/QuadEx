import React from 'react'
import { useState, useEffect } from 'react'
import '../stylesheets/QuadPage.scss'

const Quad = () => {
    const [ columns, setColumns ] = useState([]);
    const [ weekIncrement, setWeekIncrement ] = useState(0);
    const dayNames = ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat'];

    useEffect(() => {
        updateColumns();
    }, [weekIncrement]);

    const changeWeek = (increment) => {
        setWeekIncrement(weekIncrement + increment);
    }

    const resetWeek = () => {
        setWeekIncrement(0);
    }

    const updateColumns = () => {
        var newColumns = [];
        for(let i = 0; i < 7; i++){
            const date = new Date();
            const currFirst = date.getDate() - date.getDay() + 7 * weekIncrement;
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
                    <p className='prev-btn' onClick={() => changeWeek(-1)}>prev</p>
                    <p className='next-btn' onClick={() => changeWeek(1)}>next</p>
                    
                    <p className='today-btn' onClick={() => resetWeek()}>today</p>
                </div>
                {columns.length > 0 ?
                    columns
                : null}
            </div>
        </div>
    )
}

export default Quad
