const { spawn } = require('child_process');

/**
 * This script provide a cross-platform way for starting npm process in children directory.
 */

const command = 'npm';
const arguments = ['start'];
const options = { cwd: 'server', shell: true, stdio: 'inherit' };

spawn(command, arguments, options);
