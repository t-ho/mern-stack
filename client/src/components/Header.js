import React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Toolbar from '@material-ui/core/Toolbar';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { withStyles } from '@material-ui/core/styles';
import { push } from 'connected-react-router';
import { Account, Bell, Logout, Menu as MenuIcon } from 'mdi-material-ui';
import { connect } from 'react-redux';
import { compose } from 'redux';
import {
  getIsSignedIn,
  getCurrentUser,
  getSignedInWith,
} from '../store/selectors';
import { signOut } from '../store/actions';

const styles = (theme) => ({
  secondaryBar: {
    zIndex: 0,
  },
  avatar: {
    width: theme.spacing(4),
    height: theme.spacing(4),
  },
  menuButton: {
    marginLeft: -theme.spacing(1),
  },
  iconButtonAvatar: {
    padding: 4,
  },
});

class Header extends React.Component {
  state = { anchorEl: null };

  onMenuOpen = (event) => {
    this.setState({ anchorEl: event.currentTarget });
  };

  onMenuClose = () => {
    this.setState({ anchorEl: null });
  };

  onProfileClick = () => {
    this.setState({ anchorEl: null });
    this.props.push('/dashboard/profile');
  };

  getBrand = () => {
    const { routes: routeCategories, pathname } = this.props;
    let brand = '';
    routeCategories.forEach(({ routes }) => {
      routes.forEach(({ name, path }) => {
        if (pathname.indexOf(path) > -1) {
          brand = name;
        }
      });
    });
    return brand;
  };

  render() {
    const { classes, onDrawerToggle, me, authProvider, signOut } = this.props;

    const { anchorEl } = this.state;

    return (
      <React.Fragment>
        <AppBar color="primary" position="sticky" elevation={0}>
          <Toolbar>
            <Grid container spacing={1} alignItems="center">
              <Hidden lgUp>
                <Grid item>
                  <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    onClick={onDrawerToggle}
                    className={classes.menuButton}
                  >
                    <MenuIcon />
                  </IconButton>
                </Grid>
              </Hidden>
              <Grid item xs>
                <Typography color="inherit" variant="h5" component="h1">
                  {this.getBrand()}
                </Typography>
              </Grid>
              <Grid item>
                <Tooltip title="Alerts • No alerts">
                  <IconButton color="inherit">
                    <Bell />
                  </IconButton>
                </Tooltip>
              </Grid>
              <Grid item>
                <Tooltip title={`${me.firstName} ${me.lastName}`}>
                  <IconButton
                    color="inherit"
                    className={classes.iconButtonAvatar}
                    aria-controls="avatar-menu"
                    aria-haspopup="true"
                    onClick={this.onMenuOpen}
                  >
                    <Avatar
                      src={me.provider[authProvider].picture}
                      alt="My Avatar"
                      className={classes.avatar}
                    />
                  </IconButton>
                </Tooltip>
                <Menu
                  id="avatar-menu"
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={this.onMenuClose}
                  keepMounted
                >
                  <MenuItem onClick={this.onProfileClick}>
                    <ListItemIcon>
                      <Account />
                    </ListItemIcon>
                    <ListItemText primary="Profile" />
                  </MenuItem>
                  <MenuItem onClick={signOut}>
                    <ListItemIcon>
                      <Logout />
                    </ListItemIcon>
                    <ListItemText primary="Log out" />
                  </MenuItem>
                </Menu>
              </Grid>
            </Grid>
          </Toolbar>
        </AppBar>
      </React.Fragment>
    );
  }
}

Header.propTypes = {
  classes: PropTypes.object.isRequired,
  onDrawerToggle: PropTypes.func.isRequired,
  routes: PropTypes.arrayOf(PropTypes.object),
};

const mapStateToProps = (state) => {
  return {
    isSignedIn: getIsSignedIn(state),
    me: getCurrentUser(state),
    authProvider: getSignedInWith(state),
    pathname: state.router.location.pathname,
  };
};

export default compose(
  connect(mapStateToProps, { signOut, push }),
  withStyles(styles)
)(Header);
