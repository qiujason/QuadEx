import React from 'react'
import '../stylesheets/Navbar.scss'
import { Link } from 'react-router-dom'
import { GiAtomicSlashes } from 'react-icons/gi'
import { MdAdminPanelSettings } from 'react-icons/md'

const Navbar = ({ netID, setNetID, isAdmin }) => {
    return (
        <div className='navbar-page'>
            <div className="navbar">
                <div className='logo-container'>
                    <GiAtomicSlashes/>
                    <p className='logo'>Quad EX</p>
                </div>
                
                <div className='links-container'>
                    <Link to='/quad' style={{textDecoration: 'none'}}>
                        <li component={Link} to={'/quad'}>QUAD</li>
                    </Link>
                    <Link to='/events' style={{textDecoration: 'none'}}>
                        <li component={Link} to={'/events'}>EVENTS</li>
                    </Link>
                    <Link to='/leaderboard' style={{textDecoration: 'none'}}>
                        <li component={Link} to={'/leaderboard'}>LEADERBOARD</li>
                    </Link>
                    <div className="profile-container">
                        {isAdmin ? <MdAdminPanelSettings className='admin-icon'/> : ''}
                        <div className="name-container">
                            <Link to='/' style={{textDecoration: 'none'}}>
                                <p className='header'>{netID}</p>
                            </Link>
                            <Link to='/' style={{textDecoration: 'none'}}>
                                <p className='subheader' onClick={() => setNetID('')}>Sign out</p>
                            </Link>
                        </div>
                        <Link to='/'>
                            <div className='profile-icon'/>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Navbar
