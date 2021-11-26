import React from 'react'
import { useState, useEffect } from 'react'
import '../stylesheets/QuadPage.scss'
import { BiCalendarEvent } from 'react-icons/bi'
import { MdNavigateBefore, MdNavigateNext } from 'react-icons/md'
import { IoMdCloseCircle } from 'react-icons/io'
import * as db from '../helpers/Database'
import UserTag from './UserTag'
import { capitalize, convertDate } from '../helpers/Helpers'
import { getCurrDateObj } from '../helpers/CurrDate'
import { MdAdminPanelSettings } from 'react-icons/md'
import { BiCalendar } from 'react-icons/bi'

const Quad = ({ netID }) => {

    const [ quadObj, setQuadObj ] = useState(null);
    const [ adminObjs, setAdminObjs ] = useState([]);
    const [ userObjs, setUserObjs ] = useState([]);
    const [ quadPoints, setQuadPoints ] = useState(0);

    const [ showCalendar, setShowCalendar ] = useState(false);

    const [ columns, setColumns ] = useState([]);
    const [ weekIncrement, setWeekIncrement ] = useState(0);
    const dayNames = ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat'];

    const emptyDetailedUserObj = { net_id: null };
    const [ detailedUserObj, setDetailedUserObj ] = useState(emptyDetailedUserObj);
    const [ detailedUserProfilePic, setDetailedUserProfilePic ] = useState(null);

    async function fetchQuad(){
        const userData = await db.getUser(netID);
        if(userData !== null){
            const quadData = await db.getQuad(userData.quad);
            if(quadData !== null){
                setQuadObj(quadData[0]);
            }
        }
    }

    async function fetchMembers(){
        if(quadObj === null) return;
        const userData = await db.getUsersByQuad(quadObj.name);
        const adminData = await db.getAdminsByQuad(quadObj.name);
        if(userData !== null){
            userData.sort(function(a, b){
                return a.first_name.localeCompare(b.first_name);
            })
            setUserObjs(userData);
        } 
        if(adminData !== null){
            adminData.sort(function(a, b){
                return a.first_name.localeCompare(b.first_name);
            })
            setAdminObjs(adminData);
        } 

        const pointsData = await db.getPointsByQuad(quadObj.name);
        if(pointsData !== null) setQuadPoints(pointsData);
    }

    useEffect(() => {
        fetchQuad();
    }, []);

    useEffect(() => {
        fetchMembers();
    }, [quadObj]);

    useEffect(() => {
        updateColumns();
    }, [quadObj, userObjs, weekIncrement]);

    function changeWeek(increment){
        setWeekIncrement(weekIncrement + increment);
    }

    function resetWeek(){ setWeekIncrement(0); }

    const updateColumns = async () => {
        var newColumns = [];
        if(quadObj === null) return;
        for(let i = 0; i < 7; i++){
            const date = new Date();
            const currFirst = date.getDate() - date.getDay() + 7 * weekIncrement;
            const newDate = new Date(date.setDate(currFirst + i));
            const day = String(newDate.getDate()).padStart(2, '0');
            const month = String(newDate.getMonth() + 1).padStart(2, '0');
            const year = String(newDate.getFullYear()).padStart(4, '0');

            const users = await db.getUsersByBirthday(month + day) ?? [];

            const isToday = day === getCurrDateObj().day && month === getCurrDateObj().month && year === getCurrDateObj().year;

            newColumns.push(
                <div className={`column ${dayNames[i].toLowerCase()}` + (isToday ? ' today' : '')} key={i}>
                    <div className='title-container'>
                        <h1>{dayNames[i].toUpperCase()}</h1>
                        <p>{month + '/' + day + '/' + year.substring(2)}</p>
                    </div>
                    <div className='list-container'>
                        {users.map(userObj => {
                            if(userObj.quad === quadObj.name){
                                return <UserTag 
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
                            }
                            return null;
                        })}
                    </div>
                </div>
            )
        }
        setColumns(newColumns);
    }

    return (
        <div className='quad-page'>
        {quadObj !== null ?
        <>
            <div className='info-container'>
                <div className='picture-container'>
                    <img src='https://ih1.redbubble.net/image.1297785969.6887/st,small,507x507-pad,600x600,f8f8f8.u1.jpg' alt=''/>
                </div>
                <div className='title-container'>
                    <h1>{quadObj.name.toUpperCase()}S</h1>
                    <p className='dorms'>{quadObj.dorms.join(', ')}</p>
                    <p className='points'>{quadPoints} points</p>
                </div>
                <div className='background'>

                </div>
            </div>

            <div className='roster-container'>
                <div className='title-container'>
                    <h1>MEMBERS</h1>
                    <p className='count-indicator'>{userObjs.length}</p>
                </div>
                <div className='grid-spacer'/> 

                <p className='subheader'>Quad Admins<MdAdminPanelSettings className='icon'/> </p>
                <div className='admins-list-container'>
                    {adminObjs.map(userObj => 
                        <UserTag 
                            key={userObj.net_id} 
                            name={capitalize(userObj.first_name + ' ' + userObj.last_name)} 
                            netID={userObj.net_id} 
                            quad={userObj.title}
                            isAdmin={true}
                            onClick={async () => {
                                setDetailedUserObj(userObj);
                                const imgSrc = await db.getImage(`user_${userObj.net_id}`);
                                setDetailedUserProfilePic(imgSrc);
                            }}
                        />
                    )}
                </div>

                <p className='subheader'>All Members</p>
                <div className='list-container'>
                    {userObjs.map(userObj => 
                        <UserTag 
                            key={userObj.net_id} 
                            name={capitalize(userObj.first_name + ' ' + userObj.last_name)} 
                            netID={userObj.net_id} 
                            quad={userObj.quad}
                            onClick={async () => {
                                setDetailedUserObj(userObj);
                                const imgSrc = await db.getImage(`user_${userObj.net_id}`);
                                setDetailedUserProfilePic(imgSrc);
                            }}
                        />
                    )}       
                </div>
            </div>
            
            {showCalendar ?
                <div className='calendar-container'>
                    <div className='title-container'>
                        <h1>BIRTHDAY CALENDAR</h1>
                        <MdNavigateBefore className='icon-btn arrow' onClick={() => changeWeek(-1)}/>
                        <BiCalendarEvent className='icon-btn' onClick={() => resetWeek()}/>
                        <MdNavigateNext className='icon-btn arrow' onClick={() => changeWeek(1)}/>
                        <IoMdCloseCircle className='close-btn' onClick={() => setShowCalendar(false)}/>
                    </div>
                    {columns}
                </div>
            : null}

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
        </>
        : ''}
        </div>
    )
}

export default Quad
