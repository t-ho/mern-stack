const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const config = require('../config');

// Define Schema
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    lowercase: true,
    required: [true, 'Email is required']
  },
  hashedPassword: {
    type: String,
    required: true
  }
});

userSchema
  .virtual('password')
  .get(function() {
    return undefined;
  })
  .set(function(password) {
    this.hashedPassword = password;
  });

userSchema.pre('save', function(next) {
  const user = this;
  const saltRounds = 10;
  bcrypt
    .hash(user.hashedPassword, saltRounds)
    .then(hash => {
      user.hashedPassword = hash;
      next();
    })
    .catch(next);
});

userSchema.methods.comparePassword = function(candidatePassword) {
  const user = this;
  return bcrypt.compare(candidatePassword, user.hashedPassword);
};

userSchema.methods.generateJwtToken = function() {
  const user = this;
  return jwt.sign({ sub: user._id }, config.jwt.secret, {
    algorithm: config.jwt.algorithm
  });
};

mongoose.model('User', userSchema);
