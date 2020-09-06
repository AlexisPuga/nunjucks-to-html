const glob = require('glob');

/**
 * Convert glob patterns to filepaths.
 *
 * @param {string[]} sources - An array of glob patterns.
 * @return {Promise} filepaths
 */
async function getFilepaths (sources) {

	let tasks;

	if (!Array.isArray(sources)) { sources = [sources]; }

	tasks = sources.map(async (src) => await new Promise((resolve, reject) => {

		glob(src, (error, filepaths) => {

			if (error) { return void reject(error); }

			resolve(filepaths);

		});

	}));

	return await Promise
		.all(tasks)
		.then((results) => [].concat.apply([], results));

}

module.exports = getFilepaths;
