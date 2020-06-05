import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
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
import ResetPassword from '../Auth/ResetPassword';
import { getIsSignedIn } from '../../store/selectors';

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
          />
          <Route path="/reset-password/:token" component={ResetPassword} />
          <Route path="/profile" component={Profile} />
          <Route path="/users" component={UserList} />
          <Route path="/">
            {this.props.isSignedIn ? (
              <Redirect to="/profile" />
            ) : (
              <Redirect to="/signin" />
            )}
          </Route>
        </Switch>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isSignedIn: getIsSignedIn(state),
  };
};

export default connect(mapStateToProps, { tryLocalSignIn })(App);
