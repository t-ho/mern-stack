import React from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
import { Button, withTheme } from 'react-native-paper';
import { compose } from 'redux';
import { connect } from 'react-redux';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { withNavigation } from 'react-navigation';
import { signOut } from '../store/actions';
import { getCurrentUser, getSignedInWith } from '../store/selectors';
import Spacer from '../components/Spacer';
import AppbarHeader from '../components/AppbarHeader';

const title = 'Settings';

class SettingsScreen extends React.Component {
  static navigationOptions = {
    title,
    tabBarIcon: ({ tintColor }) => (
      <MaterialCommunityIcons name="cog-outline" size={24} color={tintColor} />
    ),
    tabBarAccessibilityLabel: 'Settings Screen',
  };

  render() {
    return (
      <>
        <AppbarHeader title={title} />
        <SafeAreaView style={styles.container}>
          <Spacer vertical={16}>
            <Button
              icon="logout"
              mode="contained"
              color={this.props.theme.colors.error}
              onPress={this.props.signOut}
            >
              Sign Out
            </Button>
          </Spacer>
        </SafeAreaView>
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 8,
  },
});

const mapStateToProps = (state) => {
  return {
    currentUser: getCurrentUser(state),
    signedInWith: getSignedInWith(state),
  };
};

export default compose(
  connect(mapStateToProps, { signOut }),
  withTheme,
  withNavigation
)(SettingsScreen);
