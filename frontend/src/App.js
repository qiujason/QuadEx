import './App.css'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Login from './pages/Login'
import Profile from './pages/Profile'

function App() {
  return (
    <div className="App">
        <Router>
            <Switch>
                <Route path="/" exact component={Login}/>
                <Route path="/profile" exact component={Profile}/>
            </Switch>
        </Router>
    </div>
  );
}

export default App;
