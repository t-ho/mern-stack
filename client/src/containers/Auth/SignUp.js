import React from 'react';
import { Field, reduxForm, SubmissionError } from 'redux-form';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { signUp, unloadAuthPage } from '../../store/actions';
import { getProcessing, getError } from '../../store/selectors';
import { required, minLength, email } from '../../utils/formValidator';

class SignUp extends React.Component {
  renderInput = (field) => {
    const className = `field ${
      field.meta.error && field.meta.touched ? 'error' : ''
    }`;
    return (
      <>
        <div className={className}>
          <label>{field.label}</label>
          <input
            {...field.input}
            type={field.type}
            autoComplete="off"
            placeholder={field.placeholder}
          />
        </div>
        {field.meta.touched && field.meta.error && (
          <div className="ui error message">
            <div className="header">{field.meta.error}</div>
          </div>
        )}
      </>
    );
  };

  onSubmit = (formValues) => {
    return this.props.signUp(formValues).then(() => {
      if (this.props.errorMessage) {
        throw new SubmissionError({ _error: this.props.errorMessage });
      }
      this.props.history.push('/signin');
    });
  };

  render() {
    const {
      handleSubmit,
      pristine,
      reset,
      submitting,
      valid,
      error,
    } = this.props;
    return (
      <div className="ui centered grid">
        <div className="eight wide column">
          <div className="ui segment">
            <h1 className="ui header">Sign Up</h1>
            <form
              onSubmit={handleSubmit(this.onSubmit)}
              className="ui form error"
            >
              <Field
                name="username"
                label="Username"
                placeholder="Enter your username"
                type="text"
                component={this.renderInput}
              />
              <Field
                name="email"
                label="Email"
                placeholder="Enter your email"
                type="text"
                component={this.renderInput}
              />
              <Field
                name="password"
                label="Password"
                placeholder="Enter your password"
                type="password"
                component={this.renderInput}
              />
              {error && (
                <div className="ui error message">
                  <div className="header">{error}</div>
                </div>
              )}
              <button
                disabled={pristine || submitting || !valid}
                className="ui button primary"
                type="submit"
              >
                Sign Up
              </button>
              <button
                disabled={pristine || submitting}
                onClick={reset}
                className="ui button"
                type="button"
              >
                Reset
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  componentWillUnmount() {
    this.props.unloadAuthPage();
  }
}

const maptStateToProps = (state) => {
  return {
    isProcessing: getProcessing(state),
    errorMessage: getError(state),
  };
};

const validate = (values) => {
  const errors = {};
  errors.username = required(values.username) || minLength(4)(values.username);
  errors.email = required(values.email) || email(values.email);
  errors.password = required(values.password) || minLength(8)(values.password);
  return errors;
};

export default compose(
  connect(maptStateToProps, { signUp, unloadAuthPage }),
  reduxForm({ form: 'signUp', validate })
)(SignUp);
