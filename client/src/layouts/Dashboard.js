import React from 'react';
import PropTypes from 'prop-types';
import { Switch, Redirect, Route } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Hidden from '@material-ui/core/Hidden';
import Navigator from '../components/Navigator';
import Header from '../components/Header';
import ProtectedRoute from '../components/accessControl/ProtectedRoute';
import routeCategories from '../routes';

const drawerWidth = 256;

const switchRoutes = (
  <Switch>
    {routeCategories.map(({ routes }) =>
      routes.map(({ path, permissions, component }) => (
        <ProtectedRoute
          path={path}
          permissions={permissions}
          component={component}
        />
      ))
    )}
    <Route path="/">
      <Redirect to="/dashboard/profile" />
    </Route>
  </Switch>
);

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
    padding: theme.spacing(1),
  },
});

function Admin(props) {
  const { classes } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <div className={classes.root}>
      <CssBaseline />
      <nav className={classes.drawer}>
        <Hidden lgUp implementation="js">
          <Navigator
            PaperProps={{ style: { width: drawerWidth } }}
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
          />
        </Hidden>
        <Hidden mdDown implementation="css">
          <Navigator PaperProps={{ style: { width: drawerWidth } }} />
        </Hidden>
      </nav>
      <div className={classes.app}>
        <Header onDrawerToggle={handleDrawerToggle} routes={routeCategories} />
        <main className={classes.main}>{switchRoutes}</main>
      </div>
    </div>
  );
}

Admin.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Admin);
