const {join: pathJoin, sep: pathSep} = require('path');

/**
 * Include filepath into destinationPath.
 *
 * @TODO: Find a better way to do this.
 * @param {string} filepath
 * @param {string} destinationPath
 * @example
 * const filepath = 'static/js/index.js';
 * const destinationPath = 'public';
 * 
 * expandDir(filepath, destinationPath); // > "public/js/index.js"
 * @return {string} An absolute filepath.
 */
function expandDir (filepath, destinationPath) {

	const fileDirs = filepath.split(pathSep);
	const destinationDirs = destinationPath.split(pathSep);
	const largestString = (filepath.length > destinationPath.length
		? filepath
		: destinationPath
	);
	const destinationFilepath = largestString.split(pathSep).reduce(
		(path, dir, i) => pathJoin(path, destinationDirs[i] || fileDirs[i]),
		pathSep
	);

	return destinationFilepath;

}

module.exports = expandDir;
