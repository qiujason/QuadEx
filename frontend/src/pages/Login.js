import React from 'react'
import '../stylesheets/pages.scss'
import InputBox from '../components/InputBox'
import { useState } from 'react'
import { GiAtomicSlashes } from 'react-icons/gi'

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
        year: ['', false],
        degree: ['', false],
        insta: ['', false],
        hometown: ['', false],
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
                updateState(inputValues, setInputValues, 'password', '');
                updateState(inputValues, setInputValues, 'password', true);
            }
        } else {
            updateState(inputValues, setInputValues, 'username', '');
            updateState(inputValues, setInputValues, 'password', '');
            updateState(inputValues, setInputValues, 'username', true);
        }
    }

    return (
        <div className='login-page'>
            <h1 className='title'>WELCOME TO <p><GiAtomicSlashes className='icon'/> QUAD EX.</p></h1>
            {
                isSignUp ? 
                    <div className="signup-container">
                        <InputBox placeholder='Net ID' width='16rem' value={registerValues.net_id}/>
                        <InputBox placeholder='Password' width='16rem' isPassword={true} value={registerValues.net_id}/>
                        <InputBox placeholder='Confirm password' width='16rem' isPassword={true} value={registerValues.net_id}/>
                    </div>
                :
                    <div className="login-container">
                        <InputBox 
                            error={inputValues.username[1] ? 'Username not found': ''} 
                            placeholder='Username' value={inputValues.username[0]} 
                            width='16rem'
                            onChange={val => {
                                updateState(inputValues, setInputValues, 'username', val);
                                updateState(inputValues, setInputValues, 'username', false);
                            }} 
                        />
                        <InputBox 
                            error={inputValues.password[1] ? 'Password incorrect': ''} 
                            placeholder='Password' value={inputValues.password[0]} 
                            width='16rem'
                            isPassword={true}
                            onChange={val => {
                                updateState(inputValues, setInputValues, 'password', val);
                                updateState(inputValues, setInputValues, 'password', false);
                            }} 
                        />
                        <div className="login-btn" onClick={() => fetchUserData()}>Log In</div>
                        <p className='separator'>. . .</p>
                        <div className="signup-btn">Create New Account</div>
                    </div>
            }
            
            
        </div>
    )
}

export default Login
