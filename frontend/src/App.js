import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Login from './pages/Login'
import Profile from './pages/Profile'
import Navbar from './components/Navbar'
import { useState } from 'react'

function App() {
    const [ username, setUsername ] = useState('');
    
    return (
        <div className="App">
            <Router>
                {username !== null && username.length > 0 ? <Navbar name={username}/> : ''}
                <Switch>
                    <Route path="/" exact component={Profile}/>
                    <Route path="/login" exact component={Login}/>
                </Switch>
            </Router>
        </div>
    );
}

export default App;
