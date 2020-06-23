import React from 'react';
import Alert from '@material-ui/lab/Alert';
import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import Link from '@material-ui/core/Link';
import Snackbar from '@material-ui/core/Snackbar';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { compose } from 'redux';
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
});

class VerifyEmail extends React.Component {
  componentDidMount() {
    this.verifyToken = this.props.match.params.token;
    this.props.verifyEmail(this.verifyToken);
  }

  componentWillUnmount() {
    this.props.unloadAuthPage();
  }

  render() {
    const { classes, errorMessage, isProcessed } = this.props;
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
          <Box m={2}>
            <Typography variant="body1" color="textSecondary">
              We are verifying your email address
            </Typography>
          </Box>
          <Link href="/signin" variant="body2">
            {'Go to Sign In page'}
          </Link>
        </div>
        <Snackbar open={!!errorMessage}>
          <Alert severity="error">{errorMessage}</Alert>
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

export default compose(
  connect(maptStateToProps, { verifyEmail, unloadAuthPage }),
  withStyles(styles)
)(VerifyEmail);
