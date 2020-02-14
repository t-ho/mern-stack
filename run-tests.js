const { spawn } = require('child_process');

/**
 * This script provide a cross-platform way for starting npm process in children directory.
 */

const command = 'npm';
const arguments = ['run', 'test'];
const workingDirs = ['server'];

// Run `npm run test` in each directory parallelly
workingDirs.forEach(dir => {
  const options = { cwd: dir, shell: true, stdio: 'inherit' };
  spawn(command, arguments, options);
});
