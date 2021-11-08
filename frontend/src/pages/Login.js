import React from 'react'
import '../stylesheets/pages.scss'
import InputBox from '../components/InputBox'
import { useState } from 'react'
import { GiAtomicSlashes } from 'react-icons/gi'

const Login = ({ setNetID }) => {
    const [ isSignUp, setIsSignUp ] = useState(true);

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
                        <InputBox 
                            error={registerValues.net_id[1] ? 'Net ID already taken': ''} 
                            placeholder='Net ID' 
                            value={registerValues.net_id[0]} 
                            width='16rem'
                            onChange={val => {
                                updateState(registerValues, setRegisterValues, 'net_id', val);
                                updateState(registerValues, setRegisterValues, 'net_id', false);
                            }} 
                        />
                        <InputBox 
                            placeholder='Password' 
                            value={registerValues.password[0]}
                            width='16rem'
                            onChange={val => {
                                updateState(registerValues, setRegisterValues, 'password', val);
                                updateState(registerValues, setRegisterValues, 'password', false);
                            }} 
                        />
                        <InputBox 
                            error={registerValues.confirm_password[1] ? 'Passwords do not match': ''} 
                            placeholder='Confirm password' 
                            value={registerValues.confirm_password[0]} 
                            width='16rem'
                            onChange={val => {
                                updateState(registerValues, setRegisterValues, 'confirm_password', val);
                                updateState(registerValues, setRegisterValues, 'confirm_password', false);
                            }} 
                        />
                        <div className="inputs-container">
                            <InputBox
                                placeholder='First name' 
                                value={registerValues.first_name[0]} 
                                width='8.5rem'
                                onChange={val => {
                                    updateState(registerValues, setRegisterValues, 'first_name', val);
                                    updateState(registerValues, setRegisterValues, 'first_name', false);
                                }} 
                            />

                            <InputBox
                                placeholder='Last name' 
                                value={registerValues.last_name[0]} 
                                width='6.5rem'
                                onChange={val => {
                                    updateState(registerValues, setRegisterValues, 'last_name', val);
                                    updateState(registerValues, setRegisterValues, 'last_name', false);
                                }} 
                            />
                        </div>
                        <InputBox 
                            error={registerValues.quad[1] ? 'Not a valid quad name': ''} 
                            placeholder='Affiliated Quad' 
                            value={registerValues.quad[0]} 
                            width='16rem'
                            onChange={val => {
                                updateState(registerValues, setRegisterValues, 'quad', val);
                                updateState(registerValues, setRegisterValues, 'quad', false);
                            }} 
                        />
                        <div className="inputs-container">
                            <InputBox 
                                error={registerValues.birthday_M[1] ? 'Invalid month': ''} 
                                placeholder='MM' 
                                value={registerValues.birthday_M[0]} 
                                width='4rem'
                                onChange={val => {
                                    updateState(registerValues, setRegisterValues, 'birthday_M', val);
                                    updateState(registerValues, setRegisterValues, 'birthday_M', false);
                                }} 
                            />
                            <InputBox 
                                error={registerValues.birthday_D[1] ? 'Invalid day': ''} 
                                placeholder='DD' 
                                value={registerValues.birthday_D[0]} 
                                width='4rem'
                                onChange={val => {
                                    updateState(registerValues, setRegisterValues, 'birthday_D', val);
                                    updateState(registerValues, setRegisterValues, 'birthday_D', false);
                                }} 
                            />
                            <InputBox 
                                error={registerValues.birthday_Y[1] ? 'Invalid year': ''} 
                                placeholder='YYYY' 
                                value={registerValues.birthday_Y[0]} 
                                width='6rem'
                                onChange={val => {
                                    updateState(registerValues, setRegisterValues, 'birthday_Y', val);
                                    updateState(registerValues, setRegisterValues, 'birthday_Y', false);
                                }} 
                            />
                        </div>
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
                            placeholder='Password' 
                            value={inputValues.password[0]} 
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
