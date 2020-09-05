/**
 * Get sources from cli arguments.
 *
 * @param {string[]} cliArgs - Commonly process.argv.slice(2).
 * @example
 * // Call some command using the following sintax:
 * command *.js *.css {lib,src}/* --some option
 * -
 * const cliArgs = process.argv.slice(2);
 *
 * getCliSources(cliArgs); // > *.js, *.css, {lib,src}/*
 */
function getCliSources (cliArgs) {

	const cliArgsString = cliArgs.join(' ');
	const firstOptionMatchIndex = cliArgsString.indexOf(' -');
	const sources = cliArgsString
		.slice(0, firstOptionMatchIndex)
		.split(' ')
		.join(', ');

	return sources;

}

module.exports = getCliSources;
