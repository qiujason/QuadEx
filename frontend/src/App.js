import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Login from './pages/Login'
import Profile from './pages/Profile'
import Navbar from './components/Navbar'

function App() {
  return (
    <div className="App">
        <Router>
            <Navbar name='Jason Qiu' net_id='jq39'/>
            <Switch>
                <Route path="/" exact component={Profile}/>
                <Route path="/login" exact component={Login}/>
            </Switch>
        </Router>
    </div>
  );
}

export default App;
