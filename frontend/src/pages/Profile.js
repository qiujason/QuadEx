import React from 'react'
import '../stylesheets/pages.scss'
import EventTag from './EventTag'
import SearchField from './SearchField'
import InputBox from '../components/InputBox'
import { useState, useEffect } from 'react'
import { convertDate, capitalize } from '../helpers/Helpers'
import { IoSettingsSharp } from 'react-icons/io5'
import { IoMdCheckmarkCircle, IoMdCloseCircle } from 'react-icons/io'

/*
    const postTest = () => {
        fetch('http://localhost:3001/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                net_id:'dp239', 
                password:'pass',
                first_name: 'donghan',
                last_name: 'park',
                birthday: '03092001',
                year: null,
                hometown: null,
                quad: null,
                degree: null,
                bio: null,
                insta: null,
                bday_cal: true
            })
        }).then(response => {
            return response.text();
        }).then(data => {
            console.log(data);
        });
    }

    const putTest = () => {
        fetch('http://localhost:3001/users/?id=dp239', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                net_id:'dp239', 
                password:'pass',
                first_name: 'PAMPAM',
                last_name: 'park',
                birthday: '03092001',
                year: '2023',
                hometown: 'auburn, AL',
                quad: null,
                degree: 'pratt',
                bio: null,
                insta: null,
                bday_cal: true
            })
        }).then(response => {
            return response.text();
        }).then(data => {
            console.log(data);
        });
    }
*/

const Profile = () => {
    useEffect(() => {
        fetch('http://localhost:3001/users/?id=dp239')
        .then(response => response.json())
        .then(data => {
            const prevData = { ...userInfo };
            Object.keys(data[0]).forEach(key => prevData[key] = data[0][key]);
            setUserInfo(prevData);
        });
    }, []);

    const [ isSettingsOn, setIsSettingsOn ] = useState(false);

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
        events: [
            {
                // events should have unique generated ID
                eventID: 'eventID1',
                title: 'edens halloween',
                startDate: '10312021',
                endDate: '10312021',
                startTime: '0600',
                endTime: '2200',
                location: 'page auditorium',
                description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummyLorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummyLorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy',
                picture: null,
                // event tag in profile page don't need members list
                // members: ['UID_1', 'UID_2'],
            },
            {
                eventID: 'eventID2',
                title: 'hack duke 2021',
                startDate: '10232021',
                endDate: '10242021',
                startTime: '0900',
                endTime: '1800',
                location: 'bostock library',
                description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummyLorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummyLorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy',
                picture: null,
            },
        ]
    });

    const [ renderedEvents, setRenderedEvents ] = useState(userInfo.events);

    //sort events list chronologically
    renderedEvents.sort(function (i1, i2){
        var year1 = Number(i1.startDate.substring(4) + i1.startDate.substring(2, 4) + i1.startDate.substring(0, 2));
        var year2 = Number(i2.startDate.substring(4) + i2.startDate.substring(2, 4) + i2.startDate.substring(0, 2));
        return year1 - year2;
    });

    const filterTitle = (str) => {
        if(str.length === 0){
            setRenderedEvents(userInfo.events);
            return;
        }

        setRenderedEvents([]);
        for(let i = 0; i < userInfo.events.length; i++){
            if(userInfo.events[i].title.toLowerCase().indexOf(str.toLowerCase()) !== -1){
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
                        <h1>Hi, {userInfo.first_name.toUpperCase()}.</h1>
                        <p className='bio-text'>"{userInfo.bio ?? 'Add a bio!'}"</p>
                        <p>[temp: 100] Points</p>
                    </div>
                </div>
                <div className='info-sub-container'>
                    <div className='info-box first'>
                        <p className='title'>ABOUT</p>
                        <p><strong>Net ID:</strong> {userInfo.net_id}</p>
                        <p><strong>Name:</strong> {capitalize(userInfo.first_name + ' ' + userInfo.last_name)}</p>
                        <p><strong>Quad Affiliation:</strong> {capitalize(userInfo.quad ?? '?')}</p>
                        <p><strong>Birthday:</strong> {convertDate(userInfo.birthday)}</p>
                        <p><strong>Year:</strong> {userInfo.year ?? '?'}</p>
                        <p><strong>Degree Program:</strong> {capitalize(userInfo.degree ?? '?')}</p>
                    </div>
                    <div className='info-box'>
                        <p className='title'>CONTACT</p>
                        <p><strong>Instagram:</strong> {userInfo.insta ? '@' : ''}{userInfo.insta ?? '?'}</p>
                        <p><strong>Hometown:</strong> {userInfo.hometown ?? '?'}</p>
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
                            key={eventObj.eventID}
                            title={eventObj.title} 
                            startDate={eventObj.startDate} 
                            endDate={eventObj.endDate} 
                            startTime={eventObj.startTime} 
                            endTime={eventObj.endTime} 
                            location={eventObj.location}
                            description={eventObj.description} 
                            />)
                        }
                    </div>
                </div>
            </div>


            <div className={'settings-page-container' + (isSettingsOn ? ' active' : '')}>
                <div className={'background' + (isSettingsOn ? ' active' : '')} onClick={() => setIsSettingsOn(false)}/>
                <div className={'settings-container' + (isSettingsOn ? ' active' : '')}>
                    <div className='title-container'>
                        <h1>SETTINGS</h1>
                    </div>

                    <div className='list-container'>
                        <p className='subheader'>Name</p>
                        <div className='inputs-container'>
                            <InputBox placeholder={userInfo.first_name} width='11rem'/>
                            <InputBox placeholder={userInfo.last_name} width='8rem'/>
                        </div>

                        <p className='subheader'>Quad Affiliation</p>
                        <InputBox placeholder={userInfo.quad ?? 'e.g. Cardinals'} width='20rem'/>

                        <p className='subheader'>Birthday</p>
                        <div className='inputs-container'>
                            <InputBox placeholder={userInfo.birthday.substring(0, 2)} width='6rem'/>
                            <InputBox placeholder={userInfo.birthday.substring(2, 4)} width='6rem'/>
                            <InputBox placeholder={userInfo.birthday.substring(4)} width='8rem'/>
                        </div>
                        
                        <p className='subheader'>School Year</p>
                        <InputBox placeholder={userInfo.year ?? 'e.g. 1, 2, 3, 4'} width='20rem'/>

                        <p className='subheader'>Degree Program</p>
                        <InputBox placeholder={userInfo.degree ?? 'e.g. Economimcs'} width='20rem'/>

                        <p className='subheader'>Instagram Handle</p>
                        <InputBox placeholder={userInfo.insta ?? 'e.g. @optional'} width='20rem'/>

                        <p className='subheader'>Hometown</p>
                        <InputBox placeholder={userInfo.hometown ?? 'e.g. City, State'} width='20rem'/>

                        <p className='subheader'></p>
                    </div>

                    <div className='btns-container'>
                        <IoMdCheckmarkCircle className='btn apply' onClick={() => setIsSettingsOn(false)}/>
                        <IoMdCloseCircle className='btn cancel' onClick={() => setIsSettingsOn(false)}/>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profile
