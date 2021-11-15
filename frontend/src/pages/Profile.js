import React from 'react'
import '../stylesheets/HomePage.scss'
import EventTag from './EventTag'
import SearchField from './SearchField'
import InputBox from '../components/InputBox'
import { useState, useEffect } from 'react'
import { convertDate, capitalize } from '../helpers/Helpers'
import { IoSettingsSharp } from 'react-icons/io5'
import { IoMdCheckmarkCircle, IoMdCloseCircle } from 'react-icons/io'
// import { MdAdminPanelSettings } from 'react-icons/md'
import { FaPlusCircle } from 'react-icons/fa'

import * as db from '../helpers/Database'
import * as currDate from '../helpers/CurrDate'
import * as errorHandler from '../helpers/ErrorHandler'


const minPasswordLength = 4;

const Profile = ({ netID, isAdmin }) => {
    const [ userInfo, setUserInfo ] = useState({
        net_id:'net_id', 
        password:'password',
        first_name: 'first_name',
        last_name: 'last_name',
        birthday: '00000000',
        year: null,
        hometown: null,
        quad: null,
        degree: null,
        bio: null,
        insta: null,
        bday_cal: true,
        points: 0,
        events: [
            {
                id: null,
                title: 'edens halloween',
                time: '0600',
                date: '10312021',
                end_time: '2200',
                end_date: '10312021',
                description: 'test_description',
                location: 'page auditorium',
                tags: []
            },
        ]
    });

    const [ profilePic, setProfilePic ] = useState(null);

    async function fetchUserInfo() {
        const userObj = await db.getUser(netID);
        const favEventObjs = await db.getFavEventsByUser(netID);
        const totalPoints = await db.getTotalPointsByUser(netID);

        // for images
        // var data = new FormData();
        // data.append("data", imagedata);

        const prevUserInfo = { ...userInfo };
        Object.keys(userObj).forEach(key => prevUserInfo[key] = userObj[key]);
        prevUserInfo.events = favEventObjs;
        prevUserInfo.points = totalPoints;
        setUserInfo(prevUserInfo);

        const imageRes = await db.getImage('http://localhost:3001/images/' + netID + '_profile_pic');
        setProfilePic(imageRes !== null ? URL.createObjectURL(imageRes) : 'https://ih1.redbubble.net/image.1297785969.6887/st,small,507x507-pad,600x600,f8f8f8.u1.jpg');
    }

    useEffect(() => {
        fetchUserInfo();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    // == EVENTS == //

    const [ showPastEvents, setShowPastEvents ] = useState(false);
    const [ renderedEvents, setRenderedEvents ] = useState(userInfo.events);

    useEffect(() => {
        resetSettingsValues();
        if(showPastEvents){
            setRenderedEvents(userInfo.events);
            return;
        } else {
            setRenderedEvents([]);
            var eventDate;
            userInfo.events.forEach(eventObj => {
                eventDate = Number(eventObj.date.substring(4) + eventObj.date.substring(0, 2) + eventObj.date.substring(2, 4) + eventObj.time.substring(0, 2) + eventObj.time.substring(2));
                if(eventDate >= Number(currDate.getCurrDateYMDHM())) setRenderedEvents(renderedEvents => [...renderedEvents, eventObj]);
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showPastEvents, userInfo]);

    // sort events list chronologically
    renderedEvents.sort(function (i1, i2){
        var year1 = Number(i1.date.substring(4) + i1.date.substring(0, 2) + i1.date.substring(2, 4));
        var year2 = Number(i2.date.substring(4) + i2.date.substring(0, 2) + i2.date.substring(2, 4));
        return year1 - year2;
    });

    // filter rendered events by title
    const filterTitle = (str) => {
        if(str.length === 0){
            setRenderedEvents(userInfo.events);
            return;
        }

        setRenderedEvents([]);
        userInfo.events.forEach(eventObj => {
            if(eventObj.title.toLowerCase().indexOf(str.toLowerCase()) !== -1){
                setRenderedEvents(renderedEvents => [...renderedEvents, eventObj]);
            }
        });
    }

    // change
    async function unfavoriteEvent(event_id) {
        await db.deleteFavEvent(userInfo.net_id, event_id);
        fetchUserInfo();
    }

    // ====== MISC ====== //

    async function hasInputError(requiredKeys, state, setFunc){
        const errorObj = await errorHandler.checkInputs(state, requiredKeys);
        if(errorObj !== null){
            setFunc(errorObj);
            return true;
        }
        return false;
    }

    // == SETTINGS & PREFERENCES == //

    const [ isSettingsOn, setIsSettingsOn ] = useState(false);
    const [ settingsValues, setSettingsValues ] = useState({});

    const updateSettingsValues = (key, value) => {
        const prevObj = { ...settingsValues };
        if(!(key in prevObj)) return;
        if(key !== 'bday_cal'){
            prevObj[key][typeof value === 'boolean' ? 1 : 0] = value;
        } else {
            prevObj[key][0] = value;
        }
        if(typeof value !== 'boolean') prevObj[key][1] = false;
        setSettingsValues(prevObj);
    }

    async function updateUserInfo() {
        const requiredKeys = ['first_name', 'last_name', 'quad', 'birthday_M', 'birthday_D', 'birthday_Y'];
        if(await hasInputError(requiredKeys, settingsValues, setSettingsValues)) return;

        // update userInfo object
        const prevUserInfo = { ...userInfo };
        Object.keys(settingsValues).forEach(key => {
            if(key in prevUserInfo) prevUserInfo[key] = (settingsValues[key][0] === '' ? null : settingsValues[key][0]);
        });
        if(settingsValues['password'][0] === '') prevUserInfo['password'] = userInfo.password;
        prevUserInfo['birthday'] = settingsValues['birthday_M'][0] + settingsValues['birthday_D'][0] + settingsValues['birthday_Y'][0];
        setUserInfo(prevUserInfo);

        // update database
        const putRes = await db.putUser(prevUserInfo);
        if(putRes) setIsSettingsOn(false);
        //console.log('put request: ' + putRes);
    }

    const resetSettingsValues = () => {
        setSettingsValues({
            first_name: [userInfo.first_name, false],
            last_name: [userInfo.last_name, false],
            password: ['', false],
            confirm_password: ['', false],
            quad: [userInfo.quad, false],
            birthday_M: [userInfo.birthday.substring(0, 2), false],
            birthday_D: [userInfo.birthday.substring(2, 4), false],
            birthday_Y: [userInfo.birthday.substring(4), false],
            year: [userInfo.year, false],
            degree: [userInfo.degree, false],
            insta: [userInfo.insta, false],
            hometown: [userInfo.hometown, false],
            bday_cal: [userInfo.bday_cal, false],
            bio: [userInfo.bio, false],
        });
    }


    // == POINTS == //

    const [ isPointsOn, setIsPointsOn ] = useState(false);
    const emptyPointsValues = {
        net_id: ['', false],
        reason: ['', false],
        point_value: ['', false],
    };
    const [ pointsValues, setPointsValues ] = useState(emptyPointsValues);
    const [ pointsResIndicator, setPointsResIndicator ] = useState({
        isShowing: false,
        isSuccess: false,
    });

    function activatePointsResIndicator(result) {
        const prevObj = { ...pointsResIndicator };
        prevObj.isShowing = true;
        prevObj.isSuccess = result;
        setPointsResIndicator(prevObj);
    }

    function resetPointsResIndicator(){
        const prevObj = { ...pointsResIndicator };
        Object.keys(prevObj).forEach(key => prevObj[key] = false);
        setPointsResIndicator(prevObj);
    }

    const updatePointsValues = (key, value) => {
        const prevObj = { ...pointsValues };
        if(!(key in prevObj)) return;
        prevObj[key][typeof value === 'boolean' ? 1 : 0] = value;
        if(typeof value !== 'boolean') prevObj[key][1] = false;
        resetPointsResIndicator();
        setPointsValues(prevObj);
    }

    async function postPoints(){
        // check for invalid inputs
        const requiredKeys = ['net_id', 'reason', 'point_value'];
        if(await hasInputError(requiredKeys, pointsValues, setPointsValues)) return;

        const postRes = await db.postPoints(pointsValues.net_id[0], pointsValues.reason[0], pointsValues.point_value[0]);
        activatePointsResIndicator(postRes);
        setPointsValues(emptyPointsValues);
        fetchUserInfo();
    }

    async function uploadImage(fileObj){
        await fetch('http://localhost:3001/images/' + netID + '_profile_pic', 
            { 
                method: 'DELETE', 
                headers: {
                    'Content-Type': 'application/json',
                },
                body: null
            } 
        );

        const formData = new FormData();
        formData.append("image", fileObj, netID + '_profile_pic');

        await fetch('http://localhost:3001/images', 
            {
                method: 'POST',
                body: formData,
            }
        );

        await fetchUserInfo();
    }

    return (
        <div className='profile-page'>            
            <input type="file" className='filechooser' formEncType='multipart/form-data' onChange={async e => {
                e.preventDefault();
                await uploadImage(e.target.files[0]);
            }}/>

            {isAdmin ? 
                <div className="admin-main-container">
                    <div className={'background' + (isPointsOn ? ' active' : '')} onClick={() => {
                        setIsPointsOn(false);
                        resetPointsResIndicator();
                        setPointsValues(emptyPointsValues);
                    }}/>
                    <div className="admin-container">
                        <div className={'title-container' + (isPointsOn ? ' active' : '')}>
                            <FaPlusCircle className='admin-icon' onClick={() => setIsPointsOn(true)}/>
                            <p>Manage Points</p>
                        </div>
                        {isPointsOn ? 
                            <div className='body-container'>
                                <p className='subheader'>NetID</p>
                                <InputBox placeholder={'NetID of recipient'} value={pointsValues['net_id'][0] ?? ''} error={pointsValues['net_id'][1] ? 'NetID not found' : ''} width='18rem' onChange={val => updatePointsValues('net_id', val)}/>
                                
                                <p className='subheader'>Reason</p>
                                {pointsValues.reason[1] ? <p className='error-display'>* Required</p> : ''}
                                <div className="textarea-container">
                                    <textarea placeholder='Describe reason...' value={pointsValues['reason'][0] ?? ''} onChange={e => {
                                        if(e.target.value.length <= 100){
                                            updatePointsValues('reason', e.target.value);
                                        }
                                    }}/>
                                    <p className='char-count-indicator'>{String(pointsValues['reason'][0] ?? '').length}/100</p>
                                </div>

                                <p className='subheader'>Point Value</p>
                                <InputBox placeholder={'Number of points to award'} value={pointsValues['point_value'][0] ?? ''} isNumeric={true} error={pointsValues['point_value'][1] ? 'Invalid' : ''} width='18rem' onChange={val => updatePointsValues('point_value', val)}/>
                            
                                <div className='btns-container'>
                                    <IoMdCheckmarkCircle className='btn apply' onClick={() => {
                                        postPoints();
                                    }}/>
                                    <IoMdCloseCircle className='btn cancel' onClick={() => {
                                        setIsPointsOn(false);
                                        resetPointsResIndicator();
                                        setPointsValues(emptyPointsValues);
                                    }}/>
                                </div>
                                {pointsResIndicator.isShowing ? <p className={'success-indicator' + (pointsResIndicator.isSuccess ? ' success' : '')}>
                                    {pointsResIndicator.isSuccess ? 'Points successfully awarded' : 'Oops! Something went wrong'}
                                </p> : ''}
                            </div>
                        : ''}
                    </div>
                </div>
            : ''}

            <div className='info-page-container'>
                <div className='picture-container'>
                    <div className='profile-picture-container'>
                        <img className='profile-picture' src={profilePic} alt='profile'/>
                    </div>
                    <div className='title-container'>
                        <div className="title">
                            <h1>Hi, {userInfo.first_name.toUpperCase()}.</h1>
                        </div>
                        <p className='bio-text'>"{userInfo.bio ?? 'Add a bio!'}"</p>
                        <p>{userInfo.points ?? '0'} points</p>
                    </div>
                </div>
                <div className='info-sub-container'>
                    <div className='info-box first'>
                        <p className='title'>ABOUT</p>
                        <p><strong>Net ID :</strong> {userInfo.net_id}</p>
                        <p><strong>Name :</strong> {capitalize(userInfo.first_name + ' ' + userInfo.last_name)}</p>
                        <p><strong>Quad Affiliation :</strong> {capitalize(userInfo.quad ?? '?')}</p>
                        <p><strong>Birthday :</strong> {convertDate(userInfo.birthday)}</p>
                        <p><strong>Year :</strong> {userInfo.year ?? '?'}</p>
                        <p><strong>Degree Program :</strong> {capitalize(userInfo.degree ?? '?')}</p>
                    </div>
                    <div className='info-box'>
                        <p className='title'>CONTACT</p>
                        <p><strong>Instagram :</strong> {userInfo.insta && userInfo.insta[0] !== '@' ? '@' : ''}{userInfo.insta ?? '?'}</p>
                        <p><strong>Hometown :</strong> {userInfo.hometown ?? '?'}</p>
                    </div>                    
                    <IoSettingsSharp className='settings-btn' onClick={() => setIsSettingsOn(true)}/>
                </div>
            </div>

            <div className='events-page-container'>
                <div className='events-container'>
                    <div className='title-container'>
                        <h1>MY EVENTS<p>{renderedEvents.length}</p></h1>
                    </div>
                    <div className='filter-container'>
                        <SearchField placeholder='Search for events by title' onChange={filterTitle}/>
                        <div className="time-container">
                            <div className={'icon-container' + (showPastEvents ? ' active' : '')} onClick={() => setShowPastEvents(!showPastEvents)}>
                                {showPastEvents ? <IoMdCheckmarkCircle className='icon active'/> : <IoMdCloseCircle className='icon'/>}
                            </div>
                            <p>Include past events</p>
                        </div>
                    </div>
                    {/* { title, startDate, endDate, startTime, endTime, location, description, picture } */}
                    <div className='list-container'>
                        {
                            renderedEvents.map((eventObj) => 
                                <EventTag 
                                    key={eventObj.id}
                                    title={eventObj.title} 
                                    startDate={eventObj.date} 
                                    endDate={eventObj.end_date} 
                                    startTime={eventObj.time} 
                                    endTime={eventObj.end_time} 
                                    location={eventObj.location}
                                    description={eventObj.description} 
                                    initialFavoriteState={true}
                                    onBtnClick={() => unfavoriteEvent(eventObj.id)}
                                />
                            )
                        }
                        {
                            renderedEvents.length < 1 ?
                                <p className='no-events-indicator'>No favorited events found</p>
                            : ''
                        }
                    </div>
                </div>
            </div>

            <div className={'settings-page-container' + (isSettingsOn ? ' active' : '')}>
                <div className={'background' + (isSettingsOn ? ' active' : '')} onClick={() => {
                    setIsSettingsOn(false);
                    resetSettingsValues();
                }}/>
                <div className={'settings-container' + (isSettingsOn ? ' active' : '')}>
                    <div className='title-container'>
                        <h1>SETTINGS</h1>
                    </div>

                    {userInfo.net_id !== 'net_id' ? 
                        <div className='list-container'>
                            <p className='header'>BASIC INFORMATION</p>

                            <p className='subheader'>Name</p>
                            <div className='inputs-container'>
                                <InputBox placeholder={'First'} value={settingsValues['first_name'][0]} error={settingsValues['first_name'][1] ? 'error' : ''} width='10rem' onChange={val => updateSettingsValues('first_name', val)}/>
                                <InputBox placeholder={'Last'} value={settingsValues['last_name'][0]} error={settingsValues['last_name'][1] ? 'error' : ''}  width='7rem' onChange={val => updateSettingsValues('last_name', val)}/>
                            </div>

                            <p className='subheader'>Quad Affiliation</p>
                            <InputBox placeholder={'e.g. Cardinal'} value={settingsValues['quad'][0] ?? ''} error={settingsValues['quad'][1] ? 'Invalid quad name' : ''} width='18rem' onChange={val => updateSettingsValues('quad', val)}/>

                            <p className='subheader'>Birthday</p>
                            <div className='inputs-container'>
                                <InputBox placeholder={'MM'} value={settingsValues['birthday_M'][0]} error={settingsValues['birthday_M'][1] ? 'Invalid' : ''} width='5rem' limit={2} isNumeric={true} onChange={val => updateSettingsValues('birthday_M', val)}/>
                                <InputBox placeholder={'DD'} value={settingsValues['birthday_D'][0]} error={settingsValues['birthday_D'][1] ? 'Invalid' : ''} width='5rem' limit={2} isNumeric={true} onChange={val => updateSettingsValues('birthday_D', val)}/>
                                <InputBox placeholder={'YYYY'} value={settingsValues['birthday_Y'][0]} error={settingsValues['birthday_Y'][1] ? 'Invalid' : ''} width='6rem' limit={4} isNumeric={true} onChange={val => updateSettingsValues('birthday_Y', val)}/>
                            </div>
                            
                            <p className='subheader'>School Year</p>
                            <InputBox placeholder={'e.g. 1, 2, 3, 4'} value={settingsValues['year'][0] ?? ''} width='18rem' limit={1} isNumeric={true} onChange={val => updateSettingsValues('year', val)}/>

                            <p className='subheader'>Degree Program</p>
                            <InputBox placeholder={'e.g. Computer Science'} value={settingsValues['degree'][0] ?? ''} width='18rem' onChange={val => updateSettingsValues('degree', val)}/>

                            <p className='subheader'>Instagram Handle</p>
                            <InputBox placeholder={'e.g. @optional'} value={settingsValues['insta'][0] ?? ''} width='18rem' onChange={val => updateSettingsValues('insta', val)}/>

                            <p className='subheader'>Hometown</p>
                            <InputBox placeholder={'e.g. City, State'} value={settingsValues['hometown'][0] ?? ''} width='18rem' onChange={val => updateSettingsValues('hometown', val)}/>

                            <p className='subheader'>Bio</p>
                            <div className="textarea-container">
                                <textarea placeholder='Describe yourself...' value={settingsValues['bio'][0] ?? ''} onChange={e => {
                                    if(e.target.value.length <= 150){
                                        updateSettingsValues('bio', e.target.value);
                                    }
                                }}/>
                                <p className='char-count-indicator'>{(settingsValues['bio'][0] ?? '').length}/150</p>
                            </div>
                            

                            <p className='header'>PREFERENCES</p>

                            <p className='subheader'>New Password</p>
                            <InputBox placeholder={'At least ' + minPasswordLength + ' characters'} value={settingsValues['password'][0] ?? ''} error={settingsValues['password'][1] ? 'Must be at least ' + minPasswordLength + ' characters' : ''} isPassword={true} width='18rem' onChange={val => { updateSettingsValues('password', val); updateSettingsValues('confirm_password', '') }}/>

                            <p className='subheader'>Confirm New Password</p>
                            <InputBox placeholder={'Password'} value={settingsValues['confirm_password'][0] ?? ''} error={settingsValues['confirm_password'][1] ? 'Passwords do not match' : ''} isPassword={true} width='18rem' onChange={val => updateSettingsValues('confirm_password', val)}/>
                            
                            <p className='subheader'>Birthday preference</p>
                            <div className="checkbox">
                                <div className={'icon-container' + (settingsValues['bday_cal'][0] ? ' active' : '')} onClick={() => updateSettingsValues('bday_cal', !settingsValues['bday_cal'][0])}>
                                    {settingsValues['bday_cal'][0] ? <IoMdCheckmarkCircle className='icon active'/> : <IoMdCloseCircle className='icon'/>}
                                </div>
                                <p>Make public</p>
                            </div>

                            <p className='subheader'/>
                        </div>
                    : ''}

                    <div className='btns-container'>
                        <IoMdCheckmarkCircle className='btn apply' onClick={() => {
                            updateUserInfo();
                        }}/>
                        <IoMdCloseCircle className='btn cancel' onClick={() => {
                            setIsSettingsOn(false);
                            resetSettingsValues();
                        }}/>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profile
