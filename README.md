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

- Directory `server`
- The full API documentation can be found [here](https://tdev.app/mern-stack/server)
- Todo:
  - [x] Authentication system - [passport](https://www.npmjs.com/package/passport)
    - [x] Sign up - [bcrypt](https://www.npmjs.com/package/bcrypt)
    - [x] Local login - [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) - [passport-jwt](https://www.npmjs.com/package/passport-jwt)
    - [x] Facebook login - [passport-facebook-token](https://www.npmjs.com/package/passport-facebook-token)
    - [x] Google login - [passport-google-token](https://www.npmjs.com/package/passport-google-token)
    - [x] Email verification
    - [x] Password reset email
  - [x] Authorization system
    - [x] Role-based access control
    - [x] Principle of least privilege
  - [x] User management - CRUD operations
  - [x] Input validation and sanitization - [@hapi/joi](https://www.npmjs.com/package/@hapi/joi)
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
- Created by using [expo-cli](https://www.npmjs.com/package/expo-cli). To switch to _bare_ workflow, please see docs [here](https://docs.expo.io/introduction/managed-vs-bare)
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
  - [ ] Building and deploying workflow

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
# Edit all three .env files to meet your requirements
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
# Server API is running at http://localhost:SERVER_PORT (http://localhost:8861 by default)
# Web client is running at http://localhost:PORT (http://localhost:3000 by default)
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
# Server API is running at http://localhost:SERVER_PORT (http://localhost:8861 by default)
# Web client is running at http://localhost:PORT (http://localhost:3000 by default)
```

Or to start `server` and `mobile` only, run:

```bash
# In the root directory (mern):
npm run server:mobile
# Server API is running at http://localhost:SERVER_PORT (http://localhost:8861 by default)
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
