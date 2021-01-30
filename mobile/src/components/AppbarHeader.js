import React from 'react';
import { StyleSheet } from 'react-native';
import { Appbar, Avatar, withTheme } from 'react-native-paper';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { getCurrentUser, getSignedInWith } from '../store/selectors';
import StatusBar from './StatusBar';

class AppbarHeader extends React.Component {
  render() {
    const { currentUser, signedInWith, theme } = this.props;
    let avatarUri = '';
    if (currentUser) {
      avatarUri = currentUser.provider[signedInWith].picture;
    }
    return (
      <>
        <StatusBar backgroundColor={theme.colors.primary} />
        <Appbar.Header style={styles.appbar}>
          <Appbar.Content title={this.props.title} />
          {avatarUri ? (
            <Avatar.Image
              size={30}
              source={{ uri: avatarUri }}
              style={[{ backgroundColor: theme.colors.accent }, styles.avatar]}
            />
          ) : (
            <Avatar.Icon
              size={30}
              icon="account"
              style={[{ backgroundColor: theme.colors.accent }, styles.avatar]}
            />
          )}
        </Appbar.Header>
      </>
    );
  }
}

const styles = StyleSheet.create({
  appbar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  avatar: {
    marginRight: 12,
  },
});

const mapStateToProps = (state) => {
  return {
    currentUser: getCurrentUser(state),
    signedInWith: getSignedInWith(state),
  };
};

export default compose(
  connect(mapStateToProps, {
    getCurrentUser,
    getSignedInWith,
  }),
  withTheme
)(AppbarHeader);
