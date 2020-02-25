const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const uuidv4 = require('uuid/v4');
const config = require('../config');

// By defaulf, we don't store oauth access_token and refresh_token
const providerDataSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: [true, 'Provider userId is required']
  },
  accessToken: {
    type: String
  },
  refreshToken: {
    type: String
  },
  picture: {
    type: String
  }
});

// Define Schema
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
      required: [true, 'Username is required'],
      match: [
        /^[a-zA-Z0-9.\-_]{4,30}$/,
        'Must be between 4 to 30 characters and may contain only alphanumeric chacracters, hyphen, dot or underscore'
      ]
    },
    email: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
      required: [true, 'Email is required'],
      match: [
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        'Invalid email'
      ]
    },
    // Do NOT set directly, call user.setPasswordAsync(password)
    hashedPassword: {
      type: String
    },
    // subId is used to validate JWT token.
    // Do NOT set directly, call user.setSubId().
    subId: {
      type: String,
      unique: true
    },
    firstName: { type: String, trim: true },
    lastName: { type: String, trim: true },
    status: {
      type: String,
      enum: ['active', 'disabled', 'unverifiedEmail'],
      default: 'active',
      index: true
    },
    role: {
      type: String,
      enum: ['user', 'admin', 'root'],
      default: 'user',
      index: true
    },
    // The permissions field will allow a normal user to perform
    // admin-like actions.
    // By default, root and admin can do any thing (permissions field is ignored).
    // So, call user.can(action) to determine permission on Collections.
    // The rules for updating and deleting users are implemented in createCan middleware.

    // NOTE: readUsers, insertUsers, updateUsers and deleteUsers are not listed
    // here which means that normal users DO NOT have any permissions on User
    // Collection at all.
    permissions: {
      debug: { type: Boolean, default: false }
      // Example: permissions for Posts collection should be defined as below:
      // readPosts: { type: Boolean, default: false },
      // insertPosts: { type: Boolean, default: false },
      // updatePosts: { type: Boolean, default: false },
      // deletePosts: { type: Boolean, default: false }
    },
    // token for veryfication email or reset password purpose, NOT JWT token
    // Do NOT set directly, call user.setToken(tokenPurpose) user.clearToken()
    // to set and clear token and tokenPurpose
    token: { type: String, index: true },
    tokenPurpose: { type: String, enum: ['verifyEmail', 'resetPassword'] },
    provider: {
      local: {
        type: providerDataSchema
      },
      google: {
        type: providerDataSchema
      },
      facebook: {
        type: providerDataSchema
      }
    }
  },
  { timestamps: true }
);

userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

/**
 * @returns {object} The user profile object without sensitive info such as hashed password
 */
userSchema.methods.toProfileJson = function() {
  const user = this.toObject();
  user.provider = _.mapValues(user.provider, p => {
    return _.pick(p, ['userId', 'picture']);
  });
  return _.pick(user, [
    '_id',
    'username',
    'email',
    'status',
    'firstName',
    'lastName',
    'role',
    'permissions',
    'provider',
    'createdAt',
    'updatedAt'
  ]);
};

/**
 * @returns {object} The user public profile object
 */
userSchema.methods.toPublicProfileJson = function() {
  return _.pick(this, [
    '_id',
    'username',
    'firstName',
    'lastName',
    'createdAt'
  ]);
};

/**
 * Set subId to this user.
 * Invalidate all existing JWT tokens
 *
 */
userSchema.methods.setSubId = function() {
  this.subId = new mongoose.Types.ObjectId().toHexString();
};

/**
 * Set password to this user
 * The password will be hashed and assigned to hashedPassword field
 *
 * Call this function when updating the user password
 *
 * @param {Promise} password Resolve with null value
 */
userSchema.methods.setPasswordAsync = function(password) {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds).then(hash => {
    this.hashedPassword = hash;
  });
};

/**
 * Compare candidate password with the stored one
 *
 * @returns {Promise} Resolve with a boolean value
 */
userSchema.methods.comparePasswordAsync = function(candidatePassword) {
  if (!this.hashedPassword) {
    return Promise.resolve(false);
  }
  return bcrypt.compare(candidatePassword, this.hashedPassword);
};

/**
 * Generate JWT token for authentication
 *
 * @returns {object} An object contains JWT token and expiresAt (seconds) property
 */
userSchema.methods.generateJwtToken = function() {
  const iat = Math.floor(Date.now() / 1000);
  const expiresAt = iat + config.jwt.expiresIn;
  const token = jwt.sign(
    { sub: this.subId, userId: this._id, iat },
    config.jwt.secret,
    {
      algorithm: config.jwt.algorithm,
      expiresIn: config.jwt.expiresIn // seconds
    }
  );
  return { token, expiresAt };
};

/**
 * Set token and token purpose field based on given token purpose
 *
 * @param {string} purpose The purpose of the token.
 */
userSchema.methods.setToken = function(purpose) {
  this.token = uuidv4();
  this.tokenPurpose = purpose;
};

/**
 * Clear token and token purpose field
 */
userSchema.methods.clearToken = function() {
  this.token = undefined;
  this.tokenPurpose = undefined;
};

/**
 * Determine whether this user has a permission to do given action
 * based on user role and user permissions
 *
 * @param {string} action The action such as debug, deleteUsers,...
 * @returns {boolean} True if this user has permission to perform the given action.
 * Otherwise, false
 */
userSchema.methods.can = function(action) {
  if (this.role === 'admin' || this.role === 'root') {
    return true;
  }
  return !!this.permissions[action];
};

mongoose.model('User', userSchema);
