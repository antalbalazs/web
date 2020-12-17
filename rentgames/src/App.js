import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import {Game} from './pages/games/GameComponent';
import {Login} from './pages/Login/Login';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Router>
        <Switch>
          <Route exact path="/">
            <Login/>
          </Route>
          <Route path="/games">
            <Game/>
          </Route>
        </Switch>
    </Router>
  );
}

export default App;
