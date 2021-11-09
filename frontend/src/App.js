import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Login from './pages/Login'
import Profile from './pages/Profile'
import Events from './pages/Events'
import Navbar from './components/Navbar'
import { useState, useEffect } from 'react'

function App() {
    const [ netID, setNetID ] = useState('');

    useEffect(() => {
        setNetID(window.localStorage.getItem('netID'));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        window.localStorage.setItem('netID', netID);
    }, [netID]);

    return (
        <div className="App">
            <Router>
                {netID !== null && netID.length > 0 ? <Navbar netID={netID} setNetID={setNetID}/> : ''}
                <Switch>
                    <Route path="/" exact render={props => netID !== null && netID.length > 0 ? 
                        <Profile {...props} netID={netID}/> 
                    : 
                        <Login {...props} setNetID={setNetID}/>
                    }/>
                    <Route path='/events' render={props => netID !== null && netID.length > 0 ? <Events {...props} netID={netID}/> : ''}/>
                </Switch>
            </Router>
        </div>
    );
}

export default App;
