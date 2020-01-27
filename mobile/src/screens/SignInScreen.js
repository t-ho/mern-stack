import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { Text, Button, Input } from 'react-native-elements';
import { connect } from 'react-redux';
import NavLink from '../components/NavLink';
import { getError } from '../store/selectors';
import { signIn, unloadAuthScreen } from '../store/actions';
import Spacer from '../components/Spacer';

class SignInScreen extends React.Component {
  state = { email: '', password: '' };

  onSubmit = () => {
    this.props.signIn({
      email: this.state.email,
      password: this.state.password
    });
  };

  componentWillUnmount() {
    this.props.unloadAuthScreen();
  }

  render() {
    return (
      <SafeAreaView forceInset={{ top: 'always' }} style={styles.container}>
        <Spacer>
          <Text h3>Sign In</Text>
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
        <NavLink text="Don't have an account? Sign Up!" routeName="SignUp" />
      </SafeAreaView>
    );
  }
}

const mapStateToProps = state => {
  return { errorMessage: getError(state) };
};

const styles = StyleSheet.create({
  errorMessage: {
    alignSelf: 'center',
    color: 'red',
    fontSize: 16,
    marginTop: 15
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    marginBottom: 180
  }
});

export default connect(mapStateToProps, { signIn, unloadAuthScreen })(
  SignInScreen
);
