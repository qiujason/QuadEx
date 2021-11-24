import React from 'react'
import { useState, useEffect } from 'react'
import '../stylesheets/QuadPage.scss'
import { BiCalendarEvent } from 'react-icons/bi'
import { MdNavigateBefore, MdNavigateNext } from 'react-icons/md'
import * as db from '../helpers/Database'
import UserTag from './UserTag'
import { capitalize, convertDate } from '../helpers/Helpers'

const Quad = () => {
    const [ columns, setColumns ] = useState([]);
    const [ weekIncrement, setWeekIncrement ] = useState(0);
    const dayNames = ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat'];

    const emptyDetailedUserObj = { net_id: null };
    const [ detailedUserObj, setDetailedUserObj ] = useState(emptyDetailedUserObj);
    const [ detailedUserProfilePic, setDetailedUserProfilePic ] = useState(null);

    useEffect(() => {
        updateColumns();
    }, [weekIncrement]);

    const changeWeek = (increment) => {
        setWeekIncrement(weekIncrement + increment);
    }

    const resetWeek = () => {
        setWeekIncrement(0);
    }

    const updateColumns = async () => {
        var newColumns = [];
        for(let i = 0; i < 7; i++){
            const date = new Date();
            const currFirst = date.getDate() - date.getDay() + 7 * weekIncrement;
            const newDate = new Date(date.setDate(currFirst + i));
            const day = newDate.getDate();
            const month = newDate.getMonth() + 1;
            const year = newDate.getFullYear();

            console.log(String(month) + String(day));
            const users = await db.getUsersByBirthday(String(month) + String(day) + String(year)) ?? [];

            const isToday = day === new Date().getDate() && month === new Date().getMonth() + 1 && year === new Date().getFullYear();

            newColumns.push(
                <div className={`column ${dayNames[i].toLowerCase()}` + (isToday ? ' today' : '')} key={i}>
                    <div className="title-container">
                        <h1>{dayNames[i].toUpperCase()}</h1>
                        <p>{month + '/' + day + '/' + year}</p>
                    </div>
                    <div className="list-container">
                        {users.map(userObj => 
                            <UserTag 
                                key={userObj.net_id} 
                                name={capitalize(userObj.first_name + ' ' + userObj.last_name)} 
                                netID={userObj.net_id} 
                                quad={userObj.quad}
                                isNameOnly={true}
                                onClick={async () => {
                                    setDetailedUserObj(userObj);
                                    const imgSrc = await db.getImage(`user_${userObj.net_id}`);
                                    setDetailedUserProfilePic(imgSrc);
                                }}
                            />
                        )}
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
                {columns}
            </div>

            <div className={'user-details-container' + (detailedUserObj.net_id !== null ? ' active' : '')}>
                <div className={'background' + (detailedUserObj.net_id !== null ? ' active' : '')} onClick={() => {
                    setDetailedUserObj(emptyDetailedUserObj);
                }}/>
                <div className={'user-details-info-container' + (detailedUserObj.net_id !== null ? ' active' : '')}>
                    <div className='user-details-title-container'>
                        <h1>{capitalize(detailedUserObj['first_name'] + ' ' + detailedUserObj['last_name'])}</h1>
                    </div>
                    <img className='profile-pic' src={detailedUserProfilePic} alt='profile'/>
                    <div className='info-box isBio'>
                        <p>'{detailedUserObj['bio'] ?? 'No bio found'}'</p>
                    </div>
                    <div className='info-box'>
                        <p className='title'>ABOUT</p>
                        <p><strong>Net ID :</strong> {detailedUserObj.net_id}</p>
                        <p><strong>Quad Affiliation :</strong> {capitalize(detailedUserObj['quad'] ?? '?')}</p>
                        <p><strong>Birthday :</strong> {detailedUserObj['bday_cal'] ? convertDate(detailedUserObj['birthday']) : 'Private'}</p>
                        <p><strong>Year :</strong> {detailedUserObj['year'] ?? '?'}</p>
                        <p><strong>Degree Program :</strong> {capitalize(detailedUserObj['degree'] ?? '?')}</p>
                    </div>

                    <div className='info-box'>
                        <p className='title'>CONTACT</p>
                        <p><strong>Instagram :</strong> {detailedUserObj['insta'] && detailedUserObj['insta'][0] !== '@' ? '@' : ''}{detailedUserObj['insta'] ?? '?'}</p>
                        <p><strong>Hometown :</strong> {detailedUserObj['hometown'] ?? '?'}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Quad
