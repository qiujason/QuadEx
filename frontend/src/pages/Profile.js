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
            hometown: '',
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
