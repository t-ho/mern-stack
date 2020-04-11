import React from 'react';
import { Field, reduxForm, SubmissionError } from 'redux-form';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { getError, getProcessed } from '../store/selectors';
import { email, required } from '../utils/formValidator';

class RequestTokenForm extends React.Component {
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
    formValues.tokenPurpose = this.props.tokenPurpose;
    return this.props.onSubmit(formValues).then(() => {
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
      title,
      isProcessed,
      errorMessage,
    } = this.props;
    return (
      <div className="ui centered grid">
        <div className="eight wide column">
          <div className="ui segment">
            <h1 className="ui header">{title}</h1>
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
                  Reset
                </button>
              </form>
            ) : (
              <h4 className="ui header">
                An email has been sent to your email address.
              </h4>
            )}
          </div>
        </div>
      </div>
    );
  }
}

const maptStateToProps = (state) => {
  return {
    errorMessage: getError(state),
    isProcessed: getProcessed(state),
  };
};

const validate = (values) => {
  const errors = {};
  errors.email = required(values.email) || email(values.email);
  return errors;
};

export default compose(
  connect(maptStateToProps),
  reduxForm({ form: 'requestToken', validate })
)(RequestTokenForm);
