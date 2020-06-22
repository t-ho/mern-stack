import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { Link } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Avatar from '@material-ui/core/Avatar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { Tag } from 'mdi-material-ui';
import { connect } from 'react-redux';
import { compose } from 'redux';

import ProtectedComponent from './accessControl/ProtectedComponent';
import routeCategories from '../routes';

const styles = (theme) => ({
  categoryHeader: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  categoryHeaderPrimary: {
    color: theme.palette.common.white,
  },
  item: {
    paddingTop: 1,
    paddingBottom: 1,
    color: 'rgba(255, 255, 255, 0.7)',
    '&:hover,&:focus': {
      backgroundColor: 'rgba(255, 255, 255, 0.08)',
    },
  },
  itemCategory: {
    backgroundColor: '#232f3e',
    boxShadow: '0 -1px 0 #404854 inset',
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  logo: {
    width: theme.spacing(4),
    height: theme.spacing(4),
    marginRight: theme.spacing(2),
  },
  drawerTitle: {
    fontSize: 20,
    color: theme.palette.common.white,
  },
  itemActiveItem: {
    color: theme.palette.primary.main,
  },
  itemPrimary: {
    fontSize: 'inherit',
  },
  itemIcon: {
    minWidth: 'auto',
    marginRight: theme.spacing(2),
  },
  divider: {
    marginTop: theme.spacing(2),
    backgroundColor: '#404854',
  },
});

function Navigator(props) {
  const { classes, pathname, onClose, ...other } = props;
  return (
    <Drawer variant="permanent" onClose={onClose} {...other}>
      <List disablePadding onClick={onClose}>
        <ListItem
          className={clsx(
            classes.drawerTitle,
            classes.item,
            classes.itemCategory
          )}
        >
          <Avatar
            alt="Logo"
            src="/logo-circle512.png"
            className={classes.logo}
          />
          MERN Stack
        </ListItem>
        <ListItem className={clsx(classes.item, classes.itemCategory)}>
          <ListItemIcon className={classes.itemIcon}>
            <Tag />
          </ListItemIcon>
          <ListItemText
            classes={{
              primary: classes.itemPrimary,
            }}
          >
            {process.env.REACT_APP_VERSION ?? 'App Version'}
          </ListItemText>
        </ListItem>
        {routeCategories.map(
          ({ id, name: categoryName, showOnDrawer, routes }) => {
            if (!showOnDrawer) return null;
            return (
              <React.Fragment key={id}>
                <ListItem className={classes.categoryHeader}>
                  <ListItemText
                    classes={{
                      primary: classes.categoryHeaderPrimary,
                    }}
                  >
                    {categoryName}
                  </ListItemText>
                </ListItem>
                {routes.map(
                  ({
                    id: childId,
                    path,
                    name,
                    permissions,
                    icon: IconComponent,
                  }) => (
                    <ProtectedComponent key={childId} permissions={permissions}>
                      <Link to={path}>
                        <ListItem
                          button
                          className={clsx(
                            classes.item,
                            pathname.indexOf(path) > -1 &&
                              classes.itemActiveItem
                          )}
                        >
                          <ListItemIcon className={classes.itemIcon}>
                            <IconComponent />
                          </ListItemIcon>
                          <ListItemText
                            classes={{
                              primary: classes.itemPrimary,
                            }}
                          >
                            {name}
                          </ListItemText>
                        </ListItem>
                      </Link>
                    </ProtectedComponent>
                  )
                )}

                <Divider className={classes.divider} />
              </React.Fragment>
            );
          }
        )}
      </List>
    </Drawer>
  );
}

const mapStateToProps = (state) => ({
  pathname: state.router.location.pathname,
});

Navigator.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default compose(
  connect(mapStateToProps, {}),
  withStyles(styles)
)(Navigator);
