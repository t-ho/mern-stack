const { spawnSync } = require('child_process');

/**
 * This script provide a cross-platform way for starting npm process in children directory.
 */

const command = 'npm';
const arguments = ['install'];
const workingDirs = ['.', 'server', 'web-client', 'mobile'];

// Run `npm install` in each directory one after the other
workingDirs.forEach(dir => {
  const options = { cwd: dir, shell: true, stdio: 'inherit' };
  console.log(`\n[*] Installing dependencies for ${dir}\n`);
  spawnSync(command, arguments, options);
});
