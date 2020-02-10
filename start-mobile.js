const { spawn } = require('child_process');
const fs = require('fs');
const ngrok = require('ngrok');
const figlet = require('figlet');
const dotenv = require('dotenv');

dotenv.config();

/**
 * This script provide a cross-platform way for starting npm process in children directory.
 */

const command = 'npm';
const arguments = ['start'];
const options = { cwd: 'mobile', shell: true, stdio: 'inherit' };

/**
 * Use ngrok to create public URL for server API. Then assign this public URL to
 * axios instance's baseURL in the file `mobile/src/store/apis/api.dev.js`.
 * By default, the `api.dev.js` does not exist, create one by clone api.prod.js.
 * The `api.dev.js` is not committed to the repo.
 */
ngrok
  .connect({ proto: 'http', addr: process.env.SERVER_PORT, bind_tls: false })
  .then(ngrokUrl => {
    const apiFile = fs.readFileSync(
      './mobile/src/store/apis/api.prod.js',
      'utf-8'
    );
    const apiDevFile = apiFile.replace(
      /baseURL.*/,
      `baseURL: '${ngrokUrl}/api'`
    );
    fs.writeFileSync('./mobile/src/store/apis/api.dev.js', apiDevFile);
    spawn(command, arguments, options);

    // The Ngrok URL will be expired after 8 hours
    setTimeout(() => {
      printExpiredUrlMessage();
    }, 8 * 60 * 60 * 1000); // 8 hours
  });

const printExpiredUrlMessage = () => {
  figlet.text('Ngrok URL expired', { font: 'Big' }, (err, artText) => {
    console.log(`\n\n${artText}`);
    console.log('\n[-] The ngrok URL is expired');
    console.log('[*] Please press Ctrl + C to exit');
    console.log('[*] Then, run `npm start` or `npm run mobile`');
  });
};
