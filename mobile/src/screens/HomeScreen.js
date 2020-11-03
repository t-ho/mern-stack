import React from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withTheme } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { signOut } from '../store/actions';
import { getCurrentUser, getSignedInWith } from '../store/selectors';
import AppbarHeader from '../components/AppbarHeader';

const title = 'Home';

class HomeScreen extends React.Component {
  static navigationOptions = {
    title,
    tabBarIcon: ({ tintColor }) => (
      <MaterialCommunityIcons name="home-outline" size={24} color={tintColor} />
    ),
    tabBarAccessibilityLabel: 'Home Screen',
  };

  render() {
    return (
      <>
        <AppbarHeader title={title} />
        <SafeAreaView style={styles.container}></SafeAreaView>
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    signOut,
    getCurrentUser,
    getSignedInWith,
  }),
  withTheme
)(HomeScreen);
