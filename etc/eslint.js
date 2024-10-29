import js from "@eslint/js";
import globals from "globals";
import {join} from "node:path";
import ts from "typescript-eslint";

export default ts.config(
	js.configs.recommended,
	...ts.configs.strictTypeChecked,
	...ts.configs.stylisticTypeChecked,
	{
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.mocha
			},
			parserOptions: {
				project: "tsconfig.json",
				tsconfigRootDir: join(import.meta.dirname, "..")
			}
		},
		rules: {
			"accessor-pairs": "error",
			"array-callback-return": "error",
			"arrow-body-style": "error",
			"block-scoped-var": "error",
			"camelcase": "off",
			"capitalized-comments": "warn",
			"class-methods-use-this": "off",
			"complexity": ["error", {max: 50}],
			"consistent-return": "off",
			"consistent-this": "error",
			"curly": ["error", "multi"],
			"default-case-last": "error",
			"default-case": "error",
			"default-param-last": "error",
			"dot-notation": "error",
			"eqeqeq": "off",
			"func-name-matching": "error",
			"func-names": "off",
			"func-style": ["error", "declaration", {allowArrowFunctions: true}],
			"grouped-accessor-pairs": "error",
			"guard-for-in": "error",
			"id-denylist": "error",
			"id-length": ["error", {exceptions: ["_", "$", "x", "y"]}],
			"id-match": "error",
			"init-declarations": "off",
			"logical-assignment-operators": "error",
			"max-classes-per-file": "off",
			"max-depth": "error",
			"max-lines-per-function": ["error", {max: 100}],
			"max-lines": ["error", {max: 500}],
			"max-nested-callbacks": "error",
			"max-params": "off",
			"max-statements": ["error", {max: 25}],
			"new-cap": ["error", {capIsNewExceptions: ["RangeError", "SyntaxError", "TypeError"]}],
			"no-alert": "error",
			"no-array-constructor": "error",
			"no-await-in-loop": "off",
			"no-bitwise": "off",
			"no-caller": "error",
			"no-console": "off",
			"no-constructor-return": "error",
			"no-continue": "off",
			"no-div-regex": "error",
			"no-duplicate-imports": "error",
			"no-else-return": "error",
			"no-empty-function": "error",
			"no-eq-null": "off",
			"no-eval": "error",
			"no-extend-native": "error",
			"no-extra-bind": "error",
			"no-extra-label": "error",
			"no-implicit-coercion": "error",
			"no-implicit-globals": "error",
			"no-implied-eval": "error",
			"no-inline-comments": "off",
			"no-inner-declarations": "error",
			"no-iterator": "error",
			"no-label-var": "error",
			"no-labels": "error",
			"no-lone-blocks": "error",
			"no-lonely-if": "error",
			"no-loop-func": "off",
			"no-magic-numbers": "off",
			"no-multi-assign": ["error", {ignoreNonDeclaration: true}],
			"no-multi-str": "error",
			"no-negated-condition": "off",
			"no-nested-ternary": "off",
			"no-new-func": "error",
			"no-new-wrappers": "error",
			"no-new": "error",
			"no-object-constructor": "error",
			"no-octal-escape": "error",
			"no-param-reassign": "off",
			"no-plusplus": "off",
			"no-promise-executor-return": "error",
			"no-proto": "error",
			"no-restricted-exports": "error",
			"no-restricted-globals": "error",
			"no-restricted-imports": "off",
			"no-restricted-properties": "error",
			"no-restricted-syntax": "error",
			"no-return-assign": "off",
			"no-return-await": "off",
			"no-script-url": "error",
			"no-self-compare": "error",
			"no-sequences": "error",
			"no-shadow": "off",
			"no-template-curly-in-string": "error",
			"no-ternary": "off",
			"no-undef-init": "error",
			"no-undefined": "error",
			"no-underscore-dangle": "error",
			"no-unmodified-loop-condition": "error",
			"no-unneeded-ternary": "error",
			"no-unreachable-loop": "error",
			"no-unused-expressions": "error",
			"no-use-before-define": "off",
			"no-useless-assignment": "error",
			"no-useless-call": "error",
			"no-useless-computed-key": "error",
			"no-useless-concat": "error",
			"no-useless-constructor": "error",
			"no-useless-rename": "error",
			"no-useless-return": "error",
			"no-void": ["error", {allowAsStatement: true}],
			"no-warning-comments": "warn",
			"object-shorthand": "error",
			"one-var": ["error", "never"],
			"operator-assignment": "error",
			"prefer-arrow-callback": "error",
			"prefer-const": "error",
			"prefer-destructuring": "off",
			"prefer-exponentiation-operator": "error",
			"prefer-named-capture-group": "off",
			"prefer-numeric-literals": "error",
			"prefer-object-has-own": "error",
			"prefer-object-spread": "error",
			"prefer-promise-reject-errors": "off",
			"prefer-regex-literals": "error",
			"prefer-rest-params": "error",
			"prefer-spread": "error",
			"prefer-template": "error",
			"radix": ["error", "as-needed"],
			"require-atomic-updates": ["error", {allowProperties: true}],
			"require-await": "error",
			"require-unicode-regexp": "off",
			"sort-imports": "off",
			"sort-keys": "off",
			"sort-vars": "error",
			"strict": ["error", "global"],
			"symbol-description": "error",
			"unicode-bom": "error",
			"vars-on-top": "error",
			"yoda": "error",

			"@typescript-eslint/array-type": ["error", {default: "generic"}],
			"@typescript-eslint/class-methods-use-this": "off",
			"@typescript-eslint/consistent-return": "error",
			"@typescript-eslint/consistent-type-exports": "error",
			"@typescript-eslint/consistent-type-imports": "error",
			"@typescript-eslint/default-param-last": "error",
			"@typescript-eslint/explicit-function-return-type": ["error", {allowExpressions: true}],
			"@typescript-eslint/explicit-member-accessibility": ["error", {accessibility: "no-public"}],
			"@typescript-eslint/explicit-module-boundary-types": "error",
			"@typescript-eslint/init-declarations": "error",
			"@typescript-eslint/max-params": ["error", {max: 4}],
			"@typescript-eslint/method-signature-style": "error",
			"@typescript-eslint/naming-convention": "off",
			"@typescript-eslint/no-confusing-void-expression": "off",
			"@typescript-eslint/no-empty-object-type": "error",
			"@typescript-eslint/no-explicit-any": "off",
			"@typescript-eslint/no-import-type-side-effects": "error",
			"@typescript-eslint/no-invalid-void-type": ["error", {allowAsThisParameter: true}],
			"@typescript-eslint/no-loop-func": "error",
			"@typescript-eslint/no-magic-numbers": "off",
			"@typescript-eslint/no-non-null-assertion": "off",
			"@typescript-eslint/no-require-imports": "error",
			"@typescript-eslint/no-restricted-imports": "error",
			"@typescript-eslint/no-shadow": "error",
			"@typescript-eslint/no-unnecessary-parameter-property-assignment": "error",
			"@typescript-eslint/no-unnecessary-qualifier": "error",
			"@typescript-eslint/no-unnecessary-type-parameters": "error",
			"@typescript-eslint/no-unsafe-unary-minus": "error",
			"@typescript-eslint/no-unused-expressions": ["error", {allowTaggedTemplates: true, allowTernary: true}],
			"@typescript-eslint/no-use-before-define": ["error", {functions: false}],
			"@typescript-eslint/no-useless-empty-export": "error",
			"@typescript-eslint/parameter-properties": "error",
			"@typescript-eslint/prefer-destructuring": "error",
			"@typescript-eslint/prefer-enum-initializers": "off",
			"@typescript-eslint/prefer-find": "error",
			"@typescript-eslint/prefer-readonly-parameter-types": "off",
			"@typescript-eslint/prefer-readonly": "error",
			"@typescript-eslint/prefer-regexp-exec": "error",
			"@typescript-eslint/promise-function-async": "off",
			"@typescript-eslint/require-array-sort-compare": "error",
			"@typescript-eslint/restrict-template-expressions": "off",
			"@typescript-eslint/return-await": "error",
			"@typescript-eslint/strict-boolean-expressions": "off",
			"@typescript-eslint/switch-exhaustiveness-check": ["error", {considerDefaultExhaustiveForUnions: true}],
			"@typescript-eslint/typedef": "error"
		}
	},
	{
		files: ["gulpfile.js", "test/**/*.js"],
		rules: {
			"prefer-arrow-callback": "off",
			"@typescript-eslint/explicit-function-return-type": "off",
			"@typescript-eslint/explicit-module-boundary-types": "off",
			"@typescript-eslint/no-floating-promises": "off"
		}
	}
);
