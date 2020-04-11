import React from 'react';
import { Field, reduxForm, SubmissionError } from 'redux-form';
import { connect } from 'react-redux';
import { compose } from 'redux';
import requireAnonymous from '../../hoc/requireAnonymous';
import { resetPassword, unloadAuthPage } from '../../store/actions';
import { getError, getProcessed } from '../../store/selectors';
import { email, minLength, required } from '../../utils/formValidator';

class ResetPassword extends React.Component {
  componentDidMount() {
    this.resetToken = this.props.match.params.token;
  }

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
    return this.props.resetPassword(formValues, this.resetToken).then(() => {
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
      error,
      errorMessage,
      isProcessed,
    } = this.props;
    return (
      <div className="ui centered grid">
        <div className="eight wide column">
          <div className="ui segment">
            <h1 className="ui header">Reset Your Password</h1>
            {(isProcessed && errorMessage) || !isProcessed ? (
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
                  placeholder="Enter your new password"
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
                  Submit
                </button>
                <button
                  disabled={pristine || submitting}
                  onClick={reset}
                  className="ui button"
                  type="button"
                >
                  Clear
                </button>
              </form>
            ) : (
              <h4 className="ui header">
                Your password has been reset successfully.
              </h4>
            )}
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
    isProcessed: getProcessed(state),
    errorMessage: getError(state),
  };
};

const validate = (values) => {
  const errors = {};
  errors.email = required(values.email) || email(values.email);
  errors.password = required(values.password) || minLength(8)(values.password);
  return errors;
};

export default compose(
  requireAnonymous(),
  connect(maptStateToProps, { resetPassword, unloadAuthPage }),
  reduxForm({ form: 'resetPassword', validate })
)(ResetPassword);
