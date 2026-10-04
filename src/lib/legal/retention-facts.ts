/**
 * How long the account edition keeps each kind of data, in days: the figures the privacy notice
 * prints. Each one equals the worker constant that enforces it (workers/billing/src/retention.mjs,
 * sessions.mjs); retention-facts.test.ts fails when the two drift, so the notice can never promise
 * a period the sweep does not keep.
 */
export const RETENTION_DAYS = {
  /** Sign-in records (sessions: method and times), after the session expired. */
  signinRecords: 730,
  /** A closed bug report's text. */
  reportClosed: 365,
  /** Any bug report's text, from filing. */
  reportMax: 730,
  /** A screenshot, after its report closed. */
  screenshotClosed: 90,
  /** Any screenshot, from filing. */
  screenshotMax: 180,
  /** Anonymous measurement events and experiment arms. */
  measurement: 180,
  /** Survey answers. */
  surveys: 730,
  /** Audit rows (admin actions, account changes). */
  audit: 730,
  /** After this long without a sign-in, an account MAY be deleted (owner's discretion; no sweep). */
  inactiveMay: 730,
} as const

/** Session cookie: renewed while used, ends after this many idle days, and after the maximum. */
export const SESSION_IDLE_DAYS = 30
export const SESSION_MAX_DAYS = 180

/** ARCO reply deadlines, in business days (DS 016-2024-JUS, as stated by the owner's setup thread). */
export const ARCO_DAYS = { access: 20, other: 10 } as const

/** Hours to notify the ANPD of a personal-data breach (DS 016-2024-JUS). */
export const BREACH_AUTHORITY_HOURS = 48
