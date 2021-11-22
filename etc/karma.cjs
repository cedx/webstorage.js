const {chromium} = require("playwright");
process.env.CHROME_BIN = chromium.executablePath();

module.exports = config => config.set({
	basePath: "..",
	browsers: ["ChromeHeadless"],
	coverageIstanbulInstrumenter: {
		esModules: true
	},
	coverageIstanbulReporter: {
		dir: "var",
		reports: ["lcovonly"]
	},
	files: [
		{pattern: "lib/**/*.js", type: "module"},
		{pattern: "test/**/*.js", type: "module"}
	],
	frameworks: ["mocha", "chai"],
	preprocessors: {
		"lib/**/*.js": "karma-coverage-istanbul-instrumenter"
	},
	reporters: ["progress", "coverage-istanbul"],
	singleRun: true
});
