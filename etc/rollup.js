import resolve from "@rollup/plugin-node-resolve";

export default {
	input: "test/index.js",
	output: {file: "var/tests.js", format: "iife"},
	plugins: [resolve()]
};
