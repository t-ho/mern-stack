import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView, NavigationEvents } from 'react-navigation';
import { Text, Button, SocialIcon } from 'react-native-elements';
import { connect } from 'react-redux';
import { getError } from '../store/selectors';
import {
  facebookSignIn,
  googleSignIn,
  unloadAuthScreen
} from '../store/actions';
import Spacer from '../components/Spacer';

class SignInOptionsScreen extends React.Component {
  static navigationOptions = {
    headerShown: false,
    headerTitle: 'Sign In Options'
  };

  render() {
    return (
      <SafeAreaView forceInset={{ top: 'always' }} style={styles.container}>
        <NavigationEvents onWillBlur={this.props.unloadAuthScreen} />
        <Spacer>
          <Text h3 style={styles.title}>
            Sign In Options
          </Text>
        </Spacer>
        {this.props.errorMessage ? (
          <Text style={styles.errorMessage}>{this.props.errorMessage}</Text>
        ) : null}
        <Spacer>
          <SocialIcon
            style={styles.button}
            title="Sign In With Email"
            button
            type="medium"
            onPress={() => this.props.navigation.navigate('SignIn')}
          />
        </Spacer>
        <Spacer>
          <SocialIcon
            style={styles.button}
            title="Sign In With Facebook"
            button
            type="facebook"
            onPress={() => this.props.facebookSignIn()}
          />
        </Spacer>
        <Spacer>
          <SocialIcon
            style={styles.button}
            title="Sign In With Google"
            button
            type="google"
            onPress={() => this.props.googleSignIn()}
          />
        </Spacer>
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
    marginBottom: 110
  },
  errorMessage: {
    alignSelf: 'center',
    color: 'red',
    fontSize: 16,
    marginTop: 15
  },
  title: {
    alignSelf: 'center'
  },
  button: {
    margin: 0,
    borderRadius: 5
  }
});

export default connect(mapStateToProps, {
  facebookSignIn,
  googleSignIn,
  unloadAuthScreen
})(SignInOptionsScreen);
