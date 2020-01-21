import React from 'react';
import { Route, Switch, Redirect } from 'react-router';
import { connect } from 'react-redux';
import Header from '../../components/Header';
import SignIn from '../Auth/SignIn';
import SignUp from '../Auth/SignUp';
import VerifyEmail from '../Auth/VerifyEmail';
import Profile from '../Auth/Profile';
import UserList from '../Users/UserList';
import { tryLocalSignIn } from '../../store/actions';
import RequestVerificationEmail from '../Auth/RequestVerificationEmail';
import RequestPasswordReset from '../Auth/RequestPasswordReset';

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
          <Route path="/verify-email/:token" component={VerifyEmail} />
          <Route
            path="/request-verification-email"
            component={RequestVerificationEmail}
          />
          <Route
            path="/request-password-reset"
            component={RequestPasswordReset}
          ></Route>

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
