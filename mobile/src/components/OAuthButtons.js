import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button } from 'react-native-paper';
import { connect } from 'react-redux';
import { getProcessing, getType } from '../store/selectors';
import { facebookSignIn, googleSignIn } from '../store/actions';

class OAuthButtons extends React.Component {
  state = { signInType: '' };

  onFacebookSignIn = () => {
    this.setState({ signInType: 'facebook' });
    this.props.facebookSignIn();
  };

  onGoogleSignIn = () => {
    this.setState({ signInType: 'google' });
    this.props.googleSignIn();
  };

  render() {
    return (
      <View style={styles.oauthButtons}>
        <Button
          icon="facebook"
          mode="outlined"
          color="#0D47A1"
          style={styles.oauthButton}
          accessibilityLabel="Sign In With Facebook"
          onPress={this.onFacebookSignIn}
          loading={this.props.isSigning && this.props.type === 'facebook'}
          disabled={this.props.isSigning}
        >
          Facebook
        </Button>
        <Button
          icon="google"
          mode="outlined"
          color="#f44336"
          style={styles.oauthButton}
          accessibilityLabel="Sign In With Google"
          onPress={this.onGoogleSignIn}
          loading={this.props.isSigning && this.props.type === 'google'}
          disabled={this.props.isSigning}
        >
          Google
        </Button>
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return { isSigning: getProcessing(state), type: getType(state) };
};

const styles = StyleSheet.create({
  oauthButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  oauthButton: {
    width: '47%',
  },
});

export default connect(mapStateToProps, {
  facebookSignIn,
  googleSignIn,
})(OAuthButtons);
