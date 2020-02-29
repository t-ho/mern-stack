const mongoose = require('mongoose');
const request = require('supertest');
const expect = require('chai').expect;
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const config = require('../../../config');

const createJwtToken = payload => {
  return jwt.sign(payload, config.jwt.secret, {
    algorithm: config.jwt.algorithm
  });
};

const decodeJwtToken = jwtToken => {
  return jwt.verify(jwtToken, config.jwt.secret);
};

describe('ENDPOINT: GET /api/users/', function() {
  let endpoint = '/api/users/';

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
    const existingAdmin = app.locals.existing.admin;
    let decodedToken = decodeJwtToken(existingAdmin.jwtToken);
    decodedToken.sub = 'invalid-sub-id';
    const invalidJwtToken = createJwtToken(decodedToken);
    testJwtTokenValidation(invalidJwtToken, done);
  });

  it(`GET ${endpoint} - JWT token - not exist userId`, function(done) {
    const existingAdmin = app.locals.existing.admin;
    let decodedToken = decodeJwtToken(existingAdmin.jwtToken);
    decodedToken.userId = '5e24db1d560ba309f0b0b5a8';
    const invalidJwtToken = createJwtToken(decodedToken);
    testJwtTokenValidation(invalidJwtToken, done);
  });

  it(`GET ${endpoint} - JWT token - expired token`, function(done) {
    const existingAdmin = app.locals.existing.admin;
    let decodedToken = decodeJwtToken(existingAdmin.jwtToken);
    decodedToken.iat = decodedToken.iat - 100;
    decodedToken.exp = decodedToken.iat - 50;
    const invalidJwtToken = createJwtToken(decodedToken);
    testJwtTokenValidation(invalidJwtToken, done);
  });

  it(`GET ${endpoint} - Normal user cannot get a list of users`, function(done) {
    let existingUser = app.locals.existing.user;
    request(app)
      .get(endpoint)
      .set('Authorization', `Bearer ${existingUser.jwtToken}`)
      .expect(401)
      .expect({ error: 'Unauthorized action.' }, done);
  });

  const testCanGetListOfUsers = (currentUser, done) => {
    request(app)
      .get(endpoint)
      .set('Authorization', `Bearer ${currentUser.jwtToken}`)
      .expect(200)
      .then(res => {
        expect(res.body.usersCount).to.be.equal(3);
        res.body.users.forEach(user => {
          expect(user._id).to.be.equal(
            app.locals.existing[[user.role]]._id.toString()
          );
          expect(user).to.have.property('createdAt');
          expect(user).to.have.property('updatedAt');
          expect(user.provider).to.deep.equal({
            local: {
              userId: app.locals.existing[[user.role]]._id.toString()
            },
            google: {
              // not have property "accessToken" and "refreshToken"
              userId: app.locals.existing[[user.role]].provider.google.userId,
              picture: app.locals.existing[[user.role]].provider.google.picture
            },
            facebook: {
              // not have property "accessToken" and "refreshToken"
              userId: app.locals.existing[[user.role]].provider.facebook.userId,
              picture:
                app.locals.existing[[user.role]].provider.facebook.picture
            }
          });
          expect(user).to.not.have.property('hashedPassword');
          expect(user).to.not.have.property('password');
          expect(user).to.not.have.property('subId');
          expect(user).to.not.have.property('token');
          expect(user).to.not.have.property('tokenPurpose');
          expect(user).to.deep.include(
            _.pick(app.locals.existing[[user.role]].toObject(), [
              'username',
              'email',
              'status',
              'firstName',
              'lastName',
              'role',
              'permissions'
            ])
          );
        });
        done();
      })
      .catch(done);
  };

  it(`GET ${endpoint} - Admin can get a list of users`, function(done) {
    let existingAdmin = app.locals.existing.admin;
    testCanGetListOfUsers(existingAdmin, done);
  });

  it(`GET ${endpoint} - Root can get a list of users`, function(done) {
    let existingRoot = app.locals.existing.root;
    testCanGetListOfUsers(existingRoot, done);
  });
});

describe('ENDPOINT: GET /api/users/:id', function() {
  let endpoint = '/api/users';

  const testJwtTokenValidation = (jwtToken, done) => {
    let existingUser = app.locals.existing.user;
    request(app)
      .get(`${endpoint}/${existingUser._id}`)
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(401)
      .expect({})
      .then(res => {
        expect(res.text).to.be.equal('Unauthorized');
        done();
      })
      .catch(done);
  };

  it(`GET ${endpoint}/:userId - JWT token not provided`, function(done) {
    let existingUser = app.locals.existing.user;
    request(app)
      .get(`${endpoint}/${existingUser._id}`)
      .expect(401)
      .expect({})
      .then(res => {
        expect(res.text).to.be.equal('Unauthorized');
        done();
      })
      .catch(done);
  });

  it(`GET ${endpoint}/:userId - JWT token - invalid subId`, function(done) {
    const existingAdmin = app.locals.existing.admin;
    let decodedToken = decodeJwtToken(existingAdmin.jwtToken);
    decodedToken.sub = 'invalid-sub-id';
    const invalidJwtToken = createJwtToken(decodedToken);
    testJwtTokenValidation(invalidJwtToken, done);
  });

  it(`GET ${endpoint}/:userId - JWT token - not exist userId`, function(done) {
    const existingAdmin = app.locals.existing.admin;
    let decodedToken = decodeJwtToken(existingAdmin.jwtToken);
    decodedToken.userId = '5e24db1d560ba309f0b0b5a8';
    const invalidJwtToken = createJwtToken(decodedToken);
    testJwtTokenValidation(invalidJwtToken, done);
  });

  it(`GET ${endpoint}/:userId - JWT token - expired token`, function(done) {
    const existingAdmin = app.locals.existing.admin;
    let decodedToken = decodeJwtToken(existingAdmin.jwtToken);
    decodedToken.iat = decodedToken.iat - 100;
    decodedToken.exp = decodedToken.iat - 50;
    const invalidJwtToken = createJwtToken(decodedToken);
    testJwtTokenValidation(invalidJwtToken, done);
  });

  it(`GET ${endpoint}/:userId - Params - Invalid userId`, function(done) {
    let existingUser = app.locals.existing.user;
    request(app)
      .get(`${endpoint}/invalid-user-id`)
      .set('Authorization', `Bearer ${existingUser.jwtToken}`)
      .expect(422)
      .expect({ error: 'Invalid user ID.' }, done);
  });

  it(`GET ${endpoint}/:userId - Params - not existed userId`, function(done) {
    let existingUser = app.locals.existing.user;
    request(app)
      .get(`${endpoint}/5e24db1d560ba309f0b0b5a8`)
      .set('Authorization', `Bearer ${existingUser.jwtToken}`)
      .expect(422)
      .expect({ error: 'User ID does not exist.' }, done);
  });

  it(`GET ${endpoint}/:userId - Normal user cannot get user details`, function(done) {
    let existingUser = app.locals.existing.user;
    request(app)
      .get(`${endpoint}/${existingUser._id}`)
      .set('Authorization', `Bearer ${existingUser.jwtToken}`)
      .expect(401)
      .expect({ error: 'Unauthorized action.' }, done);
  });

  const testCanGetUserDetails = (currentUser, done) => {
    let existingRoot = app.locals.existing.root;
    request(app)
      .get(`${endpoint}/${existingRoot._id}`)
      .set('Authorization', `Bearer ${currentUser.jwtToken}`)
      .expect(200)
      .then(res => {
        expect(res.body.user._id).to.be.equal(
          app.locals.existing[[res.body.user.role]]._id.toString()
        );
        expect(res.body.user).to.have.property('createdAt');
        expect(res.body.user).to.have.property('updatedAt');
        expect(res.body.user.provider).to.deep.equal({
          local: {
            userId: app.locals.existing[[res.body.user.role]]._id.toString()
          },
          google: {
            // not have property "accessToken" and "refreshToken"
            userId:
              app.locals.existing[[res.body.user.role]].provider.google.userId,
            picture:
              app.locals.existing[[res.body.user.role]].provider.google.picture
          },
          facebook: {
            // not have property "accessToken" and "refreshToken"
            userId:
              app.locals.existing[[res.body.user.role]].provider.facebook
                .userId,
            picture:
              app.locals.existing[[res.body.user.role]].provider.facebook
                .picture
          }
        });
        expect(res.body.user).to.not.have.property('hashedPassword');
        expect(res.body.user).to.not.have.property('password');
        expect(res.body.user).to.not.have.property('subId');
        expect(res.body.user).to.not.have.property('token');
        expect(res.body.user).to.not.have.property('tokenPurpose');
        expect(res.body.user).to.deep.include(
          _.pick(app.locals.existing[[res.body.user.role]].toObject(), [
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

  it(`GET ${endpoint}/:userId - Admin can get user detail`, function(done) {
    let existingAdmin = app.locals.existing.admin;
    testCanGetUserDetails(existingAdmin, done);
  });

  it(`GET ${endpoint}/:userId - Root can get user detail`, function(done) {
    let existingRoot = app.locals.existing.root;
    testCanGetUserDetails(existingRoot, done);
  });
});

describe('ENDPOINT: PUT /api/users/:userId', function() {
  let endpoint = '/api/users';

  const testJwtTokenValidation = (endpoint, jwtToken, payload, done) => {
    request(app)
      .put(endpoint)
      .set('Authorization', `Bearer ${jwtToken}`)
      .send(payload)
      .expect(401)
      .expect({})
      .then(res => {
        expect(res.text).to.be.equal('Unauthorized');
        done();
      })
      .catch(done);
  };

  it(`PUT ${endpoint}/:userId - JWT token not provided`, function(done) {
    let existingUser = app.locals.existing.user;
    request(app)
      .put(`${endpoint}/${existingUser._id}`)
      .send({ role: 'admin' })
      .expect(401)
      .expect({})
      .then(res => {
        expect(res.text).to.be.equal('Unauthorized');
        done();
      })
      .catch(done);
  });

  it(`PUT ${endpoint}/:userId - JWT token - invalid subId`, function(done) {
    let existingUser = app.locals.existing.user;
    let decodedToken = decodeJwtToken(existingUser.jwtToken);
    decodedToken.sub = 'invalid-sub-id';
    const invalidJwtToken = createJwtToken(decodedToken);
    const payload = { role: 'admin' };
    testJwtTokenValidation(
      `${endpoint}/${existingUser._id}`,
      invalidJwtToken,
      payload,
      done
    );
  });

  it(`PUT ${endpoint} - JWT token - not exist userId`, function(done) {
    let existingUser = app.locals.existing.user;
    let decodedToken = decodeJwtToken(existingUser.jwtToken);
    decodedToken.userId = '5e24db1d560ba309f0b0b5a8';
    const invalidJwtToken = createJwtToken(decodedToken);
    const payload = { role: 'admin' };
    testJwtTokenValidation(
      `${endpoint}/${existingUser._id}`,
      invalidJwtToken,
      payload,
      done
    );
  });

  it(`PUT ${endpoint} - JWT token - expired token`, function(done) {
    let existingUser = app.locals.existing.user;
    let decodedToken = decodeJwtToken(existingUser.jwtToken);
    decodedToken.iat = decodedToken.iat - 100;
    decodedToken.exp = decodedToken.iat - 50;
    const invalidJwtToken = createJwtToken(decodedToken);
    const payload = { role: 'admin' };
    testJwtTokenValidation(
      `${endpoint}/${existingUser._id}`,
      invalidJwtToken,
      payload,
      done
    );
  });

  it(`PUT ${endpoint}/:userId - Params - Invalid userId`, function(done) {
    let existingUser = app.locals.existing.user;
    request(app)
      .put(`${endpoint}/invalid-user-id`)
      .set('Authorization', `Bearer ${existingUser.jwtToken}`)
      .expect(422)
      .expect({ error: 'Invalid user ID.' }, done);
  });

  it(`PUT ${endpoint}/:userId - Params - not existed userId`, function(done) {
    let existingUser = app.locals.existing.user;
    request(app)
      .put(`${endpoint}/5e24db1d560ba309f0b0b5a8`)
      .set('Authorization', `Bearer ${existingUser.jwtToken}`)
      .expect(422)
      .expect({ error: 'User ID does not exist.' }, done);
  });

  const testInvalidPayload = (payload, errorMessage, done) => {
    const currentUser = app.locals.existing.root;
    const targetUser = app.locals.existing.user;
    request(app)
      .put(`${endpoint}/${targetUser._id}`)
      .set('Authorization', `Bearer ${currentUser.jwtToken}`)
      .send(payload)
      .expect(400)
      .expect({ error: errorMessage }, done);
  };

  it(`PUT ${endpoint}/:userId - Payload - Invalid role`, function(done) {
    const payload = { role: 'not-user-admin-or-root' };
    testInvalidPayload(
      payload,
      '"role" must be one of [root, admin, user]',
      done
    );
  });

  it(`PUT ${endpoint}/:userId - Payload - Invalid status`, function(done) {
    const payload = { status: 'not-active-disabled-or-unverifiedEmail' };
    testInvalidPayload(
      payload,
      '"status" must be one of [active, disabled, unverifiedEmail]',
      done
    );
  });

  const testUserCannotUpdateOther = (
    currentUser,
    targetUser,
    payload,
    done
  ) => {
    request(app)
      .put(`${endpoint}/${targetUser._id}`)
      .set('Authorization', `Bearer ${currentUser.jwtToken}`)
      .send(payload)
      .expect(401)
      .expect({ error: 'Unauthorized action.' }, done);
  };

  it(`PUT ${endpoint}/:userId - Normal user cannot update itself and other normal user`, function(done) {
    const currentUser = app.locals.existing.user;
    const targetUser = app.locals.existing.user;
    const payload = { status: 'active' };
    testUserCannotUpdateOther(currentUser, targetUser, payload, done);
  });

  it(`PUT ${endpoint}/:userId - Normal user cannot update admin`, function(done) {
    const currentUser = app.locals.existing.user;
    const targetUser = app.locals.existing.admin;
    const payload = { status: 'active' };
    testUserCannotUpdateOther(currentUser, targetUser, payload, done);
  });

  it(`PUT ${endpoint}/:userId - Normal user cannot update root`, function(done) {
    const currentUser = app.locals.existing.user;
    const targetUser = app.locals.existing.root;
    const payload = { status: 'active' };
    testUserCannotUpdateOther(currentUser, targetUser, payload, done);
  });

  it(`PUT ${endpoint}/:userId - Admin cannot update itself and other admin`, function(done) {
    const currentUser = app.locals.existing.admin;
    const targetUser = app.locals.existing.admin;
    const payload = { status: 'active' };
    testUserCannotUpdateOther(currentUser, targetUser, payload, done);
  });

  it(`PUT ${endpoint}/:userId - Admin cannot update root`, function(done) {
    currentUser = app.locals.existing.admin;
    const targetUser = app.locals.existing.root;
    const payload = { status: 'active' };
    testUserCannotUpdateOther(currentUser, targetUser, payload, done);
  });

  it(`PUT ${endpoint}/:userId - Admin cannot set role = 'admin' to other user`, function(done) {
    currentUser = app.locals.existing.admin;
    const targetUser = app.locals.existing.user;
    const payload = { role: 'admin' };
    testUserCannotUpdateOther(currentUser, targetUser, payload, done);
  });

  it(`PUT ${endpoint}/:userId - Admin cannot set role = 'root' to other user`, function(done) {
    currentUser = app.locals.existing.admin;
    const targetUser = app.locals.existing.user;
    const payload = { role: 'root' };
    testUserCannotUpdateOther(currentUser, targetUser, payload, done);
  });

  it(`PUT ${endpoint}/:userId - Root cannot update root`, function(done) {
    const currentUser = app.locals.existing.root;
    const targetUser = app.locals.existing.root;
    const payload = { status: 'active' };
    testUserCannotUpdateOther(currentUser, targetUser, payload, done);
  });

  it(`PUT ${endpoint}/:userId - Root cannot set role = 'root' to other admin user`, function(done) {
    const currentUser = app.locals.existing.root;
    const targetUser = app.locals.existing.admin;
    const payload = { role: 'root' };
    testUserCannotUpdateOther(currentUser, targetUser, payload, done);
  });

  it(`PUT ${endpoint}/:userId - Root cannot set role = 'root' to other normal user`, function(done) {
    const currentUser = app.locals.existing.root;
    const targetUser = app.locals.existing.user;
    const payload = { role: 'root' };
    testUserCannotUpdateOther(currentUser, targetUser, payload, done);
  });

  const testUserCanUpdateOther = (currentUser, targetUser, newRole, done) => {
    const User = mongoose.model('User');
    const payload = {
      _id: '5e24db1d560ba309f0b0b5a8',
      username: 'newusername',
      email: 'new-email@tdev.app',
      status: 'disabled', // this will be updated
      firstName: 'new-first-name',
      lastName: 'new-last-name',
      password: 'new-password',
      role: newRole, // this will be updated
      subId: '5e24db1d560ba309f0b0b5a8',
      permissions: {
        // this will be updated
        debug: true
      },
      provider: {
        // this will be updated
        google: {
          userId: 'new-google-user-id',
          picture: 'new-google-avatar-url',
          accessToken: 'new-google-access-token',
          refreshToken: 'new-google-refresh-token'
        }
      },
      createdAt: '2020-01-20T20:44:45.634Z',
      updatedAt: '2020-01-22T01:28:09.783Z'
    };
    request(app)
      .put(`${endpoint}/${targetUser._id}`)
      .set('Authorization', `Bearer ${currentUser.jwtToken}`)
      .send(payload)
      .expect(200)
      .expect({
        success: true,
        updatedFields: ['status', 'role', 'permissions']
      })
      .then(res => User.findById(targetUser._id))
      .then(updatedUser => {
        expect(updatedUser.toObject()).to.deep.include(
          _.pick(targetUser.toObject(), [
            '_id',
            'username',
            'email',
            'firstName',
            'lastName',
            'createdAt',
            'token',
            'tokenPurpose',
            'subId',
            'hashedPassword',
            'provider'
          ])
        );
        expect(updatedUser.status).to.be.equal(payload.status);
        expect(updatedUser.role).to.be.equal(payload.role);
        expect(updatedUser.permissions).to.deep.include(payload.permissions);
        done();
      })
      .catch(done);
  };

  it(`PUT ${endpoint}/:userId - Admin can update normal user (only update status, role and permissions)`, function(done) {
    const currentUser = app.locals.existing.admin;
    const targetUser = app.locals.existing.user;
    testUserCanUpdateOther(currentUser, targetUser, 'user', done);
  });

  it(`PUT ${endpoint}/:userId - Root can update admin (only update status, role and permissions)`, function(done) {
    const currentUser = app.locals.existing.root;
    const targetUser = app.locals.existing.admin;
    testUserCanUpdateOther(currentUser, targetUser, 'user', done);
  });

  it(`PUT ${endpoint}/:userId - Root can update normal admin (only update status, role and permissions)`, function(done) {
    const currentUser = app.locals.existing.root;
    const targetUser = app.locals.existing.user;
    testUserCanUpdateOther(currentUser, targetUser, 'admin', done);
  });
});

describe('ENDPOINT: DELETE /api/users/:userId', function() {
  let endpoint = '/api/users';

  const testJwtTokenValidation = (endpoint, jwtToken, done) => {
    request(app)
      .delete(endpoint)
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(401)
      .expect({})
      .then(res => {
        expect(res.text).to.be.equal('Unauthorized');
        done();
      })
      .catch(done);
  };

  it(`DELETE ${endpoint}/:userId - JWT token not provided`, function(done) {
    let existingUser = app.locals.existing.user;
    request(app)
      .delete(`${endpoint}/${existingUser._id}`)
      .expect(401)
      .expect({})
      .then(res => {
        expect(res.text).to.be.equal('Unauthorized');
        done();
      })
      .catch(done);
  });

  it(`DELETE ${endpoint}/:userId - JWT token - invalid subId`, function(done) {
    let existingUser = app.locals.existing.user;
    let decodedToken = decodeJwtToken(existingUser.jwtToken);
    decodedToken.sub = 'invalid-sub-id';
    const invalidJwtToken = createJwtToken(decodedToken);
    testJwtTokenValidation(
      `${endpoint}/${existingUser._id}`,
      invalidJwtToken,
      done
    );
  });

  it(`DELETE ${endpoint} - JWT token - not exist userId`, function(done) {
    let existingUser = app.locals.existing.user;
    let decodedToken = decodeJwtToken(existingUser.jwtToken);
    decodedToken.userId = '5e24db1d560ba309f0b0b5a8';
    const invalidJwtToken = createJwtToken(decodedToken);
    testJwtTokenValidation(
      `${endpoint}/${existingUser._id}`,
      invalidJwtToken,
      done
    );
  });

  it(`DELETE ${endpoint} - JWT token - expired token`, function(done) {
    let existingUser = app.locals.existing.user;
    let decodedToken = decodeJwtToken(existingUser.jwtToken);
    decodedToken.iat = decodedToken.iat - 100;
    decodedToken.exp = decodedToken.iat - 50;
    const invalidJwtToken = createJwtToken(decodedToken);
    testJwtTokenValidation(
      `${endpoint}/${existingUser._id}`,
      invalidJwtToken,
      done
    );
  });

  it(`DELETE ${endpoint}/:userId - Params - Invalid userId`, function(done) {
    let existingUser = app.locals.existing.user;
    request(app)
      .delete(`${endpoint}/invalid-user-id`)
      .set('Authorization', `Bearer ${existingUser.jwtToken}`)
      .expect(422)
      .expect({ error: 'Invalid user ID.' }, done);
  });

  it(`DELETE ${endpoint}/:userId - Params - not existed userId`, function(done) {
    let existingUser = app.locals.existing.user;
    request(app)
      .delete(`${endpoint}/5e24db1d560ba309f0b0b5a8`)
      .set('Authorization', `Bearer ${existingUser.jwtToken}`)
      .expect(422)
      .expect({ error: 'User ID does not exist.' }, done);
  });

  const testUserCannotDeleteOther = (currentUser, targetUser, done) => {
    request(app)
      .delete(`${endpoint}/${targetUser._id}`)
      .set('Authorization', `Bearer ${currentUser.jwtToken}`)
      .expect(401)
      .expect({ error: 'Unauthorized action.' }, done);
  };

  it(`DELETE ${endpoint}/:userId - Normal user cannot delete itself and other normal user`, function(done) {
    const currentUser = app.locals.existing.user;
    const targetUser = app.locals.existing.user;
    testUserCannotDeleteOther(currentUser, targetUser, done);
  });

  it(`DELETE ${endpoint}/:userId - Normal user cannot delete admin`, function(done) {
    const currentUser = app.locals.existing.user;
    const targetUser = app.locals.existing.admin;
    testUserCannotDeleteOther(currentUser, targetUser, done);
  });

  it(`DELETE ${endpoint}/:userId - Normal user cannot delete root`, function(done) {
    const currentUser = app.locals.existing.user;
    const targetUser = app.locals.existing.root;
    testUserCannotDeleteOther(currentUser, targetUser, done);
  });

  it(`DELETE ${endpoint}/:userId - Admin cannot delete itself and other admin`, function(done) {
    const currentUser = app.locals.existing.admin;
    const targetUser = app.locals.existing.admin;
    testUserCannotDeleteOther(currentUser, targetUser, done);
  });

  it(`DELETE ${endpoint}/:userId - Admin cannot delete root`, function(done) {
    currentUser = app.locals.existing.admin;
    const targetUser = app.locals.existing.root;
    testUserCannotDeleteOther(currentUser, targetUser, done);
  });

  it(`DELETE ${endpoint}/:userId - Root cannot delete root`, function(done) {
    const currentUser = app.locals.existing.root;
    const targetUser = app.locals.existing.root;
    testUserCannotDeleteOther(currentUser, targetUser, done);
  });

  const testUserCanDeleteOther = (currentUser, targetUser, done) => {
    const User = mongoose.model('User');
    request(app)
      .delete(`${endpoint}/${targetUser._id}`)
      .set('Authorization', `Bearer ${currentUser.jwtToken}`)
      .expect(200)
      .expect({
        success: true,
        message: 'User deleted'
      })
      .then(res => User.findById(targetUser._id))
      .then(user => {
        expect(user).to.be.null;
        done();
      })
      .catch(done);
  };

  it(`DELETE ${endpoint}/:userId - Admin can delete normal user`, function(done) {
    const currentUser = app.locals.existing.admin;
    const targetUser = app.locals.existing.user;
    testUserCanDeleteOther(currentUser, targetUser, done);
  });

  it(`DELETE ${endpoint}/:userId - Root can delete admin`, function(done) {
    const currentUser = app.locals.existing.root;
    const targetUser = app.locals.existing.admin;
    testUserCanDeleteOther(currentUser, targetUser, done);
  });

  it(`DELETE ${endpoint}/:userId - Root can delete normal user`, function(done) {
    const currentUser = app.locals.existing.root;
    const targetUser = app.locals.existing.user;
    testUserCanDeleteOther(currentUser, targetUser, done);
  });
});
