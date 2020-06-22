import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import AnonymousRoute from '../../components/accessControl/AnonymousRoute';
import ProtectedRoute from '../../components/accessControl/ProtectedRoute';
import SignIn from '../Auth/SignIn';
import SignUp from '../Auth/SignUp';
import VerifyEmail from '../Auth/VerifyEmail';
import { tryLocalSignIn } from '../../store/actions';
import RequestVerificationEmail from '../Auth/RequestVerificationEmail';
import RequestPasswordReset from '../Auth/RequestPasswordReset';
import ResetPassword from '../Auth/ResetPassword';
import Dashboard from '../../layouts/Dashboard';
import { getIsSignedIn } from '../../store/selectors';

class App extends React.Component {
  componentDidMount() {
    this.props.tryLocalSignIn();
  }

  render() {
    return (
      <Switch>
        <AnonymousRoute path="/signin" component={SignIn} />
        <AnonymousRoute path="/signup" component={SignUp} />
        <AnonymousRoute path="/verify-email/:token" component={VerifyEmail} />
        <AnonymousRoute
          path="/request-verification-email"
          component={RequestVerificationEmail}
        />
        <AnonymousRoute
          path="/request-password-reset"
          component={RequestPasswordReset}
        />
        <AnonymousRoute
          path="/reset-password/:token"
          component={ResetPassword}
        />
        <ProtectedRoute path="/dashboard" component={Dashboard} />

        <Route path="/">
          {this.props.isSignedIn ? (
            <Redirect to="/dashboard" />
          ) : (
            <Redirect to="/signin" />
          )}
        </Route>
      </Switch>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isSignedIn: getIsSignedIn(state),
  };
};

export default connect(mapStateToProps, { tryLocalSignIn })(App);
