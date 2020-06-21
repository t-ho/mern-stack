import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import { Field, reduxForm, SubmissionError } from 'redux-form';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { resetPassword, unloadAuthPage } from '../../store/actions';
import { getError, getProcessed } from '../../store/selectors';
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
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
});

class ResetPassword extends React.Component {
  componentDidMount() {
    this.resetToken = this.props.match.params.token;
  }
  onSubmit = (formValues) => {
    return this.props.resetPassword(formValues, this.resetToken).then(() => {
      if (this.props.errorMessage) {
        throw new SubmissionError({ _error: this.props.errorMessage });
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
      margin="normal"
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
      errorMessage,
      isProcessed,
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
            Reset Your Password
          </Typography>
          <form className={classes.form} onSubmit={handleSubmit(this.onSubmit)}>
            <Field
              autoComplete="email"
              component={this.renderTextField}
              disabled={isProcessed && !errorMessage}
              id="email"
              label="Email Address"
              name="email"
            />
            <Field
              autoComplete="current-password"
              component={this.renderTextField}
              disabled={isProcessed && !errorMessage}
              id="password"
              label="Password"
              name="password"
              type="password"
            />
            <Button
              className={classes.submit}
              color="primary"
              disabled={
                pristine ||
                submitting ||
                !valid ||
                (isProcessed && !errorMessage)
              }
              fullWidth
              type="submit"
              variant="contained"
            >
              Submit
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="/signin" variant="body2">
                  Sign In
                </Link>
              </Grid>
              <Grid item>
                <Link href="/signup" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </form>
        </div>
        <Snackbar open={!!error}>
          <Alert severity="error">{error}</Alert>
        </Snackbar>
        <Snackbar open={isProcessed && !errorMessage}>
          <Alert severity="success">
            Your password has been reset successfully
          </Alert>
        </Snackbar>
      </Container>
    );
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
  connect(maptStateToProps, { resetPassword, unloadAuthPage }),
  reduxForm({ form: 'reset-password', validate }),
  withStyles(styles)
)(ResetPassword);
