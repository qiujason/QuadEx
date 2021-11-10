import React from 'react'
import '../stylesheets/HomePage.scss'
import EventTag from './EventTag'
import SearchField from './SearchField'
import InputBox from '../components/InputBox'
import { useState, useEffect } from 'react'
import { convertDate, capitalize } from '../helpers/Helpers'
import { IoSettingsSharp } from 'react-icons/io5'
import { IoMdCheckmarkCircle, IoMdCloseCircle } from 'react-icons/io'


const minPasswordLength = 4;

const Profile = ({ netID }) => {
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
        isAdmin: false,
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

    useEffect(() => {
        fetchUserInfo();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    async function fetchUserInfo() {
        let userResponse = await fetch('http://localhost:3001/users/?id=' + netID);
        let userData = await userResponse.json();

        let eventsResponse = await fetch('http://localhost:3001/events/favoriteByUser/?id=' + netID);
        let eventsData = await eventsResponse.json();

        let pointsResponse = await fetch('http://localhost:3001/points/user/sum/?id=' + netID);
        let pointsData = await pointsResponse.json();

        let adminResponse = await fetch('http://localhost:3001/admins/?id=' + netID);
        let adminData = await adminResponse.json();

        const prevUserInfo = { ...userInfo };
        Object.keys(userData[0]).forEach(key => {
            prevUserInfo[key] = userData[0][key];
        });
        prevUserInfo.events = eventsData;
        prevUserInfo.points = pointsData[0].sum;
        prevUserInfo.isAdmin = adminData.length > 0;
        setUserInfo(prevUserInfo);
    }


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
            const date = new Date();
            var currDate, eventDate;
            userInfo.events.forEach(eventObj => {
                currDate = Number(String(date.getFullYear()) + String(date.getMonth() + 1).padStart(2, '0') + String(date.getDate()).padStart(2, '0') + String(date.getHours()).padStart(2, '0') + String(date.getMinutes()).padStart(2, '0'));
                eventDate = Number(eventObj.date.substring(4) + eventObj.date.substring(0, 2) + eventObj.date.substring(2, 4) + eventObj.time.substring(0, 2) + eventObj.time.substring(2));
                if(eventDate >= currDate) setRenderedEvents(renderedEvents => [...renderedEvents, eventObj]);
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

    async function unfavoriteEvent(event_id) {
        await fetch('http://localhost:3001/events/favoriteForUser/?net_id=' + userInfo.net_id + '&event_id=' + event_id, 
            { 
                method: 'DELETE', 
                headers: {
                    'Content-Type': 'application/json',
                },
                body: null
            } 
        );
        fetchUserInfo();
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

    const updateUserInfo = () => {
        // check for invalid inputs
        var numErrors = 0;
        const requiredKeys = ['first_name', 'last_name', 'quad', 'birthday_M', 'birthday_D', 'birthday_Y'];
        requiredKeys.forEach(key => {
            if(settingsValues[key][0] === ''){
                updateSettingsValues(key, true);
                numErrors++;
            }
        });
        if(settingsValues['password'][0] !== '' && String(settingsValues['password'][0]).length < 4){
            numErrors++;
            updateSettingsValues('password', true);
        }
        if(settingsValues['password'][0] !== userInfo.password && settingsValues['confirm_password'][0] !== settingsValues['password'][0]){
            numErrors++;
            updateSettingsValues('confirm_password', true);
        }
        if(Number(settingsValues['birthday_M'][0]) < 1 || Number(settingsValues['birthday_M'][0]) > 12){
            numErrors++;
            updateSettingsValues('birthday_M', true);
        }
        if(Number(settingsValues['birthday_D'][0]) < 1 || Number(settingsValues['birthday_D'][0]) > 31){
            numErrors++;
            updateSettingsValues('birthday_D', true);
        }
        if(Number(settingsValues['birthday_Y'][0]) > new Date().getFullYear()){
            numErrors++;
            updateSettingsValues('birthday_Y', true);
        }
        if(!['raven', 'cardinal', 'eagle', 'robin', 'blue jay', 'owl', 'dove'].includes(String(settingsValues['quad'][0]).toLowerCase())){
            updateSettingsValues('quad', true);
            numErrors++;
        }

        if(numErrors > 0) return;

        // update userInfo object
        const prevUserInfo = { ...userInfo };
        Object.keys(settingsValues).forEach(key => {
            if(key in prevUserInfo) prevUserInfo[key] = (settingsValues[key][0] === '' ? null : settingsValues[key][0]);
        });
        prevUserInfo['birthday'] = settingsValues['birthday_M'][0] + settingsValues['birthday_D'][0] + settingsValues['birthday_Y'][0];
        setUserInfo(prevUserInfo);

        // update database
        async function putUserInfo(){
            await fetch('http://localhost:3001/users/?id=' + prevUserInfo.net_id, 
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        net_id: prevUserInfo.net_id, 
                        password: prevUserInfo.password,
                        first_name: prevUserInfo.first_name,
                        last_name: prevUserInfo.last_name,
                        birthday: prevUserInfo.birthday,
                        year: prevUserInfo.year,
                        hometown: prevUserInfo.hometown,
                        quad: prevUserInfo.quad,
                        degree: prevUserInfo.degree,
                        bio: prevUserInfo.bio,
                        insta: prevUserInfo.insta,
                        bday_cal: prevUserInfo.bday_cal
                    })
                }
            );
        }
        putUserInfo();
        setIsSettingsOn(false);
    }

    const resetSettingsValues = () => {
        setSettingsValues({
            first_name: [userInfo.first_name, false],
            last_name: [userInfo.last_name, false],
            password: [userInfo.password, false],
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


    return (
        <div className='profile-page'>
            <div className='info-page-container'>
                <div className='picture-container'>
                    <div className='profile-picture-container'>
                        <div className='profile-picture'/>
                    </div>
                    <div className='title-container'>
                        <h1>Hi, {userInfo.first_name.toUpperCase()}.</h1>
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
                                <textarea value={settingsValues['bio'][0] ?? ''} onChange={e => {
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
                            
                            <p className='subheader'/>

                            <div className="checkbox">
                                <div className={'icon-container' + (settingsValues['bday_cal'][0] ? ' active' : '')} onClick={() => updateSettingsValues('bday_cal', !settingsValues['bday_cal'][0])}>
                                    {settingsValues['bday_cal'][0] ? <IoMdCheckmarkCircle className='icon active'/> : <IoMdCloseCircle className='icon'/>}
                                </div>
                                <p>Make birthday public</p>
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
