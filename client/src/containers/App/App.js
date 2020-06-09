import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import AnonymousRoute from '../../components/AnonymousRoute';
import ProtectedRoute from '../../components/ProtectedRoute';
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
          <AnonymousRoute path="/signin">
            <SignIn />
          </AnonymousRoute>
          <AnonymousRoute path="/signup">
            <SignUp />
          </AnonymousRoute>
          <AnonymousRoute path="/verify-email/:token">
            <VerifyEmail />
          </AnonymousRoute>
          <AnonymousRoute path="/request-verification-email">
            <RequestVerificationEmail />
          </AnonymousRoute>
          <AnonymousRoute path="/request-password-reset">
            <RequestPasswordReset />
          </AnonymousRoute>
          <AnonymousRoute path="/reset-password/:token">
            <ResetPassword />
          </AnonymousRoute>
          <ProtectedRoute path="/profile">
            <Profile />
          </ProtectedRoute>
          <ProtectedRoute
            path="/users"
            permissions={['usersRead', 'usersModify']}
          >
            <UserList />
          </ProtectedRoute>
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
