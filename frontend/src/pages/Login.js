import React from 'react'
import '../stylesheets/pages.scss'
import InputBox from '../components/InputBox'
import { useState } from 'react'
import { GiAtomicSlashes } from 'react-icons/gi'

const minPasswordLength = 4;

/*
TODO:

test include past event filter with times (dates checked): add total # of events indicator

separate field checkers into separate class -> 
settings fields must also be value checked in similar fashion

update password in settings
*/

const Login = ({ setNetID }) => {
    const [ isSignUp, setIsSignUp ] = useState(false);

    const [ inputValues, setInputValues ] = useState({
        username: ['', false],
        password: ['', false],
    });

    const [ registerValues, setRegisterValues ] = useState({
        net_id: ['', false],
        password: ['', false],
        confirm_password: ['', false],
        first_name: ['', false],
        last_name: ['', false],
        quad: ['', false],
        birthday_M: ['', false],
        birthday_D: ['', false],
        birthday_Y: ['', false],
    });

    const updateState = (state, func, key, value) => {
        let prevObj = { ...state };
        prevObj[key][typeof value == 'boolean' ? 1 : 0] = value;
        func(prevObj);
    }

    async function fetchUserData() {
        const net_id = inputValues.username[0];
        let userResponse = await fetch('http://localhost:3001/users/?id=' + net_id);
        let userData = await userResponse.json();

        if(userData[0] && 'password' in userData[0]){
            // user found
            if(inputValues.password[0] === userData[0].password) {
                console.log('successful authentication');
                setNetID(inputValues.username[0]);
            } else {
                updateState(inputValues, setInputValues, 'password', true);
            }
        } else {
            updateState(inputValues, setInputValues, 'username', true);
        }
    }

    async function postUserData() {
        let userResponse = await fetch('http://localhost:3001/users/?id=' + registerValues.net_id[0]);
        let userData = await userResponse.json();

        var numErrors = 0;
        Object.keys(registerValues).forEach(key => {
            if(registerValues[key][0] === ''){
                updateState(registerValues, setRegisterValues, key, true);
                numErrors++;
            }
        });
        
        if(userData.length > 0){
            numErrors++;
            updateState(registerValues, setRegisterValues, 'net_id', true);
        }
        if(String(registerValues.password[0]).length < 4){
            numErrors++;
            updateState(registerValues, setRegisterValues, 'password', true);
        }
        if(registerValues.confirm_password[0] !== registerValues.password[0]){
            numErrors++;
            updateState(registerValues, setRegisterValues, 'confirm_password', true);
        }
        if(Number(registerValues.birthday_M[0]) < 1 || Number(registerValues.birthday_M[0]) > 12){
            numErrors++;
            updateState(registerValues, setRegisterValues, 'birthday_M', true);
        }
        if(Number(registerValues.birthday_D[0]) < 1 || Number(registerValues.birthday_D[0]) > 31){
            numErrors++;
            updateState(registerValues, setRegisterValues, 'birthday_D', true);
        }
        if(Number(registerValues.birthday_Y[0]) > new Date().getFullYear()){
            numErrors++;
            updateState(registerValues, setRegisterValues, 'birthday_Y', true);
        }
        if(!['raven', 'cardinal', 'eagle', 'robin', 'blue jay', 'owl', 'dove'].includes(String(registerValues.quad[0]).toLowerCase())){
            numErrors++;
            updateState(registerValues, setRegisterValues, 'quad', true);
        }

        if(numErrors === 0){
            await fetch('http://localhost:3001/users', 
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        net_id: registerValues.net_id[0], 
                        password: registerValues.password[0], 
                        first_name: registerValues.first_name[0], 
                        last_name: registerValues.last_name[0], 
                        birthday: String(registerValues.birthday_M[0]) + String(registerValues.birthday_D[0]) + String(registerValues.birthday_Y[0]), 
                        year: null,
                        hometown: null,
                        quad: String(registerValues.quad[0]).toLowerCase(),
                        degree: null,
                        bio: null,
                        insta: null,
                        bday_cal: true
                    })
                }
            );

            updateState(inputValues, setInputValues, 'username', registerValues.net_id[0]);
            updateState(inputValues, setInputValues, 'password', registerValues.password[0]);
            await fetchUserData();
        }
    }

    return (
        <div className='login-page'>
            <h1 className='title'>WELCOME TO <p><GiAtomicSlashes className='icon'/> QUAD EX.</p></h1>
            {
                isSignUp ? 
                    <div className="signup-container">
                        <p className='subheader'>Net ID</p>
                        <InputBox 
                            error={registerValues.net_id[1] ? 'Already taken' : ''} 
                            placeholder='e.g. abc123' 
                            value={registerValues.net_id[0]} 
                            width='16rem'
                            onChange={val => {
                                updateState(registerValues, setRegisterValues, 'net_id', val);
                                updateState(registerValues, setRegisterValues, 'net_id', false);
                            }} 
                        />
                        <p className='subheader'>Password</p>
                        <InputBox 
                            error={registerValues.password[1] ? 'Must be at least ' + minPasswordLength + ' characters' : ''} 
                            placeholder={'At least ' + minPasswordLength + ' characters'}
                            value={registerValues.password[0]}
                            width='16rem'
                            isPassword={true}
                            onChange={val => {
                                updateState(registerValues, setRegisterValues, 'password', val);
                                updateState(registerValues, setRegisterValues, 'confirm_password', '');
                                updateState(registerValues, setRegisterValues, 'password', false);
                            }}
                        />
                        <p className='subheader'>Confirm Password</p>
                        <InputBox 
                            error={registerValues.confirm_password[1] ? 'Passwords do not match': ''} 
                            placeholder='Password'
                            value={registerValues.confirm_password[0]} 
                            width='16rem'
                            isPassword={true}
                            onChange={val => {
                                updateState(registerValues, setRegisterValues, 'confirm_password', val);
                                updateState(registerValues, setRegisterValues, 'confirm_password', false);
                            }} 
                        />
                        <p className='subheader'>Name</p>
                        <div className="inputs-container">
                            <InputBox
                                error={registerValues.first_name[1] ? 'Invalid': ''} 
                                placeholder='First' 
                                value={registerValues.first_name[0]} 
                                width='8.5rem'
                                onChange={val => {
                                    updateState(registerValues, setRegisterValues, 'first_name', val);
                                    updateState(registerValues, setRegisterValues, 'first_name', false);
                                }} 
                            />
                            <InputBox
                                error={registerValues.last_name[1] ? 'Invalid': ''} 
                                placeholder='Last' 
                                value={registerValues.last_name[0]} 
                                width='6.5rem'
                                onChange={val => {
                                    updateState(registerValues, setRegisterValues, 'last_name', val);
                                    updateState(registerValues, setRegisterValues, 'last_name', false);
                                }} 
                            />
                        </div>
                        <p className='subheader'>Birthday</p>
                        <div className="inputs-container">
                            <InputBox 
                                error={registerValues.birthday_M[1] ? 'Invalid': ''} 
                                placeholder='MM' 
                                value={registerValues.birthday_M[0]} 
                                width='4rem'
                                limit={2} 
                                isNumeric={true}
                                onChange={val => {
                                    updateState(registerValues, setRegisterValues, 'birthday_M', val);
                                    updateState(registerValues, setRegisterValues, 'birthday_M', false);
                                }} 
                            />
                            <InputBox 
                                error={registerValues.birthday_D[1] ? 'Invalid': ''} 
                                placeholder='DD' 
                                value={registerValues.birthday_D[0]} 
                                width='4rem'
                                limit={2} 
                                isNumeric={true}
                                onChange={val => {
                                    updateState(registerValues, setRegisterValues, 'birthday_D', val);
                                    updateState(registerValues, setRegisterValues, 'birthday_D', false);
                                }} 
                            />
                            <InputBox 
                                error={registerValues.birthday_Y[1] ? 'Invalid': ''} 
                                placeholder='YYYY' 
                                value={registerValues.birthday_Y[0]} 
                                width='6rem'
                                limit={4} 
                                isNumeric={true}
                                onChange={val => {
                                    updateState(registerValues, setRegisterValues, 'birthday_Y', val);
                                    updateState(registerValues, setRegisterValues, 'birthday_Y', false);
                                }} 
                            />
                        </div>
                        <p className='subheader'>Affiliated Quad</p>
                        <InputBox 
                            error={registerValues.quad[1] ? 'Invalid quad name': ''} 
                            placeholder='e.g. Cardinal' 
                            value={registerValues.quad[0]} 
                            width='16rem'
                            onChange={val => {
                                updateState(registerValues, setRegisterValues, 'quad', val);
                                updateState(registerValues, setRegisterValues, 'quad', false);
                            }} 
                        />
                        <div className="primary-btn" onClick={() => postUserData()}>Sign Up</div>
                        <p className='separator'>. . .</p>
                        <div className="secondary-btn" onClick={() => setIsSignUp(false)}>Log in with Existing Account</div>
                    </div>
                :
                    <div className="login-container">
                        <InputBox 
                            error={inputValues.username[1] ? 'Username not found': ''} 
                            placeholder='Username' value={inputValues.username[0]} 
                            width='16rem'
                            onEnter={() => fetchUserData()}
                            onChange={val => {
                                updateState(inputValues, setInputValues, 'username', val);
                                updateState(inputValues, setInputValues, 'username', false);
                            }} 
                        />
                        <InputBox 
                            error={inputValues.password[1] ? 'Password incorrect': ''} 
                            placeholder='Password' 
                            value={inputValues.password[0]} 
                            width='16rem'
                            isPassword={true}
                            onEnter={() => fetchUserData()}
                            onChange={val => {
                                updateState(inputValues, setInputValues, 'password', val);
                                updateState(inputValues, setInputValues, 'password', false);
                            }} 
                        />
                        <div className="primary-btn" onClick={() => fetchUserData()}>Log In</div>
                        <p className='separator'>. . .</p>
                        <div className="secondary-btn" onClick={() => setIsSignUp(true)}>Create New Account</div>
                    </div>
            }
            
            
        </div>
    )
}

export default Login
