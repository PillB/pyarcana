// Gate-local ESLint configuration for scripts/complexity_gate.mjs. It is used only by that gate
// (overrideConfigFile), not by `bun run lint`, whose root config ignores scripts/ and docs/.
//
// The one rule, gate/measure, is ESLint's `complexity` rule at threshold 0 with a stable identity on
// each report (see complexity_gate.rule.mjs). It reports every function with its score; the gate
// applies the ceiling itself, and needs every score to key a per-function baseline.
import tseslint from "typescript-eslint";
import measure from "./complexity_gate.rule.mjs";

const rules = { "gate/measure": "error" };
const plugins = { gate: { rules: { measure } } };

export default [
  {
    files: ["**/*.{ts,mts,cts}"],
    plugins,
    languageOptions: { parser: tseslint.parser, sourceType: "module" },
    rules,
  },
  {
    files: ["**/*.tsx"],
    plugins,
    languageOptions: {
      parser: tseslint.parser,
      sourceType: "module",
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    rules,
  },
  {
    files: ["**/*.{js,mjs,cjs,jsx}"],
    plugins,
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    rules,
  },
];
