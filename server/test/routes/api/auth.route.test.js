const mongoose = require('mongoose');
const request = require('supertest');
const expect = require('chai').expect;
const _ = require('lodash');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const config = require('../../../config');

const createTestPayloadValidation = (endpoint) => {
  return (payload, statusCode, errorMessage, done) => {
    request(app)
      .post(endpoint)
      .send(payload)
      .expect(statusCode)
      .expect({ error: { message: errorMessage } }, done);
  };
};

const createJwtToken = (payload) => {
  return jwt.sign(payload, config.jwt.secret, {
    algorithm: config.jwt.algorithm,
  });
};

const decodeJwtToken = (jwtToken) => {
  return jwt.verify(jwtToken, config.jwt.secret);
};

describe('ENDPOINT: POST /api/auth/signup', function () {
  const endpoint = '/api/auth/signup';
  const testValidation = createTestPayloadValidation(endpoint);

  it(`POST ${endpoint} - Email required`, function (done) {
    const payload = {
      username: 'john',
      password: 'qweasdzxc',
    };

    testValidation(payload, 400, 'Email is required', done);
  });

  it(`POST ${endpoint} - Username required`, function (done) {
    const payload = {
      email: 'john@tdev.app',
      password: 'qweasdzxc',
    };

    testValidation(payload, 400, 'Username is required', done);
  });

  it(`POST ${endpoint} - Password required`, function (done) {
    const payload = {
      username: 'john',
      email: 'john@tdev.app',
    };

    testValidation(payload, 400, 'Password is required', done);
  });

  it(`POST ${endpoint} - Status is not allowed`, function (done) {
    const payload = {
      username: 'john',
      email: 'john@tdev.app',
      password: 'qweasdzxc',
      status: 'active',
    };

    testValidation(payload, 400, '"status" is not allowed', done);
  });

  it(`POST ${endpoint} - Permissions is not allowed`, function (done) {
    const payload = {
      username: 'john',
      email: 'john@tdev.app',
      password: 'qweasdzxc',
      permissions: {
        userInsert: true,
        userModify: true,
      },
    };

    testValidation(payload, 400, '"permissions" is not allowed', done);
  });

  it(`POST ${endpoint} - Email existed`, function (done) {
    const payload = {
      username: 'john',
      email: 'admin@tdev.app',
      password: 'qweasdzxc',
    };

    testValidation(payload, 422, 'Email is already in use', done);
  });

  it(`POST ${endpoint} - Username existed`, function (done) {
    const payload = {
      username: 'admin',
      email: 'john@tdev.app',
      password: 'qweasdzxc',
    };

    testValidation(payload, 422, 'Username is already in use', done);
  });

  it(`POST ${endpoint} - Fresh sign up succeeded`, function (done) {
    const User = mongoose.model('User');
    const payload = {
      username: 'john',
      email: 'tester.hmt3@gmail.com',
      password: 'qweasdzxc',
    };

    request(app)
      .post(endpoint)
      .send(payload)
      .expect(201)
      .then((res) => {
        if (config.auth.verifyEmail) {
          expect(res.body).to.deep.equal({
            message: 'A verification email has been sent to your email',
          });
        } else {
          expect(res.body).to.deep.equal({
            message: 'Your account has been created successfully',
          });
        }
        return User.findOne({ email: payload.email });
      })
      .then((user) => {
        user = user.toObject();
        expect(user).to.have.property('permissions');
        _.forOwn(user.permissions, (value, key) => {
          expect(value).to.be.false;
        });
        if (config.auth.verifyEmail) {
          expect(user.status).to.be.equal('unverified-email');
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

  it(`POST ${endpoint} - Oauth account with the same email existed - Sign up succeeded`, function (done) {
    const User = mongoose.model('User');
    existingUser = app.locals.existing.user;
    existingUser.provider.local = undefined;
    existingUser
      .save()
      .then((u) => {
        existingUser = u;
        const payload = {
          username: 'this-username-willbe-ignored',
          email: 'tester.hmt4@gmail.com',
          password: 'qweasdzxc',
        };

        request(app)
          .post(endpoint)
          .send(payload)
          .expect(201)
          .then((res) => {
            if (config.auth.verifyEmail) {
              expect(res.body).to.deep.equal({
                message: 'A verification email has been sent to your email',
              });
            } else {
              expect(res.body).to.deep.equal({
                message: 'Your account has been created successfully',
              });
            }

            return User.findOne({ email: payload.email });
          })
          .then((user) => {
            user = user.toObject();
            expect(user).to.have.property('permissions');
            _.forOwn(user.permissions, (value, key) => {
              expect(value).to.be.false;
            });
            if (config.auth.verifyEmail) {
              expect(user.status).to.be.equal('unverified-email');
            } else {
              expect(user.status).to.be.equal('active');
            }
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
              userId: user._id.toString(),
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

describe('ENDPOINT: POST /api/auth/signin', function () {
  const endpoint = '/api/auth/signin';
  const testValidation = createTestPayloadValidation(endpoint);

  it(`POST ${endpoint} - Either username or email required`, function (done) {
    const payload = {
      password: 'qweasdzxc',
    };

    testValidation(
      payload,
      400,
      'Either username or email must be provided',
      done
    );
  });

  it(`POST ${endpoint} - Password required`, function (done) {
    const payload = {
      email: 'admin@tdev.app',
    };

    testValidation(payload, 400, 'Password is required', done);
  });

  it(`POST ${endpoint} - Email not existed`, function (done) {
    const payload = {
      email: 'not-exist@tdev.app',
      password: 'password',
    };

    testValidation(payload, 401, 'Username or email does not exist', done);
  });

  it(`POST ${endpoint} - Username not existed`, function (done) {
    const payload = {
      username: 'not-exist',
      password: 'password',
    };

    testValidation(payload, 401, 'Username or email does not exist', done);
  });

  const testSignInSuccess = (payload, done) => {
    let existingAdmin = app.locals.existing.admin;
    request(app)
      .post(endpoint)
      .send(payload)
      .expect(200)
      .then((res) => {
        expect(res.body.token).to.be.a('string');
        expect(res.body.expiresAt).to.be.a('number');
        const decodedToken = jwt.verify(res.body.token, config.jwt.secret);
        expect(decodedToken.sub).to.be.equal(existingAdmin.subId);
        expect(decodedToken.userId).to.be.equal(existingAdmin._id.toString());
        expect(decodedToken.exp).to.be.equal(res.body.expiresAt);
        expect(decodedToken.iat).to.be.equal(
          decodedToken.exp - config.jwt.expiresIn
        );
        expect(decodedToken.provider).to.be.equal('local');
        expect(res.body.user.id).to.be.equal(existingAdmin._id.toString());
        expect(res.body.user).to.have.property('createdAt');
        expect(res.body.user).to.have.property('updatedAt');
        expect(res.body.user.provider).to.deep.equal({
          local: {
            userId: existingAdmin._id.toString(),
          },
          google: {
            // not have property "accessToken" and "refreshToken"
            userId: existingAdmin.provider.google.userId,
            picture: existingAdmin.provider.google.picture,
          },
          facebook: {
            // not have property "accessToken" and "refreshToken"
            userId: existingAdmin.provider.facebook.userId,
            picture: existingAdmin.provider.facebook.picture,
          },
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
            'permissions',
          ])
        );
        done();
      })
      .catch(done);
  };

  it(`POST ${endpoint} - Sign in by email succeeded`, function (done) {
    let existingAdmin = app.locals.existing.admin;
    const payload = {
      email: existingAdmin.email,
      password: 'password',
    };
    testSignInSuccess(payload, done);
  });

  it(`POST ${endpoint} - Sign in by username succeeded`, function (done) {
    let existingAdmin = app.locals.existing.admin;
    const payload = {
      username: existingAdmin.username,
      password: 'password',
    };
    testSignInSuccess(payload, done);
  });
});

describe('ENDPOINT: POST /api/auth/send-token', function () {
  const endpoint = '/api/auth/send-token';
  const testValidation = createTestPayloadValidation(endpoint);

  if (config.auth.verifyEmail || config.auth.resetPassword) {
    it(`POST ${endpoint} - Email required`, function (done) {
      const payload = {
        tokenPurpose: 'verify-email',
      };

      testValidation(payload, 400, 'Email is required', done);
    });

    it(`POST ${endpoint} - Token purpose required`, function (done) {
      const payload = {
        email: 'admin@tdev.app',
      };

      testValidation(payload, 400, '"tokenPurpose" is required', done);
    });

    it(`POST ${endpoint} - Token purpose invalid`, function (done) {
      let existingUser = app.locals.existing.user;
      const payload = {
        email: existingUser.email,
        tokenPurpose: 'invalidTokenPurpose',
      };

      testValidation(
        payload,
        400,
        '"tokenPurpose" must be one of [verify-email, reset-password]',
        done
      );
    });
  } else {
    // config.auth.verifyEmail === false
    if (!config.auth.verifyEmail) {
      it(`POST ${endpoint} - Email verification functionality is not available`, function (done) {
        let existingUser = app.locals.existing.user;
        const payload = {
          email: existingUser.email,
          tokenPurpose: 'verify-email',
        };
        request(app)
          .post(endpoint)
          .send(payload)
          .expect(422)
          .expect(
            {
              error: {
                message: 'Email verification functionality is not available',
              },
            },
            done
          );
      });
    } else {
      // config.auth.resetPassword === false
      it(`POST ${endpoint} - Password reset functionality is not available`, function (done) {
        let existingUser = app.locals.existing.user;
        const payload = {
          email: existingUser.email,
          tokenPurpose: 'reset-password',
        };
        request(app)
          .post(endpoint)
          .send(payload)
          .expect(422)
          .expect(
            {
              error: {
                message: 'Password reset functionality is not available',
              },
            },
            done
          );
      });
    }
  }

  const testSendTokenSucceeded = (tokenPurpose, existingUser, done) => {
    const User = mongoose.model('User');
    const payload = {
      email: existingUser.email,
      tokenPurpose,
    };
    request(app)
      .post(endpoint)
      .send(payload)
      .expect(200)
      .then((res) => {
        if (tokenPurpose === 'verify-email') {
          expect(res.body).to.deep.equal({
            message: 'A verification email has been sent to your email',
          });
        } else {
          expect(res.body).to.deep.equal({
            message: 'A password-reset email has been sent to your email',
          });
        }
        return User.findOne({ email: existingUser.email });
      })
      .then((user) => {
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
            'provider',
          ])
        );
        done();
      })
      .catch(done);
  };

  if (config.auth.verifyEmail) {
    it(`POST ${endpoint} - Email already verified`, function (done) {
      let existingUser = app.locals.existing.user;
      const payload = {
        email: existingUser.email,
        tokenPurpose: 'verify-email',
      };
      testValidation(payload, 422, 'Email already verified', done);
    });

    it(`POST ${endpoint} - Send email verification token succeeded`, function (done) {
      let existingUser = app.locals.existing.user;
      existingUser.status = 'unverified-email';
      existingUser.save().then((user) => {
        testSendTokenSucceeded('verify-email', existingUser, done);
      });
    });
  }

  if (config.auth.resetPassword) {
    it(`POST ${endpoint} - Send password reset token succeeded`, function (done) {
      let existingUser = app.locals.existing.user;
      testSendTokenSucceeded('reset-password', existingUser, done);
    });
  }
});

describe('ENDPOINT: POST /api/auth/reset-password/:token', function () {
  let endpoint = '';
  let testValidation;

  beforeEach(function (done) {
    let existingAdmin = app.locals.existing.admin;
    existingAdmin.token = uuidv4();
    existingAdmin.tokenPurpose = 'reset-password';
    existingAdmin
      .save()
      .then((user) => {
        endpoint = `/api/auth/reset-password/${user.token}`;
        testValidation = createTestPayloadValidation(endpoint);
        done();
      })
      .catch(done);
  });

  if (config.auth.resetPassword) {
    it(`POST ${endpoint} - Email required`, function (done) {
      const payload = {
        password: 'new-password',
      };

      testValidation(payload, 400, 'Email is required', done);
    });

    it(`POST ${endpoint} - New password required`, function (done) {
      const payload = {
        email: 'admin@tdev.app',
      };

      testValidation(payload, 400, 'Password is required', done);
    });

    it(`POST ${endpoint} - Email and token is not a pair`, function (done) {
      const payload = {
        email: 'another@tdev.app',
        password: 'new-password',
      };

      testValidation(payload, 422, 'Token expired', done);
    });

    it(`POST ${endpoint} - Token not existed`, function (done) {
      const existingAdmin = app.locals.existing.admin;
      const payload = {
        email: existingAdmin.email,
        password: 'new-password',
      };

      request(app)
        .post('/api/auth/reset-password/not-exist-token')
        .send(payload)
        .expect(422)
        .expect({ error: { message: 'Token expired' } }, done);
    });

    it(`POST ${endpoint} - Token existed but not resetPassword token`, function (done) {
      let existingAdmin = app.locals.existing.admin;
      const payload = {
        email: existingAdmin.email,
        password: 'new-password',
      };
      existingAdmin.tokenPurpose = 'verify-email';
      existingAdmin
        .save()
        .then((user) => {
          testValidation(payload, 422, 'Token expired', done);
        })
        .catch(done);
    });

    it(`POST ${endpoint} - Password reset succeeded`, function (done) {
      let existingAdmin = app.locals.existing.admin;
      const User = mongoose.model('User');
      const payload = {
        email: existingAdmin.email,
        password: 'new-password',
      };

      request(app)
        .post(endpoint)
        .send(payload)
        .expect(200)
        .expect({ message: 'Password reset' })
        .then((res) => User.findOne({ email: payload.email }))
        .then((user) => {
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
              'provider',
            ])
          );
          done();
        })
        .catch(done);
    });
  } else {
    // config.auth.resetPassword === false
    it(`POST ${endpoint} - Password reset functionality is not available`, function (done) {
      let existingAdmin = app.locals.existing.admin;
      const payload = {
        email: existingAdmin.email,
        password: 'new-password',
      };
      request(app)
        .post(endpoint)
        .send(payload)
        .expect(422)
        .expect(
          {
            error: {
              message: 'Password reset functionality is not available',
            },
          },
          done
        );
    });
  }
});

describe('ENDPOINT: POST /api/auth/verify-email/:token', function () {
  let endpoint = '';

  beforeEach(function (done) {
    let existingAdmin = app.locals.existing.admin;
    existingAdmin.token = uuidv4();
    existingAdmin.tokenPurpose = 'verify-email';
    existingAdmin
      .save()
      .then((user) => {
        admin = user;
        endpoint = `/api/auth/verify-email/${user.token}`;
        done();
      })
      .catch(done);
  });

  if (config.auth.verifyEmail) {
    it(`POST ${endpoint} - Password required`, function (done) {
      const testValidation = createTestPayloadValidation(endpoint);
      testValidation({}, 400, 'Password is required', done);
    });

    it(`POST ${endpoint} - Token not existed`, function (done) {
      request(app)
        .post('/api/auth/verify-email/not-existed-token')
        .send({ password: 'password' })
        .expect(422)
        .expect({ error: { message: 'Token expired' } }, done);
    });

    it(`POST ${endpoint} - Token existed but not verify-email token`, function (done) {
      let existingAdmin = app.locals.existing.admin;
      existingAdmin.tokenPurpose = 'reset-password';
      admin
        .save()
        .then((user) => {
          request(app)
            .post(endpoint)
            .send({ password: 'password' })
            .expect(422)
            .expect({ error: { message: 'Token expired' } }, done);
        })
        .catch(done);
    });

    it(`POST ${endpoint} - Token existed but incorrect password`, function (done) {
      request(app)
        .post(endpoint)
        .send({ password: 'incorrect-password' })
        .expect(422)
        .expect({ error: { message: 'Password is incorrect' } }, done);
    });

    it(`POST ${endpoint} - Email verified succeeded`, function (done) {
      let existingAdmin = app.locals.existing.admin;
      const User = mongoose.model('User');
      request(app)
        .post(endpoint)
        .send({ password: 'password' })
        .expect(200)
        .expect({ message: 'Email verified' })
        .then((res) => User.findOne({ email: existingAdmin.email }))
        .then((user) => {
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
              'provider',
            ])
          );
          done();
        })
        .catch(done);
    });
  } else {
    // config.auth.verifyEmail === false
    it(`POST ${endpoint} - Email verification functionality is not available`, function (done) {
      request(app)
        .post(endpoint)
        .send({ password: 'password' })
        .expect(422)
        .expect(
          {
            error: {
              message: 'Email verification functionality is not available',
            },
          },
          done
        );
    });
  }
});

describe('ENDPOINT: POST /api/auth/invalidate-all-jwt-tokens', function () {
  let endpoint = '/api/auth/invalidate-all-jwt-tokens';

  it(`POST ${endpoint} - JWT token not provided`, function (done) {
    request(app)
      .post(endpoint)
      .expect(401)
      .expect({ error: { message: 'No auth token' } }, done);
  });

  it(`POST ${endpoint} - JWT token - invalid subId`, function (done) {
    const existingAdmin = app.locals.existing.admin;
    let decodedToken = decodeJwtToken(existingAdmin.jwtToken);
    decodedToken.sub = 'invalid-sub-id';
    request(app)
      .post(endpoint)
      .set('Authorization', `Bearer ${createJwtToken(decodedToken)}`)
      .expect(401)
      .expect({ error: { message: 'Invalid JWT token' } }, done);
  });

  it(`POST ${endpoint} - JWT token - not exist userId`, function (done) {
    const existingAdmin = app.locals.existing.admin;
    let decodedToken = decodeJwtToken(existingAdmin.jwtToken);
    decodedToken.userId = '5e24db1d560ba309f0b0b5a8';
    request(app)
      .post(endpoint)
      .set('Authorization', `Bearer ${createJwtToken(decodedToken)}`)
      .expect(401)
      .expect({ error: { message: 'Invalid credentials' } }, done);
  });

  it(`POST ${endpoint} - JWT token - expired token`, function (done) {
    const existingAdmin = app.locals.existing.admin;
    let decodedToken = decodeJwtToken(existingAdmin.jwtToken);
    decodedToken.iat = decodedToken.iat - 100;
    decodedToken.exp = decodedToken.iat - 50;
    request(app)
      .post(endpoint)
      .set('Authorization', `Bearer ${createJwtToken(decodedToken)}`)
      .expect(401)
      .expect({ error: { message: 'jwt expired' } }, done);
  });

  it(`POST ${endpoint} - JWT token - disabled account - local provider`, function (done) {
    let existingAdmin = app.locals.existing.admin;
    let decodedToken = decodeJwtToken(existingAdmin.jwtToken);
    decodedToken.provider = 'local';
    existingAdmin.status = 'disabled';
    existingAdmin.save().then((u) => {
      existingAdmin = u;
      request(app)
        .post(endpoint)
        .set('Authorization', `Bearer ${createJwtToken(decodedToken)}`)
        .expect(401)
        .expect({ error: { message: 'Account is disabled' } }, done);
    });
  });

  it(`POST ${endpoint} - JWT token - disabled account - google provider`, function (done) {
    let existingAdmin = app.locals.existing.admin;
    let decodedToken = decodeJwtToken(existingAdmin.jwtToken);
    decodedToken.provider = 'google';
    existingAdmin.status = 'disabled';
    existingAdmin.save().then((u) => {
      existingAdmin = u;
      request(app)
        .post(endpoint)
        .set('Authorization', `Bearer ${createJwtToken(decodedToken)}`)
        .expect(401)
        .expect({ error: { message: 'Account is disabled' } }, done);
    });
  });

  it(`POST ${endpoint} - JWT token - disabled account - facebook provider`, function (done) {
    let existingAdmin = app.locals.existing.admin;
    let decodedToken = decodeJwtToken(existingAdmin.jwtToken);
    decodedToken.provider = 'facebook';
    existingAdmin.status = 'disabled';
    existingAdmin.save().then((u) => {
      existingAdmin = u;
      request(app)
        .post(endpoint)
        .set('Authorization', `Bearer ${createJwtToken(decodedToken)}`)
        .expect(401)
        .expect({ error: { message: 'Account is disabled' } }, done);
    });
  });

  it(`POST ${endpoint} - JWT token - unverified-email - local provider`, function (done) {
    let existingAdmin = app.locals.existing.admin;
    let decodedToken = decodeJwtToken(existingAdmin.jwtToken);
    decodedToken.provider = 'local';
    existingAdmin.status = 'unverified-email';
    existingAdmin.save().then((u) => {
      existingAdmin = u;
      request(app)
        .post(endpoint)
        .set('Authorization', `Bearer ${createJwtToken(decodedToken)}`)
        .expect(401)
        .then((res) => {
          if (config.auth.verifyEmail) {
            expect(res.body).to.deep.equal({
              error: { message: 'Email is not verified' },
            });
          } else {
            expect(res.body).to.deep.equal({
              error: { message: 'Account status is invalid' },
            });
          }
          done();
        })
        .catch(done);
    });
  });

  it(`POST ${endpoint} - JWT Token - Invalidating all JWT tokens succeeded`, function (done) {
    const existingAdmin = app.locals.existing.admin;
    let decodedToken = decodeJwtToken(existingAdmin.jwtToken);
    const User = mongoose.model('User');
    request(app)
      .post(endpoint)
      .set('Authorization', `Bearer ${existingAdmin.jwtToken}`)
      .expect(200)
      .then((res) => {
        expect(res.body.message).to.be.equal(
          'All JWT tokens have been invalidated'
        );
        return User.findById(existingAdmin._id);
      })
      .then((updatedUser) => {
        expect(updatedUser.toObject()).to.deep.include(
          _.pick(existingAdmin.toObject(), [
            '_id',
            'username',
            'firtName',
            'lastName',
            'email',
            'status',
            'role',
            'permissions',
            'createdAt',
            'token',
            'tokenPurpose',
            'provider',
            'hashedPassword',
          ])
        );
        expect(updatedUser.subId).to.be.a('string');
        expect(mongoose.Types.ObjectId.isValid(updatedUser.subId)).to.be.true;
        expect(updatedUser.subId).to.not.equal(existingAdmin.subId);
        expect(updatedUser.subId).to.not.equal(decodedToken.sub);
        done();
      })
      .catch(done);
  });
});

describe('ENDPOINT: POST /api/auth/verify-jwt-token', function () {
  let endpoint = '/api/auth/verify-jwt-token';

  it(`POST ${endpoint} - JWT token not provided`, function (done) {
    request(app)
      .post(endpoint)
      .expect(401)
      .expect({ error: { message: 'No auth token' } }, done);
  });

  it(`POST ${endpoint} - JWT token - invalid subId`, function (done) {
    const existingAdmin = app.locals.existing.admin;
    let decodedToken = decodeJwtToken(existingAdmin.jwtToken);
    decodedToken.sub = 'invalid-sub-id';
    request(app)
      .post(endpoint)
      .set('Authorization', `Bearer ${createJwtToken(decodedToken)}`)
      .expect(401)
      .expect({ error: { message: 'Invalid JWT token' } }, done);
  });

  it(`POST ${endpoint} - JWT token - not exist userId`, function (done) {
    const existingAdmin = app.locals.existing.admin;
    let decodedToken = decodeJwtToken(existingAdmin.jwtToken);
    decodedToken.userId = '5e24db1d560ba309f0b0b5a8';
    request(app)
      .post(endpoint)
      .set('Authorization', `Bearer ${createJwtToken(decodedToken)}`)
      .expect(401)
      .expect({ error: { message: 'Invalid credentials' } }, done);
  });

  it(`POST ${endpoint} - JWT token - expired token`, function (done) {
    const existingAdmin = app.locals.existing.admin;
    let decodedToken = decodeJwtToken(existingAdmin.jwtToken);
    decodedToken.iat = decodedToken.iat - 100;
    decodedToken.exp = decodedToken.iat - 50;
    request(app)
      .post(endpoint)
      .set('Authorization', `Bearer ${createJwtToken(decodedToken)}`)
      .expect(401)
      .expect({ error: { message: 'jwt expired' } }, done);
  });

  it(`POST ${endpoint} - JWT token - disabled account - local provider`, function (done) {
    let existingAdmin = app.locals.existing.admin;
    let decodedToken = decodeJwtToken(existingAdmin.jwtToken);
    decodedToken.provider = 'local';
    existingAdmin.status = 'disabled';
    existingAdmin.save().then((u) => {
      existingAdmin = u;
      request(app)
        .post(endpoint)
        .set('Authorization', `Bearer ${createJwtToken(decodedToken)}`)
        .expect(401)
        .expect({ error: { message: 'Account is disabled' } }, done);
    });
  });

  it(`POST ${endpoint} - JWT token - disabled account - google provider`, function (done) {
    let existingAdmin = app.locals.existing.admin;
    let decodedToken = decodeJwtToken(existingAdmin.jwtToken);
    decodedToken.provider = 'google';
    existingAdmin.status = 'disabled';
    existingAdmin.save().then((u) => {
      existingAdmin = u;
      request(app)
        .post(endpoint)
        .set('Authorization', `Bearer ${createJwtToken(decodedToken)}`)
        .expect(401)
        .expect({ error: { message: 'Account is disabled' } }, done);
    });
  });

  it(`POST ${endpoint} - JWT token - disabled account - facebook provider`, function (done) {
    let existingAdmin = app.locals.existing.admin;
    let decodedToken = decodeJwtToken(existingAdmin.jwtToken);
    decodedToken.provider = 'facebook';
    existingAdmin.status = 'disabled';
    existingAdmin.save().then((u) => {
      existingAdmin = u;
      request(app)
        .post(endpoint)
        .set('Authorization', `Bearer ${createJwtToken(decodedToken)}`)
        .expect(401)
        .expect({ error: { message: 'Account is disabled' } }, done);
    });
  });

  it(`POST ${endpoint} - JWT token - unverified-email - local provider`, function (done) {
    let existingAdmin = app.locals.existing.admin;
    let decodedToken = decodeJwtToken(existingAdmin.jwtToken);
    decodedToken.provider = 'local';
    existingAdmin.status = 'unverified-email';
    existingAdmin.save().then((u) => {
      existingAdmin = u;
      request(app)
        .post(endpoint)
        .set('Authorization', `Bearer ${createJwtToken(decodedToken)}`)
        .expect(401)
        .then((res) => {
          if (config.auth.verifyEmail) {
            expect(res.body).to.deep.equal({
              error: { message: 'Email is not verified' },
            });
          } else {
            expect(res.body).to.deep.equal({
              error: { message: 'Account status is invalid' },
            });
          }
          done();
        })
        .catch(done);
    });
  });

  const testVerifyTokenSuccess = (
    existingUser,
    provider,
    refreshToken,
    refreshUser,
    done
  ) => {
    let decodedToken = decodeJwtToken(existingUser.jwtToken);
    if (provider) {
      decodedToken.provider = provider;
    }

    request(app)
      .post(endpoint)
      .set('Authorization', `Bearer ${createJwtToken(decodedToken)}`)
      .send({ refreshToken, refreshUser })
      .expect(200)
      .then((res) => {
        expect(res.body.message).to.be.equal('JWT token is valid');
        if (refreshToken) {
          expect(res.body.expiresAt).to.be.a('number');
          const newlyDecodedToken = decodeJwtToken(res.body.token);
          expect(newlyDecodedToken.sub).to.be.equal(existingUser.subId);
          expect(newlyDecodedToken.userId).to.be.equal(
            existingUser._id.toString()
          );
          expect(newlyDecodedToken.exp).to.be.equal(res.body.expiresAt);
          expect(newlyDecodedToken.iat).to.be.equal(
            newlyDecodedToken.exp - config.jwt.expiresIn
          );
          expect(newlyDecodedToken.provider).to.be.equal(decodedToken.provider);
        } else {
          // refreshToken === false
          expect(res.body).to.not.have.property('token');
          expect(res.body).to.not.have.property('expiresAt');
        }

        if (refreshUser) {
          expect(res.body.user.id).to.be.equal(existingUser._id.toString());
          expect(res.body.user).to.have.property('createdAt');
          expect(res.body.user).to.have.property('updatedAt');
          expect(res.body.user.provider).to.deep.equal({
            local: {
              userId: existingUser._id.toString(),
            },
            google: {
              // not have property "accessToken" and "refreshToken"
              userId: existingUser.provider.google.userId,
              picture: existingUser.provider.google.picture,
            },
            facebook: {
              // not have property "accessToken" and "refreshToken"
              userId: existingUser.provider.facebook.userId,
              picture: existingUser.provider.facebook.picture,
            },
          });
          expect(res.body.user).to.not.have.property('hashedPassword');
          expect(res.body.user).to.not.have.property('password');
          expect(res.body.user).to.not.have.property('subId');
          expect(res.body.user).to.not.have.property('token');
          expect(res.body.user).to.not.have.property('tokenPurpose');
          expect(res.body.user).to.deep.include(
            _.pick(existingUser.toObject(), [
              'username',
              'email',
              'status',
              'firstName',
              'lastName',
              'role',
              'permissions',
            ])
          );
        } else {
          // refreshUser === false
          expect(res.body).to.not.have.property('user');
        }
        done();
      })
      .catch(done);
  };

  it(`POST ${endpoint} - JWT Token - verification (no refresh token and user) succeeded`, function (done) {
    let existingAdmin = app.locals.existing.admin;
    testVerifyTokenSuccess(existingAdmin, 'local', false, false, done);
  });

  it(`POST ${endpoint} - JWT Token - verification and refresh token succeeded`, function (done) {
    let existingAdmin = app.locals.existing.admin;
    testVerifyTokenSuccess(existingAdmin, 'local', true, false, done);
  });

  it(`POST ${endpoint} - JWT Token - verification and refresh user succeeded`, function (done) {
    let existingAdmin = app.locals.existing.admin;
    testVerifyTokenSuccess(existingAdmin, 'local', false, true, done);
  });

  it(`POST ${endpoint} - JWT Token - verification, refresh token and refresh user succeeded`, function (done) {
    let existingAdmin = app.locals.existing.admin;
    testVerifyTokenSuccess(existingAdmin, 'local', true, true, done);
  });

  it(`POST ${endpoint} - JWT Token (facebook provider) - verification (no refresh token and user) succeeded`, function (done) {
    let existingAdmin = app.locals.existing.admin;
    testVerifyTokenSuccess(existingAdmin, 'facebook', false, false, done);
  });

  it(`POST ${endpoint} - JWT Token (facebook provider) - verification and refresh token succeeded`, function (done) {
    let existingAdmin = app.locals.existing.admin;
    testVerifyTokenSuccess(existingAdmin, 'facebook', true, false, done);
  });

  it(`POST ${endpoint} - JWT Token (facebook provider) - verification and refresh user succeeded`, function (done) {
    let existingAdmin = app.locals.existing.admin;
    testVerifyTokenSuccess(existingAdmin, 'facebook', false, true, done);
  });

  it(`POST ${endpoint} - JWT Token (facebook provider) - verification, refresh token and refresh user succeeded`, function (done) {
    let existingAdmin = app.locals.existing.admin;
    testVerifyTokenSuccess(existingAdmin, 'facebook', true, true, done);
  });

  it(`POST ${endpoint} - JWT Token (facebook provider - unverified-email) - verification, refresh token and refresh user succeeded`, function (done) {
    let existingAdmin = app.locals.existing.admin;
    existingAdmin.status = 'unverified-email';
    existingAdmin.save().then((u) => {
      existingAdmin = u;
      testVerifyTokenSuccess(existingAdmin, 'facebook', true, true, done);
    });
  });

  it(`POST ${endpoint} - JWT Token (google provider) - verification (no refresh token and user) succeeded`, function (done) {
    let existingAdmin = app.locals.existing.admin;
    testVerifyTokenSuccess(existingAdmin, 'google', false, false, done);
  });

  it(`POST ${endpoint} - JWT Token (google provider) - verification and refresh token succeeded`, function (done) {
    let existingAdmin = app.locals.existing.admin;
    testVerifyTokenSuccess(existingAdmin, 'google', true, false, done);
  });

  it(`POST ${endpoint} - JWT Token (google provider) - verification and refresh user succeeded`, function (done) {
    let existingAdmin = app.locals.existing.admin;
    testVerifyTokenSuccess(existingAdmin, 'google', false, true, done);
  });

  it(`POST ${endpoint} - JWT Token (google provider) - verification, refresh token and refresh user succeeded`, function (done) {
    let existingAdmin = app.locals.existing.admin;
    testVerifyTokenSuccess(existingAdmin, 'google', true, true, done);
  });

  it(`POST ${endpoint} - JWT Token (google provider - unverified-email) - verification, refresh token and refresh user succeeded`, function (done) {
    let existingAdmin = app.locals.existing.admin;
    existingAdmin.status = 'unverified-email';
    existingAdmin.save().then((u) => {
      existingAdmin = u;
      testVerifyTokenSuccess(existingAdmin, 'google', true, true, done);
    });
  });
});
