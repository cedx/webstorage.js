import {playwrightLauncher} from "@web/test-runner-playwright";

/**
 * @type {import("@web/test-runner").TestRunnerConfig}
 */
export default {
	browsers: [
		playwrightLauncher({product: "chromium"}),
		playwrightLauncher({product: "firefox"}),
		playwrightLauncher({product: "webkit"})
	],
	files: "test/**/*.js",
	nodeResolve: true
};
