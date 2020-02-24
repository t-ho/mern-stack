import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import requireRole from '../../hoc/requireRole';
import { getCurrentUser } from '../../store/selectors';

class Profile extends React.Component {
  render() {
    const { currentUser } = this.props;
    return (
      <div className="ui card">
        <div className="content">
          <a className="header">{`${currentUser.firstName} ${currentUser.lastName}`}</a>
          <div className="meta">
            <span className="date">
              Joined in {new Date(currentUser.createdAt).getFullYear()}
            </span>
          </div>
          <div className="description">
            You are logged in as {currentUser.username}
          </div>
        </div>
        <div className="extra content">
          <a>
            <i className="envelope icon"></i>
            {currentUser.email}
          </a>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    currentUser: getCurrentUser(state)
  };
};

export default compose(
  requireRole('user'),
  connect(mapStateToProps, {})
)(Profile);
