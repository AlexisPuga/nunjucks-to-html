const fs = require('fs');
const path = require('path');
const execAsync = require('../lib/exec-async');
const sandboxDir = path.join(__dirname, 'sandbox');

describe('CLI', () => {

	afterEach(() => {

		// @TODO Remove created files.

	});

	describe('[without arguments nor flags]', () => {

		it('Should parse all .njk files under the ./sandbox directory, '
			+ 'save the results in ./sanbox/public with the .html extension '
			+ 'preserve the full source file name under that directory '
			+ 'and ignore nunjucks.config.js since it doesn\'t exist.', async () => {

			const {stdout, stderr} = await execAsync('nunjucks-to-html', {
				'cwd': sandboxDir
			});
			const destinationPath = path.join(sandboxDir, 'public');

			expect(stderr).toBe('');
			expect(stdout).not.toBe('');

			/** Mocking fs would be better, but doesn't seem to work. */
			expect(fs.existsSync(path.join(destinationPath, 'ignore.no-njk'))).toBe(false);
			expect(fs.existsSync(path.join(destinationPath, 'dir', 'ignore.no-njk'))).toBe(false);

			expect(fs.readFileSync(path.join(destinationPath, 'cli.html'), {
				'encoding': 'utf8'
			})).toEqual(
				expect.stringContaining('<h1>CLI example</h1>')
			);

			expect(fs.readFileSync(path.join(destinationPath, 'dir', 'cli.html'), {
				'encoding': 'utf8'
			})).toEqual(
				expect.stringContaining('<h1>CLI example in directory</h1>')
			);

		});

	});

	describe('[without flags]', () => {

		it('Should set the arguments as sources.', async () => {

			const destinationPath = path.join(sandboxDir, 'public');

			await execAsync('nunjucks-to-html "cli.name with spaces.no-njk" cli.no-njk dir/cli.no-njk', {
				'cwd': sandboxDir
			});

			expect(fs.readFileSync(path.join(destinationPath, 'cli.name with spaces.html'), {
				'encoding': 'utf8'
			})).toEqual(
				expect.stringContaining('<h1>CLI filename with spaces example</h1>')
			);

			expect(fs.readFileSync(path.join(destinationPath, 'cli.html'), {
				'encoding': 'utf8'
			})).toEqual(
				expect.stringContaining('<h1>CLI custom extension example</h1>')
			);

			expect(fs.readFileSync(path.join(destinationPath, 'dir', 'cli.html'), {
				'encoding': 'utf8'
			})).toEqual(
				expect.stringContaining('<h1>CLI custom extension under /dir example</h1>')
			);

		});

	});

	describe('using the --config flag', () => {

		it('Should read a configuration file in the given path.', async () => {

			const configFilepath = path.join(sandboxDir, 'cli.nunjucks.config.js');
			const {stderr, stdout} = await execAsync(
				`nunjucks-to-html --config ${configFilepath}`,
				{'cwd': sandboxDir}
			);

			expect(stderr).toBe('');
			expect(stdout).toEqual(
				expect.stringContaining('[test] Read.')
			);

		});

	});

	describe('using the --dest flag', () => {

		it('Should change the destination path.', async () => {

			const destinationPath = path.join(sandboxDir, 'custom dir');
			const {stderr, stdout} = await execAsync(
				`nunjucks-to-html --dest "${destinationPath}"`,
				{'ext': sandboxDir}
			);

			expect(stderr).toBe('');
			expect(stdout).not.toBe('');

			expect(fs.existsSync(path.join(destinationPath, 'cli.html'))).toBe(true);
			expect(fs.existsSync(path.join(destinationPath, 'dir', 'cli.html'))).toBe(true);

		});

	});

	describe('using the --ext flag', () => {

		it('Should change the extension for the destination file.', async () => {

			const destinationPath = path.join(sandboxDir, 'public');
			const destinationExtension = '.nunjucks';
			const destinationFile = `cli${destinationExtension}`;
			const {stderr, stdout} = await execAsync(
				`nunjucks-to-html --ext ${destinationExtension}`,
				{'cwd': sandboxDir}
			);

			expect(stderr).toBe('');
			expect(stdout).not.toBe('');

			expect(fs.existsSync(path.join(destinationPath, destinationFile))).toBe(true);
			expect(fs.existsSync(path.join(destinationPath, 'dir', destinationFile))).toBe(true);

		});

	});

	describe('using the --cwd', () => {

		it('Should change the base directory for all paths.', async () => {

			const cwd = path.resolve(sandboxDir, 'cwd');
			const {stderr, stdout} = await execAsync(
				`nunjucks-to-html --cwd ${cwd}`,
				{'cwd': cwd}
			);

			expect(stderr).toBe('');
			expect(stdout).not.toBe('');

			expect(fs.readFileSync(path.join(cwd, 'public', 'cli.html'), {
				'encoding': 'utf8'
			})).toEqual(
				expect.stringContaining('<h1>CLI --cwd flag example</h1>')
			);

		});

	});

});