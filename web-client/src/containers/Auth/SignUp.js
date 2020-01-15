import React from 'react';
import { Field, reduxForm, SubmissionError } from 'redux-form';
import { connect } from 'react-redux';
import { signUp } from '../../store/actions';
import { getProcessing, getError } from '../../store/selectors';
import { required, email, minLength } from '../../utils/formValidator';

class SignUp extends React.Component {
  renderInput = field => {
    const className = `field ${
      field.meta.error && field.meta.touched ? 'error' : ''
    }`;
    return (
      <>
        <div className={className}>
          <label>{field.label}</label>
          <input {...field.input} type={field.type} autoComplete="off" />
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
    return this.props.signUp(formValues).then(() => {
      if (this.props.errorMessage) {
        throw new SubmissionError({
          email: this.props.errorMessage
        });
      }
      this.props.history.push('/signin');
    });
  };

  render() {
    const { handleSubmit, pristine, reset, submitting, valid } = this.props;
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
                name="email"
                label="Email"
                type="text"
                validate={[required, email]}
                component={this.renderInput}
              />
              <Field
                name="password"
                label="Password"
                type="password"
                validate={[required, minLength(8)]}
                component={this.renderInput}
              />
              <Field
                name="firstName"
                label="First Name"
                type="text"
                validate={required}
                component={this.renderInput}
              />
              <Field
                name="lastName"
                label="Last Name"
                type="text"
                validate={required}
                component={this.renderInput}
              />
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
}

const maptStateToProps = state => {
  return {
    isProcessing: getProcessing(state),
    errorMessage: getError(state)
  };
};

export default connect(maptStateToProps, { signUp })(
  reduxForm({ form: 'signUp' })(SignUp)
);
