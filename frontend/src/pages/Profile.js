import React from 'react'
import '../stylesheets/pages.scss'
import EventTag from './EventTag';
import { useState } from 'react';
import { convertDate, capitalize } from '../helpers/Helpers';
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
            bio: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy',
            igHandle: '@johndoe',
            hometown: ['city/country', '[state]'],
        },
        events: {
            "eventID_1": {
                // events should have unique generated ID
                basic: {
                    title: 'edens halloween',
                    startDate: '09312021',
                    endDate: '09312021',
                    startTime: '1200',
                    endTime: '2000',
                    location: 'page auditorium',
                    description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummyLorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummyLorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy',
                },
                optional: {
                    picture: '',
                }
                // event tag in profile page don't need members list
                // members: ['UID_1', 'UID_2'],
            },
            "eventID_2": {
                basic: {
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
        },
        preferences: {
            birthdayPrivate: false,
        },
        role: 'member',
    });

    const updateBasicInfo = (key, value) => {
        // update preferences locally for now
        // [!] settings for updating info should NOT be based on text (prevent inspect)
        let newUserInfo = { ...userInfo };
        if(!(key in newUserInfo.basic)) return;
        newUserInfo.basic[key] = value;
        setUserInfo(newUserInfo);
    }

    const updateOptionalInfo = (key, value) => {

    }

    const updatePreferences = (key) => {
        let newUserInfo = { ...userInfo };
        if(!(key in newUserInfo.preferences)) return;
        newUserInfo.preferences[key] = !newUserInfo.preferences[key];
        setUserInfo(newUserInfo);
    }

    return (
        <div className='profile-page'>
            <div className="info-page-container">
                <div className="picture-container">
                    <div className="profile-picture-container">
                        <div className="profile-picture"/>
                    </div>
                    <div className="title-container">
                        <h1>Hi, {userInfo.basic.firstName.toUpperCase()}.</h1>
                        <p>{userInfo.basic.pointBalance} Points</p>
                    </div>
                </div>
                <div className="info-sub-container">
                    <div className="info-box first">
                        <p className="title">BIO</p>
                        <p>"{userInfo.optional.bio}"</p>
                    </div>
                    <div className="info-box">
                        <p className="title">ABOUT</p>
                        <p><strong>Net ID:</strong> {userInfo.UID}</p>
                        <p><strong>Name:</strong> {capitalize(userInfo.basic.firstName + ' ' + userInfo.basic.lastName)}</p>
                        <p><strong>Quad Affiliation:</strong> {capitalize(userInfo.basic.quadAffiliation)}</p>
                        <p><strong>Birthday:</strong> {convertDate(userInfo.basic.birthday)}</p>
                        <p><strong>Year:</strong> {userInfo.basic.year}</p>
                        <p><strong>Degree Program:</strong> {capitalize(userInfo.basic.program)}</p>
                    </div>
                    <div className="info-box">
                        <p className="title">CONTACT</p>
                        <p><strong>Instagram:</strong> {userInfo.optional.igHandle}</p>
                        <p><strong>Hometown:</strong> {capitalize(userInfo.optional.hometown[0]) + (userInfo.optional.hometown.length > 1 ? ', ' + userInfo.optional.hometown[1].toUpperCase() : '')}</p>
                    </div>
                    
                    <IoSettingsSharp className='settings-btn' onClick={() => console.log('yeyeyeye')}/>
                </div>
            </div>
            <div className="events-page-container">
                <div className="events-container">
                    <div className="title-container">
                        <h1>EVENTS</h1>
                    </div>
                    <div className="filter-container">

                    </div>
                    {/* { title, startDate, endDate, startTime, endTime, location, description, picture } */}
                    <div className="list-container">
                        {
                            Object.keys(userInfo.events).map((eventID) => 
                            <EventTag 
                            key={eventID}
                            title={userInfo.events[eventID].basic.title} 
                            startDate={userInfo.events[eventID].basic.startDate} 
                            endDate={userInfo.events[eventID].basic.endDate} 
                            startTime={userInfo.events[eventID].basic.startTime} 
                            endTime={userInfo.events[eventID].basic.endTime} 
                            location={userInfo.events[eventID].basic.location}
                            description={userInfo.events[eventID].basic.description} 
                            />)
                        }
                    </div>
                </div>
            </div>


            {/* <h1>temp profile page</h1>
            <div className="info-container">
                {
                    Object.keys(userInfo.basic).map((key) => <p><strong>{key + colonSeparator}</strong>{userInfo.basic[key]}</p>)
                }
            </div>
            <button className="yese" onClick={() => updatePreferences("birthdayPrivate")}>hello</button> */}
        </div>
    )
}

export default Profile
