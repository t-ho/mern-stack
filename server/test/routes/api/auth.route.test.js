const mongoose = require('mongoose');
const request = require('supertest');
const expect = require('chai').expect;
const _ = require('lodash');
const uuidv4 = require('uuid/v4');
const config = require('../../../config');

describe('ENDPOINT: /api/auth/signup', function() {
  it('POST /api/auth/signup - Email required', function(done) {
    const newUser = {
      username: 'john',
      password: 'qweasdzxc'
    };

    request(app)
      .post('/api/auth/signup')
      .send(newUser)
      .expect(400)
      .expect(
        {
          error: 'Email is required.'
        },
        done
      );
  });

  it('POST /api/auth/signup - Username required', function(done) {
    const newUser = {
      email: 'john@mern-stack.org',
      password: 'qweasdzxc'
    };

    request(app)
      .post('/api/auth/signup')
      .send(newUser)
      .expect(400)
      .expect(
        {
          error: 'Username is required.'
        },
        done
      );
  });

  it('POST /api/auth/signup - Password required', function(done) {
    const newUser = {
      username: 'john',
      email: 'john@mern-stack.org'
    };

    request(app)
      .post('/api/auth/signup')
      .send(newUser)
      .expect(400)
      .expect(
        {
          error: 'Password is required.'
        },
        done
      );
  });

  it('POST /api/auth/signup - Email existed', function(done) {
    const newUser = {
      username: 'john',
      email: 'admin@mern-stack.org',
      password: 'qweasdzxc'
    };

    request(app)
      .post('/api/auth/signup')
      .send(newUser)
      .expect(422)
      .expect(
        {
          error: 'Email is already in use.'
        },
        done
      );
  });

  it('POST /api/auth/signup - Username existed', function(done) {
    const newUser = {
      username: 'admin',
      email: 'john@mern-stack.org',
      password: 'qweasdzxc'
    };

    request(app)
      .post('/api/auth/signup')
      .send(newUser)
      .expect(422)
      .expect(
        {
          error: 'Username is already in use.'
        },
        done
      );
  });

  it('POST /api/auth/signup - Sign up succeeded', function(done) {
    const User = mongoose.model('User');
    const newUser = {
      username: 'john',
      email: 'john@mern-stack.org',
      password: 'qweasdzxc'
    };

    request(app)
      .post('/api/auth/signup')
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

describe('ENDPOINT: /api/auth/signin', function() {
  it('POST /api/auth/signin - Either username or email required', function(done) {
    const userInfo = {
      password: 'qweasdzxc'
    };

    request(app)
      .post('/api/auth/signin')
      .send(userInfo)
      .expect(400)
      .expect(
        {
          error: 'Either username or email must be provided.'
        },
        done
      );
  });

  it('POST /api/auth/signin - Password required', function(done) {
    const userInfo = {
      email: 'admin@mern-stack.org'
    };

    request(app)
      .post('/api/auth/signin')
      .send(userInfo)
      .expect(400)
      .expect(
        {
          error: 'Password is required.'
        },
        done
      );
  });

  const testUsernameOrEmailNotExist = (userInfo, done) => {
    request(app)
      .post('/api/auth/signin')
      .send(userInfo)
      .expect(401)
      .expect(
        {
          error: 'Username or email does not exist.'
        },
        done
      );
  };

  it('POST /api/auth/signin - Email not existed', function(done) {
    const userInfo = {
      email: 'not-exist@mern-stack.org',
      password: 'password'
    };

    testUsernameOrEmailNotExist(userInfo, done);
  });

  it('POST /api/auth/signin - Username not existed', function(done) {
    const userInfo = {
      username: 'not-exist',
      password: 'password'
    };

    testUsernameOrEmailNotExist(userInfo, done);
  });

  const testSignInSuccess = (userInfo, done) => {
    request(app)
      .post('/api/auth/signin')
      .send(userInfo)
      .expect(200)
      .then(res => {
        expect(res.body.token).to.be.a('string');
        expect(res.body.expiresAt).to.be.a('number');
        expect(res.body.user._id).to.be.a('string');
        expect(res.body.user).to.have.property('createdAt');
        expect(res.body.user).to.have.property('updatedAt');
        expect(res.body.user).to.deep.include(
          _.pick(app.test.data.admin.toJSON(), [
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

  it('POST /api/auth/signin - Sign in by email succeeded', function(done) {
    const userInfo = {
      email: 'admin@mern-stack.org',
      password: 'password'
    };
    testSignInSuccess(userInfo, done);
  });

  it('POST /api/auth/signin - Sign in by username succeeded', function(done) {
    const userInfo = {
      username: 'admin',
      password: 'password'
    };
    testSignInSuccess(userInfo, done);
  });
});

describe('ENDPOINT: /api/auth/send-token', function() {
  it('POST /api/auth/send-token - Email required', function(done) {
    const payload = {
      tokenPurpose: 'resetPassword'
    };

    request(app)
      .post('/api/auth/send-token')
      .send(payload)
      .expect(400)
      .expect(
        {
          error: 'Email is required.'
        },
        done
      );
  });

  it('POST /api/auth/send-token - Token purpose required', function(done) {
    const payload = {
      email: 'admin@mern-stack.org'
    };

    request(app)
      .post('/api/auth/send-token')
      .send(payload)
      .expect(400)
      .expect(
        {
          error: '"tokenPurpose" is required'
        },
        done
      );
  });

  it('POST /api/auth/send-token - Token purpose invalid', function(done) {
    const payload = {
      email: 'admin@mern-stack.org',
      tokenPurpose: 'invalidTokenPurpose'
    };

    request(app)
      .post('/api/auth/send-token')
      .send(payload)
      .expect(400)
      .expect(
        {
          error: '"tokenPurpose" must be one of [verifyEmail, resetPassword]'
        },
        done
      );
  });

  it('POST /api/auth/send-token - Send password reset token succeeded', function(done) {
    const User = mongoose.model('User');
    const payload = {
      email: 'admin@mern-stack.org',
      tokenPurpose: 'resetPassword'
    };

    request(app)
      .post('/api/auth/send-token')
      .send(payload)
      .then(res => User.findOne({ email: payload.email }))
      .then(user => {
        expect(user.token).to.be.a('string');
        expect(user.tokenPurpose).to.equal(payload.tokenPurpose);
        done();
      })
      .catch(done);
  });

  it('POST /api/auth/send-token - Send email verification token succeeded', function(done) {
    const User = mongoose.model('User');
    const payload = {
      email: 'admin@mern-stack.org',
      tokenPurpose: 'verifyEmail'
    };
    if (!config.auth.verifyEmail) {
      request(app)
        .post('/api/auth/send-token')
        .send(payload)
        .expect(404)
        .expect({ error: 'Unknown request.' }, done);
    } else {
      request(app)
        .post('/api/auth/send-token')
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

describe('ENDPOINT: /api/auth/reset-password/:token', function() {
  let endpoint = '';
  beforeEach(function(done) {
    app.test.data.admin.token = uuidv4();
    app.test.data.admin.tokenPurpose = 'resetPassword';
    app.test.data.admin.save().then(user => {
      app.test.data.admin = user;
      endpoint = `/api/auth/reset-password/${user.token}`;
      done();
    });
  });

  it('POST /api/auth/reset-password/:token - Email required', function(done) {
    const payload = {
      password: 'new-password'
    };

    request(app)
      .post(endpoint)
      .send(payload)
      .expect(400)
      .expect(
        {
          error: 'Email is required.'
        },
        done
      );
  });

  it('POST /api/auth/reset-password/:token - New password required', function(done) {
    const payload = {
      email: 'admin@mern-stack.org'
    };

    request(app)
      .post(endpoint)
      .send(payload)
      .expect(400)
      .expect(
        {
          error: 'Password is required.'
        },
        done
      );
  });

  it('POST /api/auth/reset-password/:token - Email and token is not a pair', function(done) {
    const payload = {
      email: 'another@mern-stack.org',
      password: 'new-password'
    };

    request(app)
      .post(endpoint)
      .send(payload)
      .expect(422)
      .expect(
        {
          error: 'Token expired.'
        },
        done
      );
  });

  it('POST /api/auth/reset-password/:token - Token not existed', function(done) {
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

  it('POST /api/auth/reset-password/:token - Token existed but not resetPassword token', function(done) {
    const payload = {
      email: 'admin@mern-stack.org',
      password: 'new-password'
    };
    app.test.data.admin.tokenPurpose = 'verifyEmail';
    app.test.data.admin
      .save()
      .then(user => {
        request(app)
          .post(endpoint)
          .send(payload)
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

  it('POST /api/auth/reset-password/:token - Password reset succeeded', function(done) {
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
        expect(user.hashedPassword).to.not.equal(
          app.test.data.admin.hashedPassword
        );
        expect(user.subId).to.be.a('string');
        expect(user.subId).to.not.equal(app.test.data.admin.subId);
        done();
      })
      .catch(done);
  });
});

describe('ENDPOINT: /api/auth/verify-email/:token', function() {
  let endpoint = '';
  beforeEach(function(done) {
    app.test.data.admin.token = uuidv4();
    app.test.data.admin.tokenPurpose = 'verifyEmail';
    app.test.data.admin.save().then(user => {
      app.test.data.admin = user;
      endpoint = `/api/auth/verify-email/${user.token}`;
      done();
    });
  });

  it('POST /api/auth/verify-email/:token - Token not existed', function(done) {
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

  it('POST /api/auth/verify-email/:token - Token existed but not verifyEmail token', function(done) {
    app.test.data.admin.tokenPurpose = 'resetPassword';
    app.test.data.admin
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

  it('POST /api/auth/verify-email/:token - Email verified succeeded', function(done) {
    const User = mongoose.model('User');
    request(app)
      .post(endpoint)
      .expect(200)
      .expect({
        message: 'Email verified.',
        success: true
      })
      .then(res => User.findOne({ email: app.test.data.admin.email }))
      .then(user => {
        expect(user.status).to.be.equal('active');
        expect(user.token).to.be.undefined;
        expect(user.tokenPurpose).to.be.undefined;
        done();
      })
      .catch(done);
  });
});
