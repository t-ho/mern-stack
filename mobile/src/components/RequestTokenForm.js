import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { Text, Button, Input } from 'react-native-elements';
import { connect } from 'react-redux';
import { getError, getProcessed } from '../store/selectors';
import Spacer from './Spacer';

class RequestTokenForm extends React.Component {
  state = { email: '', password: '' };

  onSubmit = () => {
    this.props.onSubmit({
      email: this.state.email,
      tokenPurpose: this.props.tokenPurpose
    });
  };

  render() {
    const { title, errorMessage, isProcessed } = this.props;
    return (
      <SafeAreaView forceInset={{ top: 'always' }} style={styles.container}>
        <Spacer>
          <Text h4 style={styles.title}>
            {title}
          </Text>
        </Spacer>
        {(isProcessed && errorMessage) || !isProcessed ? (
          <>
            <Input
              label="Email"
              value={this.state.email}
              autoCapitalize="none"
              autoCorrect={false}
              onChangeText={email => this.setState({ email })}
            />
            <Spacer />
            {errorMessage && (
              <Text style={styles.errorMessage}>{errorMessage}</Text>
            )}
            <Spacer>
              <Button title="Submit" onPress={this.onSubmit} />
            </Spacer>
          </>
        ) : (
          <Text style={styles.successMessage}>
            An email has been sent to your email.
          </Text>
        )}
      </SafeAreaView>
    );
  }
}

const mapStateToProps = state => {
  return {
    isProcessed: getProcessed(state),
    errorMessage: getError(state)
  };
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
  },
  successMessage: {
    alignSelf: 'center',
    fontSize: 16,
    marginTop: 15
  },
  title: {
    alignSelf: 'center'
  }
});

export default connect(mapStateToProps)(RequestTokenForm);
