/**
 * The test runner configuration.
 * @type {import("@web/test-runner").TestRunnerConfig}
 */
export default {
	coverage: true,
	coverageConfig: {reportDir: "var"},
	files: "test/**/*.js",
	nodeResolve: true
};
