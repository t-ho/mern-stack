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
import { signUp, unloadAuthPage } from '../../store/actions';
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
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
});

class SignUp extends React.Component {
  onSubmit = (formValues) => {
    return this.props.signUp(formValues).then(() => {
      if (this.props.errorMessage) {
        throw new SubmissionError({ _error: this.props.errorMessage });
      }
      this.props.history.push('/signin');
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
            Sign Up
          </Typography>
          <form className={classes.form} onSubmit={handleSubmit(this.onSubmit)}>
            <Field
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              component={this.renderTextField}
            />
            <Field
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              component={this.renderTextField}
            />
            <Field
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              component={this.renderTextField}
            />
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
            <Grid container justify="flex-end">
              <Grid item>
                <Link href="/signin" variant="body2">
                  {'Already have an account? Sign in'}
                </Link>
              </Grid>
            </Grid>
          </form>
        </div>
        <Snackbar open={!!error}>
          <Alert severity="error">{error}</Alert>
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
  errors.username = required(values.username) || minLength(4)(values.username);
  errors.email = required(values.email) || email(values.email);
  errors.password = required(values.password) || minLength(8)(values.password);
  return errors;
};

export default compose(
  connect(maptStateToProps, { signUp, unloadAuthPage }),
  reduxForm({ form: 'signUp', validate }),
  withStyles(styles)
)(SignUp);
