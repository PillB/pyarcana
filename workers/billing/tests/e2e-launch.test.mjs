// Which browser the e2e suites launch (workers/billing/e2e/sandbox-trust.mjs launchOptions).
// Owner's Mac run, 7 Oct 2026: six suites hard-coded the cloud sandbox's Chromium path, so they
// failed at launch on any other machine unless CHROMIUM was exported.
import assert from "node:assert/strict";
import test from "node:test";
import { launchOptions, SANDBOX_CHROMIUM } from "../e2e/sandbox-trust.mjs";

const noCa = "/nonexistent/ca.crt";

test("CHROMIUM wins wherever it is set", () => {
  const o = launchOptions({ env: { CHROMIUM: "/Applications/Chrome for Testing" }, exists: () => true, caPath: noCa });
  assert.equal(o.executablePath, "/Applications/Chrome for Testing");
});

test("in the sandbox, without CHROMIUM, the sandbox's Chromium is used", () => {
  const o = launchOptions({ env: {}, exists: (p) => p === SANDBOX_CHROMIUM, caPath: noCa });
  assert.equal(o.executablePath, SANDBOX_CHROMIUM);
});

test("elsewhere, without CHROMIUM, Playwright's own browser is used (no executablePath at all)", () => {
  const o = launchOptions({ env: {}, exists: () => false, caPath: noCa });
  assert.equal("executablePath" in o, false);
  assert.equal(o.headless, true);
  assert.deepEqual(o.args, [], "no certificate argument off the sandbox");
});
