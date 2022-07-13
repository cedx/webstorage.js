/** @type {import("@web/test-runner").TestRunnerConfig} */
export default {
	coverage: true,
	coverageConfig: {include: ["src/**/*.js"], reportDir: "var"},
	files: "test/**/*.js",
	nodeResolve: true
};
