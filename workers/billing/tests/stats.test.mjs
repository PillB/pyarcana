/**
 * stats.mjs (port of Vocal Studio's stats.js) against published values:
 * - Wilson score intervals: Newcombe (1998a), Statistics in Medicine 17:857-872, Table I (method 3).
 * - Differences of proportions, hybrid score (method 10): Newcombe (1998b), Statistics in Medicine
 *   17:873-890, Table II examples (a), (b), (d).
 * - Chi-square upper tail: the 0.05 and 0.001 critical values (df 1: 3.841459, 10.827566;
 *   df 2: 5.991465, 13.815511).
 * - NPS: the variance of a +1/0/-1 score, p_P + p_D - (p_P - p_D)^2 (e.g. Rocks 2016, "The true
 *   standard error of the Net Promoter Score").
 */

import assert from "node:assert/strict";
import test from "node:test";

import { chiSquareP, compareRates, meanFromSums, normCdf, npsSummary, sampleRatioMismatch, sampleSizePerArm, wilson } from "../src/stats.mjs";

/**
 * Round to 4 decimals, as the papers print.
 * @param {number} x Value.
 * @returns {number} Rounded.
 */
const r4 = (x) => Math.round(x * 10000) / 10000;

test("Wilson intervals match Newcombe 1998a Table I", () => {
  const cases = [
    [81, 263, 0.2553, 0.3662],
    [15, 148, 0.0624, 0.1605],
    [0, 20, 0, 0.1611],
    [1, 29, 0.0061, 0.1718]
  ];
  for (const [k, n, lo, hi] of cases) {
    const w = wilson(k, n);
    assert.deepEqual([r4(w.lo), r4(w.hi)], [lo, hi], `${k}/${n}`);
  }
  assert.deepEqual(wilson(0, 0), { rate: null, lo: null, hi: null });
});

test("Newcombe's hybrid score interval for a difference matches 1998b examples (a), (b), (d)", () => {
  const cases = [
    [48, 80, 56, 70, 0.0524, 0.3339],
    [3, 10, 9, 10, 0.1705, 0.809],
    [0, 29, 5, 56, -0.0381, 0.1926]
  ];
  for (const [kc, nc, kt, nt, lo, hi] of cases) {
    const c = compareRates(kc, nc, kt, nt);
    assert.deepEqual([r4(c.lo), r4(c.hi)], [lo, hi], `${kt}/${nt} - ${kc}/${nc}`);
  }
  assert.equal(compareRates(0, 0, 1, 2).diff, null);
});

test("chi-square tail at the published critical values; normal CDF at 1.96", () => {
  assert.ok(Math.abs(chiSquareP(3.841459, 1) - 0.05) < 1e-6);
  assert.ok(Math.abs(chiSquareP(10.827566, 1) - 0.001) < 1e-7);
  assert.ok(Math.abs(chiSquareP(5.991465, 2) - 0.05) < 1e-6);
  assert.ok(Math.abs(chiSquareP(13.815511, 2) - 0.001) < 1e-7);
  assert.ok(Math.abs(normCdf(1.959964) - 0.975) < 1e-6);
});

test("sample-ratio mismatch flags only below p = 0.001", () => {
  assert.equal(sampleRatioMismatch([500, 500], [1, 1]).p, 1);
  const edge = sampleRatioMismatch([450, 550], [1, 1]);
  assert.deepEqual([edge.chi2, edge.flagged], [10, false], "p = 0.0016 is not flagged");
  const broken = sampleRatioMismatch([440, 560], [1, 1]);
  assert.deepEqual([r4(broken.chi2), broken.flagged], [14.4, true]);
  assert.equal(sampleRatioMismatch([0, 0], [1, 1]).flagged, false);
});

test("means and NPS with their intervals; NPS gets no interval below 30 answers", () => {
  const m = meanFromSums(5, 15, 55);
  assert.deepEqual([m.mean, r4(m.sd), r4(m.hi - m.mean)], [3, 1.5811, 1.3859]);
  const nps = npsSummary(50, 30, 20);
  assert.deepEqual([nps.n, nps.nps, r4(nps.lo), r4(nps.hi)], [100, 30, 14.6922, 45.3078]);
  const small = npsSummary(10, 5, 4);
  assert.deepEqual([small.n, r4(small.nps), small.lo, small.hi], [19, 31.5789, null, null]);
  assert.deepEqual(npsSummary(0, 0, 0), { n: 0, nps: null, lo: null, hi: null });
  assert.equal(sampleSizePerArm(0.05, 0.1), 432);
});
