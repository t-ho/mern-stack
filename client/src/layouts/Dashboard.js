import React from 'react';
import PropTypes from 'prop-types';
import CssBaseline from '@material-ui/core/CssBaseline';
import Hidden from '@material-ui/core/Hidden';
import { withStyles } from '@material-ui/core/styles';
import { Switch, Redirect, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'redux';
import Navigator from '../components/Navigator';
import Header from '../components/Header';
import ProtectedRoute from '../components/accessControl/ProtectedRoute';
import { getRouteCategories } from '../store/selectors';

const drawerWidth = 256;

const styles = (theme) => ({
  root: {
    display: 'flex',
  },
  drawer: {
    [theme.breakpoints.up('lg')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  app: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  main: {
    flex: 1,
    padding: theme.spacing(2),
  },
});

class Dashboard extends React.Component {
  state = { mobileOpen: false };

  handleDrawerToggle = () => {
    this.setState({ mobileOpen: !this.state.mobileOpen });
  };

  renderSwitchRoutes = (routeCategories) => (
    <Switch>
      {routeCategories.map(({ routes }) =>
        routes.map(
          ({
            path,
            requiresRole,
            permissions,
            requiresAnyPermissions,
            component,
          }) => (
            <ProtectedRoute
              path={path}
              requiresRole={requiresRole}
              permissions={permissions}
              requiresAnyPermissions={requiresAnyPermissions}
              component={component}
            />
          )
        )
      )}
      <Route path="/">
        <Redirect to="/dashboard/profile" />
      </Route>
    </Switch>
  );

  render() {
    const { classes, routeCategories } = this.props;
    const { mobileOpen } = this.state;

    return (
      <div className={classes.root}>
        <CssBaseline />
        <nav className={classes.drawer}>
          <Hidden lgUp implementation="js">
            <Navigator
              PaperProps={{ style: { width: drawerWidth } }}
              variant="temporary"
              open={mobileOpen}
              onClose={this.handleDrawerToggle}
            />
          </Hidden>
          <Hidden mdDown implementation="css">
            <Navigator PaperProps={{ style: { width: drawerWidth } }} />
          </Hidden>
        </nav>
        <div className={classes.app}>
          <Header
            onDrawerToggle={this.handleDrawerToggle}
            routes={routeCategories}
          />
          <main className={classes.main}>
            {this.renderSwitchRoutes(routeCategories)}
          </main>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  routeCategories: getRouteCategories(state),
});

Dashboard.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default compose(
  connect(mapStateToProps, {}),
  withStyles(styles)
)(Dashboard);
