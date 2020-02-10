# MERN Stack

### MongoDB - Express - React - Redux - React Native - NodeJS

[![mern-workflow](https://raw.githubusercontent.com/t-ho/mern/assets/assets/mern-workflow.gif)](https://github.com/t-ho/mern)

## The server API documentation can be found [here](./server/README.md)

## Getting started

### 1. Install `expo-cli` globally for developing mobile app

```bash
npm install -g expo-cli
```

### 2. Clone the `mern` repository:

```bash
git clone https://github.com/t-ho/mern.git
cd mern
cp .env.example .env
# Edit .env file to meet your requirements
```

### 3. Install package dependencies:

```bash
npm run install:deps
# Note: On MacOs and Linux, the command above is kind of equivalent to:
# npm install && cd server && npm install && cd ../web-client && npm install && cd ../mobile && npm install && cd ..
```

Then command `npm run install:deps` just provides a convenient (cross-platform) way for installing all deps in one command on MacOS, Linux and Windows:

### 4. To start server, web client and mobile, run:

```bash
# In the root directory (mern):
npm start
# Server API is running at http://localhost:8080
# Web client is running at http://localhost:3000
# Mobile - Expo DevTools is running at http://localhost:19002
```

**NOTE:**

- **For the sake of simplicity, we use free service [ngrok](https://ngrok.com/) to create public API URL for mobile development. The downside of this approach is that the public URL is only available for 8 hours, so we need to restart the `npm` process every 8 hours.**
- **After 8 hours, the expired ngrok URL message will be displayed in your terminal to remind you restart npm process.**

To restart npm process (_If you don't start mobile development process, simply ignore this step_):

```bash
# In your current terminal, press Ctrl + C to exit. Then run
npm start # start server, web-client and mobile dev process
# or
npm run server:mobile # start server and mobile dev process
```

Or to start server and web client only, run:

```bash
# In the root directory (mern):
npm run server:client
# Server API is running at http://localhost:8080
# Web client is running at http://localhost:3000
```

Or to start server and mobile only, run

```bash
# In the root directory (mern):
npm run server:mobile
# Server API is running at http://localhost:8080
# Mobile - Expo DevTools is running at http://localhost:19002
```

### 5. To see the mobile app on your mobile devices:

- On iOS devices, install [Expo Client](https://apps.apple.com/us/app/expo-client/id982107779)
- On Android devices, install [Expo](https://play.google.com/store/apps/details?id=host.exp.exponent&hl=en_US)
- Then scan QR code displayed on your terminal to launch the app.

### 6. To debug mobile app with `react-native-debugger`:

- Install [react-native-debugger](https://github.com/jhen0409/react-native-debugger/releases).
- Open React Native Debugger window instance with port `19001` (`Debugger` > `New Window`).
- Enable [Debugging mode](https://facebook.github.io/react-native/docs/debugging.html#accessing-the-in-app-developer-menu) on your iOS simulator or Android emulator.
