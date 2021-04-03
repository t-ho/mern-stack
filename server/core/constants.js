const ENV_DEV = 'development';
const ENV_PROD = 'production';
const ENV_TEST = 'test';

const ERROR_MESSAGE_CURRENT_PASSWORD = {
  'string.empty': 'Current Password cannot be empty',
  'string.min': 'Current Password must be at least 8 characters',
  'any.required': 'Current Password is required',
};
const ERROR_MESSAGE_EMAIL = {
  'string.empty': 'Email cannot be empty',
  'string.email': 'Email is invalid',
  'any.required': 'Email is required',
};
const ERROR_MESSAGE_PASSWORD = {
  'string.empty': 'Password cannot be empty',
  'string.min': 'Password must be at least 8 characters',
  'any.required': 'Password is required',
};
const ERROR_MESSAGE_USERNAME = {
  'string.empty': 'Username cannot be empty',
  'string.pattern.base':
    'Username must be between 4 to 30 characters and may contain only alphanumeric chacracters, hyphen, dot or underscore',
  'any.required': 'Username is required',
};

const MORGAN_FORMAT_COMBINED = 'combined';
const MORGAN_FORMAT_COMMON = 'common';
const MORGAN_FORMAT_DEV = 'dev';
const MORGAN_FORMAT_SHORT = 'short';
const MORGAN_FORMAT_TINY = 'tiny';

const PROVIDER_APPLE = 'apple';
const PROVIDER_FACEBOOK = 'facebook';
const PROVIDER_GOOGLE = 'google';
const PROVIDER_LOCAL = 'local';

const ROLE_ADMIN = 'admin';
const ROLE_ROOT = 'root';
const ROLE_USER = 'user';

const STATUS_ACTIVE = 'active';
const STATUS_DISABLED = 'disabled';
const STATUS_UNVERIFIED_EMAIL = 'unverified-email';

const TOKEN_PURPOSE_RESET_PASSWORD = 'reset-password';
const TOKEN_PURPOSE_VERIFY_EMAIL = 'verify-email';

module.exports = {
  ENV_DEV,
  ENV_PROD,
  ENV_TEST,

  ERROR_MESSAGE_CURRENT_PASSWORD,
  ERROR_MESSAGE_EMAIL,
  ERROR_MESSAGE_PASSWORD,
  ERROR_MESSAGE_USERNAME,

  MORGAN_FORMAT_COMBINED,
  MORGAN_FORMAT_COMMON,
  MORGAN_FORMAT_DEV,
  MORGAN_FORMAT_SHORT,
  MORGAN_FORMAT_TINY,

  PROVIDER_APPLE,
  PROVIDER_FACEBOOK,
  PROVIDER_GOOGLE,
  PROVIDER_LOCAL,

  ROLE_ADMIN,
  ROLE_ROOT,
  ROLE_USER,

  STATUS_ACTIVE,
  STATUS_DISABLED,
  STATUS_UNVERIFIED_EMAIL,

  TOKEN_PURPOSE_RESET_PASSWORD,
  TOKEN_PURPOSE_VERIFY_EMAIL,
};
