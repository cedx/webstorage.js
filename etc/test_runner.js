import {playwrightLauncher} from "@web/test-runner-playwright";

/**
 * The test runner configuration.
 * @type {import("@web/test-runner").TestRunnerConfig}
 */
export default {
	browsers: [
		playwrightLauncher({product: "chromium"}),
		playwrightLauncher({product: "firefox"}),
		playwrightLauncher({product: "webkit"})
	],
	coverage: true,
	coverageConfig: {reportDir: "var"},
	files: "test/**/*.js",
	nodeResolve: true
};
