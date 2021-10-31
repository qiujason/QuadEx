import React from 'react'
import '../stylesheets/pages.scss'
import EventTag from './EventTag'
import SearchField from './SearchField'
import InputBox from '../components/InputBox'
import { useState } from 'react'
import { convertDate, capitalize } from '../helpers/Helpers'
import { IoSettingsSharp } from 'react-icons/io5'

const Profile = () => {
    const tempUserInfo = {
        UID: 'jd123',
        firstName: 'john',
        lastName: 'doe',
        quadAffiliation: 'edens',
        birthday: '01012001',
        year: '2021',
        program: 'pratt',
        pointBalance: '100',
    };

    const [ isSettingsOn, setIsSettingsOn ] = useState(false);

    const [ userInfo, setUserInfo ] = useState({
        UID: tempUserInfo.UID,
        basic: {
            firstName: tempUserInfo.firstName,
            lastName: tempUserInfo.lastName,
            quadAffiliation: tempUserInfo.quadAffiliation,
            birthday: tempUserInfo.birthday,
            year: tempUserInfo.year,
            program: tempUserInfo.program,
            pointBalance: tempUserInfo.pointBalance,
        },
        optional: {
            picture: '',
            bio: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummyLorem Ipsum is simply dummy text of',
            // 150 character limit
            igHandle: '@johndoe',
            hometown: ['city/country', '[state]'],
        },
        events: [
            {
                // events should have unique generated ID
                basic: {
                    eventID: 'eventID1',
                    title: 'edens halloween',
                    startDate: '10312021',
                    endDate: '10312021',
                    startTime: '0600',
                    endTime: '2200',
                    location: 'page auditorium',
                    description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummyLorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummyLorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy',
                },
                optional: {
                    picture: '',
                }
                // event tag in profile page don't need members list
                // members: ['UID_1', 'UID_2'],
            },
            {
                basic: {
                    eventID: 'eventID2',
                    title: 'hack duke 2021',
                    startDate: '10232021',
                    endDate: '10242021',
                    startTime: '0900',
                    endTime: '1800',
                    location: 'bostock library',
                    description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummyLorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummyLorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy',
                },
                optional: {
                    picture: '',
                }
            },
        ],
        preferences: {
            birthdayPrivate: false,
        },
        role: 'member',
    });

    const [ renderedEvents, setRenderedEvents ] = useState(userInfo.events);

    renderedEvents.sort(function (i1, i2){
        var year1 = Number(i1.basic.startDate.substring(4));
        var year2 = Number(i2.basic.startDate.substring(4));
        if(year1 !== year2){
            return year1 - year2;
        } else {
            var month1 = Number(i1.basic.startDate.substring(2, 4));
            var month2 = Number(i2.basic.startDate.substring(2, 4));
            if(month1 !== month2){
                return month1 - month2;
            } else {
                var day1 = Number(i1.basic.startDate.substring(0, 2));
                var day2 = Number(i2.basic.startDate.substring(0, 2));
                if(day1 !== day2){
                    return day1 - day2;
                } else {
                    var time1 = Number(i1.basic.startTime);
                    var time2 = Number(i2.basic.startTime);
                    return time1 - time2;
                }
            }
        }
    });

    const filterTitle = (str) => {
        if(str.length === 0){
            setRenderedEvents(userInfo.events);
            return;
        }

        setRenderedEvents([]);
        for(let i = 0; i < userInfo.events.length; i++){
            if(userInfo.events[i].basic.title.toLowerCase().indexOf(str.toLowerCase()) !== -1){
                setRenderedEvents(renderedEvents => [...renderedEvents, userInfo.events[i]]);
            }
        }
    }

    // const updateBasicInfo = (key, value) => {
    //     // update preferences locally for now
    //     // [!] settings for updating info should NOT be based on text (prevent inspect)
    //     let newUserInfo = { ...userInfo };
    //     if(!(key in newUserInfo.basic)) return;
    //     newUserInfo.basic[key] = value;
    //     setUserInfo(newUserInfo);
    // }

    // const updateOptionalInfo = (key, value) => {

    // }

    // const updatePreferences = (key) => {
    //     let newUserInfo = { ...userInfo };
    //     if(!(key in newUserInfo.preferences)) return;
    //     newUserInfo.preferences[key] = !newUserInfo.preferences[key];
    //     setUserInfo(newUserInfo);
    // }

    return (
        <div className='profile-page'>
            <div className='info-page-container'>
                <div className='picture-container'>
                    <div className='profile-picture-container'>
                        <div className='profile-picture'/>
                    </div>
                    <div className='title-container'>
                        <h1>Hi, {userInfo.basic.firstName.toUpperCase()}.</h1>
                        <p className='bio-text'>"{userInfo.optional.bio}"</p>
                        <p>{userInfo.basic.pointBalance} Points</p>
                    </div>
                </div>
                <div className='info-sub-container'>
                    {/* <div className='info-box first'>
                        <p className='title'>BIO</p>
                        <p>"{userInfo.optional.bio}"</p>
                    </div> */}
                    <div className='info-box first'>
                        <p className='title'>ABOUT</p>
                        <p><strong>Net ID:</strong> {userInfo.UID}</p>
                        <p><strong>Name:</strong> {capitalize(userInfo.basic.firstName + ' ' + userInfo.basic.lastName)}</p>
                        <p><strong>Quad Affiliation:</strong> {capitalize(userInfo.basic.quadAffiliation)}</p>
                        <p><strong>Birthday:</strong> {convertDate(userInfo.basic.birthday)}</p>
                        <p><strong>Year:</strong> {userInfo.basic.year}</p>
                        <p><strong>Degree Program:</strong> {capitalize(userInfo.basic.program)}</p>
                    </div>
                    <div className='info-box'>
                        <p className='title'>CONTACT</p>
                        <p><strong>Instagram:</strong> {userInfo.optional.igHandle}</p>
                        <p><strong>Hometown:</strong> {capitalize(userInfo.optional.hometown[0]) + (userInfo.optional.hometown.length > 1 ? ', ' + userInfo.optional.hometown[1].toUpperCase() : '')}</p>
                    </div>                    
                    <IoSettingsSharp className='settings-btn' onClick={() => setIsSettingsOn(true)}/>
                </div>
            </div>
            <div className='events-page-container'>
                <div className='events-container'>
                    <div className='title-container'>
                        <h1>EVENTS</h1>
                    </div>
                    <div className='filter-container'>
                        <SearchField placeholder='Search for events by title' onChange={filterTitle}/>
                    </div>
                    {/* { title, startDate, endDate, startTime, endTime, location, description, picture } */}
                    <div className='list-container'>
                        {
                            renderedEvents.map((eventObj) => 
                            <EventTag 
                            key={eventObj.basic.eventID}
                            title={eventObj.basic.title} 
                            startDate={eventObj.basic.startDate} 
                            endDate={eventObj.basic.endDate} 
                            startTime={eventObj.basic.startTime} 
                            endTime={eventObj.basic.endTime} 
                            location={eventObj.basic.location}
                            description={eventObj.basic.description} 
                            />)
                        }
                    </div>
                </div>
            </div>


            <div className={'settings-page-container' + (isSettingsOn ? ' active' : '')}>
                <div className={'background' + (isSettingsOn ? ' active' : '')}/>
                <div className={'settings-container' + (isSettingsOn ? ' active' : '')}>
                    <div className='title-container'>
                        <h1>SETTINGS</h1>
                    </div>

                    <div className='list-container'>
                        <p className='subheader'>Name</p>
                        <div className='inputs-container'>
                            <InputBox placeholder='first' width='11rem'/>
                            <InputBox placeholder='last' width='8rem'/>
                        </div>

                        <p className='subheader'>Quad Affiliation</p>
                        <InputBox placeholder='e.g. edens' width='20rem'/>

                        <p className='subheader'>Birthday</p>
                        <div className='inputs-container'>
                            <InputBox placeholder='MM' width='6rem'/>
                            <InputBox placeholder='DD' width='6rem'/>
                            <InputBox placeholder='YYYY' width='8rem'/>
                        </div>
                        
                        <p className='subheader'>School Year</p>
                        <InputBox placeholder='YYYY' width='20rem'/>

                        <p className='subheader'>Degree Program</p>
                        <InputBox placeholder='e.g. Pratt/Trinity' width='20rem'/>

                        <p className='subheader'>Instagram Handle</p>
                        <InputBox placeholder='e.g. @optional' width='20rem'/>

                        <p className='subheader'>Hometown</p>
                        <div className='inputs-container'>
                            <InputBox placeholder='city/country' width='11rem'/>
                            <InputBox placeholder='state' width='8rem'/>
                        </div>    

                        <p className='subheader'></p>
                    </div>

                    <div className='btns-container'>
                        <div className='btn apply' onClick={() => setIsSettingsOn(false)}>
                            APPLY
                        </div>
                        <div className='btn cancel' onClick={() => setIsSettingsOn(false)}>CANCEL</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profile
