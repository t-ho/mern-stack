import React from 'react';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { getCurrentUser, getSignedInWith } from '../../store/selectors';

const styles = (theme) => ({
  image: {
    backgroundColor: '#f5f5f5',
    width: '100%',
  },
});

class Profile extends React.Component {
  render() {
    const { me, classes, authProvider } = this.props;

    let picture = '';
    if (me.provider) {
      picture = me.provider[authProvider].picture;
    }

    picture = picture ? picture : '/logo-circle512.png';

    return (
      <Grid container justify="center">
        <Grid xs={12} sm={5} md={3} item>
          <Card>
            <CardActionArea>
              <CardMedia
                component={() => (
                  <div>
                    <img alt="avatar" src={picture} className={classes.image} />
                  </div>
                )}
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                  {`${me.firstName} ${me.lastName}`}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  Joined in {new Date(me.createdAt).getFullYear()}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  You are logged in as <b>{me.username}</b>
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      </Grid>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    me: getCurrentUser(state),
    authProvider: getSignedInWith(state),
  };
};

export default compose(
  connect(mapStateToProps, {}),
  withStyles(styles)
)(Profile);
