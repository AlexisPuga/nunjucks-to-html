const glob = require('glob');

/**
 * Convert glob patterns to filepaths.
 *
 * @param {string} sources - A glob pattern.
 * @return {Promise} filepaths
 */
async function getFilepaths (sources) {

	return await new Promise((resolve, reject) => {

		glob(sources.toString(), (error, filepaths) => {

			if (error) { return void reject(error); }

			resolve(filepaths);

		});

	});

}

module.exports = getFilepaths;
