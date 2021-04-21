import React from 'react';
import {
  KeyboardAvoidingView,
  StyleSheet,
  View,
  ScrollView,
  Platform,
} from 'react-native';
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
import StatusBar from '../components/StatusBar';
import { getError, getProcessing, getType } from '../store/selectors';
import NavLink from '../components/NavLink';
import { clearErrorMessage, signIn, unloadAuthScreen } from '../store/actions';
import Spacer from '../components/Spacer';
import OAuthButtons from '../components/OAuthButtons';
import Logo from '../components/Logo';

class SignInScreen extends React.Component {
  static navigationOptions = {
    headerShown: false,
    headerTitle: 'Sign In',
  };

  state = { email: '', password: '' };

  onEmailSignIn = () => {
    this.props.signIn({
      email: this.state.email,
      password: this.state.password,
    });
  };

  render() {
    const {
      clearErrorMessage,
      errorMessage,
      isProcessing,
      theme: { colors },
      type,
      unloadAuthScreen,
    } = this.props;
    return (
      <SafeAreaView forceInset={{ top: 'always' }} style={styles.container}>
        <NavigationEvents onWillBlur={unloadAuthScreen} />
        <StatusBar barStyle="dark-content" />
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : null}
          style={styles.container}
        >
          <ScrollView
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
          >
            <Logo />
            <Spacer>
              <Title style={{ alignSelf: 'center', color: colors.primary }}>
                Sign In
              </Title>
            </Spacer>
            <Spacer>
              <TextInput
                label="Email"
                mode="outlined"
                dense
                value={this.state.email}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                onChangeText={(email) => this.setState({ email })}
                onSubmitEditing={this.onEmailSignIn}
                onFocus={clearErrorMessage}
                disabled={isProcessing}
              />
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
                onSubmitEditing={this.onEmailSignIn}
                onFocus={clearErrorMessage}
                disabled={isProcessing}
              />
              <View style={styles.navLinks}>
                <NavLink
                  text="Forgot password?"
                  routeName="RequestPasswordReset"
                  disabled={isProcessing}
                />
                <NavLink
                  text="Register instead!"
                  routeName="SignUp"
                  disabled={isProcessing}
                />
              </View>
            </Spacer>
            <Spacer vertical={4}>
              <Button
                mode="contained"
                accessibilityLabel="Sign In"
                onPress={this.onEmailSignIn}
                loading={isProcessing && type === 'email'}
                disabled={isProcessing}
              >
                Sign In
              </Button>
            </Spacer>
            <Spacer vertical={12}>
              <Text style={{ alignSelf: 'center' }}>Or Sign In With</Text>
            </Spacer>
            <Spacer>
              <OAuthButtons />
            </Spacer>
            {errorMessage === 'Email is not verified' && (
              <NavLink
                text="Have not received verification email?"
                routeName="RequestVerificationEmail"
                disabled={isProcessing}
              />
            )}
          </ScrollView>
          <Snackbar
            visible={errorMessage}
            onDismiss={clearErrorMessage}
            action={{
              label: 'Dismiss',
              accessibilityLabel: 'Dismiss',
              onPress: () => {},
            }}
          >
            {errorMessage}
          </Snackbar>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    errorMessage: getError(state),
    isProcessing: getProcessing(state),
    type: getType(state),
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  navLinks: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
});

export default compose(
  connect(mapStateToProps, {
    clearErrorMessage,
    signIn,
    unloadAuthScreen,
  }),
  withTheme,
  withNavigation
)(SignInScreen);
