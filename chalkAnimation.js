
const chalk = require('chalk');
//const log = console.log;
const chalkAnimation = require('chalk-animation');

// Combine styled and normal strings
log(chalk.blue('Hello') + ' World' + chalk.red('!'));
log(chalkAnimation.rainbow('Lorem ipsum dolor sit amet'));
