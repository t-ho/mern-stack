import React from 'react';
import requireRole from '../../hoc/requireRole';

const UserList = () => {
  return (
    <div>
      <h3>UserList Page</h3>
      Only root or admin can go here
    </div>
  );
};

export default requireRole('admin')(UserList);
