import {cp, readFile} from "node:fs/promises";
import del from "del";
import {execa} from "execa";
import gulp from "gulp";

/** Builds the project. */
export function build() {
	return exec("tsc", ["--project", "lib/jsconfig.json"]);
}

/** Deletes all generated files and reset any saved state. */
export function clean() {
	return del(["share", "var/**/*"]);
}

/** Builds the documentation. */
export async function doc() {
	await exec("typedoc", ["--options", "etc/typedoc.json"]);
	return cp("www/favicon.ico", "docs/favicon.ico");
}

/** Performs the static analysis of source code. */
export async function lint() {
	const sources = JSON.parse(await readFile("jsconfig.json", "utf8")).include;
	await exec("eslint", ["--config=etc/eslint.json", ...sources]);
	return exec("tsc", ["--project", "jsconfig.json"]);
}

/** Publishes the package in the registry. */
export async function publish() {
	const {version} = JSON.parse(await readFile("package.json", "utf8"));
	for (const registry of ["https://registry.npmjs.org", "https://npm.pkg.github.com"]) await exec("npm", ["publish", `--registry=${registry}`]);
	for (const command of [["tag"], ["push", "origin"]]) await exec("git", [...command, `v${version}`]);
}

/** Runs the test suite. */
export function test() {
	return exec("karma", ["start", "etc/karma.cjs"]);
}

/** Watches for file changes. */
export function watch() {
	return exec("tsc", ["--project", "jsconfig.json", "--watch"]);
}

/** Runs the default task. */
export default gulp.series(
	clean,
	build
);

/**
 * Runs the specified command.
 * @param {string} command The command to run.
 * @param {string[]} [args] The command arguments.
 * @param {import("execa").Options} [options] The child process options.
 * @returns {import("execa").ExecaChildProcess} Resolves when the command is finally terminated.
 */
function exec(command, args = [], options = {}) {
	return execa(command, args, {preferLocal: true, stdio: "inherit", ...options});
}