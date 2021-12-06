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


const defaultImgSrc = 'https://ih1.redbubble.net/image.1297785969.6887/st,small,507x507-pad,600x600,f8f8f8.u1.jpg';
const dayNames = ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat'];

function sortListByKey(list, key){
    list.sort(function(a, b){
        return a[key].localeCompare(b[key]);
    })
}

const Quad = ({ netID, isAdmin }) => {

    // object for specified quad information
    const [ quadObj, setQuadObj ] = useState(null);

    // list of objects for users who are admins of the quad
    const [ adminObjs, setAdminObjs ] = useState([]);

    // list of objects for all users of quad
    const [ userObjs, setUserObjs ] = useState([]);

    // total number of points earned by quad
    const [ quadPoints, setQuadPoints ] = useState(0);

    // image source link for quad picture/logo
    const [ imageSrc, setImageSrc ] = useState(null);

    // list of objects for daily bulletin
    const [ dailyEventObjs, setDailyEventObjs ] = useState([]);
    const [ dailyUserObjs, setDailyUserObjs ] = useState([]);

    // boolean to determine whether to show birthday calendar
    const [ showCalendar, setShowCalendar ] = useState(false);

    // list of rendered column tags for birthday calendar columns
    const [ columns, setColumns ] = useState([]);

    // number of weeks from current date to show on birthday calendar
    const [ weekIncrement, setWeekIncrement ] = useState(0);

    // variables for condensed detailed user view (updated whenever user tag is clicked)
    const emptyDetailedUserObj = { net_id: null };
    const [ detailedUserObj, setDetailedUserObj ] = useState(emptyDetailedUserObj);
    const [ detailedUserProfilePic, setDetailedUserProfilePic ] = useState(null);


    // HTTP request functions

    // fetch user's affiliated quad
    async function fetchQuad(){
        const userData = await db.getUser(netID);
        if(userData !== null){
            const quadData = await db.getQuad(userData.quad);
            if(quadData !== null){
                setQuadObj(quadData[0]);
            }
        }
    }

    // fetch all other states dependent on quad
    async function fetchMembers(){
        if(quadObj === null) return;

        const [ imageData, pointsData, userData, adminData, dailyUserData, dailyEventsData ] = await Promise.all([
            await db.getImage(`quad_${quadObj.name}`),
            await db.getTotalPointsByQuad(quadObj.name),
            await db.getUsersByQuad(quadObj.name),
            await db.getAdminsByQuad(quadObj.name),
            await db.getUsersByBirthday(getCurrDateObj().month + getCurrDateObj().day, quadObj.name),
            await db.getEventsByDateAndQuad(getCurrDateMDY(), quadObj.name),
        ]);

        setImageSrc(imageData);
        if(pointsData !== null) setQuadPoints(pointsData);
        if(userData !== null){
            sortListByKey(userData, 'first_name');
            setUserObjs(userData);
        } 
        if(adminData !== null){
            sortListByKey(adminData, 'first_name');
            setAdminObjs(adminData);
        } 
        if(dailyUserData !== null){
            const filteredData = dailyUserData.filter(userObj => userObj.bday_cal === true);
            sortListByKey(filteredData, 'first_name');
            setDailyUserObjs(filteredData);
        }
        if(dailyEventsData !== null){
            sortListByKey(dailyEventsData, 'time');
            setDailyEventObjs(dailyEventsData);
        }
    }

    // function to update quad picture/logo
    async function uploadImage(fileObj){
        await db.deleteImage(`quad_${quadObj.name}`);
        await db.postImage(fileObj, `quad_${quadObj.name}`);
        const imageData = await db.getImage(`quad_${quadObj.name}`);
        setImageSrc(imageData);
    }

    // react hooks for when components are loaded/updated
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


    // other helper functions

    // change week increment for birthday calendar
    function changeWeek(increment){
        setWeekIncrement(weekIncrement + increment);
    }
    function resetWeek(){ setWeekIncrement(0); }

    // update columns in birthday calendar with birthdays of respective users
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
            const filteredUsers = users.filter(userObj => userObj.bday_cal === true);

            const isToday = (month + day + year === getCurrDateMDY());

            newColumns.push(
                <div className={`column ${dayNames[i].toLowerCase()}` + (isToday ? ' today' : '')} key={i}>
                    <div className='title-container'>
                        <h1>{dayNames[i].toUpperCase()}</h1>
                        <p>{month + '/' + day + '/' + year.substring(2)}</p>
                    </div>
                    <div className='list-container'>
                        {filteredUsers.map(userObj =>
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
                    <img src={imageSrc} alt='' onError={(e) => e.target.src=defaultImgSrc}/>
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
                    <img className='profile-pic' src={detailedUserProfilePic} alt='profile' onError={(e) => e.target.src=defaultImgSrc}/>
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
