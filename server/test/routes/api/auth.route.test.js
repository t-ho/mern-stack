const mongoose = require('mongoose');
const request = require('supertest');
const expect = require('chai').expect;
const _ = require('lodash');
const uuidv4 = require('uuid/v4');
const jwt = require('jsonwebtoken');
const config = require('../../../config');

const createTestPayloadValidation = endpoint => {
  return (payload, statusCode, errorMessage, done) => {
    request(app)
      .post(endpoint)
      .send(payload)
      .expect(statusCode)
      .expect({ error: errorMessage }, done);
  };
};

const createJwtToken = payload => {
  return jwt.sign(payload, config.jwt.secret, {
    algorithm: config.jwt.algorithm
  });
};

const decodeJwtToken = jwtToken => {
  return jwt.verify(jwtToken, config.jwt.secret);
};

describe('ENDPOINT: POST /api/auth/signup', function() {
  const endpoint = '/api/auth/signup';
  const testValidation = createTestPayloadValidation(endpoint);

  it(`POST ${endpoint} - Email required`, function(done) {
    const payload = {
      username: 'john',
      password: 'qweasdzxc'
    };

    testValidation(payload, 400, 'Email is required.', done);
  });

  it(`POST ${endpoint} - Username required`, function(done) {
    const payload = {
      email: 'john@tdev.app',
      password: 'qweasdzxc'
    };

    testValidation(payload, 400, 'Username is required.', done);
  });

  it(`POST ${endpoint} - Password required`, function(done) {
    const payload = {
      username: 'john',
      email: 'john@tdev.app'
    };

    testValidation(payload, 400, 'Password is required.', done);
  });

  it(`POST ${endpoint} - Email existed`, function(done) {
    const payload = {
      username: 'john',
      email: 'admin@tdev.app',
      password: 'qweasdzxc'
    };

    testValidation(payload, 422, 'Email is already in use.', done);
  });

  it(`POST ${endpoint} - Username existed`, function(done) {
    const payload = {
      username: 'admin',
      email: 'john@tdev.app',
      password: 'qweasdzxc'
    };

    testValidation(payload, 422, 'Username is already in use.', done);
  });

  it(`POST ${endpoint} - Fresh sign up succeeded`, function(done) {
    const User = mongoose.model('User');
    const payload = {
      username: 'john',
      email: 'john@tdev.app',
      password: 'qweasdzxc'
    };

    request(app)
      .post(endpoint)
      .send(payload)
      .expect(201)
      .then(res => {
        if (config.auth.verifyEmail) {
          expect(res.body).to.deep.equal({
            success: true,
            message: 'A verification email has been sent to your email.'
          });
        } else {
          expect(res.body).to.deep.equal({
            success: true,
            message: 'Your account has been created successfully.'
          });
        }
        return User.findOne({ email: payload.email });
      })
      .then(user => {
        user = user.toObject();
        expect(user).to.have.property('permissions');
        _.forOwn(user.permissions, (value, key) => {
          expect(value).to.be.false;
        });
        if (config.auth.verifyEmail) {
          expect(user.status).to.be.equal('unverifiedEmail');
        } else {
          expect(user.status).to.be.equal('active');
        }
        expect(user.role).to.equal('user');
        expect(user.username).to.be.equal(payload.username);
        expect(user.email).to.be.equal(payload.email);
        expect(user.subId).to.be.a('string');
        expect(mongoose.Types.ObjectId.isValid(user.subId)).to.be.true;
        expect(user).to.not.have.property('password');
        expect(user.hashedPassword).to.be.a('string');
        expect(user.hashedPassword).to.not.equal(payload.password);
        expect(user.provider).to.be.an('object');
        expect(user.provider.local.userId).to.be.equal(user._id.toString());
        done();
      })
      .catch(done);
  });

  it(`POST ${endpoint} - Oauth account with the same email existed - Sign up succeeded`, function(done) {
    const User = mongoose.model('User');
    existingUser = app.locals.existing.user;
    existingUser.provider.local = undefined;
    existingUser
      .save()
      .then(u => {
        existingUser = u;
        const payload = {
          username: 'this-username-willbe-ignored',
          email: 'user@tdev.app',
          password: 'qweasdzxc'
        };

        request(app)
          .post(endpoint)
          .send(payload)
          .expect(201)
          .expect({
            success: true,
            message: 'Your account has been created successfully.'
          })
          .then(res => User.findOne({ email: payload.email }))
          .then(user => {
            user = user.toObject();
            expect(user).to.have.property('permissions');
            _.forOwn(user.permissions, (value, key) => {
              expect(value).to.be.false;
            });
            expect(user.status).to.be.equal('active');
            expect(user.role).to.equal('user');
            expect(user.username).to.be.equal(existingUser.username);
            expect(user.email).to.be.equal(payload.email);
            expect(user.subId).to.be.a('string');
            expect(mongoose.Types.ObjectId.isValid(user.subId)).to.be.true;
            expect(user).to.not.have.property('password');
            expect(user.hashedPassword).to.be.a('string');
            expect(user.hashedPassword).to.not.equal(payload.password);
            expect(user.provider).to.be.an('object');
            expect(user.provider.local).to.deep.include({
              userId: user._id.toString()
            });
            expect(user.provider.google).to.deep.equal(
              existingUser.toObject().provider.google
            );
            expect(user.provider.facebook).to.deep.equal(
              existingUser.toObject().provider.facebook
            );
            done();
          })
          .catch(done);
      })
      .catch(done);
  });
});

describe('ENDPOINT: POST /api/auth/signin', function() {
  const endpoint = '/api/auth/signin';
  const testValidation = createTestPayloadValidation(endpoint);

  it(`POST ${endpoint} - Either username or email required`, function(done) {
    const payload = {
      password: 'qweasdzxc'
    };

    testValidation(
      payload,
      400,
      'Either username or email must be provided.',
      done
    );
  });

  it(`POST ${endpoint} - Password required`, function(done) {
    const payload = {
      email: 'admin@tdev.app'
    };

    testValidation(payload, 400, 'Password is required.', done);
  });

  it(`POST ${endpoint} - Email not existed`, function(done) {
    const payload = {
      email: 'not-exist@tdev.app',
      password: 'password'
    };

    testValidation(payload, 401, 'Username or email does not exist.', done);
  });

  it(`POST ${endpoint} - Username not existed`, function(done) {
    const payload = {
      username: 'not-exist',
      password: 'password'
    };

    testValidation(payload, 401, 'Username or email does not exist.', done);
  });

  const testSignInSuccess = (payload, done) => {
    let existingAdmin = app.locals.existing.admin;
    request(app)
      .post(endpoint)
      .send(payload)
      .expect(200)
      .then(res => {
        expect(res.body.token).to.be.a('string');
        expect(res.body.expiresAt).to.be.a('number');
        const decodedToken = jwt.verify(res.body.token, config.jwt.secret);
        expect(decodedToken.sub).to.be.equal(existingAdmin.subId);
        expect(decodedToken.userId).to.be.equal(existingAdmin._id.toString());
        expect(decodedToken.exp).to.be.equal(res.body.expiresAt);
        expect(decodedToken.iat).to.be.equal(
          decodedToken.exp - config.jwt.expiresIn
        );
        expect(res.body.user._id).to.be.equal(existingAdmin._id.toString());
        expect(res.body.user).to.have.property('createdAt');
        expect(res.body.user).to.have.property('updatedAt');
        expect(res.body.user.provider).to.deep.equal({
          local: {
            userId: existingAdmin._id.toString()
          },
          google: {
            // not have property "accessToken" and "refreshToken"
            userId: existingAdmin.provider.google.userId,
            picture: existingAdmin.provider.google.picture
          },
          facebook: {
            // not have property "accessToken" and "refreshToken"
            userId: existingAdmin.provider.facebook.userId,
            picture: existingAdmin.provider.facebook.picture
          }
        });
        expect(res.body.user).to.not.have.property('hashedPassword');
        expect(res.body.user).to.not.have.property('password');
        expect(res.body.user).to.not.have.property('subId');
        expect(res.body.user).to.not.have.property('token');
        expect(res.body.user).to.not.have.property('tokenPurpose');
        expect(res.body.user).to.deep.include(
          _.pick(existingAdmin.toObject(), [
            'username',
            'email',
            'status',
            'firstName',
            'lastName',
            'role',
            'permissions'
          ])
        );
        done();
      })
      .catch(done);
  };

  it(`POST ${endpoint} - Sign in by email succeeded`, function(done) {
    let existingAdmin = app.locals.existing.admin;
    const payload = {
      email: existingAdmin.email,
      password: 'password'
    };
    testSignInSuccess(payload, done);
  });

  it(`POST ${endpoint} - Sign in by username succeeded`, function(done) {
    let existingAdmin = app.locals.existing.admin;
    const payload = {
      username: existingAdmin.username,
      password: 'password'
    };
    testSignInSuccess(payload, done);
  });
});

describe('ENDPOINT: POST /api/auth/send-token', function() {
  const endpoint = '/api/auth/send-token';
  const testValidation = createTestPayloadValidation(endpoint);

  if (config.auth.verifyEmail || config.auth.resetPassword) {
    it(`POST ${endpoint} - Email required`, function(done) {
      const payload = {
        tokenPurpose: 'verifyEmail'
      };

      testValidation(payload, 400, 'Email is required.', done);
    });

    it(`POST ${endpoint} - Token purpose required`, function(done) {
      const payload = {
        email: 'admin@tdev.app'
      };

      testValidation(payload, 400, '"tokenPurpose" is required', done);
    });

    it(`POST ${endpoint} - Token purpose invalid`, function(done) {
      let existingUser = app.locals.existing.user;
      const payload = {
        email: existingUser.email,
        tokenPurpose: 'invalidTokenPurpose'
      };

      testValidation(
        payload,
        400,
        '"tokenPurpose" must be one of [verifyEmail, resetPassword]',
        done
      );
    });
  } else {
    // config.auth.verifyEmail === false
    if (!config.auth.verifyEmail) {
      it(`POST ${endpoint} - Email verification functionality is not available`, function(done) {
        let existingUser = app.locals.existing.user;
        const payload = {
          email: existingUser.email,
          tokenPurpose: 'verifyEmail'
        };
        request(app)
          .post(endpoint)
          .send(payload)
          .expect(422)
          .expect(
            { error: 'Email verification functionality is not available.' },
            done
          );
      });
    } else {
      // config.auth.resetPassword === false
      it(`POST ${endpoint} - Password reset functionality is not available`, function(done) {
        let existingUser = app.locals.existing.user;
        const payload = {
          email: existingUser.email,
          tokenPurpose: 'resetPassword'
        };
        request(app)
          .post(endpoint)
          .send(payload)
          .expect(422)
          .expect(
            { error: 'Password reset functionality is not available.' },
            done
          );
      });
    }
  }

  const testSendTokenSucceeded = (tokenPurpose, existingUser, done) => {
    const User = mongoose.model('User');
    const payload = {
      email: existingUser.email,
      tokenPurpose
    };
    request(app)
      .post(endpoint)
      .send(payload)
      .expect(200)
      .then(res => {
        if (tokenPurpose === 'verifyEmail') {
          expect(res.body).to.deep.equal({
            success: true,
            message: 'A verification email has been sent to your email.'
          });
        } else {
          expect(res.body).to.deep.equal({
            success: true,
            message: 'A password-reset email has been sent to your email.'
          });
        }
        return User.findOne({ email: existingUser.email });
      })
      .then(user => {
        expect(user.token).to.be.a('string');
        expect(user.token).to.not.be.empty;
        expect(user.tokenPurpose).to.equal(payload.tokenPurpose);
        // other properties should be unchanged
        expect(user.toObject()).to.be.deep.include(
          _.pick(existingUser.toObject(), [
            'username',
            'email',
            'status',
            'hashedPassword',
            'subId',
            'firstName',
            'lastName',
            'role',
            'permissions',
            'provider'
          ])
        );
        done();
      })
      .catch(done);
  };

  if (config.auth.verifyEmail) {
    it(`POST ${endpoint} - Email already verified`, function(done) {
      let existingUser = app.locals.existing.user;
      const payload = {
        email: existingUser.email,
        tokenPurpose: 'verifyEmail'
      };
      testValidation(payload, 422, 'Email already verified.', done);
    });

    it(`POST ${endpoint} - Send email verification token succeeded`, function(done) {
      let existingUser = app.locals.existing.user;
      existingUser.status = 'unverifiedEmail';
      existingUser.save().then(user => {
        testSendTokenSucceeded('verifyEmail', existingUser, done);
      });
    });
  }

  if (config.auth.resetPassword) {
    it(`POST ${endpoint} - Send password reset token succeeded`, function(done) {
      let existingUser = app.locals.existing.user;
      testSendTokenSucceeded('resetPassword', existingUser, done);
    });
  }
});

describe('ENDPOINT: POST /api/auth/reset-password/:token', function() {
  let endpoint = '';
  let testValidation;

  beforeEach(function(done) {
    let existingAdmin = app.locals.existing.admin;
    existingAdmin.token = uuidv4();
    existingAdmin.tokenPurpose = 'resetPassword';
    existingAdmin
      .save()
      .then(user => {
        endpoint = `/api/auth/reset-password/${user.token}`;
        testValidation = createTestPayloadValidation(endpoint);
        done();
      })
      .catch(done);
  });

  if (config.auth.resetPassword) {
    it(`POST ${endpoint} - Email required`, function(done) {
      const payload = {
        password: 'new-password'
      };

      testValidation(payload, 400, 'Email is required.', done);
    });

    it(`POST ${endpoint} - New password required`, function(done) {
      const payload = {
        email: 'admin@tdev.app'
      };

      testValidation(payload, 400, 'Password is required.', done);
    });

    it(`POST ${endpoint} - Email and token is not a pair`, function(done) {
      const payload = {
        email: 'another@tdev.app',
        password: 'new-password'
      };

      testValidation(payload, 422, 'Token expired.', done);
    });

    it(`POST ${endpoint} - Token not existed`, function(done) {
      const existingAdmin = app.locals.existing.admin;
      const payload = {
        email: existingAdmin.email,
        password: 'new-password'
      };

      request(app)
        .post('/api/auth/reset-password/not-exist-token')
        .send(payload)
        .expect(422)
        .expect(
          {
            error: 'Token expired.'
          },
          done
        );
    });

    it(`POST ${endpoint} - Token existed but not resetPassword token`, function(done) {
      let existingAdmin = app.locals.existing.admin;
      const payload = {
        email: existingAdmin.email,
        password: 'new-password'
      };
      existingAdmin.tokenPurpose = 'verifyEmail';
      existingAdmin
        .save()
        .then(user => {
          testValidation(payload, 422, 'Token expired.', done);
        })
        .catch(done);
    });

    it(`POST ${endpoint} - Password reset succeeded`, function(done) {
      let existingAdmin = app.locals.existing.admin;
      const User = mongoose.model('User');
      const payload = {
        email: existingAdmin.email,
        password: 'new-password'
      };

      request(app)
        .post(endpoint)
        .send(payload)
        .expect(200)
        .expect({
          message: 'Password reset.',
          success: true
        })
        .then(res => User.findOne({ email: payload.email }))
        .then(user => {
          expect(user.token).to.be.undefined;
          expect(user.tokenPurpose).to.be.undefined;
          expect(user.hashedPassword).to.be.a('string');
          expect(user.hashedPassword).to.not.equal(
            existingAdmin.hashedPassword
          );
          expect(user.subId).to.be.a('string');
          expect(mongoose.Types.ObjectId.isValid(user.subId)).to.be.true;
          expect(user.subId).to.not.equal(existingAdmin.subId);
          // other properties should be unchanged
          expect(user.toObject()).to.be.deep.include(
            _.pick(existingAdmin.toObject(), [
              'username',
              'email',
              'status',
              'firstName',
              'lastName',
              'role',
              'permissions',
              'provider'
            ])
          );
          done();
        })
        .catch(done);
    });
  } else {
    // config.auth.resetPassword === false
    it(`POST ${endpoint} - Password reset functionality is not available`, function(done) {
      let existingAdmin = app.locals.existing.admin;
      const payload = {
        email: existingAdmin.email,
        password: 'new-password'
      };
      request(app)
        .post(endpoint)
        .send(payload)
        .expect(422)
        .expect(
          { error: 'Password reset functionality is not available.' },
          done
        );
    });
  }
});

describe('ENDPOINT: POST /api/auth/verify-email/:token', function() {
  let endpoint = '';

  beforeEach(function(done) {
    let existingAdmin = app.locals.existing.admin;
    existingAdmin.token = uuidv4();
    existingAdmin.tokenPurpose = 'verifyEmail';
    existingAdmin
      .save()
      .then(user => {
        admin = user;
        endpoint = `/api/auth/verify-email/${user.token}`;
        done();
      })
      .catch(done);
  });

  if (config.auth.verifyEmail) {
    it(`POST ${endpoint} - Token not existed`, function(done) {
      request(app)
        .post('/api/auth/verify-email/not-existed-token')
        .expect(422)
        .expect(
          {
            error: 'Token expired.'
          },
          done
        );
    });

    it(`POST ${endpoint} - Token existed but not verifyEmail token`, function(done) {
      let existingAdmin = app.locals.existing.admin;
      existingAdmin.tokenPurpose = 'resetPassword';
      admin
        .save()
        .then(user => {
          request(app)
            .post(endpoint)
            .expect(422)
            .expect(
              {
                error: 'Token expired.'
              },
              done
            );
        })
        .catch(done);
    });

    it(`POST ${endpoint} - Email verified succeeded`, function(done) {
      let existingAdmin = app.locals.existing.admin;
      const User = mongoose.model('User');
      request(app)
        .post(endpoint)
        .expect(200)
        .expect({
          message: 'Email verified.',
          success: true
        })
        .then(res => User.findOne({ email: existingAdmin.email }))
        .then(user => {
          expect(user.status).to.be.equal('active');
          expect(user.token).to.be.undefined;
          expect(user.tokenPurpose).to.be.undefined;
          // other properties should be unchanged
          expect(user.toObject()).to.be.deep.include(
            _.pick(existingAdmin.toObject(), [
              'username',
              'email',
              'hashedPassword',
              'subId',
              'firstName',
              'lastName',
              'role',
              'permissions',
              'provider'
            ])
          );
          done();
        })
        .catch(done);
    });
  } else {
    // config.auth.verifyEmail === false
    it(`POST ${endpoint} - Email verification functionality is not available`, function(done) {
      request(app)
        .post(endpoint)
        .expect(422)
        .expect(
          { error: 'Email verification functionality is not available.' },
          done
        );
    });
  }
});

describe('ENDPOINT: POST /api/auth/refresh-token', function() {
  let endpoint = '/api/auth/refresh-token';

  const testJwtTokenValidation = (jwtToken, done) => {
    request(app)
      .post(endpoint)
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(401)
      .expect({})
      .then(res => {
        expect(res.text).to.be.equal('Unauthorized');
        done();
      })
      .catch(done);
  };

  it(`POST ${endpoint} - JWT token not provided`, function(done) {
    request(app)
      .post(endpoint)
      .expect(401)
      .expect({})
      .then(res => {
        expect(res.text).to.be.equal('Unauthorized');
        done();
      })
      .catch(done);
  });

  it(`POST ${endpoint} - JWT token - invalid subId`, function(done) {
    const existingAdmin = app.locals.existing.admin;
    let decodedToken = decodeJwtToken(existingAdmin.jwtToken);
    decodedToken.sub = 'invalid-sub-id';
    const invalidJwtToken = createJwtToken(decodedToken);
    testJwtTokenValidation(invalidJwtToken, done);
  });

  it(`POST ${endpoint} - JWT token - not exist userId`, function(done) {
    const existingAdmin = app.locals.existing.admin;
    let decodedToken = decodeJwtToken(existingAdmin.jwtToken);
    decodedToken.userId = '5e24db1d560ba309f0b0b5a8';
    const invalidJwtToken = createJwtToken(decodedToken);
    testJwtTokenValidation(invalidJwtToken, done);
  });

  it(`POST ${endpoint} - JWT token - expired token`, function(done) {
    const existingAdmin = app.locals.existing.admin;
    let decodedToken = decodeJwtToken(existingAdmin.jwtToken);
    decodedToken.iat = decodedToken.iat - 100;
    decodedToken.exp = decodedToken.iat - 50;
    const invalidJwtToken = createJwtToken(decodedToken);
    testJwtTokenValidation(invalidJwtToken, done);
  });

  it(`POST ${endpoint} - JWT Token - refresh succeeded`, function(done) {
    let existingAdmin = app.locals.existing.admin;
    request(app)
      .post(endpoint)
      .set('Authorization', `Bearer ${existingAdmin.jwtToken}`)
      .expect(200)
      .then(res => {
        expect(res.body.expiresAt).to.be.a('number');
        const newlyDecodedToken = decodeJwtToken(res.body.token);
        expect(newlyDecodedToken.sub).to.be.equal(existingAdmin.subId);
        expect(newlyDecodedToken.userId).to.be.equal(
          existingAdmin._id.toString()
        );
        expect(newlyDecodedToken.exp).to.be.equal(res.body.expiresAt);
        expect(newlyDecodedToken.iat).to.be.equal(
          newlyDecodedToken.exp - config.jwt.expiresIn
        );
        done();
      })
      .catch(done);
  });
});
