/**
 * config.mjs: typed parsing of [vars] with clamped defaults, so a typo in
 * wrangler.toml degrades to the documented default instead of NaN.
 */

import assert from "node:assert/strict";
import test from "node:test";

import {
  adminEmails,
  emailDailyCap,
  graceDays,
  intVar,
  isLocalhostOrigin,
  listVar,
  reportAttachmentsCapBytes,
  sessionMaxSeconds,
  termsVersion,
  trialDays
} from "../src/config.mjs";

test("intVar parses integers, clamps to range and falls back on junk", () => {
  assert.equal(intVar({ X: "12" }, "X", 5, 1, 20), 12);
  assert.equal(intVar({ X: "99" }, "X", 5, 1, 20), 20);
  assert.equal(intVar({ X: "0" }, "X", 5, 1, 20), 1);
  assert.equal(intVar({ X: "abc" }, "X", 5, 1, 20), 5);
  assert.equal(intVar({ X: "7.5" }, "X", 5, 1, 20), 5);
  assert.equal(intVar({}, "X", 5, 1, 20), 5);
});

test("the documented defaults hold: trial 7, grace 7, session cap 180 days, email cap 90", () => {
  assert.equal(trialDays({}), 7);
  assert.equal(graceDays({}), 7);
  assert.equal(sessionMaxSeconds({}), 180 * 86400);
  assert.equal(emailDailyCap({}), 90);
  assert.equal(trialDays({ TRIAL_DAYS: "30" }), 30);
});

test("listVar splits and trims a comma list", () => {
  assert.deepEqual(listVar({ L: " a, b ,,c " }, "L"), ["a", "b", "c"]);
  assert.deepEqual(listVar({}, "L"), []);
});

test("admin emails are normalized", () => {
  assert.deepEqual(adminEmails({ ADMIN_EMAILS: " Owner@Gmail.com ,x@y.test" }), ["owner@gmail.com", "x@y.test"]);
  assert.deepEqual(adminEmails({}), []);
});

test("termsVersion is the trimmed var or empty", () => {
  assert.equal(termsVersion({ TERMS_VERSION: " 2026-09-28 " }), "2026-09-28");
  assert.equal(termsVersion({}), "");
});

test("isLocalhostOrigin accepts only http://localhost[:port]", () => {
  assert.equal(isLocalhostOrigin("http://localhost:3000"), true);
  assert.equal(isLocalhostOrigin("http://localhost"), true);
  assert.equal(isLocalhostOrigin("http://localhost.evil.test"), false);
  assert.equal(isLocalhostOrigin("https://localhost:3000"), false);
  assert.equal(isLocalhostOrigin("http://127.0.0.1:3000"), false);
  assert.equal(isLocalhostOrigin("garbage"), false);
});

test("the screenshot storage ceiling defaults to 200 MiB, clamped to 1..9000 MiB", () => {
  assert.equal(reportAttachmentsCapBytes({}), 200 * 1024 * 1024);
  assert.equal(reportAttachmentsCapBytes({ REPORT_ATTACHMENTS_CAP_MB: "0" }), 1024 * 1024);
  assert.equal(reportAttachmentsCapBytes({ REPORT_ATTACHMENTS_CAP_MB: "50" }), 50 * 1024 * 1024);
  assert.equal(reportAttachmentsCapBytes({ REPORT_ATTACHMENTS_CAP_MB: "junk" }), 200 * 1024 * 1024);
});
