import './App.css'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Login from './pages/Login'
import Profile from './pages/Profile'

function App() {
  return (
    <div className="App">
        <Router>
            <Switch>
                <Route path="/" exact component={Profile}/>
                <Route path="/login" exact component={Login}/>
            </Switch>
        </Router>
    </div>
  );
}

export default App;
