import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { getIsSignedIn } from '../store/selectors';
import { signOut } from '../store/actions';
import ProtectedComponent from './accessControl/ProtectedComponent';

export class Header extends React.Component {
  renderAuthButtons = () => {
    const { isSignedIn } = this.props;
    if (isSignedIn) {
      return (
        <>
          <ProtectedComponent
            permissions={['userInsert', 'userRead', 'userModify']}
          >
            <NavLink to="/users" className="item">
              Manage Users
            </NavLink>
          </ProtectedComponent>
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
  };
};

export default connect(mapStateToProps, { signOut })(Header);
