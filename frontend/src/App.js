import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Login from './pages/Login'
import Profile from './pages/Profile'
import Events from './pages/Events'
import Navbar from './components/Navbar'
import Quad from './pages/Quad'
import Leaderboard from './pages/Leaderboard'
import { useState, useEffect } from 'react'

function App() {
    const [ netID, setNetID ] = useState('');
    const [ isAdmin, setIsAdmin ] = useState(false);

    useEffect(() => {
        setNetID(window.localStorage.getItem('netID'));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        window.localStorage.setItem('netID', netID);
        async function fetchAdmin(){
            let adminResponse = await fetch('http://localhost:3001/admins/?id=' + netID);
            let adminData = await adminResponse.json();
            setIsAdmin(adminData.length > 0);
        }
        fetchAdmin();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [netID]);

    function isNetIDFound(){
        return netID !== null && netID.length > 0;
    }

    return (
        <div className="App">
            <Router>
                { isNetIDFound() ? <Navbar netID={netID} setNetID={setNetID} isAdmin={isAdmin}/> : null }
                <Switch>
                    <Route path="/" exact render={ props => isNetIDFound() ? <Profile { ...props}  netID={netID} isAdmin={isAdmin}/> : <Login {...props} setNetID={setNetID}/> }/>
                    <Route path='/events' render={ props => isNetIDFound() ? <Events { ...props } netID={netID} isAdmin={isAdmin}/> : null }/>
                    <Route path='/quad' render={ props => isNetIDFound() ? <Quad { ...props } netID={netID} isAdmin={isAdmin}/> : null }/>
                    <Route path='/leaderboard' render={ props => isNetIDFound() ? <Leaderboard { ...props } /> : null }/>
                </Switch>
            </Router>
        </div>
    );
}

export default App;
