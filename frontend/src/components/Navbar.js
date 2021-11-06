import React from 'react'
import '../stylesheets/navbar.scss'
import { GiAtomicSlashes } from 'react-icons/gi'

const Navbar = ({ name, net_id }) => {
    return (
        <div className='navbar-page'>
            <div className="navbar">
                <div className='logo-container'>
                    <GiAtomicSlashes/>
                    <p className='logo'>Quad EX</p>
                </div>
                <div className='links-container'>
                    <li onClick={() => {alert('nope >:I')}}>QUAD</li>
                    <li onClick={() => {alert('nope >:I')}}>EVENTS</li>
                    <li onClick={() => {alert('nope >:I')}}>LEADERBOARD</li>
                    <div className="profile-container">
                        <div className="name-container">
                            <p className='header'>{name}</p>
                            <p className='subheader'>Sign out</p>
                        </div>
                        <div className='profile-icon'/>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Navbar
