const { spawnSync } = require('child_process');

/**
 * This script provide a cross-platform way for starting npm process in children directory.
 */

const command = 'npm';
const arguments = ['run', 'test'];
const workingDirs = ['server'];

// Run `npm run test` in each directory one after the other
workingDirs.forEach(dir => {
  const options = { cwd: dir, shell: true, stdio: 'inherit' };
  console.log(`\n[*] Running tests for ${dir}\n`);
  spawnSync(command, arguments, options);
});
