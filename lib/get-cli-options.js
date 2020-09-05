/**
 * Convert CLI arguments that match "--" and "-" into
 * an object literal.
 *
 * @param {string[]} cliArgs - Commonly process.argv
 * @example
 * getCliOptions([
 *     '--key1', 'value1',
 *     '-2', 'value2'
 * ]); // {'key1': 'value1', '2': 'value2'}
 * @return {!object} An object literal.
 */
function getCliOptions (cliArgs) {

	return cliArgs.reduce((args, string, i) => (/^--?(.+)/.test(string)
		&& (args[RegExp.$1] = cliArgs[i + 1]), args
	), {});

}

module.exports = getCliOptions;
