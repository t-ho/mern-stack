# MERN Stack

## Getting started

```bash
git clone https://github.com/t-ho/mern.git
```

To start the server:

```bash
cd mern/server
npm install
cp .env.example .env
npm run dev # start server
```

To start client:

```bash
cd mern/web-client
npm install
npm start
```

To start mobile:

```bash
cd mern/mobile
npm install
npm start

# Open another terminal
cd mern/server
npm run tunnel
# Copy the URL http://xxxxxxxx.ngrok.io to the `baseUrl` in the file `rmg/mobile/src/store/apis/mern.js`
```
