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
 * getCliSources(cliArgs); // > [*.js, *.css, {lib,src}/*]
 * @return {string[]}
 */
function getCliSources (cliArgs) {

	const firstOptionMatchIndex = cliArgs.findIndex((value) => /^-/.test(value));
	const sources = cliArgs.slice(0, firstOptionMatchIndex);

	return sources;

}

module.exports = getCliSources;
