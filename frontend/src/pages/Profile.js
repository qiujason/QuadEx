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

    useEffect(() => {
        async function getUserInfo(){
            let response = await fetch('http://localhost:3001/users/?id=jq39');
            let data = await response.json();

            const prevUserInfo = { ...userInfo };
            Object.keys(data[0]).forEach(key => {
                prevUserInfo[key] = data[0][key];
            });
            setUserInfo(prevUserInfo);
        }
        getUserInfo();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        resetPrefValues();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userInfo]);

    const [ isSettingsOn, setIsSettingsOn ] = useState(false);

    const [ renderedEvents, setRenderedEvents ] = useState(userInfo.events);

    //sort events list chronologically
    renderedEvents.sort(function (i1, i2){
        var year1 = Number(i1.startDate.substring(4) + i1.startDate.substring(2, 4) + i1.startDate.substring(0, 2));
        var year2 = Number(i2.startDate.substring(4) + i2.startDate.substring(2, 4) + i2.startDate.substring(0, 2));
        return year1 - year2;
    });

    //filter rendered events by title
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

    const [ prefValues, setPrefValues ] = useState({});

    const updatePrefValue = (key, value) => {
        const prevObj = { ...prefValues };
        if(!(key in prevObj)) return;
        prevObj[key] = value;
        setPrefValues(prevObj);
    }

    const updateUserInfo = () => {
        const prevUserInfo = { ...userInfo };
        Object.keys(prefValues).forEach(key => {
            if(key in prevUserInfo) prevUserInfo[key] = prefValues[key];
        });
        prevUserInfo['birthday'] = prefValues['birthday_M'] + prefValues['birthday_D'] + prefValues['birthday_Y'];
        setUserInfo(prevUserInfo);

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
                        year: prevUserInfo.year ?? null,
                        hometown: prevUserInfo.hometown ?? null,
                        quad: prevUserInfo.quad ?? null,
                        degree: prevUserInfo.degree ?? null,
                        bio: prevUserInfo.bio ?? null,
                        insta: prevUserInfo.insta ?? null,
                        bday_cal: prevUserInfo.bday_cal
                    })
                }
            );
            //console.log(data);
        }
        putUserInfo();
    }

    const resetPrefValues = () => {
        //while(userInfo.net_id === 'net_id') setTimeout(() => {}, 100);
        setPrefValues({
            state_id: 'prefValues',
            first_name: userInfo.first_name,
            last_name: userInfo.last_name,
            quad: userInfo.quad,
            birthday_M: userInfo.birthday.substring(0, 2),
            birthday_D: userInfo.birthday.substring(2, 4),
            birthday_Y: userInfo.birthday.substring(4),
            year: userInfo.year,
            degree: userInfo.degree,
            insta: userInfo.insta,
            hometown: userInfo.hometown,
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
                <div className={'background' + (isSettingsOn ? ' active' : '')} onClick={() => {
                    setIsSettingsOn(false);
                    resetPrefValues();
                }}/>
                <div className={'settings-container' + (isSettingsOn ? ' active' : '')}>
                    <div className='title-container'>
                        <h1>SETTINGS</h1>
                    </div>

                    <div className='list-container'>
                        <p className='subheader'>Name</p>
                        {/* wait until userInfo data is fetched */}
                        {userInfo.net_id !== 'net_id' ? 
                            <div>
                                <div className='inputs-container'>
                                    <InputBox placeholder={'first'} value={prefValues['first_name']} width='11rem' onChange={val => updatePrefValue('first_name', val)}/>
                                    <InputBox placeholder={'last'} value={prefValues['last_name']} width='8rem' onChange={val => updatePrefValue('last_name', val)}/>
                                </div>

                                <p className='subheader'>Quad Affiliation</p>
                                <InputBox placeholder={'e.g. Cardinals'} value={prefValues['quad'] ?? ''} width='20rem' onChange={val => updatePrefValue('quad', val)}/>

                                <p className='subheader'>Birthday</p>
                                <div className='inputs-container'>
                                    <InputBox placeholder={'MM'} value={prefValues['birthday_M']} width='6rem' limit={2} isNumeric={true} onChange={val => updatePrefValue('birthday_M', val)}/>
                                    <InputBox placeholder={'DD'} value={prefValues['birthday_D']} width='6rem' limit={2} isNumeric={true} onChange={val => updatePrefValue('birthday_D', val)}/>
                                    <InputBox placeholder={'YYYY'} value={prefValues['birthday_Y']} width='8rem' limit={4} isNumeric={true} onChange={val => updatePrefValue('birthday_Y', val)}/>
                                </div>
                                
                                <p className='subheader'>School Year</p>
                                <InputBox placeholder={'e.g. 1, 2, 3, 4'} value={prefValues['year'] ?? ''} width='20rem' limit={1} isNumeric={true} onChange={val => updatePrefValue('year', val)}/>

                                <p className='subheader'>Degree Program</p>
                                <InputBox placeholder={'e.g. Computer Science'} value={prefValues['degree'] ?? ''} width='20rem' onChange={val => updatePrefValue('degree', val)}/>

                                <p className='subheader'>Instagram Handle</p>
                                <InputBox placeholder={'e.g. @optional'} value={prefValues['insta'] ?? ''} width='20rem' onChange={val => updatePrefValue('insta', val)}/>

                                <p className='subheader'>Hometown</p>
                                <InputBox placeholder={'e.g. City, State'} value={prefValues['hometown'] ?? ''} width='20rem' onChange={val => updatePrefValue('hometown', val)}/>

                                <p className='subheader'></p>
                            </div>
                        : ''}
                    </div>

                    <div className='btns-container'>
                        <IoMdCheckmarkCircle className='btn apply' onClick={() => {
                            setIsSettingsOn(false);
                            updateUserInfo();
                        }}/>
                        <IoMdCloseCircle className='btn cancel' onClick={() => {
                            setIsSettingsOn(false);
                            resetPrefValues();
                        }}/>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profile
