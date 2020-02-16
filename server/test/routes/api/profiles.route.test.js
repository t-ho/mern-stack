const mongoose = require('mongoose');
const request = require('supertest');
const expect = require('chai').expect;
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const config = require('../../../config');

describe('ENDPOINT: GET /api/profiles/', function() {
  let endpoint = '/api/profiles/';
  let decodedToken;

  const createJwtToken = payload => {
    return jwt.sign(payload, config.jwt.secret, {
      algorithm: config.jwt.algorithm
    });
  };

  const testJwtTokenValidation = (jwtToken, done) => {
    request(app)
      .get(endpoint)
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

  it(`GET ${endpoint} - JWT token not provided`, function(done) {
    request(app)
      .get(endpoint)
      .expect(401)
      .expect({})
      .then(res => {
        expect(res.text).to.be.equal('Unauthorized');
        done();
      })
      .catch(done);
  });

  it(`GET ${endpoint} - JWT token - invalid subId`, function(done) {
    decodedToken.sub = 'invalid-sub-id';
    const invalidJwtToken = createJwtToken(decodedToken);
    testJwtTokenValidation(invalidJwtToken, done);
  });

  it(`GET ${endpoint} - JWT token - not exist userId`, function(done) {
    decodedToken.userId = '5e24db1d560ba309f0b0b5a8';
    const invalidJwtToken = createJwtToken(decodedToken);
    testJwtTokenValidation(invalidJwtToken, done);
  });

  it(`GET ${endpoint} - JWT token - expired token`, function(done) {
    decodedToken.iat = decodedToken.iat - 100;
    decodedToken.exp = decodedToken.iat - 50;
    const invalidJwtToken = createJwtToken(decodedToken);
    testJwtTokenValidation(invalidJwtToken, done);
  });

  it(`GET ${endpoint} - Get profile succeeded`, function(done) {
    const newJwtToken = createJwtToken(decodedToken);
    let existingAdmin = app.locals.existing.admin;
    request(app)
      .get(endpoint)
      .set('Authorization', `Bearer ${newJwtToken}`)
      .expect(200)
      .then(res => {
        expect(res.body.profile._id).to.be.equal(existingAdmin._id.toString());
        expect(res.body.profile).to.have.property('createdAt');
        expect(res.body.profile).to.have.property('updatedAt');
        expect(res.body.profile).to.not.have.property('hashedPassword');
        expect(res.body.profile).to.not.have.property('password');
        expect(res.body.profile).to.not.have.property('subId');
        expect(res.body.profile).to.not.have.property('token');
        expect(res.body.profile).to.not.have.property('tokenPurpose');
        expect(res.body.profile).to.deep.include(
          _.pick(existingAdmin.toJSON(), [
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
  });
});

describe('ENDPOINT: PUT /api/profiles/', function() {
  let endpoint = '/api/profiles/';
  let decodedToken;

  const createJwtToken = payload => {
    return jwt.sign(payload, config.jwt.secret, {
      algorithm: config.jwt.algorithm
    });
  };

  const testJwtTokenValidation = (jwtToken, payload, done) => {
    request(app)
      .put(endpoint)
      .send(payload)
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

  it(`PUT ${endpoint} - JWT token not provided`, function(done) {
    request(app)
      .put(endpoint)
      .send({ firstName: 'John', password: 'new-password' })
      .expect(401)
      .expect({})
      .then(res => {
        expect(res.text).to.be.equal('Unauthorized');
        done();
      })
      .catch(done);
  });

  it(`PUT ${endpoint} - JWT token - invalid subId`, function(done) {
    decodedToken.sub = 'invalid-sub-id';
    const invalidJwtToken = createJwtToken(decodedToken);
    const payload = { firstName: 'John', password: 'new-password' };
    testJwtTokenValidation(invalidJwtToken, payload, done);
  });

  it(`PUT ${endpoint} - JWT token - not exist userId`, function(done) {
    decodedToken.userId = '5e24db1d560ba309f0b0b5a8';
    const invalidJwtToken = createJwtToken(decodedToken);
    const payload = { firstName: 'John', password: 'new-password' };
    testJwtTokenValidation(invalidJwtToken, payload, done);
  });

  it(`PUT ${endpoint} - JWT token - expired token`, function(done) {
    decodedToken.iat = decodedToken.iat - 100;
    decodedToken.exp = decodedToken.iat - 50;
    const invalidJwtToken = createJwtToken(decodedToken);
    const payload = { firstName: 'John', password: 'new-password' };
    testJwtTokenValidation(invalidJwtToken, payload, done);
  });

  it(`PUT ${endpoint} - Can only update firstName, lastName and password`, function(done) {
    const User = mongoose.model('User');
    const newJwtToken = createJwtToken(decodedToken);
    let existingAdmin = app.locals.existing.admin;
    const payload = {
      _id: '5e24db1d560ba309f0b0b5a8',
      username: 'newusername',
      email: 'new-email@mern-stack.org',
      status: 'disabled',
      firstName: 'John',
      lastName: 'Connor',
      password: 'new-password',
      role: 'root',
      subId: '5e24db1d560ba309f0b0b5a8',
      permissions: {
        debug: true
      },
      createdAt: '2020-01-20T20:44:44.634Z',
      updatedAt: '2020-01-22T01:28:03.783Z'
    };
    request(app)
      .put(endpoint)
      .set('Authorization', `Bearer ${newJwtToken}`)
      .send(payload)
      .expect(200)
      .expect({
        success: true,
        updatedFields: ['firstName', 'lastName', 'password']
      })
      .then(res => User.findById(existingAdmin._id))
      .then(updatedUser => {
        expect(updatedUser.toJSON()).to.deep.include(
          _.pick(existingAdmin.toJSON(), [
            '_id',
            'username',
            'email',
            'status',
            'role',
            'permissions',
            'createdAt',
            'token',
            'tokenPurpose'
          ])
        );
        expect(updatedUser.firstName).to.be.equal(payload.firstName);
        expect(updatedUser.lastName).to.be.equal(payload.lastName);
        // password changed
        expect(updatedUser.hashedPassword).to.not.equal(payload.password);
        expect(updatedUser.hashedPassword).to.not.equal(
          existingAdmin.hashedPassword
        );
        expect(updatedUser.subId).to.not.equal(payload.subId);
        expect(updatedUser.subId).to.not.equal(existingAdmin.subId);

        done();
      })
      .catch(done);
  });

  it(`PUT ${endpoint} - Should not update subId`, function(done) {
    const User = mongoose.model('User');
    const newJwtToken = createJwtToken(decodedToken);
    let existingAdmin = app.locals.existing.admin;
    const payload = {
      firstName: 'John',
      lastName: 'Connor',
      subId: '5e24db1d560ba309f0b0b5a8'
    };
    request(app)
      .put(endpoint)
      .set('Authorization', `Bearer ${newJwtToken}`)
      .send(payload)
      .expect(200)
      .expect({
        success: true,
        updatedFields: ['firstName', 'lastName']
      })
      .then(res => User.findById(existingAdmin._id))
      .then(updatedUser => {
        expect(updatedUser.toJSON()).to.deep.include(
          _.pick(existingAdmin.toJSON(), [
            '_id',
            'username',
            'email',
            'status',
            'role',
            'permissions',
            'createdAt',
            'token',
            'tokenPurpose',
            'subId',
            'hashedPassword'
          ])
        );
        expect(updatedUser.firstName).to.be.equal(payload.firstName);
        expect(updatedUser.lastName).to.be.equal(payload.lastName);

        done();
      })
      .catch(done);
  });

  describe('ENDPOINT: GET /api/profiles/:userId', function() {
    let endpoint = '/api/profiles';

    it(`GET ${endpoint} - User ID not exist`, function(done) {
      request(app)
        .get(`${endpoint}/5e24db1d560ba309f0b0b5a8`)
        .expect(422)
        .expect(
          {
            error: 'User ID does not exist'
          },
          done
        );
    });

    it(`GET ${endpoint} - Get public profile succeeded`, function(done) {
      let existingAdmin = app.locals.existing.admin;
      request(app)
        .get(`${endpoint}/${existingAdmin._id}`)
        .expect(200)
        .then(res => {
          expect(res.body.profile._id).to.be.equal(
            existingAdmin._id.toString()
          );
          expect(res.body.profile).to.have.property('createdAt');
          expect(res.body.profile).to.be.deep.include(
            _.pick(existingAdmin.toString(), [
              'username',
              'firstName',
              'lastName'
            ])
          );
          expect(res.body.profile).to.not.have.property('email');
          expect(res.body.profile).to.not.have.property('status');
          expect(res.body.profile).to.not.have.property('role');
          expect(res.body.profile).to.not.have.property('permissions');
          expect(res.body.profile).to.not.have.property('subId');
          expect(res.body.profile).to.not.have.property('token');
          expect(res.body.profile).to.not.have.property('tokenPurpose');
          expect(res.body.profile).to.not.have.property('hashedPassword');
          done();
        })
        .catch(done);
    });
  });
});
