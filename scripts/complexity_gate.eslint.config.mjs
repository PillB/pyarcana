// Gate-local ESLint configuration for scripts/complexity_gate.mjs. It is used only by that gate
// (overrideConfigFile), not by `bun run lint`, whose root config ignores scripts/ and docs/.
//
// The rule threshold is 0, so ESLint reports every function with its score. The gate applies the
// ceiling itself, and needs every function's score to key a per-function baseline stably.
import tseslint from "typescript-eslint";

const complexity = { complexity: ["error", 0] };

export default [
  {
    files: ["**/*.{ts,mts,cts}"],
    languageOptions: { parser: tseslint.parser, sourceType: "module" },
    rules: complexity,
  },
  {
    files: ["**/*.tsx"],
    languageOptions: {
      parser: tseslint.parser,
      sourceType: "module",
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    rules: complexity,
  },
  {
    files: ["**/*.{js,mjs,cjs,jsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    rules: complexity,
  },
];
