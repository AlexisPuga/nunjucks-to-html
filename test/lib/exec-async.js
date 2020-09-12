const {exec} = require('child_process');
const path = require('path');

async function execAsync (command, options) {

	return await new Promise((resolve, reject) => {

		const pathToCommand = (/^nunjucks-to-html/.test(command)
			? path.join(process.cwd(), 'bin', command.replace('nunjucks-to-html', 'cli.js'))
			: null
		);

		if (!pathToCommand) { return void reject(new Error('Unknown command.')); }

		exec(pathToCommand, options, (error, stdout, stderr) => {

			if (error) { return reject(error); }

			resolve({stderr, stdout});

		});

	});

}

module.exports = execAsync;
