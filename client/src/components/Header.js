import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { getIsSignedIn, getCurrentUser } from '../store/selectors';
import { signOut } from '../store/actions';

export class Header extends React.Component {
  renderAuthButtons = () => {
    const { isSignedIn, currentUser } = this.props;
    if (isSignedIn) {
      return (
        <>
          {(currentUser.role === 'root' || currentUser.role === 'admin') && (
            <NavLink to="/users" className="item">
              Manage Users
            </NavLink>
          )}
          <button
            style={{ cursor: 'pointer' }}
            onClick={this.props.signOut}
            className="item"
          >
            Sign Out
          </button>
        </>
      );
    } else {
      return (
        <>
          <NavLink to="/signin" className="item">
            Sign In
          </NavLink>
          <NavLink to="/signup" className="item">
            Sign Up
          </NavLink>
        </>
      );
    }
  };

  render() {
    return (
      <div className="ui secondary pointing menu">
        <Link to="/" className="item">
          MERN
        </Link>
        <div className="right menu">{this.renderAuthButtons()}</div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isSignedIn: getIsSignedIn(state),
    currentUser: getCurrentUser(state),
  };
};

export default connect(mapStateToProps, { signOut })(Header);
