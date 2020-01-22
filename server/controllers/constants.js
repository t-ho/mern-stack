const EMAIL_ERROR_MESSAGES = {
  'string.empty': 'Email cannot be empty.',
  'string.email': 'Email is invalid.',
  'any.required': 'Email is required.'
};

const PASSWORD_ERROR_MESSAGES = {
  'string.empty': 'Password cannot be empty.',
  'string.min': 'Password must be at least 8 characters.',
  'any.required': 'Password is required.'
};

const USERNAME_ERROR_MESSAGE = {
  'string.empty': 'Username cannot be empty.',
  'string.pattern.base':
    'Username must be between 4 to 30 characters and may contain only alphanumeric chacracters, hyphen, dot or underscore.',
  'any.required': 'Username is required.'
};

module.exports = {
  EMAIL_ERROR_MESSAGES,
  PASSWORD_ERROR_MESSAGES,
  USERNAME_ERROR_MESSAGE
};
