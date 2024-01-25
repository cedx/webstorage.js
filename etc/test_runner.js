import {chromeLauncher} from "@web/test-runner";

/**
 * @type {import("@web/test-runner").TestRunnerConfig}
 */
export default {
	browsers: [chromeLauncher()],
	files: "test/**/*.js",
	nodeResolve: true
};
