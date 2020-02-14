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
