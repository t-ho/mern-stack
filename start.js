const concurrently = require('concurrently');
const chalk = require('chalk');
const figlet = require('figlet');
const _ = require('lodash');

/**
 * This script run npm proccesses concurrently
 *
 * Usage: node start [install-children|test|server|client|mobile|server:client:mobile|server:client|server:mobile]
 *
 * Example:
 * * node start install-children
 * * node start test
 * * node start server
 * * node start client
 * * node start mobile
 * * node start server:client:mobile
 * * node start server:client
 * * node start server:mobile
 */

const getUppercaseArgs = () => {
  validArgs = [
    'install-children',
    'test',
    'server',
    'client',
    'mobile',
    'server:client:mobile',
    'server:client',
    'server:mobile',
  ];

  if (process.argv.length === 2) {
    process.argv.push('server:client:mobile');
  } else if (process.argv.length > 3) {
    throw new Error(`[-] Invalid command. Please specify only one argument`);
  }

  if (_.findIndex(validArgs, (arg) => arg === process.argv[2]) === -1) {
    throw new Error(`[-] Invalid argument "${process.argv[2]}"`);
  }
  const args = process.argv[2].split(':').map((arg) => arg.toUpperCase());
  return args;
};

const run = () => {
  const artText = figlet.textSync(' MERN STACK', { font: 'ANSI Shadow' });
  console.log(chalk.cyan(artText));

  const upperCaseArgs = getUppercaseArgs();
  let availableCommands = [
    {
      command: 'node start-helper install-children',
      name: 'INSTALL-CHILDREN',
      prefixColor: 'gray',
    },
    {
      command: 'node start-helper test',
      name: 'TEST',
      prefixColor: 'cyan',
    },
    {
      command: 'node start-helper server',
      name: 'SERVER',
      prefixColor: 'cyan',
    },
    {
      command: 'node start-helper client',
      name: 'CLIENT',
      prefixColor: 'yellow',
    },
    {
      command: 'node start-helper mobile',
      name: 'MOBILE',
      prefixColor: 'gray',
    },
  ];

  const commands = _.filter(availableCommands, (command) => {
    return _.some(upperCaseArgs, (arg) => command.name === arg);
  });

  const options = {
    prefix: 'name',
    restartTries: 0,
    restartDelay: 0,
    successCondition: 'all',
  };

  if (_.isEqual(upperCaseArgs, ['INSTALL-CHILDREN'])) {
    options.raw = true;
  }

  const { result } = concurrently(commands, options);

  result
    .then((success, failure) => {})
    .catch((err) => {
      if (err) {
        process.exit(1);
      }
    });
};

run();
