const { spawn } = require('child_process');

/**
 * This script provide a cross-platform way for starting npm process in children directory.
 */

const command = 'npm';
const arguments = ['install'];
const workingDirs = ['.', 'server', 'web-client', 'mobile'];

// Run `npm install` in each directory parallelly
workingDirs.forEach(dir => {
  const options = { cwd: dir, shell: true, stdio: 'inherit' };
  spawn(command, arguments, options);
});
