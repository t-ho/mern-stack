import React from 'react';
import Alert from '@material-ui/lab/Alert';
import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import Snackbar from '@material-ui/core/Snackbar';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import { Facebook, Google } from 'mdi-material-ui';
import GoogleLogin from 'react-google-login';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import { Field, reduxForm, SubmissionError } from 'redux-form';
import { connect } from 'react-redux';
import { compose } from 'redux';
import {
  signIn,
  facebookSignIn,
  googleSignIn,
  unloadAuthPage,
} from '../../store/actions';
import { getProcessing, getError } from '../../store/selectors';
import { email, minLength, required } from '../../utils/formValidator';

const styles = (theme) => ({
  paper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    marginTop: theme.spacing(6),
    marginBottom: theme.spacing(2),
    width: theme.spacing(10),
    height: theme.spacing(10),
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(4, 0, 2),
  },
});

class SignIn extends React.Component {
  onSubmit = (formValues) => {
    return this.props.signIn(formValues).then(() => {
      if (this.props.errorMessage) {
        throw new SubmissionError({ _error: this.props.errorMessage });
      }
    });
  };

  onFacebookResponse = (response) => {
    const payload = {
      accessToken: response.accessToken,
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
      idToken: response.tokenId,
    };
    this.props.googleSignIn(payload).then(() => {
      // FIXME:
      if (this.props.errorMessage) {
        console.log(this.props.errorMessage);
      }
    });
  };

  componentWillUnmount() {
    this.props.unloadAuthPage();
  }

  renderTextField = ({ input, label, meta: { touched, error }, ...custom }) => (
    <TextField
      label={label}
      error={touched && !!error}
      helperText={touched && error}
      variant="outlined"
      margin="none"
      required
      fullWidth
      {...input}
      {...custom}
    />
  );

  render() {
    const {
      classes,
      handleSubmit,
      pristine,
      submitting,
      valid,
      error,
    } = this.props;
    return (
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar
            className={classes.avatar}
            alt="Logo"
            src="/logo-circle512.png"
          />
          <Typography component="h1" variant="h5" color="primary">
            Sign in
          </Typography>
          <form className={classes.form} onSubmit={handleSubmit(this.onSubmit)}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Field
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  component={this.renderTextField}
                />
              </Grid>
              <Grid item xs={12}>
                <Field
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  component={this.renderTextField}
                />
              </Grid>
            </Grid>
            <Button
              className={classes.submit}
              color="primary"
              disabled={pristine || submitting || !valid}
              fullWidth
              type="submit"
              variant="contained"
            >
              Submit
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="/request-password-reset" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="/signup" variant="body2">
                  {"Don't have an account? Sign up"}
                </Link>
              </Grid>
            </Grid>
          </form>
          <Box m={3}>
            <Typography variant="body2" color="textSecondary">
              Or Sign In With
            </Typography>
          </Box>
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <FacebookLogin
                appId={process.env.REACT_APP_FACEBOOK_APP_ID}
                fields="name,email,picture"
                scope="public_profile,email"
                version="7.0"
                callback={this.onFacebookResponse}
                render={(renderProps) => (
                  <Button
                    color="primary"
                    disabled={renderProps.isProcessing}
                    fullWidth
                    onClick={renderProps.onClick}
                    startIcon={<Facebook />}
                    variant="outlined"
                  >
                    Facebook
                  </Button>
                )}
              />
            </Grid>
            <Grid item xs={6}>
              <GoogleLogin
                clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
                buttonText="Google Login"
                onSuccess={this.onGoogleResponse}
                onFailure={this.onGoogleResponse}
                render={(renderProps) => (
                  <Button
                    color="secondary"
                    disabled={renderProps.disabled}
                    fullWidth
                    onClick={renderProps.onClick}
                    startIcon={<Google />}
                    variant="outlined"
                  >
                    Google
                  </Button>
                )}
              />
            </Grid>
          </Grid>
        </div>
        <Snackbar open={!!error}>
          {error !== 'Email is not verified' ? (
            <Alert severity="error">{error}</Alert>
          ) : (
            <Alert
              severity="error"
              action={
                <Link href="/request-verification-email" variant="body2">
                  Click here
                </Link>
              }
            >
              Email is not verified. Have not received verification email?
            </Alert>
          )}
        </Snackbar>
      </Container>
    );
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
  connect(maptStateToProps, {
    signIn,
    facebookSignIn,
    googleSignIn,
    unloadAuthPage,
  }),
  reduxForm({ form: 'signIn', validate }),
  withStyles(styles)
)(SignIn);
