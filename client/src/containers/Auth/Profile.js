import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import requireRole from '../../hoc/requireRole';
import { getCurrentUser, getSignedInWith } from '../../store/selectors';

class Profile extends React.Component {
  render() {
    const { currentUser, signedInWith } = this.props;
    let picture = '';
    if (currentUser.provider) {
      picture = currentUser.provider[signedInWith].picture;
    }
    picture = picture ? picture : '/logo512.png';
    return (
      <div className="ui centered grid padded">
        <div className="ui raised card">
          <div className="image">
            <img alt="avatar" src={picture} />
          </div>
          <div className="content">
            <span className="header">{`${currentUser.firstName} ${currentUser.lastName}`}</span>
            <div className="meta">
              <span className="date">
                Joined in {new Date(currentUser.createdAt).getFullYear()}
              </span>
            </div>
            <div className="description">
              You are logged in as <b>{currentUser.username}</b>
            </div>
          </div>
          <div className="extra content">
            <span>
              <i className="envelope icon"></i>
              {currentUser.email}
            </span>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    currentUser: getCurrentUser(state),
    signedInWith: getSignedInWith(state),
  };
};

export default compose(
  requireRole('user'),
  connect(mapStateToProps, {})
)(Profile);
