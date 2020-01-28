import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView, NavigationEvents } from 'react-navigation';
import { Text, Button, Input } from 'react-native-elements';
import { connect } from 'react-redux';
import NavLink from '../components/NavLink';
import { getError } from '../store/selectors';
import { signUp, unloadAuthScreen } from '../store/actions';
import Spacer from '../components/Spacer';

class SignUpScreen extends React.Component {
  static navigationOptions = {
    headerShown: false,
    headerTitle: 'Sign Up'
  };

  state = { username: '', email: '', password: '' };

  onSubmit = () => {
    this.props.signUp({
      username: this.state.username,
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
            Sign Up
          </Text>
        </Spacer>
        <Input
          label="Username"
          value={this.state.username}
          autoCapitalize="none"
          autoCorrect={false}
          onChangeText={username => this.setState({ username })}
        />
        <Spacer />
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
          <Button title="Sign Up" onPress={this.onSubmit} />
        </Spacer>
        <NavLink text="Have an account? Sign In!" routeName="SignIn" />
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
    marginBottom: 120
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

export default connect(mapStateToProps, { signUp, unloadAuthScreen })(
  SignUpScreen
);
