import React from 'react'
import '../stylesheets/pages.scss'
import InputBox from '../components/InputBox'

const Login = () => {
    return (
        <div className='login-page'>
            <h1>Login</h1>
            <InputBox placeholder='username'/>
            <InputBox placeholder='password'/>
        </div>
    )
}

export default Login
