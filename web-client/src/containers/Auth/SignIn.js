import React from 'react';
import { Field, reduxForm, SubmissionError } from 'redux-form';
import { connect } from 'react-redux';
import { compose } from 'redux';
import requireAnonymous from '../../hoc/requireAnonymous';
import { signIn } from '../../store/actions';
import { getProcessing, getError } from '../../store/selectors';
import { email, minLength, required } from '../../utils/formValidator';

class SignIn extends React.Component {
  renderInput = field => {
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

  onSubmit = formValues => {
    return this.props.signIn(formValues).then(() => {
      if (this.props.errorMessage) {
        throw new SubmissionError({ _error: this.props.errorMessage });
      }
    });
  };

  render() {
    const {
      handleSubmit,
      pristine,
      reset,
      submitting,
      valid,
      error
    } = this.props;
    return (
      <div className="ui centered grid">
        <div className="eight wide column">
          <div className="ui segment">
            <h1 className="ui header">Sign In</h1>
            <form
              onSubmit={handleSubmit(this.onSubmit)}
              className="ui form error"
            >
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
              <button
                disabled={pristine || submitting || !valid}
                className="ui button primary"
                type="submit"
              >
                Sign In
              </button>
              <button
                disabled={pristine || submitting}
                onClick={reset}
                className="ui button"
                type="button"
              >
                Reset
              </button>
              {error && (
                <div className="ui error message">
                  <div className="header">{error}</div>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    );
  }
}

const maptStateToProps = state => {
  return {
    isProcessing: getProcessing(state),
    errorMessage: getError(state)
  };
};

const validate = values => {
  const errors = {};
  errors.email = required(values.email) || email(values.email);
  errors.password = required(values.password) || minLength(8)(values.password);
  return errors;
};

export default compose(
  requireAnonymous(),
  connect(maptStateToProps, { signIn }),
  reduxForm({ form: 'signUp', validate })
)(SignIn);
