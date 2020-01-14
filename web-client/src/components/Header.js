import React from 'react';
import { Link, NavLink } from 'react-router-dom';

const Header = ({ props }) => {
  return (
    <div class="ui secondary pointing menu">
      <Link to="/" className="item">
        MERN
      </Link>
      <div className="right menu">
        <NavLink to="/signin" className="item">
          Sign In
        </NavLink>
        <NavLink to="/signup" className="item">
          Sign Up
        </NavLink>
      </div>
    </div>
  );
};

export default Header;
