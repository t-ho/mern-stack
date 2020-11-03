import env from 'react-native-config';

if (env.REACT_NATIVE_ENV === 'production') {
  module.exports = require('./configureStore.prod');
} else {
  module.exports = require('./configureStore.dev');
}
