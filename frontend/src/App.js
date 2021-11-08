import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Login from './pages/Login'
import Profile from './pages/Profile'
import Navbar from './components/Navbar'
import { useState } from 'react'

function App() {
    const [ netID, setNetID ] = useState('');

    return (
        <div className="App">
            <Router>
                {netID !== null && netID.length > 0 ? <Navbar netID={netID} setNetID={setNetID}/> : ''}
                <Switch>
                    <Route path="/" exact render={(props) => netID !== null && netID.length > 0 ? 
                        <Profile {...props} netID={netID}/> 
                    : 
                        <Login {...props} setNetID={setNetID}/>
                    }/>
                </Switch>
            </Router>
        </div>
    );
}

export default App;
