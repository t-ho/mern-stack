import React from 'react';
import { Field, reduxForm, SubmissionError } from 'redux-form';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Link } from 'react-router-dom';
import requireAnonymous from '../../hoc/requireAnonymous';
import {
  signIn,
  facebookSignIn,
  googleSignIn,
  unloadAuthPage,
} from '../../store/actions';
import { getProcessing, getError } from '../../store/selectors';
import { email, minLength, required } from '../../utils/formValidator';
import GoogleLogin from 'react-google-login';
import FacebookLogin from 'react-facebook-login';

class SignIn extends React.Component {
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
    return this.props.signIn(formValues).then(() => {
      if (this.props.errorMessage) {
        throw new SubmissionError({ _error: this.props.errorMessage });
      }
    });
  };

  onFacebookResponse = (response) => {
    const payload = {
      access_token: response.accessToken,
    };
    this.props.facebookSignIn(payload).then(() => {
      // FIXME:
      if (this.props.errorMessage) {
        console.log(this.props.errorMessage);
      }
    });
  };

  onGoogleResponse = (response) => {
    const payload = {
      access_token: response.tokenObj.access_token,
    };
    this.props.googleSignIn(payload).then(() => {
      // FIXME:
      if (this.props.errorMessage) {
        console.log(this.props.errorMessage);
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
              <div className="field">
                Forgot your password?{' '}
                <Link to="/request-password-reset">Click here</Link>
              </div>
              {this.props.errorMessage === 'Email is not verified.' && (
                <div className="field">
                  Have not received verification email?{' '}
                  <Link to="/request-verification-email">Click here</Link>
                </div>
              )}
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
            </form>
          </div>
          <div className="ui segment">
            <div className="ui stackable two column center aligned grid">
              <div className="column">
                <GoogleLogin
                  clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
                  buttonText="Google Login"
                  onSuccess={this.onGoogleResponse}
                  onFailure={this.onGoogleResponse}
                  render={(renderProps) => (
                    <button
                      onClick={renderProps.onClick}
                      disabled={renderProps.disabled}
                      className="ui google blue large button"
                    >
                      <i className="google icon"></i>
                      Google Login
                    </button>
                  )}
                />
              </div>
              <div className="column">
                <FacebookLogin
                  appId={process.env.REACT_APP_FACEBOOK_APP_ID}
                  fields="name,email,picture"
                  scope="public_profile,email"
                  version="6.0"
                  callback={this.onFacebookResponse}
                  textButton="Facebook Login"
                  icon={<i className="facebook icon"></i>}
                  cssClass="ui facebook large button"
                />
              </div>
            </div>
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
  errors.email = required(values.email) || email(values.email);
  errors.password = required(values.password) || minLength(8)(values.password);
  return errors;
};

export default compose(
  requireAnonymous(),
  connect(maptStateToProps, {
    signIn,
    facebookSignIn,
    googleSignIn,
    unloadAuthPage,
  }),
  reduxForm({ form: 'signIn', validate })
)(SignIn);
