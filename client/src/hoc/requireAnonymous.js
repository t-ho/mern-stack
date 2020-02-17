import React from 'react';
import { connect } from 'react-redux';
import { getIsSignedIn, getDefaultPath } from '../store/selectors';

/**
 * If user already logged in, redirect to default path.
 *
 * @param {Component} WrappedComponent The component to be wrapped
 */
const requireAnonymous = () => WrappedComponent => {
  class ComposedComponent extends React.Component {
    componentDidMount() {
      this.shouldNavigateAway();
    }

    componentDidUpdate() {
      this.shouldNavigateAway();
    }

    shouldNavigateAway = () => {
      if (this.props.isSignedIn) {
        this.props.history.replace(this.props.defaultPath);
      }
    };

    render() {
      return <WrappedComponent {...this.props} />;
    }
  }

  const mapStateToProps = state => {
    return {
      isSignedIn: getIsSignedIn(state),
      defaultPath: getDefaultPath(state)
    };
  };

  return connect(mapStateToProps)(ComposedComponent);
};

export default requireAnonymous;
