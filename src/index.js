'use strict';

const {join: pathJoin, dirname: pathDirname} = require('path');
const fs = require('fs');
const nunjucks = require('nunjucks');
const getFileContents = require('../lib/get-file-contents');
const getFilepaths = require('../lib/get-filepaths');
const expandDir = require('../lib/expand-dir');

/**
 * Parse Nunjucks templates to HTML.
 * Inspired by github.com/vitkarpov/grunt-nunjucks-2-html
 *
 * Read a series of Nunjucks tasks from a config file.
 * Call nunjucks.configure().
 * Emit options.beforeRender().
 *     If the result is false, skip the parsing and resolve to an empty value.
 * 	   otherwise, continue.
 * Call nunjucks.render().
 * 		If there's any errors, reject with the error.
 *      otherwise, continue.
 * Emit options.beforeWrite().
 *     If the result is false, skip writing to a file and resolve to an empty value.
 *     otherwise, continue.
 * Create the destination directory.
 * Write to the destination file.
 *     If there's no errors, resolve with its contents.
 *     otherwise, reject with the error.
 * Return a promise with the resolved values.
 *
 * @param {string[]} [sources=all .njk files] - A array of glob patterns.
 * @param {object} [options] - Non-nunjucks options.
 * @param {string} [options.config="./nunjucks.config.js"] - Path for
 *     the config file. Relative to cwd.
 * @param {string} [cwd=process.cwd()] - Current working directory.
 * @param {string} [dest="./public"] - A destination path relative to cwd.
 * @param {string} [ext=".html"] - The extension for the destination file.
 * @return {Promise} A promise with all the results.
 */
async function parseNunjucksTemplatesToHTML (sources = ['**/*.njk'], {
	config: relativeConfigFilepath = './nunjucks.config.js',
	dest: relativeDestinationPath = './public',
	ext: destinationFilepathExtension = '.html',
	cwd: customCwd
}) {

	const cwd = customCwd || process.cwd();
	const filepaths = await getFilepaths(sources);
	const destinationPath = pathJoin(cwd, relativeDestinationPath);
	const configFilepath = pathJoin(cwd, relativeConfigFilepath);
	const config = (fs.existsSync(configFilepath)
		? getFileContents(configFilepath)
		: []
	);
	const jobs = (Array.isArray(config) ? config : [config]);
	let actions;

	if (!jobs.length) { jobs.push({}); /* Run at least once. */ }

	actions = jobs.map(({
		options: customOptions = {},
		configure = {},
		render = {}
	}) => new Promise((resolve, reject) => {

		const {
			beforeRender,
			beforeWrite,
			data: dataFilepath
		} = customOptions;
		const {path, options} = configure;
		const {name, context = {}} = render;
		const dataFileContents = (typeof dataFilepath === 'string'
			? getFileContents(dataFilepath, cwd)
			: null
		);
		let data = {
			...dataFileContents,
			...context
		};
		const tasks = filepaths.map((src) => new Promise((resolve, reject) => {

			const filepath = pathJoin(cwd, src);
			const destinationFilepath = expandDir(filepath, destinationPath).replace(/\.njk$/i, destinationFilepathExtension);
			const renderName = name || filepath;
			const nunjucksEnv = nunjucks.configure(path, options);
			let continueRendering;

			if (typeof beforeRender === 'function') {

				continueRendering = beforeRender.call(nunjucks, nunjucksEnv, renderName, data);

			}

			if (continueRendering === false) { return void resolve(); }

			nunjucksEnv.render(renderName, data, (error, result) => {

				let continueWriting;

				if (error) { return void reject(error); }

				if (typeof beforeWrite === 'function') {

					continueWriting = beforeWrite.call(nunjucks, destinationFilepath, result);

				}

				if (continueWriting === false) { return void resolve(); }

				// Create structure first to prevent errors in the next line.
				fs.mkdirSync(pathDirname(destinationFilepath), {'recursive': true});
				// Save the parsed template.
				fs.writeFile(destinationFilepath, result, (error, result) => {

					if (error) { return void reject(error); }

					resolve(result);

				});

			});

		}));

		Promise.all(tasks).then(resolve).catch(reject);

	}));

	return await Promise.all(actions);

}

module.exports = parseNunjucksTemplatesToHTML;
