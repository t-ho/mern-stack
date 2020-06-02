[![CI Testing](https://github.com/t-ho/mern-stack/workflows/CI%20Testing/badge.svg?branch=master)](https://github.com/t-ho/mern-stack/actions)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![license](https://img.shields.io/github/license/t-ho/mern-stack)](https://github.com/t-ho/mern-stack/blob/master/LICENSE)

# MERN Stack

### MongoDB - Express - React - Redux - React Native - NodeJS

MERN stack is intended to provide a starting point for building full-stack JavaScript applications, including dynamic web and mobile apps. The stack is made of MongoDB, Express, React, Redux, React Native and NodeJS.

[![mern-workflow](https://raw.githubusercontent.com/t-ho/mern-stack/assets/assets/mern-workflow.gif)](https://github.com/t-ho/mern-stack)

## Server API documentation

The full documentation of the server API can be found [here](https://tdev.app/mern-stack/server)

## Getting started

### 1. Install `expo-cli`

To develop the mobile app, install `expo-cli` globally:

```bash
npm install -g expo-cli
```

### 2. Clone the `mern-stack` repository

```bash
git clone https://github.com/t-ho/mern-stack.git
cd mern-stack
cp .env.example .env
cp client/.env.example client/.env
cp mobile/.env.example mobile/.env
# Edit .env files to meet your requirements
```

### 3. Install package dependencies

In the `root` directory, run:

```bash
npm install
```

### 4. Start development servers

To start `server`, `client`, and `mobile`, run:

```bash
# In the root directory (mern):
npm start
# Server API is running at http://localhost:8080
# Web client is running at http://localhost:3000
# Mobile - Expo DevTools is running at http://localhost:19002
```

**NOTE:**

- **For the sake of simplicity, we use free service [ngrok](https://ngrok.com/) to create a public API URL for mobile development. The downside of this approach is that the public URL is only available for 8 hours, so we need to restart the npm process every 8 hours.**
- **After 8 hours, the `mobile` process will be terminated, and a warning message will be displayed in your terminal to remind you to restart npm process.**

To restart npm process (_If you don't start the mobile development process, ignore this step_):

```bash
# In your current terminal, press Ctrl + C to exit. Then run
npm start # start server, client and mobile dev process
# or
npm run server:mobile # start server and mobile dev process
```

Or to start `server` and `client` only, run:

```bash
# In the root directory (mern):
npm run server:client
# Server API is running at http://localhost:8080
# Web client is running at http://localhost:3000
```

Or to start `server` and `mobile` only, run:

```bash
# In the root directory (mern):
npm run server:mobile
# Server API is running at http://localhost:8080
# Mobile - Expo DevTools is running at http://localhost:19002
```

### 5. Run the mobile app on your mobile devices

- On iOS devices, install [Expo Client](https://apps.apple.com/us/app/expo-client/id982107779)
- On Android devices, install [Expo](https://play.google.com/store/apps/details?id=host.exp.exponent&hl=en_US)
- Then scan QR code displayed on your terminal to launch the app.

### 6. Debug mobile app with `react-native-debugger`

- Install [react-native-debugger](https://github.com/jhen0409/react-native-debugger/releases).
- Open React Native Debugger window instance with port `19001` (`Debugger` > `New Window`).
- Enable [Debugging mode](https://facebook.github.io/react-native/docs/debugging.html#accessing-the-in-app-developer-menu) on your iOS simulator or Android emulator.

### 7. Debug web app with `Redux DevTools`

- On Chrome, install [redux-devtools-extension](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd)
- On Firefox, install [redux-devtools-add-ons](https://addons.mozilla.org/en-US/firefox/addon/reduxdevtools/)

## Testing

In the root (`mern-stack`) directory, run:

```bash
npm run test
```

Testing frameworks:

- Server: [mocha](https://mochajs.org/) - [chai](https://www.chaijs.com/) - [supertest](https://github.com/visionmedia/supertest)
- Web-client: [jest](https://jestjs.io/)
- Mobile:
