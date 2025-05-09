[![CI Testing](https://github.com/t-ho/mern-stack/workflows/CI%20Testing/badge.svg?branch=master)](https://github.com/t-ho/mern-stack/actions)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![license](https://img.shields.io/github/license/t-ho/mern-stack)](https://github.com/t-ho/mern-stack/blob/master/LICENSE)

<p align="center"><a href="https://github.com/t-ho/mern-stack"><img alt="mern-logo" width="360" src="https://raw.githubusercontent.com/t-ho/mern-stack/assets/assets/mern-logo.png"/></a></p>

# MERN Stack with Docker

### MongoDB - Express - React - Redux - React Native - NodeJS

MERN stack is intended to provide a starting point for building full-stack JavaScript applications, including dynamic web and mobile apps. The stack is made of MongoDB, Express, React, Redux, React Native and NodeJS.

[![mern-workflow](https://raw.githubusercontent.com/t-ho/mern-stack/assets/assets/mern-workflow.gif)](https://github.com/t-ho/mern-stack)

## Demo

- Web app [demo](https://mernstack.tdev.app)
- Mobile app [demo](https://expo.io/@t-ho/mern-stack)
- Dummy accounts:
  - email: `admin@tdev.app` - password: `password`
  - email: `user@tdev.app` - password: `password`

## Project Breakdown

### 1. API Server

**NOTE: The full API documentation can be found [here](https://tdev.app/mern-stack/server)**

- Directory `server`
- Todo:
  - [x] Authentication system - [passport](https://www.npmjs.com/package/passport)
    - [x] Sign up - [bcrypt](https://www.npmjs.com/package/bcrypt)
    - [x] Local login - [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) - [passport-jwt](https://www.npmjs.com/package/passport-jwt)
    - [x] Apple login - [@nicokaiser/passport-apple](https://www.npmjs.com/package/@nicokaiser/passport-apple)
    - [x] Facebook login - [passport-facebook-token](https://www.npmjs.com/package/passport-facebook-token)
    - [x] Google login - [passport-google-id-token](https://www.npmjs.com/package/passport-google-id-token)
    - [x] Email verification
    - [x] Password reset email
  - [x] Authorization system
    - [x] Role-based access control
    - [x] Principle of least privilege
  - [x] User management - CRUD operations
  - [x] Input validation and sanitization - [joi](https://www.npmjs.com/package/joi)
  - [x] Integration testing - [mocha](https://www.npmjs.com/package/mocha) - [chai](https://www.npmjs.com/package/chai) - [supertest](https://www.npmjs.com/package/supertest)
  - [x] Docker support - [node:lts-buster](https://hub.docker.com/_/node)
    - [x] Dev mode - See [server/Dockerfile](https://github.com/t-ho/mern-stack/blob/master/server/Dockerfile)
    - [x] Prod mode - See [server/Dockerfile.prod](https://github.com/t-ho/mern-stack/blob/master/server/Dockerfile.prod)

### 2. React Client

- Directory `client`
- Created by using [create-react-app](https://www.npmjs.com/package/create-react-app)
- Todo:
  - [x] Redux store - [react-redux](https://www.npmjs.com/package/react-redux)
  - [x] Redux form - [redux-form](https://redux-form.com/8.3.0). NOTE: Migrate to [formik](https://jaredpalmer.com/formik) soon
  - [x] Router - [react-router-dom](https://www.npmjs.com/package/react-router-dom) - [connected-react-router](https://www.npmjs.com/package/connected-react-router)
  - [x] Material design - [Material-UI](https://material-ui.com)
  - [ ] Authentication pages
    - [x] Sign up page
    - [x] Sign in page with email, Facebook or Google account
    - [x] Request password reset email page
    - [x] Request verification email page
    - [x] Reset password page
    - [ ] Profile page
  - [ ] User management pages
    - [ ] User list page
    - [ ] User edit page
  - [x] Docker support - [node:lts-buster](https://hub.docker.com/_/node) - [nginx:stable-alpine](https://hub.docker.com/_/nginx)
    - [x] Dev mode - See [client/Dockerfile](https://github.com/t-ho/mern-stack/blob/master/client/Dockerfile)
    - [x] Prod mode - See [client/Dockerfile.prod](https://github.com/t-ho/mern-stack/blob/master/client/Dockerfile.prod)

### 3. React Native - Mobile

- Directory `mobile`
- Created by using [react-native-cli](https://github.com/react-native-community/cli). If you want to use Expo, please check out [expo](https://github.com/t-ho/mern-stack/tree/expo) branch and see docs [here](https://github.com/t-ho/mern-stack/blob/expo/README.md)
- Todo:
  - [x] Redux store - [react-redux](https://www.npmjs.com/package/react-redux)
  - [x] Router - [react-navigation](https://reactnavigation.org)
  - [x] Material design - [react-native-paper](https://www.npmjs.com/package/react-native-paper)
  - [ ] Authentication screens
    - [x] Sign up screen
    - [x] Sign in screen with email, Facebook or Google account
    - [x] Request password reset email screen
    - [x] Request verification email screen
    - [ ] Settings screen

### 4. Nginx Proxy

- Directory `nginx-proxy`
- Todo:
  - [x] Reverse proxy server - [nginx:stable](https://hub.docker.com/_/nginx)
    - [x] Dev mode - See [nginx-proxy/Dockerfile](https://github.com/t-ho/mern-stack/blob/master/nginx-proxy/Dockerfile)
    - [x] Prod mode - See [nginx-proxy/Dockerfile.prod](https://github.com/t-ho/mern-stack/blob/master/nginx-proxy/Dockerfile.prod)
      - [x] Install and auto-renew SSL certificate
      - [x] Force all HTTP traffic (domain name and IP address) to HTTPS
      - [x] Use recommended configuration - [server-configs-nginx](https://github.com/h5bp/server-configs-nginx)
  - [x] Configuration can be done easily by modifying the `.env` file

### 5. CI and CD

- Directory `.github/workflows`
- Todo:
  - [x] Testing workflow
  - [x] Building and deploying workflow

## Getting started

### 1. Clone the `mern-stack` repository

**If you want to use Expo for developing mobile app, please check out the [expo](https://github.com/t-ho/mern-stack/tree/expo) branch and see instructions [here](https://github.com/t-ho/mern-stack/blob/expo/README.md)**

```bash
git clone https://github.com/t-ho/mern-stack.git
cd mern-stack
cp .env.example .env
cp client/.env.example client/.env
cp mobile/.env.example mobile/.env
# Edit all three .env files to meet your requirements
```

### 2. Install package dependencies

In the `root` directory, run:

```bash
yarn install
```

### 3. Start development servers

To start `server`, `client`, and `mobile`, run:

```bash
# In the root directory (mern):
yarn start
# Server API is running at http://localhost:SERVER_PORT (http://localhost:8861 by default)
# Web client is running at http://localhost:PORT (http://localhost:3000 by default)
# Mobile - Expo DevTools is running at http://localhost:19002
```

**NOTE:**

- **For the sake of simplicity, we use free service [ngrok](https://ngrok.com/) to create a public API URL for mobile development. The downside of this approach is that the public URL is only available for 8 hours, so we need to restart the npm process every 8 hours.**
- **After 8 hours, the `mobile` process will be terminated, and a warning message will be displayed in your terminal to remind you to restart npm process.**

To restart yarn process (_If you don't start the mobile development process, ignore this step_):

```bash
# In your current terminal, press Ctrl + C to exit. Then run
yarn start # start server, client and mobile dev process
# or
yarn run server:mobile # start server and mobile dev process
```

Or to start `server` and `client` only, run:

```bash
# In the root directory (mern):
yarn run server:client
# Server API is running at http://localhost:SERVER_PORT (http://localhost:8861 by default)
# Web client is running at http://localhost:PORT (http://localhost:3000 by default)
```

Or to start `server` and `mobile` only, run:

```bash
# In the root directory (mern):
yarn run server:mobile
# Server API is running at http://localhost:SERVER_PORT (http://localhost:8861 by default)
```

### 4. Run the mobile app in your emulator/simulator

```bash
cd mobile
npx react-native run-android
# or
npx react-native run-ios
```

### 5. Run the mobile app on your mobile devices

- Please read the documenatation [here](https://reactnative.dev/docs/running-on-device)

### 6. Debug mobile app with `react-native-debugger`

- Install [react-native-debugger](https://github.com/jhen0409/react-native-debugger/releases).
- Open React Native Debugger window instance with port `19001` (`Debugger` > `New Window`).
- Enable [Debugging mode](https://facebook.github.io/react-native/docs/debugging.html#accessing-the-in-app-developer-menu) on your iOS simulator or Android emulator.

### 7. Debug web app with `Redux DevTools`

- On Chrome, install [redux-devtools-extension](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd)
- On Firefox, install [redux-devtools-add-ons](https://addons.mozilla.org/en-US/firefox/addon/reduxdevtools/)

### 8. Docker

You can start the MERN stack (`server` and `client` only) using `docker-compose`:

**Development mode**

```bash
git clone https://github.com/t-ho/mern-stack.git
cd mern-stack
cp .env.example .env
cp client/.env.example client/.env

# Edit the .env file to meet your requirements
docker-compose up
# The mongoDB service listen on port 27018
```

The `nginx-proxy` server will listen on port `8080` (`NGINX_PROXY_PORT`) by default.

**Production mode**

```bash
git clone https://github.com/t-ho/mern-stack.git
cd mern-stack
cp .env.example .env.prod

# Edit the .env.prod file to meet your requirements
docker-compose -f docker-compose.prod.yml  --env-file ./.env.prod up -d
```

## Testing

In the root (`mern-stack`) directory, run:

```bash
npm run test
```

Testing frameworks:

- Server: [mocha](https://mochajs.org/) - [chai](https://www.chaijs.com/) - [supertest](https://github.com/visionmedia/supertest)
- Web-client: [jest](https://jestjs.io/)
- Mobile:
