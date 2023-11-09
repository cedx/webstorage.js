import {puppeteerLauncher} from "@web/test-runner-puppeteer";

/**
 * The test runner configuration.
 * @type {import("@web/test-runner").TestRunnerConfig}
 */
export default {
	browsers: [puppeteerLauncher()],
	coverage: true,
	coverageConfig: {reportDir: "var"},
	files: "test/**/*.js",
	nodeResolve: true
};
