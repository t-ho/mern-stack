import React from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import {
  Button,
  IconButton,
  Snackbar,
  TextInput,
  Title,
  withTheme,
} from 'react-native-paper';
import { withNavigation } from 'react-navigation';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { getError, getProcessed, getProcessing } from '../store/selectors';
import { clearErrorMessage } from '../store/actions';
import Spacer from './Spacer';
import Logo from './Logo';

class RequestTokenForm extends React.Component {
  state = { email: '', password: '' };

  onSubmit = () => {
    this.props.onSubmit({
      email: this.state.email,
      tokenPurpose: this.props.tokenPurpose,
    });
  };

  render() {
    const { title, errorMessage, isProcessed, isProcessing } = this.props;
    const { colors } = this.props.theme;
    return (
      <View style={styles.container}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
        >
          <IconButton
            icon="chevron-left"
            color={this.props.theme.colors.primary}
            size={30}
            accessibilityLabel="Back to sign in"
            onPress={() => this.props.navigation.goBack()}
          />
          <Logo />
          <Spacer>
            <Title style={{ alignSelf: 'center', color: colors.primary }}>
              {title}
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
              onSubmitEditing={this.onSubmit}
              disabled={isProcessing || (isProcessed && !errorMessage)}
            />
          </Spacer>
          <Spacer vertical={16}>
            <Button
              mode="contained"
              accessibilityLabel="Submit"
              onPress={this.onSubmit}
              loading={isProcessing}
              disabled={isProcessing || (isProcessed && !errorMessage)}
            >
              Submit
            </Button>
          </Spacer>
        </ScrollView>
        <Snackbar
          visible={errorMessage}
          onDismiss={this.props.clearErrorMessage}
          action={{
            label: 'Dismiss',
            accessibilityLabel: 'Dismiss',
            onPress: () => {},
          }}
          style={{ backgroundColor: colors.error }}
        >
          {errorMessage}
        </Snackbar>
        <Snackbar
          visible={isProcessed && !errorMessage}
          onDismiss={() => this.props.navigation.goBack()}
          action={{
            label: 'Go Back',
            accessibilityLabel: 'Go Back',
            onPress: () => this.props.navigation.goBack(),
          }}
        >
          An email has been sent to your email.
        </Snackbar>
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isProcessed: getProcessed(state),
    isProcessing: getProcessing(state),
    errorMessage: getError(state),
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default compose(
  connect(mapStateToProps, { clearErrorMessage }),
  withTheme,
  withNavigation
)(RequestTokenForm);
