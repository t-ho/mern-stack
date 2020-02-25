import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView, NavigationEvents } from 'react-navigation';
import { Text, Button, Input } from 'react-native-elements';
import { connect } from 'react-redux';
import NavLink from '../components/NavLink';
import { getError } from '../store/selectors';
import { signIn, unloadAuthScreen } from '../store/actions';
import Spacer from '../components/Spacer';

class SignInScreen extends React.Component {
  static navigationOptions = {
    headerTitle: ''
  };

  state = { email: '', password: '' };

  onSubmit = () => {
    this.props.signIn({
      email: this.state.email,
      password: this.state.password
    });
  };

  render() {
    return (
      <SafeAreaView forceInset={{ top: 'always' }} style={styles.container}>
        <NavigationEvents onWillBlur={this.props.unloadAuthScreen} />
        <Spacer>
          <Text h3 style={styles.title}>
            Sign In With Email
          </Text>
        </Spacer>
        <Input
          label="Email"
          value={this.state.email}
          autoCapitalize="none"
          autoCorrect={false}
          onChangeText={email => this.setState({ email })}
        />
        <Spacer />
        <Input
          label="Password"
          secureTextEntry
          value={this.state.password}
          autoCapitalize="none"
          autoCorrect={false}
          onChangeText={password => this.setState({ password })}
        />
        {this.props.errorMessage ? (
          <Text style={styles.errorMessage}>{this.props.errorMessage}</Text>
        ) : null}
        <Spacer>
          <Button title="Sign In" onPress={this.onSubmit} />
        </Spacer>
        <NavLink
          text="Forgot your password?"
          routeName="RequestPasswordReset"
        />
        <NavLink text="Don't have an account? Sign Up!" routeName="SignUp" />
        {this.props.errorMessage === 'Email is not verified.' && (
          <NavLink
            text="Have not received verification email?"
            routeName="RequestVerificationEmail"
          />
        )}
      </SafeAreaView>
    );
  }
}

const mapStateToProps = state => {
  return { errorMessage: getError(state) };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    marginBottom: 150
  },
  errorMessage: {
    alignSelf: 'center',
    color: 'red',
    fontSize: 16,
    marginTop: 15
  },
  title: {
    alignSelf: 'center'
  }
});

export default connect(mapStateToProps, { signIn, unloadAuthScreen })(
  SignInScreen
);
