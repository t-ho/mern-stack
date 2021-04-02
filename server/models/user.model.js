const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const { v4: uuidv4 } = require('uuid');
const config = require('../config');
const constants = require('../core/constants');

// By defaulf, we don't store oauth accessToken and refreshToken
const providerDataSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: [true, 'Provider userId is required'],
  },
  accessToken: {
    type: String,
  },
  refreshToken: {
    type: String,
  },
  picture: {
    type: String,
  },
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
        'Must be between 4 to 30 characters and may contain only alphanumeric chacracters, hyphen, dot or underscore',
      ],
    },
    email: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
      required: [true, 'Email is required'],
      match: [
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        'Invalid email',
      ],
    },
    // Do NOT set directly, call user.setPasswordAsync(password)
    hashedPassword: {
      type: String,
    },
    // subId is used to validate JWT token.
    // Do NOT set directly, call user.setSubId().
    subId: {
      type: String,
      unique: true,
    },
    firstName: { type: String, trim: true },
    lastName: { type: String, trim: true },
    status: {
      type: String,
      enum: [
        constants.STATUS_ACTIVE,
        constants.STATUS_DISABLED,
        constants.STATUS_UNVERIFIED_EMAIL,
      ],
      default: constants.STATUS_ACTIVE,
      index: true,
    },
    role: {
      type: String,
      enum: [constants.ROLE_ADMIN, constants.ROLE_ROOT, constants.ROLE_USER],
      default: constants.ROLE_USER,
      index: true,
    },
    // The permissions field will allow a normal user to perform
    // admin-like actions.
    // By default, root and admin can do any thing (permissions field is ignored).
    // So, call user.hasPermission(permission) to determine the permission.
    // The rules for updating and deleting are implemented in createXAuthorizationMiddleware middleware.
    permissions: {
      userInsert: { type: Boolean, default: false }, // Insert only
      userModify: { type: Boolean, default: false }, // Update and Delete
      userRead: { type: Boolean, default: false }, // Read only
      // Example: permissions for ExamplePost model should be defined as below:
      // examplePostInsert: { type: Boolean, default: false }, // Insert only
      // examplePostModify: { type: Boolean, default: false }, // Update and Delete
      // examplePostRead: { type: Boolean, default: true }, // Read only
    },
    // token for veryfication email or reset password purpose, NOT JWT token
    // Do NOT set directly, call user.setToken(tokenPurpose) user.clearToken()
    // to set and clear token and tokenPurpose
    token: { type: String, index: true },
    tokenPurpose: {
      type: String,
      enum: [
        constants.TOKEN_PURPOSE_VERIFY_EMAIL,
        constants.TOKEN_PURPOSE_RESET_PASSWORD,
      ],
    },
    provider: {
      apple: {
        type: providerDataSchema,
      },
      facebook: {
        type: providerDataSchema,
      },
      google: {
        type: providerDataSchema,
      },
      local: {
        type: providerDataSchema,
      },
    },
  },
  { timestamps: true }
);

userSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

/**
 * @returns {object} The user profile object without sensitive info such as hashed password
 */
userSchema.methods.toJsonFor = function (user) {
  const userObj = this.toObject();
  if (user && (user.hasPermission('userRead') || user.id === this.id)) {
    const provider = _.mapValues(userObj.provider, (p) => {
      return _.pick(p, ['userId', 'picture']);
    });
    return {
      id: userObj._id,
      username: userObj.username,
      email: userObj.email,
      status: userObj.status,
      firstName: userObj.firstName,
      lastName: userObj.lastName,
      role: userObj.role,
      permissions: userObj.permissions,
      provider,
      createdAt: userObj.createdAt,
      updatedAt: userObj.updatedAt,
    };
  } else {
    // public profile
    return {
      id: userObj._id,
      username: userObj.username,
      firstName: userObj.firstName,
      lastName: userObj.lastName,
      createdAt: userObj.createdAt,
    };
  }
};

/**
 * Set subId to this user.
 * Invalidate all existing JWT tokens
 *
 */
userSchema.methods.setSubId = function () {
  this.subId = new mongoose.Types.ObjectId().toHexString();
};

/**
 * Set password to this user
 * The password will be hashed and assigned to hashedPassword field
 *
 * Call this function when updating the user password
 *
 * @param {*} password
 *
 * @returns {Promise} Resolve with null value
 */
userSchema.methods.setPasswordAsync = function (password) {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds).then((hash) => {
    this.hashedPassword = hash;
  });
};

/**
 * Compare candidate password with the stored one
 *
 * @param {string} candidatePassword The candidate password
 *
 * @returns {Promise} Resolve with a boolean value
 */
userSchema.methods.comparePasswordAsync = function (candidatePassword) {
  if (!this.hashedPassword) {
    return Promise.resolve(false);
  }
  return bcrypt.compare(candidatePassword, this.hashedPassword);
};

/**
 * Generate JWT token for authentication
 *
 * @param {string} provider Default value: 'local'
 *
 * @returns {object} An object contains JWT token and expiresAt (seconds) property
 */
userSchema.methods.generateJwtToken = function (
  provider = constants.PROVIDER_LOCAL
) {
  const iat = Math.floor(Date.now() / 1000);
  const expiresAt = iat + config.jwt.expiresIn;
  const token = jwt.sign(
    { sub: this.subId, userId: this._id, iat, provider },
    config.jwt.secret,
    {
      algorithm: config.jwt.algorithm,
      expiresIn: config.jwt.expiresIn, // seconds
    }
  );
  return { token, expiresAt };
};

/**
 * Set token and token purpose field based on given token purpose
 *
 * @param {string} purpose The purpose of the token.
 */
userSchema.methods.setToken = function (purpose) {
  this.token = uuidv4();
  this.tokenPurpose = purpose;
};

/**
 * Clear token and token purpose field
 */
userSchema.methods.clearToken = function () {
  this.token = undefined;
  this.tokenPurpose = undefined;
};

/**
 * Determine whether this user has a permission
 * based on user role and user's permissions properties
 *
 * @param {string} permission A permission
 * @returns {boolean} true if this user has the given permission.
 * Otherwise, false
 */
userSchema.methods.hasPermission = function (permission) {
  if (this.role === constants.ROLE_ADMIN || this.role === constants.ROLE_ROOT) {
    return true;
  }
  return !!this.permissions[permission];
};

mongoose.model('User', userSchema);
