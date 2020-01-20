import React from 'react';
import { Route, Switch, Redirect } from 'react-router';
import { connect } from 'react-redux';
import Header from '../../components/Header';
import SignIn from '../Auth/SignIn';
import SignUp from '../Auth/SignUp';
import Profile from '../Auth/Profile';
import UserList from '../Users/UserList';
import { tryLocalSignIn } from '../../store/actions';

class App extends React.Component {
  componentDidMount() {
    this.props.tryLocalSignIn();
  }

  render() {
    return (
      <div className="ui container">
        <Header />
        <Switch>
          <Route path="/signin" component={SignIn} />
          <Route path="/signup" component={SignUp} />
          <Route path="/profile" component={Profile} />
          <Route path="/users" component={UserList} />
          <Route path="/" component={SignIn} />
          <Redirect to="/" />
        </Switch>
      </div>
    );
  }
}

export default connect(null, { tryLocalSignIn })(App);
