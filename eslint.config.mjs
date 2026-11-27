import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const eslintConfig = [...nextCoreWebVitals, ...nextTypescript, {
  rules: {
    // TypeScript rules
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-unused-vars": "off",
    "@typescript-eslint/no-non-null-assertion": "off",
    "@typescript-eslint/ban-ts-comment": "off",
    "@typescript-eslint/prefer-as-const": "off",
    "@typescript-eslint/no-unused-disable-directive": "off",
    
    // React rules
    "react-hooks/exhaustive-deps": "off",
    "react-hooks/purity": "off",
    "react/no-unescaped-entities": "off",
    "react/display-name": "off",
    "react/prop-types": "off",
    "react-compiler/react-compiler": "off",
    
    // Next.js rules
    "@next/next/no-img-element": "off",
    "@next/next/no-html-link-for-pages": "off",
    
    // General JavaScript rules
    "prefer-const": "off",
    "no-unused-vars": "off",
    "no-console": "off",
    "no-debugger": "off",
    "no-empty": "off",
    "no-irregular-whitespace": "off",
    "no-case-declarations": "off",
    "no-fallthrough": "off",
    "no-mixed-spaces-and-tabs": "off",
    "no-redeclare": "off",
    "no-undef": "off",
    "no-unreachable": "off",
    "no-useless-escape": "off",
  },
}, {
  // chore(lint): strict per-function ceiling for newly introduced learning-parity code.
  // Unlike the legacy aggregate ratchet, debt reduction elsewhere cannot hide a violation here.
  files: ["src/lib/setup/shared-state.ts", "src/lib/learning-checks.ts", "src/components/course/LearningCheckCard.tsx", "src/lib/tracks/storage-admission.ts", "src/lib/tracks/shared-state.ts", "src/lib/learning-resume.ts", "src/components/course/LearningResumeLink.tsx"],
  rules: { complexity: ["error", 15] }
}, {
  // Local-only folders that a checkout on the owner's computer holds and CI never has: agent
  // worktrees (.claude/worktrees, each a full copy of the repository), the static-journeys build
  // (.ci-static) and the live checks' Playwright install (workers/billing/e2e/node_modules). Linting
  // them made a local `bun run lint` report 88 errors that CI never sees (25 Nov 2026).
  ignores: ["node_modules/**", ".next/**", "out/**", "build/**", "next-env.d.ts", "examples/**", "skills", "scripts/**", "docs/**",
    ".claude/**", ".ci-static/**", "workers/billing/e2e/node_modules/**"]
}];

export default eslintConfig;
