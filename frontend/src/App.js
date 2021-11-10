import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Login from './pages/Login'
import Profile from './pages/Profile'
import Events from './pages/Events'
import Navbar from './components/Navbar'
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

    return (
        <div className="App">
            <Router>
                {netID !== null && netID.length > 0 ? <Navbar netID={netID} setNetID={setNetID}/> : ''}
                <Switch>
                    <Route path="/" exact render={props => netID !== null && netID.length > 0 ? 
                        <Profile {...props} netID={netID} isAdmin={isAdmin}/> 
                    : 
                        <Login {...props} setNetID={setNetID}/>
                    }/>
                    <Route path='/events' render={props => netID !== null && netID.length > 0 ? <Events {...props} netID={netID} isAdmin={isAdmin}/> : ''}/>
                </Switch>
            </Router>
        </div>
    );
}

export default App;
