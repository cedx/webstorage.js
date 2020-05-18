module.exports = config => config.set({
	basePath: "..",
	browsers: ["FirefoxHeadless"],
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
