import React from 'react'
import '../stylesheets/pages.scss'
import { useState } from 'react';

const Profile = () => {
    const tempUserInfo = {
        UID: '123',
        firstName: 'john',
        lastName: 'doe',
        quadAffiliation: 'edens',
        birthday: '03092001',
        year: '2021',
        program: 'pratt',
        pointBalance: '100',
    };

    const colonSeparator = ' : ';

    const [ userInfo, setUserInfo ] = useState({
        basic: {
            UID: tempUserInfo.UID,
            firstName: tempUserInfo.firstName,
            lastName: tempUserInfo.lastName,
            quadAffiliation: tempUserInfo.quadAffiliation,
            birthday: tempUserInfo.birthday,
            year: tempUserInfo.year,
            program: tempUserInfo.program,
            pointBalance: tempUserInfo.pointBalance,
        },
        optional: {
            hometown: '',
            bio: '',
            profilePicture: '',
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
                    tags: '',
                },
                members: ['UID_1', 'UID_2'],
            }
        }
    });

    return (
        <div className='profile-page'>
            <h1>temp profile page</h1>
            <div className="info-container">
                {
                    Object.keys(userInfo.basic).map((key) => <p><strong>{key + colonSeparator}</strong>{userInfo.basic[key]}</p>)
                }
            </div>

        </div>
    )
}

export default Profile
