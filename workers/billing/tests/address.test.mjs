/**
 * address.mjs: email normalisation for lookup (trim + lowercase only) and the
 * canonical form used ONLY for trial anti-abuse claims (+tags stripped, Gmail
 * dots stripped, googlemail folded into gmail).
 */

import assert from "node:assert/strict";
import test from "node:test";

import { canonicalEmail, normalizeEmail } from "../src/address.mjs";

test("normalizeEmail trims and lowercases, nothing more", () => {
  assert.equal(normalizeEmail("  Ana.Perez+Py@Gmail.COM "), "ana.perez+py@gmail.com");
  assert.equal(normalizeEmail("a@b.test"), "a@b.test");
});

test("normalizeEmail refuses things that are not an address", () => {
  for (const bad of ["", "   ", "no-at-sign", "a@b", "a@@b.test", "a b@c.test", "@b.test", "a@.test", null, undefined, 42]) {
    assert.equal(normalizeEmail(bad), "", String(bad));
  }
  assert.equal(normalizeEmail(`${"a".repeat(65)}@b.test`), "", "local part over 64");
  assert.equal(normalizeEmail(`a@${"b".repeat(250)}.test`), "", "address over 254");
});

test("canonicalEmail strips +tags for every domain", () => {
  assert.equal(canonicalEmail("ana+one@example.test"), "ana@example.test");
  assert.equal(canonicalEmail("ana+one+two@example.test"), "ana@example.test");
});

test("canonicalEmail strips dots only for Gmail and folds googlemail", () => {
  assert.equal(canonicalEmail("a.n.a+x@gmail.com"), "ana@gmail.com");
  assert.equal(canonicalEmail("a.n.a@googlemail.com"), "ana@gmail.com");
  assert.equal(canonicalEmail("a.n.a@example.test"), "a.n.a@example.test");
});

test("canonicalEmail keeps an address whose local part would vanish", () => {
  assert.equal(canonicalEmail("+tag@example.test"), "+tag@example.test");
  assert.equal(canonicalEmail(""), "");
});
