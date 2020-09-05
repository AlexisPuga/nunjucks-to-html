#!/usr/bin/env node

'use strict';

const nunjucksToHtml = require('../src');
const getCliOptions = require('../lib/get-cli-options');
const getCliSources = require('../lib/get-cli-sources');

(async () => {

	// First 2 args are not required.
	const cliArgs = process.argv.slice(2);
	const cliPaths = getCliSources(cliArgs);
	const cliOptions = getCliOptions(cliArgs);

	try { await nunjucksToHtml(cliPaths, cliOptions); }
	catch (exception) {

		console.error(exception);
		process.exit(1);

		return;

	}

	console.log('[nunjucks-to-html] Done.');

})();
