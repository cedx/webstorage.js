import resolve from "@rollup/plugin-node-resolve";

/**
 * The build options.
 * @type {import("rollup").RollupOptions}
 */
export default {
	context: "this",
	input: "lib/rollup.js",
	output: {file: "var/tests.js", format: "iife"},
	plugins: [resolve()]
};
