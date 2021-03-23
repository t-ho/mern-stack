const mongoose = require('mongoose');
const request = require('supertest');
const expect = require('chai').expect;
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const config = require('../../../config');

const createJwtToken = (payload) => {
  return jwt.sign(payload, config.jwt.secret, {
    algorithm: config.jwt.algorithm,
  });
};

const decodeJwtToken = (jwtToken) => {
  return jwt.verify(jwtToken, config.jwt.secret);
};

describe('ENDPOINT: GET /api/profiles/', function () {
  let endpoint = '/api/profiles/';

  it(`GET ${endpoint} - JWT token not provided`, function (done) {
    request(app)
      .get(endpoint)
      .expect(401)
      .expect({ error: { message: 'No auth token' } }, done);
  });

  it(`GET ${endpoint} - JWT token - invalid subId`, function (done) {
    const existingAdmin = app.locals.existing.admin;
    let decodedToken = decodeJwtToken(existingAdmin.jwtToken);
    decodedToken.sub = 'invalid-sub-id';
    request(app)
      .get(endpoint)
      .set('Authorization', `Bearer ${createJwtToken(decodedToken)}`)
      .expect(401)
      .expect({ error: { message: 'Invalid JWT token' } }, done);
  });

  it(`GET ${endpoint} - JWT token - not exist userId`, function (done) {
    const existingAdmin = app.locals.existing.admin;
    let decodedToken = decodeJwtToken(existingAdmin.jwtToken);
    decodedToken.userId = '5e24db1d560ba309f0b0b5a8';
    request(app)
      .get(endpoint)
      .set('Authorization', `Bearer ${createJwtToken(decodedToken)}`)
      .expect(401)
      .expect({ error: { message: 'Invalid credentials' } }, done);
  });

  it(`GET ${endpoint} - JWT token - expired token`, function (done) {
    const existingAdmin = app.locals.existing.admin;
    let decodedToken = decodeJwtToken(existingAdmin.jwtToken);
    decodedToken.iat = decodedToken.iat - 100;
    decodedToken.exp = decodedToken.iat - 50;
    request(app)
      .get(endpoint)
      .set('Authorization', `Bearer ${createJwtToken(decodedToken)}`)
      .expect(401)
      .expect({ error: { message: 'jwt expired' } }, done);
  });

  it(`GET ${endpoint} - Get profile succeeded`, function (done) {
    let existingAdmin = app.locals.existing.admin;
    request(app)
      .get(endpoint)
      .set('Authorization', `Bearer ${existingAdmin.jwtToken}`)
      .expect(200)
      .then((res) => {
        expect(res.body.profile.id).to.be.equal(existingAdmin._id.toString());
        expect(res.body.profile).to.have.property('createdAt');
        expect(res.body.profile).to.have.property('updatedAt');
        expect(res.body.profile.provider).to.deep.equal({
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
        expect(res.body.profile).to.not.have.property('hashedPassword');
        expect(res.body.profile).to.not.have.property('password');
        expect(res.body.profile).to.not.have.property('subId');
        expect(res.body.profile).to.not.have.property('token');
        expect(res.body.profile).to.not.have.property('tokenPurpose');
        expect(res.body.profile).to.deep.include(
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
  });
});

describe('ENDPOINT: PUT /api/profiles/', function () {
  let endpoint = '/api/profiles/';

  it(`PUT ${endpoint} - JWT token not provided`, function (done) {
    request(app)
      .put(endpoint)
      .send({ firstName: 'John' })
      .expect(401)
      .expect({ error: { message: 'No auth token' } }, done);
  });

  it(`PUT ${endpoint} - JWT token - invalid subId`, function (done) {
    const existingAdmin = app.locals.existing.admin;
    let decodedToken = decodeJwtToken(existingAdmin.jwtToken);
    decodedToken.sub = 'invalid-sub-id';
    const payload = { firstName: 'John' };
    request(app)
      .put(endpoint)
      .send(payload)
      .set('Authorization', `Bearer ${createJwtToken(decodedToken)}`)
      .expect(401)
      .expect({ error: { message: 'Invalid JWT token' } }, done);
  });

  it(`PUT ${endpoint} - JWT token - not exist userId`, function (done) {
    const existingAdmin = app.locals.existing.admin;
    let decodedToken = decodeJwtToken(existingAdmin.jwtToken);
    decodedToken.userId = '5e24db1d560ba309f0b0b5a8';
    const payload = { firstName: 'John' };
    request(app)
      .put(endpoint)
      .send(payload)
      .set('Authorization', `Bearer ${createJwtToken(decodedToken)}`)
      .expect(401)
      .expect({ error: { message: 'Invalid credentials' } }, done);
  });

  it(`PUT ${endpoint} - JWT token - expired token`, function (done) {
    const existingAdmin = app.locals.existing.admin;
    let decodedToken = decodeJwtToken(existingAdmin.jwtToken);
    decodedToken.iat = decodedToken.iat - 100;
    decodedToken.exp = decodedToken.iat - 50;
    const payload = { firstName: 'John' };
    request(app)
      .put(endpoint)
      .send(payload)
      .set('Authorization', `Bearer ${createJwtToken(decodedToken)}`)
      .expect(401)
      .expect({ error: { message: 'jwt expired' } }, done);
  });

  it(`PUT ${endpoint} - JWT token - disabled account - local provider`, function (done) {
    let existingAdmin = app.locals.existing.admin;
    let decodedToken = decodeJwtToken(existingAdmin.jwtToken);
    decodedToken.provider = 'local';
    const payload = { firstName: 'John' };
    existingAdmin.status = 'disabled';
    existingAdmin.save().then((u) => {
      existingAdmin = u;
      request(app)
        .put(endpoint)
        .send(payload)
        .set('Authorization', `Bearer ${createJwtToken(decodedToken)}`)
        .expect(401)
        .expect({ error: { message: 'Account is disabled' } }, done);
    });
  });

  it(`PUT ${endpoint} - JWT token - disabled account - google provider`, function (done) {
    let existingAdmin = app.locals.existing.admin;
    let decodedToken = decodeJwtToken(existingAdmin.jwtToken);
    decodedToken.provider = 'google';
    const payload = { firstName: 'John' };
    existingAdmin.status = 'disabled';
    existingAdmin.save().then((u) => {
      existingAdmin = u;
      request(app)
        .put(endpoint)
        .send(payload)
        .set('Authorization', `Bearer ${createJwtToken(decodedToken)}`)
        .expect(401)
        .expect({ error: { message: 'Account is disabled' } }, done);
    });
  });

  it(`PUT ${endpoint} - JWT token - disabled account - facebook provider`, function (done) {
    let existingAdmin = app.locals.existing.admin;
    let decodedToken = decodeJwtToken(existingAdmin.jwtToken);
    decodedToken.provider = 'facebook';
    const payload = { firstName: 'John' };
    existingAdmin.status = 'disabled';
    existingAdmin.save().then((u) => {
      existingAdmin = u;
      request(app)
        .put(endpoint)
        .send(payload)
        .set('Authorization', `Bearer ${createJwtToken(decodedToken)}`)
        .expect(401)
        .expect({ error: { message: 'Account is disabled' } }, done);
    });
  });

  it(`PUT ${endpoint} - JWT token - unverified-email - local provider`, function (done) {
    let existingAdmin = app.locals.existing.admin;
    let decodedToken = decodeJwtToken(existingAdmin.jwtToken);
    decodedToken.provider = 'local';
    const payload = { firstName: 'John' };
    existingAdmin.status = 'unverified-email';
    existingAdmin.save().then((u) => {
      existingAdmin = u;
      request(app)
        .put(endpoint)
        .send(payload)
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

  it(`PUT ${endpoint} - Can only update firstName, lastName, displayName`, function (done) {
    const User = mongoose.model('User');
    let existingAdmin = app.locals.existing.admin;
    const payload = {
      _id: '5e24db1d560ba309f0b0b5a8',
      username: 'newusername',
      email: 'new-email@tdev.app',
      status: 'disabled',
      firstName: 'new-first-name',
      lastName: 'new-last-name',
      password: 'new-password',
      role: 'root',
      subId: '5e24db1d560ba309f0b0b5a8',
      permissions: {
        userModify: true,
        userRead: true,
      },
      provider: {
        google: {
          userId: 'new-google-user-id',
          picture: 'new-google-avatar-url',
          accessToken: 'new-google-access-token',
          refreshToken: 'new-google-refresh-token',
        },
      },
      createdAt: '2020-01-20T20:44:44.634Z',
      updatedAt: '2020-01-22T01:28:03.783Z',
    };
    request(app)
      .put(endpoint)
      .set('Authorization', `Bearer ${existingAdmin.jwtToken}`)
      .send(payload)
      .expect(200)
      .then((res) => {
        expect(res.body.updatedFields)
          .to.be.an('array')
          .that.include.members(['firstName', 'lastName']);
        expect(res.body.user).to.not.have.property('hashedPassword');
        expect(res.body.user).to.not.have.property('password');
        expect(res.body.user).to.not.have.property('subId');
        expect(res.body.user).to.not.have.property('token');
        expect(res.body.user).to.not.have.property('tokenPurpose');
        expect(res.body.user).to.have.property('username');
        expect(res.body.user).to.have.property('email');
        expect(res.body.user).to.have.property('status');
        expect(res.body.user).to.have.property('firstName');
        expect(res.body.user).to.have.property('lastName');
        expect(res.body.user).to.have.property('role');
        expect(res.body.user).to.have.property('permissions');
        expect(res.body.user).to.have.property('provider');
        return User.findById(existingAdmin._id);
      })
      .then((updatedUser) => {
        expect(updatedUser.toObject()).to.deep.include(
          _.pick(existingAdmin.toObject(), [
            '_id',
            'username',
            'email',
            'status',
            'role',
            'permissions',
            'createdAt',
            'token',
            'tokenPurpose',
            'provider',
            'hashedPassword',
            'subId',
          ])
        );
        expect(updatedUser.firstName).to.be.equal(payload.firstName);
        expect(updatedUser.lastName).to.be.equal(payload.lastName);

        done();
      })
      .catch(done);
  });

  it(`PUT ${endpoint} - Should not update subId`, function (done) {
    const User = mongoose.model('User');
    let existingAdmin = app.locals.existing.admin;
    const payload = {
      firstName: 'new-first-name',
      lastName: 'new-last-name',
      subId: '5e24db1d560ba309f0b0b5a8',
    };
    request(app)
      .put(endpoint)
      .set('Authorization', `Bearer ${existingAdmin.jwtToken}`)
      .send(payload)
      .expect(200)
      .then((res) => User.findById(existingAdmin._id))
      .then((updatedUser) => {
        expect(updatedUser.toObject()).to.deep.include(
          _.pick(existingAdmin.toObject(), [
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
            'hashedPassword',
            'provider',
          ])
        );
        expect(updatedUser.firstName).to.be.equal(payload.firstName);
        expect(updatedUser.lastName).to.be.equal(payload.lastName);

        done();
      })
      .catch(done);
  });
});

describe('ENDPOINT: PUT /api/profiles/password', function () {
  let endpoint = '/api/profiles/password';

  it(`PUT ${endpoint} - JWT token not provided`, function (done) {
    request(app)
      .put(endpoint)
      .send({ password: 'new-password', currentPassword: 'password' })
      .expect(401)
      .expect({ error: { message: 'No auth token' } }, done);
  });

  it(`PUT ${endpoint} - JWT token - invalid subId`, function (done) {
    const existingAdmin = app.locals.existing.admin;
    let decodedToken = decodeJwtToken(existingAdmin.jwtToken);
    decodedToken.sub = 'invalid-sub-id';
    const payload = { password: 'new-password', currentPassword: 'password' };
    request(app)
      .put(endpoint)
      .send(payload)
      .set('Authorization', `Bearer ${createJwtToken(decodedToken)}`)
      .expect(401)
      .expect({ error: { message: 'Invalid JWT token' } }, done);
  });

  it(`PUT ${endpoint} - JWT token - not exist userId`, function (done) {
    const existingAdmin = app.locals.existing.admin;
    let decodedToken = decodeJwtToken(existingAdmin.jwtToken);
    decodedToken.userId = '5e24db1d560ba309f0b0b5a8';
    const payload = { password: 'new-password', currentPassword: 'password' };
    request(app)
      .put(endpoint)
      .send(payload)
      .set('Authorization', `Bearer ${createJwtToken(decodedToken)}`)
      .expect(401)
      .expect({ error: { message: 'Invalid credentials' } }, done);
  });

  it(`PUT ${endpoint} - JWT token - expired token`, function (done) {
    const existingAdmin = app.locals.existing.admin;
    let decodedToken = decodeJwtToken(existingAdmin.jwtToken);
    decodedToken.iat = decodedToken.iat - 100;
    decodedToken.exp = decodedToken.iat - 50;
    const payload = { password: 'new-password', currentPassword: 'password' };
    request(app)
      .put(endpoint)
      .send(payload)
      .set('Authorization', `Bearer ${createJwtToken(decodedToken)}`)
      .expect(401)
      .expect({ error: { message: 'jwt expired' } }, done);
  });

  it(`PUT ${endpoint} - JWT token - disabled account - local provider`, function (done) {
    let existingAdmin = app.locals.existing.admin;
    let decodedToken = decodeJwtToken(existingAdmin.jwtToken);
    decodedToken.provider = 'local';
    const payload = { password: 'new-password', currentPassword: 'password' };
    existingAdmin.status = 'disabled';
    existingAdmin.save().then((u) => {
      existingAdmin = u;
      request(app)
        .put(endpoint)
        .send(payload)
        .set('Authorization', `Bearer ${createJwtToken(decodedToken)}`)
        .expect(401)
        .expect({ error: { message: 'Account is disabled' } }, done);
    });
  });

  it(`PUT ${endpoint} - JWT token - disabled account - google provider`, function (done) {
    let existingAdmin = app.locals.existing.admin;
    let decodedToken = decodeJwtToken(existingAdmin.jwtToken);
    decodedToken.provider = 'google';
    const payload = { password: 'new-password', currentPassword: 'password' };
    existingAdmin.status = 'disabled';
    existingAdmin.save().then((u) => {
      existingAdmin = u;
      request(app)
        .put(endpoint)
        .send(payload)
        .set('Authorization', `Bearer ${createJwtToken(decodedToken)}`)
        .expect(401)
        .expect({ error: { message: 'Account is disabled' } }, done);
    });
  });

  it(`PUT ${endpoint} - JWT token - disabled account - facebook provider`, function (done) {
    let existingAdmin = app.locals.existing.admin;
    let decodedToken = decodeJwtToken(existingAdmin.jwtToken);
    decodedToken.provider = 'facebook';
    const payload = { password: 'new-password', currentPassword: 'password' };
    existingAdmin.status = 'disabled';
    existingAdmin.save().then((u) => {
      existingAdmin = u;
      request(app)
        .put(endpoint)
        .send(payload)
        .set('Authorization', `Bearer ${createJwtToken(decodedToken)}`)
        .expect(401)
        .expect({ error: { message: 'Account is disabled' } }, done);
    });
  });

  it(`PUT ${endpoint} - JWT token - unverified-email - local provider`, function (done) {
    let existingAdmin = app.locals.existing.admin;
    let decodedToken = decodeJwtToken(existingAdmin.jwtToken);
    decodedToken.provider = 'local';
    const payload = { password: 'new-password', currentPassword: 'password' };
    existingAdmin.status = 'unverified-email';
    existingAdmin.save().then((u) => {
      existingAdmin = u;
      request(app)
        .put(endpoint)
        .send(payload)
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

  it(`PUT ${endpoint} - Current passowrd is required`, function (done) {
    let existingAdmin = app.locals.existing.admin;
    const payload = { password: 'new-password' };
    request(app)
      .put(endpoint)
      .send(payload)
      .set('Authorization', `Bearer ${existingAdmin.jwtToken}`)
      .expect(400)
      .expect({ error: { message: 'Current Password is required' } }, done);
  });

  it(`PUT ${endpoint} - Password is required`, function (done) {
    let existingAdmin = app.locals.existing.admin;
    const payload = { currentPassword: 'password' };
    request(app)
      .put(endpoint)
      .send(payload)
      .set('Authorization', `Bearer ${existingAdmin.jwtToken}`)
      .expect(400)
      .expect({ error: { message: 'Password is required' } }, done);
  });

  it(`PUT ${endpoint} - Password and current password are the same`, function (done) {
    let existingAdmin = app.locals.existing.admin;
    const payload = { password: 'password', currentPassword: 'password' };
    request(app)
      .put(endpoint)
      .send(payload)
      .set('Authorization', `Bearer ${existingAdmin.jwtToken}`)
      .expect(422)
      .expect(
        { error: { message: 'New password is the same as current password' } },
        done
      );
  });

  it(`PUT ${endpoint} -  Token with facebook provider should not be allowed to update password`, function (done) {
    let existingAdmin = app.locals.existing.admin;
    let decodedToken = decodeJwtToken(existingAdmin.jwtToken);
    decodedToken.provider = 'facebook';
    const payload = { password: 'new-password', currentPassword: 'password' };
    request(app)
      .put(endpoint)
      .send(payload)
      .set('Authorization', `Bearer ${createJwtToken(decodedToken)}`)
      .expect(403)
      .expect(
        { error: { message: 'Cannot change the password of OAuth account' } },
        done
      );
  });

  it(`PUT ${endpoint} -  Token with google provider should not be allowed to update password`, function (done) {
    let existingAdmin = app.locals.existing.admin;
    let decodedToken = decodeJwtToken(existingAdmin.jwtToken);
    decodedToken.provider = 'facebook';
    const payload = { password: 'new-password', currentPassword: 'password' };
    request(app)
      .put(endpoint)
      .send(payload)
      .set('Authorization', `Bearer ${createJwtToken(decodedToken)}`)
      .expect(403)
      .expect(
        { error: { message: 'Cannot change the password of OAuth account' } },
        done
      );
  });

  it(`PUT ${endpoint} - Current password is incorrect`, function (done) {
    let existingAdmin = app.locals.existing.admin;
    const payload = {
      password: 'new-password',
      currentPassword: 'incorrect-password',
    };
    request(app)
      .put(endpoint)
      .send(payload)
      .set('Authorization', `Bearer ${existingAdmin.jwtToken}`)
      .expect(422)
      .expect({ error: { message: 'Current password is incorrect' } }, done);
  });

  it(`PUT ${endpoint} - Update passowrd success`, function (done) {
    const User = mongoose.model('User');
    let existingAdmin = app.locals.existing.admin;
    let decodedToken = decodeJwtToken(existingAdmin.jwtToken);
    const payload = {
      password: 'new-password',
      currentPassword: 'password',
      subId: '60592551fc72e0ad2a1da0b8', // This subId will be ignored
    };
    let response = null;
    request(app)
      .put(endpoint)
      .set('Authorization', `Bearer ${existingAdmin.jwtToken}`)
      .send(payload)
      .expect(200)
      .then((res) => {
        expect(res.body.expiresAt).to.be.a('number');
        expect(res.body.token).to.be.a('string');
        response = res;
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
          ])
        );
        // password changed
        expect(updatedUser.hashedPassword).to.not.equal(payload.password);
        expect(updatedUser.hashedPassword).to.not.equal(
          existingAdmin.hashedPassword
        );
        expect(mongoose.Types.ObjectId.isValid(updatedUser.subId)).to.be.true;
        expect(updatedUser.subId).to.not.equal(decodedToken.sub);
        expect(updatedUser.subId).to.not.equal(payload.subId);
        expect(updatedUser.subId).to.not.equal(existingAdmin.subId);

        const newlyDecodedToken = decodeJwtToken(response.body.token);
        expect(newlyDecodedToken.sub).to.not.equal(existingAdmin.subId);
        expect(newlyDecodedToken.sub).to.be.equal(updatedUser.subId);
        expect(newlyDecodedToken.userId).to.be.equal(
          updatedUser._id.toString()
        );
        expect(newlyDecodedToken.exp).to.be.equal(response.body.expiresAt);
        expect(newlyDecodedToken.iat).to.be.equal(
          newlyDecodedToken.exp - config.jwt.expiresIn
        );
        expect(newlyDecodedToken.provider).to.be.equal('local');

        done();
      })
      .catch(done);
  });
});

describe('ENDPOINT: GET /api/profiles/:userId', function () {
  let endpoint = '/api/profiles';

  it(`GET ${endpoint}/:userId - Params - Invalid userId`, function (done) {
    let existingUser = app.locals.existing.user;
    request(app)
      .get(`${endpoint}/invalid-user-id`)
      .expect(422)
      .expect({ error: { message: 'Invalid user ID' } }, done);
  });

  it(`GET ${endpoint}/userId - Params - User ID not exist`, function (done) {
    request(app)
      .get(`${endpoint}/5e24db1d560ba309f0b0b5a8`)
      .expect(422)
      .expect({ error: { message: 'User ID does not exist' } }, done);
  });

  it(`GET ${endpoint}/userId - Get public profile succeeded`, function (done) {
    let existingAdmin = app.locals.existing.admin;
    request(app)
      .get(`${endpoint}/${existingAdmin._id}`)
      .expect(200)
      .then((res) => {
        expect(res.body.profile.id).to.be.equal(existingAdmin._id.toString());
        expect(res.body.profile).to.have.property('createdAt');
        expect(res.body.profile).to.be.deep.include(
          _.pick(existingAdmin.toString(), [
            'username',
            'firstName',
            'lastName',
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
        expect(res.body.profile).to.not.have.property('provider');
        done();
      })
      .catch(done);
  });
});
