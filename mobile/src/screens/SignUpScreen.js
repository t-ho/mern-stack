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
import NavLink from '../components/NavLink';
import { clearErrorMessage, signUp, unloadAuthScreen } from '../store/actions';
import Spacer from '../components/Spacer';
import { getError, getProcessing, getType } from '../store/selectors';
import OAuthButtons from '../components/OAuthButtons';
import Logo from '../components/Logo';
import StatusBar from '../components/StatusBar';

class SignUpScreen extends React.Component {
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
    this.props.signUp({
      username: this.state.username.trim(),
      email: this.state.email.trim(),
      firstName: this.state.firstName.trim(),
      lastName: this.state.lastName.trim(),
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
                onSubmitEditing={this.onEmailRegister}
                onFocus={clearErrorMessage}
                disabled={isProcessing}
              />
              <Spacer />
              <TextInput
                label="Email"
                mode="outlined"
                dense
                value={this.state.email}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                onChangeText={(email) => this.setState({ email })}
                onSubmitEditing={this.onEmailRegister}
                onFocus={clearErrorMessage}
                disabled={isProcessing}
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
                  onSubmitEditing={this.onEmailRegister}
                  onFocus={clearErrorMessage}
                  disabled={isProcessing}
                />
                <TextInput
                  label="Last Name"
                  mode="outlined"
                  style={styles.name}
                  dense
                  value={this.state.lastName}
                  autoCorrect={false}
                  onChangeText={(lastName) => this.setState({ lastName })}
                  onSubmitEditing={this.onEmailRegister}
                  onFocus={clearErrorMessage}
                  disabled={isProcessing}
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
                onSubmitEditing={this.onEmailRegister}
                onFocus={clearErrorMessage}
                disabled={isProcessing}
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
                loading={isProcessing && type === 'email'}
                disabled={isProcessing}
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
});

export default compose(
  connect(mapStateToProps, {
    clearErrorMessage,
    signUp,
    unloadAuthScreen,
  }),
  withTheme,
  withNavigation
)(SignUpScreen);
