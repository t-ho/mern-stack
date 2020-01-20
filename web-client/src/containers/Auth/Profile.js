import React from 'react';
import requireRole from '../../hoc/requireRole';

const Profile = () => {
  return (
    <div>
      <h3>Profile</h3>
      You logged in. This is your profile page
    </div>
  );
};

export default requireRole(Profile, 'user');
