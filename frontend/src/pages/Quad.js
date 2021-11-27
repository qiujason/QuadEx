import React from 'react'
import { useState, useEffect } from 'react'
import '../stylesheets/QuadPage.scss'
import { BiCalendarEvent } from 'react-icons/bi'
import { MdNavigateBefore, MdNavigateNext } from 'react-icons/md'
import { IoMdCloseCircle } from 'react-icons/io'
import * as db from '../helpers/Database'
import UserTag from './UserTag'
import { capitalize, convertDate } from '../helpers/Helpers'
import { getCurrDateObj, getCurrDateMDY } from '../helpers/CurrDate'
import { MdAdminPanelSettings } from 'react-icons/md'
import { BiCalendar } from 'react-icons/bi'
import { convertTime } from '../helpers/Helpers'

const Quad = ({ netID, isAdmin }) => {

    const [ quadObj, setQuadObj ] = useState(null);
    const [ adminObjs, setAdminObjs ] = useState([]);
    const [ userObjs, setUserObjs ] = useState([]);
    const [ quadPoints, setQuadPoints ] = useState(0);
    const [ imageSrc, setImageSrc ] = useState(null);

    const [ dailyEventObjs, setDailyEventObjs ] = useState([]);
    const [ dailyUserObjs, setDailyUserObjs ] = useState([]);

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

    function sortByObjKey(key, a, b){
        return a[key].localeCompare(b[key]);
    }

    async function fetchMembers(){
        if(quadObj === null) return;

        const [ imageData, pointsData, userData, adminData, dailyUserData, dailyEventsData ] = await Promise.all([
            await db.getImage(`quad_${quadObj.name}`),
            await db.getPointsByQuad(quadObj.name),
            await db.getUsersByQuad(quadObj.name),
            await db.getAdminsByQuad(quadObj.name),
            await db.getUsersByBirthday(getCurrDateObj().month + getCurrDateObj().day, quadObj.name),
            await db.getEventsByDateAndQuad(getCurrDateMDY(), quadObj.name),
        ]);

        setImageSrc(imageData);
        if(pointsData !== null) setQuadPoints(pointsData);
        if(userData !== null){
            userData.sort(function(a, b){
                return sortByObjKey('first_name', a, b);
            })
            setUserObjs(userData);
        } 
        if(adminData !== null){
            adminData.sort(function(a, b){
                return sortByObjKey('first_name', a, b);
            })
            setAdminObjs(adminData);
        } 
        if(dailyUserData !== null){
            dailyUserData.sort(function(a, b){
                return sortByObjKey('first_name', a, b);
            })
            setDailyUserObjs(dailyUserData);
        }
        if(dailyEventsData !== null){
            dailyEventsData.sort(function(a, b){
                return sortByObjKey('time', a, b);
            })
            setDailyEventObjs(dailyEventsData);
        }
    }

    async function uploadImage(fileObj){
        await db.deleteImage(`quad_${quadObj.name}`);
        await db.postImage(fileObj, `quad_${quadObj.name}`);
        const imageData = await db.getImage(`quad_${quadObj.name}`);
        setImageSrc(imageData);
    }

    useEffect(() => {
        fetchQuad();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        fetchMembers();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [quadObj]);

    useEffect(() => {
        updateColumns();
        // eslint-disable-next-line react-hooks/exhaustive-deps
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

            const users = await db.getUsersByBirthday(month + day, quadObj.name) ?? [];

            const isToday = day === getCurrDateObj().day && month === getCurrDateObj().month && year === getCurrDateObj().year;

            newColumns.push(
                <div className={`column ${dayNames[i].toLowerCase()}` + (isToday ? ' today' : '')} key={i}>
                    <div className='title-container'>
                        <h1>{dayNames[i].toUpperCase()}</h1>
                        <p>{month + '/' + day + '/' + year.substring(2)}</p>
                    </div>
                    <div className='list-container'>
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
        {quadObj !== null ?
        <>
            <div className='info-container'>
                <div className='picture-container'>
                    {imageSrc !== null ?
                    <img src={imageSrc} alt=''/>
                    : null}
                </div>
                <div className='title-container'>
                    <h1>{quadObj.name.toUpperCase()}S</h1>
                    <p className='dorms'>Affiliated dorms : {quadObj.dorms.join(', ')}</p>
                    <p className='points'>{quadPoints} total points</p>
                </div>
                <div className='daily-bulletin-container'>
                    {isAdmin ?
                        <div className="filechooser-container">
                            <MdAdminPanelSettings className='icon'/>
                            <input type="file" className='filechooser' formEncType='multipart/form-data' onChange={async e => {
                                e.preventDefault();
                                uploadImage(e.target.files[0]);
                            }}/>
                        </div>
                    : null}
                    
                    <BiCalendar className='birthday-btn' onClick={() => setShowCalendar(true)}/>
                    <p className='birthday-calendar-subheader'>Show birthday calendar</p>
                    <div className="title-container">
                        <h1>DAILY BULLETIN</h1>
                        <p>{`Today's Date : ${getCurrDateObj().month}/${getCurrDateObj().day}/${getCurrDateObj().year.substring(2)}`}</p>
                    </div>
                    <div className="daily-events-container">
                        <div className="title-container">
                            <p className="title">EVENTS</p>
                            <p className="count-indicator">{dailyEventObjs.length}</p>
                        </div>
                        <p className="desc">{dailyEventObjs.length > 0 ? 'The following events are taking place today! Check them out from the events page!' : 'Looks like there are no events today!'}</p>
                        {dailyEventObjs.map(eventObj => 
                            <p key={eventObj.id}>&bull; "{eventObj.title.toUpperCase()}" : {convertTime(eventObj.time)} {eventObj.location !== null ? ` at ${capitalize(eventObj.location)}` : ''}</p>
                        )}
                    </div>
                    <div className="daily-birthdays-container">
                        <div className="title-container">
                            <p className="title">BIRTHDAYS</p>
                            <p className="count-indicator">{dailyUserObjs.length}</p>
                        </div>
                        <p className='desc'>{dailyUserObjs.length > 0 ? 'The following members have birthdays today. Make sure to wish them a happy birthday!' : 'Looks like no one has a birthday today!'}</p>
                        {dailyUserObjs.map(userObj => 
                            <p key={userObj.net_id}>&bull; {capitalize(userObj.first_name + ' ' + userObj.last_name)} : {userObj.net_id}</p>
                        )}
                    </div>
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
