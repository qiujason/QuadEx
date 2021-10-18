import React from 'react'
import '../stylesheets/pages.scss'
import { useState } from 'react';
import { convertDate } from '../helpers/Helpers';

const Profile = () => {
    const tempUserInfo = {
        UID: '123',
        firstName: 'john',
        lastName: 'doe',
        quadAffiliation: 'edens',
        birthday: '01012001',
        year: '2021',
        program: 'pratt',
        pointBalance: '100',
    };

    const colonSeparator = ' : ';

    const [ userInfo, setUserInfo ] = useState({
        UID: tempUserInfo.UID,
        basic: {
            firstName: tempUserInfo.firstName,
            lastName: tempUserInfo.lastName,
            quadAffiliation: tempUserInfo.quadAffiliation,
            birthday: convertDate(tempUserInfo.birthday),
            year: tempUserInfo.year,
            program: tempUserInfo.program,
            pointBalance: tempUserInfo.pointBalance,
        },
        optional: {
            picture: '',
            bio: '',
            igHandle: '',
            hometown: ['city/country', 'state'],
        },
        events: {
            "example_title_1": {
                // events should have unique generated ID
                basic: {
                    title: '',
                    description: '',
                    location: '',
                    date: '',
                    time: '',
                },
                optional: {
                    picture: '',
                }
                // event tag in profile page don't need members list
                // members: ['UID_1', 'UID_2'],
            }
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
                        <p>300 Points</p>
                    </div>
                </div>
                <div className="info-sub-container">

                </div>
            </div>
            <div className="events-page-container">

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
