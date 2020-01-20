import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import Header from '../../components/Header';
import SignIn from '../Auth/SignIn';
import SignUp from '../Auth/SignUp';
import Profile from '../Auth/Profile';

function App() {
  return (
    <div className="ui container">
      <Header />
      <Switch>
        <Route path="/signin" component={SignIn} />
        <Route path="/signup" component={SignUp} />
        <Route path="/profile" component={Profile} />
        <Route path="/" component={SignIn} />
        <Redirect to="/" />
      </Switch>
    </div>
  );
}

export default App;
