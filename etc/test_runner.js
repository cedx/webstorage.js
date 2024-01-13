import {chromeLauncher} from "@web/test-runner";

/**
 * The test runner configuration.
 * @type {import("@web/test-runner").TestRunnerConfig}
 */
export default {
	browsers: [chromeLauncher()],
	coverage: true,
	coverageConfig: {reportDir: "var"},
	files: "test/**/*.js",
	nodeResolve: true
};
