const {exec} = require('child_process');
const {promisify} = require('util');
const path = require('path');
const execPromisified = promisify(exec);
const projectRoot = path.resolve(__dirname, '..', '..');

async function execAsync (command, options) {

	const pathToCommand = (/^nunjucks-to-html/.test(command)
		? path.resolve(projectRoot, 'bin', command.replace('nunjucks-to-html', 'cli.js'))
		: null
	);

	if (!pathToCommand) { throw new Error('Unknown command.'); }

	return await execPromisified(pathToCommand, options);

}

module.exports = execAsync;
