import React from 'react';
import Alert from '@material-ui/lab/Alert';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import Link from '@material-ui/core/Link';
import Snackbar from '@material-ui/core/Snackbar';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { Field, reduxForm, SubmissionError } from 'redux-form';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { required } from '../../utils/formValidator';
import { verifyEmail, unloadAuthPage } from '../../store/actions';
import { getError, getProcessed } from '../../store/selectors';

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

class VerifyEmail extends React.Component {
  componentDidMount() {
    this.verifyToken = this.props.match.params.token;
  }

  onSubmit = (formValues) => {
    return this.props.verifyEmail(formValues, this.verifyToken).then(() => {
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
      margin="none"
      autoComplete="off"
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
      errorMessage,
      error,
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
            Verify Email
          </Typography>
          <form className={classes.form} onSubmit={handleSubmit(this.onSubmit)}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Field
                  component={this.renderTextField}
                  disabled={isProcessed && !errorMessage}
                  id="password"
                  label="Password"
                  placeholder="Please enter your password"
                  name="password"
                  type="password"
                />
              </Grid>
            </Grid>
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
                <Link href="/request-password-reset" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
            </Grid>
          </form>
        </div>
        <Snackbar open={!!error}>
          <Alert severity="error">{error}</Alert>
        </Snackbar>
        <Snackbar open={isProcessed && !errorMessage}>
          <Alert
            severity="success"
            action={
              <Link href="/signin" variant="body2">
                Sign In
              </Link>
            }
          >
            Email has been verified successfully
          </Alert>
        </Snackbar>
      </Container>
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
  return { password: required(values.password) };
};

export default compose(
  connect(maptStateToProps, { verifyEmail, unloadAuthPage }),
  reduxForm({ form: 'verify-email', validate }),
  withStyles(styles)
)(VerifyEmail);
