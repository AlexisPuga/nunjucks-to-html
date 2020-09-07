const getCliArgsUntilPattern = require('./get-cli-args-until-pattern');

/**
 * Convert CLI arguments that match "--" and "-" into
 * an object literal.
 *
 * @param {string[]} cliArgs - Commonly process.argv
 * @example
 * getCliOptions([
 *     '--key1', 'value1',
 *     '-2', 'value2',
 *     '--3', 'value1 value2'
 * ]); // {'key1': 'value1', '2': 'value2', '3': ['value1', 'value2']}
 * @return {!object} An object literal.
 */
function getCliOptions (cliArgs) {

	return cliArgs.reduce((args, string, i) => {

		const value = cliArgs.slice(i + 1);

		if (/^--?(.+)/.test(string)) {

			let flagName = RegExp.$1;
			let flagValues = getCliArgsUntilPattern(value, /^-/);

			args[flagName] = (flagValues.length === 1
				? flagValues[0]
				: flagValues
			);

		}

		return args;

	}, {});

}

module.exports = getCliOptions;
