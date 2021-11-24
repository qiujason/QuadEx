import React from 'react'
import { useState, useEffect } from 'react'
import '../stylesheets/QuadPage.scss'
import { BiCalendarEvent } from 'react-icons/bi'
import { MdNavigateBefore, MdNavigateNext } from 'react-icons/md'

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
            const day = newDate.getDate();
            const month = newDate.getMonth() + 1;

            newColumns.push(
                <div className={'column' + (day === new Date().getDate() && month === new Date().getMonth() + 1 ? ' today' : '')} key={i}>
                    <div className="title-container">
                        <h1>{dayNames[i].toUpperCase()}</h1>
                        <p>{month + '/' + day}</p>
                    </div>
                </div>
            )
        }
        setColumns(newColumns);
    }

    return (
        <div className='quad-page'>
            <div className="calendar-container">
                <div className="title-container">
                    <h1>BIRTHDAY CALENDAR</h1>
                    <MdNavigateBefore className='icon-btn arrow' onClick={() => changeWeek(-1)}/>
                    <BiCalendarEvent className='icon-btn' onClick={() => resetWeek()}/>
                    <MdNavigateNext className='icon-btn arrow' onClick={() => changeWeek(1)}/>
                </div>
                {columns.length > 0 ?
                    columns
                : null}
            </div>
        </div>
    )
}

export default Quad
