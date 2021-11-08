import React from 'react'
import '../stylesheets/pages.scss'
import InputBox from '../components/InputBox'
import { useState } from 'react'
import { GiAtomicSlashes } from 'react-icons/gi'

const Login = ({ setNetID }) => {
    const [ inputValues, setInputValues ] = useState({
        username: '',
        password: ''
    });
    const [ errorValues, setErrorValues ] = useState({
        username: false,
        password: false
    });

    const updateInputValue = (key, value) => {
        let prevObj = { ...inputValues };
        prevObj[key] = value;
        setInputValues(prevObj);
        prevObj = { ...errorValues };
        prevObj[key] = false;
        setErrorValues(prevObj);
    }

    const updateErrorValue = (key) => {
        let prevObj = { ...errorValues };
        prevObj[key] = true;
        setErrorValues(prevObj);
    }

    async function fetchUserData() {
        const net_id = inputValues.username;
        let userResponse = await fetch('http://localhost:3001/users/?id=' + net_id);
        let userData = await userResponse.json();

        if(userData[0] && 'password' in userData[0]){
            // user found
            if(inputValues.password === userData[0].password) {
                console.log('successful authentication');
                setNetID(inputValues.username);
            } else {
                updateInputValue('password', '');
                updateErrorValue('password');
            }
        } else {
            updateInputValue('username', '');
            updateInputValue('password', '');
            updateErrorValue('username');
        }
    }

    return (
        <div className='login-page'>
            <h1 className='title'>WELCOME TO <p><GiAtomicSlashes className='icon'/> QUAD EX.</p></h1>
            <div className="login-container">
                <InputBox error={errorValues.username ? 'Username not found': ''} placeholder='Username' value={inputValues.username} onChange={val => updateInputValue('username', val)} width='16rem' />
                <InputBox error={errorValues.password ? 'Password incorrect': ''} placeholder='Password' value={inputValues.password} onChange={val => updateInputValue('password', val)} width='16rem' isPassword={true}/>
                <div className="login-btn" onClick={() => fetchUserData()}>Log In</div>
                <p className='separator'>. . .</p>
                <div className="signup-btn">Create New Account</div>
            </div>
        </div>
    )
}

export default Login
