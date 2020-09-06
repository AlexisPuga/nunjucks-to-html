const {exec} = require('child_process');

async function execAsync (command, options) {

	return await new Promise((resolve, reject) => {

		exec(command, options, (error, stdout, stderr) => {

			if (error) { return reject(error); }

			resolve({stderr, stdout});

		});

	});

}

module.exports = execAsync;
