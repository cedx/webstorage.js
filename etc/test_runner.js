import {chromeLauncher} from "@web/test-runner";

/**
 * The test runner configuration.
 * @type {import("@web/test-runner").TestRunnerConfig}
 */
export default {
	browsers: [chromeLauncher()],
	files: "test/**/*.js",
	nodeResolve: true
};
