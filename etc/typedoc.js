/**
 * @type {Partial<import("typedoc").TypeDocOptions>}
 */
export default {
	entryPoints: ["../src/index.ts"],
	excludePrivate: true,
	gitRevision: "main",
	hideGenerator: true,
	name: "Web Storage for JS",
	out: "../docs/api",
	readme: "none",
	tsconfig: "../src/tsconfig.json"
};