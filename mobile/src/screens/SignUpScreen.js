import React from 'react';
import { Keyboard, Platform, StatusBar, StyleSheet, View } from 'react-native';
import {
  SafeAreaView,
  NavigationEvents,
  withNavigation,
} from 'react-navigation';
import {
  Button,
  Snackbar,
  Text,
  TextInput,
  Title,
  withTheme,
} from 'react-native-paper';
import { connect } from 'react-redux';
import { compose } from 'redux';
import NavLink from '../components/NavLink';
import { clearErrorMessage, signUp, unloadAuthScreen } from '../store/actions';
import Spacer from '../components/Spacer';
import DismissKeyboardView from '../hoc/DismissKeyboardView';
import { getError, getProcessing, getType } from '../store/selectors';
import OAuthButtons from '../components/OAuthButtons';
import Logo from '../components/Logo';

class RegisterScreen extends React.Component {
  static navigationOptions = {
    headerShown: false,
    headerTitle: 'Sign Up',
  };

  state = {
    email: '',
    username: '',
    firstName: '',
    lastName: '',
    password: '',
    confirmPassword: '',
  };

  onEmailRegister = () => {
    Keyboard.dismiss();
    const email = this.state.email.trim();
    const firstName = this.state.firstName.trim();
    const lastName = this.state.lastName.trim();
    const password = this.state.password;
    this.props.signUp({ email, firstName, lastName, password });
  };

  onSnackbarDismiss = () => {
    this.props.clearErrorMessage();
    this.setState({ errorMessage: null });
  };

  render() {
    const { colors } = this.props.theme;
    return (
      <SafeAreaView forceInset={{ top: 'always' }} style={styles.container}>
        <NavigationEvents onWillBlur={this.props.unloadAuthScreen} />
        {Platform.OS === 'ios' && <StatusBar barStyle="dark-content" />}
        <DismissKeyboardView>
          <Logo />
          <Spacer>
            <Title style={{ alignSelf: 'center', color: colors.primary }}>
              Sign Up
            </Title>
          </Spacer>
          <Spacer>
            <TextInput
              label="Username"
              mode="outlined"
              dense
              value={this.state.username}
              autoCapitalize="none"
              autoCorrect={false}
              onChangeText={(username) => this.setState({ username })}
              disabled={this.props.isSigning}
            />
            <Spacer />
            <TextInput
              label="Email"
              mode="outlined"
              dense
              value={this.state.email}
              autoCapitalize="none"
              autoCorrect={false}
              onChangeText={(email) => this.setState({ email })}
              disabled={this.props.isSigning}
            />
            <Spacer />
            <View style={styles.fullName}>
              <TextInput
                label="First Name"
                mode="outlined"
                style={styles.name}
                dense
                value={this.state.firstName}
                autoCorrect={false}
                onChangeText={(firstName) => this.setState({ firstName })}
                disabled={this.props.isSigning}
              />
              <TextInput
                label="Last Name"
                mode="outlined"
                style={styles.name}
                dense
                value={this.state.lastName}
                autoCorrect={false}
                onChangeText={(lastName) => this.setState({ lastName })}
                disabled={this.props.isSigning}
              />
            </View>
            <Spacer />
            <TextInput
              label="Password"
              mode="outlined"
              dense
              secureTextEntry
              value={this.state.password}
              autoCapitalize="none"
              autoCorrect={false}
              onChangeText={(password) => this.setState({ password })}
              disabled={this.props.isSigning}
            />
            <View style={styles.navLinks}>
              <NavLink text="Sign in instead!" routeName="SignIn" />
            </View>
          </Spacer>
          <Spacer vertical={4}>
            <Button
              mode="contained"
              accessibilityLabel="Sign In"
              onPress={this.onEmailRegister}
              loading={this.props.isSigning && this.props.type === 'email'}
              disabled={this.props.isSigning}
            >
              Sign Up
            </Button>
          </Spacer>
          <Spacer vertical={12}>
            <Text style={{ alignSelf: 'center' }}>Or Sign Up With</Text>
          </Spacer>
          <Spacer>
            <OAuthButtons />
          </Spacer>
        </DismissKeyboardView>
        <Snackbar
          visible={this.props.errorMessage}
          onDismiss={this.onSnackbarDismiss}
          style={{ backgroundColor: colors.error }}
        >
          {this.props.errorMessage}
        </Snackbar>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    errorMessage: getError(state),
    isSigning: getProcessing(state),
    type: getType(state),
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fullName: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  name: {
    width: '47%',
  },
  navLinks: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
  },
  termsConditions: {
    textAlign: 'center',
  },
});

export default compose(
  connect(mapStateToProps, {
    clearErrorMessage,
    signUp,
    unloadAuthScreen,
  }),
  withTheme,
  withNavigation
)(RegisterScreen);
