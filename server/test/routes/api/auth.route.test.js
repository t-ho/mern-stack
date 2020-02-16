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
      email: 'john@mern-stack.org',
      password: 'qweasdzxc'
    };

    testValidation(payload, 400, 'Username is required.', done);
  });

  it(`POST ${endpoint} - Password required`, function(done) {
    const payload = {
      username: 'john',
      email: 'john@mern-stack.org'
    };

    testValidation(payload, 400, 'Password is required.', done);
  });

  it(`POST ${endpoint} - Email existed`, function(done) {
    const payload = {
      username: 'john',
      email: 'admin@mern-stack.org',
      password: 'qweasdzxc'
    };

    testValidation(payload, 422, 'Email is already in use.', done);
  });

  it(`POST ${endpoint} - Username existed`, function(done) {
    const payload = {
      username: 'admin',
      email: 'john@mern-stack.org',
      password: 'qweasdzxc'
    };

    testValidation(payload, 422, 'Username is already in use.', done);
  });

  it(`POST ${endpoint} - Sign up succeeded`, function(done) {
    const User = mongoose.model('User');
    const newUser = {
      username: 'john',
      email: 'john@mern-stack.org',
      password: 'qweasdzxc'
    };

    request(app)
      .post(endpoint)
      .send(newUser)
      .expect(201)
      .expect({
        message: 'Your account has been created successfully',
        success: true
      })
      .then(res => User.findOne({ email: newUser.email }))
      .then(user => {
        user = user.toJSON();
        expect(user).to.have.property('permissions');
        _.forOwn(user.permissions, (value, key) => {
          expect(value).to.be.false;
        });
        expect(user.status).to.be.oneOf([
          'active',
          'disabled',
          'unverifiedEmail'
        ]);
        expect(user.role).to.equal('user');
        expect(user.username).to.be.a('string');
        expect(user.email).to.be.a('string');
        expect(user.subId).to.be.a('string');
        expect(user).to.not.have.property('password');
        expect(user.hashedPassword).to.be.a('string');
        expect(user.hashedPassword).to.not.equal(newUser.password);
        done();
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
      email: 'admin@mern-stack.org'
    };

    testValidation(payload, 400, 'Password is required.', done);
  });

  it(`POST ${endpoint} - Email not existed`, function(done) {
    const payload = {
      email: 'not-exist@mern-stack.org',
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

  const testSignInSuccess = (userInfo, done) => {
    let admin = app.locals.test.admin;
    request(app)
      .post(endpoint)
      .send(userInfo)
      .expect(200)
      .then(res => {
        expect(res.body.token).to.be.a('string');
        expect(res.body.expiresAt).to.be.a('number');
        const decodedToken = jwt.verify(res.body.token, config.jwt.secret);
        expect(decodedToken.sub).to.be.equal(admin.subId);
        expect(decodedToken.userId).to.be.equal(admin._id.toString());
        expect(decodedToken.exp).to.be.equal(res.body.expiresAt);
        expect(decodedToken.iat).to.be.equal(
          decodedToken.exp - config.jwt.expiresIn
        );
        expect(res.body.user._id).to.be.equal(admin._id.toString());
        expect(res.body.user).to.have.property('createdAt');
        expect(res.body.user).to.have.property('updatedAt');
        expect(res.body.user).to.not.have.property('hashedPassword');
        expect(res.body.user).to.not.have.property('password');
        expect(res.body.user).to.not.have.property('subId');
        expect(res.body.user).to.not.have.property('token');
        expect(res.body.user).to.not.have.property('tokenPurpose');
        expect(res.body.user).to.deep.include(
          _.pick(admin.toJSON(), [
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
    const userInfo = {
      email: 'admin@mern-stack.org',
      password: 'password'
    };
    testSignInSuccess(userInfo, done);
  });

  it(`POST ${endpoint} - Sign in by username succeeded`, function(done) {
    const userInfo = {
      username: 'admin',
      password: 'password'
    };
    testSignInSuccess(userInfo, done);
  });
});

describe('ENDPOINT: POST /api/auth/send-token', function() {
  const endpoint = '/api/auth/send-token';
  const testValidation = createTestPayloadValidation(endpoint);

  it(`POST ${endpoint} - Email required`, function(done) {
    const payload = {
      tokenPurpose: 'resetPassword'
    };

    testValidation(payload, 400, 'Email is required.', done);
  });

  it(`POST ${endpoint} - Token purpose required`, function(done) {
    const payload = {
      email: 'admin@mern-stack.org'
    };

    testValidation(payload, 400, '"tokenPurpose" is required', done);
  });

  it(`POST ${endpoint} - Token purpose invalid`, function(done) {
    const payload = {
      email: 'admin@mern-stack.org',
      tokenPurpose: 'invalidTokenPurpose'
    };

    testValidation(
      payload,
      400,
      '"tokenPurpose" must be one of [verifyEmail, resetPassword]',
      done
    );
  });

  it(`POST ${endpoint} - Send password reset token succeeded`, function(done) {
    const User = mongoose.model('User');
    const payload = {
      email: 'admin@mern-stack.org',
      tokenPurpose: 'resetPassword'
    };

    request(app)
      .post(endpoint)
      .send(payload)
      .then(res => User.findOne({ email: payload.email }))
      .then(user => {
        expect(user.token).to.be.a('string');
        expect(user.tokenPurpose).to.equal(payload.tokenPurpose);
        done();
      })
      .catch(done);
  });

  it(`POST ${endpoint} - Send email verification token succeeded`, function(done) {
    const User = mongoose.model('User');
    const payload = {
      email: 'admin@mern-stack.org',
      tokenPurpose: 'verifyEmail'
    };
    if (!config.auth.verifyEmail) {
      request(app)
        .post(endpoint)
        .send(payload)
        .expect(404)
        .expect({ error: 'Unknown request.' }, done);
    } else {
      request(app)
        .post(endpoint)
        .send(payload)
        .then(res => User.findOne({ email: payload.email }))
        .then(user => {
          expect(user.token).to.be.a('string');
          expect(user.tokenPurpose).to.equal(payload.tokenPurpose);
          done();
        })
        .catch(done);
    }
  });
});

describe('ENDPOINT: POST /api/auth/reset-password/:token', function() {
  let endpoint = '';
  let testValidation;

  beforeEach(function(done) {
    let admin = app.locals.test.admin;
    admin.token = uuidv4();
    admin.tokenPurpose = 'resetPassword';
    admin
      .save()
      .then(user => {
        admin = user;
        endpoint = `/api/auth/reset-password/${user.token}`;
        testValidation = createTestPayloadValidation(endpoint);
        done();
      })
      .catch(done);
  });

  it(`POST ${endpoint} - Email required`, function(done) {
    const payload = {
      password: 'new-password'
    };

    testValidation(payload, 400, 'Email is required.', done);
  });

  it(`POST ${endpoint} - New password required`, function(done) {
    const payload = {
      email: 'admin@mern-stack.org'
    };

    testValidation(payload, 400, 'Password is required.', done);
  });

  it(`POST ${endpoint} - Email and token is not a pair`, function(done) {
    const payload = {
      email: 'another@mern-stack.org',
      password: 'new-password'
    };

    testValidation(payload, 422, 'Token expired.', done);
  });

  it(`POST ${endpoint} - Token not existed`, function(done) {
    const payload = {
      email: 'admin@mern-stack.org',
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
    let admin = app.locals.test.admin;
    const payload = {
      email: 'admin@mern-stack.org',
      password: 'new-password'
    };
    admin.tokenPurpose = 'verifyEmail';
    admin
      .save()
      .then(user => {
        testValidation(payload, 422, 'Token expired.', done);
      })
      .catch(done);
  });

  it(`POST ${endpoint} - Password reset succeeded`, function(done) {
    let admin = app.locals.test.admin;
    const User = mongoose.model('User');
    const payload = {
      email: 'admin@mern-stack.org',
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
        expect(user.hashedPassword).to.not.equal(admin.hashedPassword);
        expect(user.subId).to.be.a('string');
        expect(user.subId).to.not.equal(admin.subId);
        done();
      })
      .catch(done);
  });
});

describe('ENDPOINT: POST /api/auth/verify-email/:token', function() {
  let endpoint = '';

  beforeEach(function(done) {
    let admin = app.locals.test.admin;
    admin.token = uuidv4();
    admin.tokenPurpose = 'verifyEmail';
    admin
      .save()
      .then(user => {
        admin = user;
        endpoint = `/api/auth/verify-email/${user.token}`;
        done();
      })
      .catch(done);
  });

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
    let admin = app.locals.test.admin;
    admin.tokenPurpose = 'resetPassword';
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
    let admin = app.locals.test.admin;
    const User = mongoose.model('User');
    request(app)
      .post(endpoint)
      .expect(200)
      .expect({
        message: 'Email verified.',
        success: true
      })
      .then(res => User.findOne({ email: admin.email }))
      .then(user => {
        expect(user.status).to.be.equal('active');
        expect(user.token).to.be.undefined;
        expect(user.tokenPurpose).to.be.undefined;
        done();
      })
      .catch(done);
  });
});

describe('ENDPOINT: POST /api/auth/refresh-token', function() {
  let endpoint = '/api/auth/refresh-token';
  let decodedToken;

  const createJwtToken = payload => {
    return jwt.sign(payload, config.jwt.secret, {
      algorithm: config.jwt.algorithm
    });
  };

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

  beforeEach(function(done) {
    request(app)
      .post('/api/auth/signin')
      .send({ email: 'admin@mern-stack.org', password: 'password' })
      .then(res => {
        decodedToken = jwt.verify(res.body.token, config.jwt.secret);
        done();
      })
      .catch(done);
  });

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
    decodedToken.sub = 'invalid-sub-id';
    const invalidJwtToken = createJwtToken(decodedToken);
    testJwtTokenValidation(invalidJwtToken, done);
  });

  it(`POST ${endpoint} - JWT token - not exist userId`, function(done) {
    decodedToken.userId = '5e24db1d560ba309f0b0b5a8';
    const invalidJwtToken = createJwtToken(decodedToken);
    testJwtTokenValidation(invalidJwtToken, done);
  });

  it(`POST ${endpoint} - JWT token - expired token`, function(done) {
    decodedToken.iat = decodedToken.iat - 100;
    decodedToken.exp = decodedToken.iat - 50;
    const invalidJwtToken = createJwtToken(decodedToken);
    testJwtTokenValidation(invalidJwtToken, done);
  });

  it(`POST ${endpoint} - JWT Token - refresh succeeded`, function(done) {
    const newJwtToken = createJwtToken(decodedToken);
    let admin = app.locals.test.admin;
    request(app)
      .post(endpoint)
      .set('Authorization', `Bearer ${newJwtToken}`)
      .expect(200)
      .then(res => {
        expect(res.body.expiresAt).to.be.a('number');
        const decoded = jwt.verify(res.body.token, config.jwt.secret);
        expect(decoded.sub).to.be.equal(admin.subId);
        expect(decoded.userId).to.be.equal(admin._id.toString());
        expect(decoded.exp).to.be.equal(res.body.expiresAt);
        expect(decoded.iat).to.be.equal(
          decodedToken.exp - config.jwt.expiresIn
        );
        done();
      })
      .catch(done);
  });
});
