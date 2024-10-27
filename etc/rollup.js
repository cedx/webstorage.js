import resolve from "@rollup/plugin-node-resolve";

/** @type {import("rollup").RollupOptions} */
export default {
	input: "test/index.js",
	output: {file: "var/tests.js", format: "iife"},
	plugins: [resolve()]
};
