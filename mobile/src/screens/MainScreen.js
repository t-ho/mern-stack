import React from 'react';
import { SafeAreaView } from 'react-navigation';
import { StyleSheet, Text } from 'react-native';
import { Button, Card, Avatar } from 'react-native-elements';
import { connect } from 'react-redux';
import { signOut } from '../store/actions';
import { getCurrentUser, getSignedInWith } from '../store/selectors';

class MainScreen extends React.Component {
  render() {
    const { currentUser, signedInWith } = this.props;
    let picture = '';
    let initials = '';
    if (currentUser) {
      picture = currentUser.provider[signedInWith].picture;
      initials =
        currentUser.firstName.charAt(0) + currentUser.lastName.charAt(0);
    }
    return (
      <SafeAreaView forceInset={{ top: 'always' }}>
        <Card title={`${currentUser.firstName} ${currentUser.lastName}`}>
          <Avatar
            rounded
            size="xlarge"
            title={initials}
            source={{ uri: picture }}
            containerStyle={styles.avatar}
          />
          <Text style={styles.text}>
            You are logged in as {currentUser.username}
          </Text>
          <Text style={styles.text}>Your email: {currentUser.email}</Text>
          <Button
            style={styles.button}
            title="Sign Out"
            onPress={this.props.signOut}
          />
        </Card>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  text: {
    alignSelf: 'center'
  },
  avatar: {
    marginBottom: 20,
    alignSelf: 'center'
  },
  button: {
    marginTop: 20
  }
});

const mapStateToProps = state => {
  return {
    currentUser: getCurrentUser(state),
    signedInWith: getSignedInWith(state)
  };
};

export default connect(mapStateToProps, {
  signOut,
  getCurrentUser,
  getSignedInWith
})(MainScreen);
