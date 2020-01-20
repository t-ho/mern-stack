import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import requireAnonymous from '../../hoc/requireAnonymous';
import { verifyEmail } from '../../store/actions';
import { getError } from '../../store/selectors';

class SignIn extends React.Component {
  componentDidMount() {
    this.verifyToken = this.props.match.params.token;
    this.props.verifyEmail(this.verifyToken);
  }

  render() {
    const { errorMessage } = this.props;
    return (
      <div className="ui centered grid">
        <div className="eight wide column">
          <div className="ui segment">
            <h2 className="ui header">
              {errorMessage
                ? errorMessage
                : 'Email has been verified successfully.'}
            </h2>
          </div>
        </div>
      </div>
    );
  }
}

const maptStateToProps = state => {
  return {
    errorMessage: getError(state)
  };
};

export default compose(
  requireAnonymous(),
  connect(maptStateToProps, { verifyEmail })
)(SignIn);
