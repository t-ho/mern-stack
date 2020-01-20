import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { getIsSignedIn } from '../store/selectors';
import { signOut } from '../store/actions';

export class Header extends React.Component {
  renderAuthButtons = () => {
    if (this.props.isSignedIn) {
      return (
        <>
          <NavLink to="/users" className="item">
            Manage Users
          </NavLink>
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

const mapStateToProps = state => {
  return { isSignedIn: getIsSignedIn(state) };
};

export default connect(mapStateToProps, { signOut })(Header);
