const mongoose = require('mongoose');
const request = require('supertest');
const expect = require('chai').expect;
const _ = require('lodash');

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
      .then(res => {
        User.findOne({ email: newUser.email })
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
