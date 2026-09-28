/**
 * Validation for bug reports (DESIGN-v3): the QA enums, the context
 * allowlist and the screenshot attachments.
 *
 * The enums mirror QA_CATEGORIES / QA_CAUSES / QA_SEVERITIES in
 * src/lib/qa-session.ts; tests/reports.test.mjs parses that file and fails
 * if the two drift apart.
 *
 * Attachments: at most 3, each PNG, JPEG or WebP of at most 1 MiB, sent as
 * base64 or a base64 data URL. The declared type must match the file's own
 * magic bytes (a GIF, an SVG or HTML renamed .png is refused), and a data
 * URL's type must match the declared one.
 */

import { base64ToBytes } from "./crypto.mjs";

/** Mirrors QA_CATEGORIES in src/lib/qa-session.ts. */
export const REPORT_CATEGORIES = Object.freeze([
  "functionality",
  "content",
  "unexplained-term",
  "unanswerable-question",
  "assessment-design",
  "ui-ux",
  "accessibility",
  "compatibility",
  "other"
]);

/** Mirrors QA_CAUSES in src/lib/qa-session.ts. */
export const REPORT_CAUSES = Object.freeze([
  "content-gap",
  "logic-state",
  "navigation",
  "data-persistence",
  "browser-device",
  "accessibility",
  "visual-layout",
  "unknown"
]);

/** Mirrors QA_SEVERITIES in src/lib/qa-session.ts. */
export const REPORT_SEVERITIES = Object.freeze(["blocker", "high", "medium", "low"]);

/** Triage states (DESIGN-v3). */
export const REPORT_STATUSES = Object.freeze(["new", "triaged", "in_progress", "fixed", "wontfix", "duplicate"]);

/** Where a report came from. */
export const REPORT_SOURCES = Object.freeze(["qa_harness", "feedback"]);

/** Largest attachment, in bytes. */
export const ATTACHMENT_MAX_BYTES = 1024 * 1024;

/** Attachments per report. */
export const ATTACHMENTS_MAX = 3;

/**
 * True when `bytes` starts with `prefix`.
 * @param {Uint8Array} bytes Bytes.
 * @param {number[]} prefix Expected leading bytes.
 * @param {number} [offset] Where to look.
 * @returns {boolean} Match.
 */
function hasBytes(bytes, prefix, offset = 0) {
  return bytes.length >= offset + prefix.length && prefix.every((b, i) => bytes[offset + i] === b);
}

const RIFF = [0x52, 0x49, 0x46, 0x46];
const WEBP = [0x57, 0x45, 0x42, 0x50];

const MAGIC = [
  ["image/png", (b) => hasBytes(b, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])],
  ["image/jpeg", (b) => hasBytes(b, [0xff, 0xd8, 0xff])],
  ["image/webp", (b) => hasBytes(b, RIFF) && hasBytes(b, WEBP, 8)]
];

/**
 * The image type a file's magic bytes prove, or null.
 * @param {Uint8Array} bytes File bytes.
 * @returns {string|null} MIME type.
 */
export function sniffImage(bytes) {
  const hit = MAGIC.find(([, test]) => test(bytes));
  return hit ? hit[0] : null;
}

const ALLOWED_MIME = new Set(MAGIC.map(([mime]) => mime));

/**
 * Text of at most `max` characters, or null (null stays null).
 * @param {number} max Maximum length.
 * @returns {function(unknown): (string|null|undefined)} Parser (undefined = drop).
 */
function text(max) {
  return (v) => (v === null ? null : typeof v === "string" ? v.slice(0, max) : undefined);
}

/**
 * An integer in [min, max], or null.
 * @param {number} min Minimum.
 * @param {number} max Maximum.
 * @returns {function(unknown): (number|null|undefined)} Parser (undefined = drop).
 */
function int(min, max) {
  return (v) => (v === null ? null : Number.isInteger(v) && v >= min && v <= max ? v : undefined);
}

/**
 * A {width, height} viewport.
 * @param {unknown} v Value.
 * @returns {{width: number, height: number}|undefined} Viewport (undefined = drop).
 */
function viewport(v) {
  const size = int(0, 100000);
  const ok = v && typeof v === "object" && size(v.width) !== undefined && size(v.height) !== undefined;
  return ok ? { width: v.width, height: v.height } : undefined;
}

/** The context keys a report may carry (QAContext), each with its parser. */
const CONTEXT_FIELDS = {
  path: text(300),
  hash: text(300),
  sectionId: text(40),
  sectionIndex: int(1, 999),
  sectionTitle: text(200),
  subStep: text(60),
  viewport,
  scrollY: int(0, 100000000),
  userAgent: text(400),
  language: text(20),
  deploymentSha: text(64),
  elementHint: text(300)
};

/**
 * Keep only known, well-typed context fields. Context is diagnostic, so a
 * bad field is dropped rather than failing the whole report.
 * @param {unknown} value Raw context.
 * @returns {Object} Clean context.
 */
export function sanitizeContext(value) {
  const out = {};
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return out;
  }
  for (const [key, parse] of Object.entries(CONTEXT_FIELDS)) {
    const clean = key in value ? parse(value[key]) : undefined;
    if (clean !== undefined) {
      out[key] = clean;
    }
  }
  return out;
}

/**
 * A refused attachment.
 * @param {string} reason Reason code.
 * @param {number} [status] HTTP status.
 * @returns {{error: Object}} Error.
 */
function refuse(reason, status = 400) {
  return { error: { status, body: { ok: false, reason } } };
}

/**
 * The base64 payload of an attachment, checking a data URL's type.
 * @param {string} data base64 or data URL.
 * @param {string} declared Declared MIME type.
 * @returns {string|null} base64 text, or null when the data URL disagrees.
 */
function base64Payload(data, declared) {
  const match = /^data:([^;,]+);base64,/i.exec(data);
  if (!match) {
    return data;
  }
  return match[1].toLowerCase() === declared ? data.slice(match[0].length) : null;
}

/**
 * Decode and verify one attachment.
 * @param {unknown} item `{mime, data}`.
 * @returns {{mime: string, bytes: Uint8Array}|{error: Object}} Attachment or error.
 */
function decodeAttachment(item) {
  const declared = item && typeof item === "object" ? item.mime : null;
  if (!ALLOWED_MIME.has(declared) || typeof item.data !== "string") {
    return refuse("bad_attachment");
  }
  const payload = base64Payload(item.data, declared);
  const bytes = payload === null ? null : base64ToBytes(payload);
  if (!bytes) {
    return refuse("bad_attachment");
  }
  if (bytes.byteLength > ATTACHMENT_MAX_BYTES) {
    return refuse("attachment_too_large", 413);
  }
  return sniffImage(bytes) === declared ? { mime: declared, bytes } : refuse("bad_attachment");
}

/**
 * Decode every attachment of a report.
 * @param {unknown} value Raw `attachments`.
 * @returns {{items: Array<{mime: string, bytes: Uint8Array}>}|{error: Object}} Attachments or error.
 */
export function parseAttachments(value) {
  if (value === undefined || value === null) {
    return { items: [] };
  }
  if (!Array.isArray(value)) {
    return refuse("bad_attachments");
  }
  if (value.length > ATTACHMENTS_MAX) {
    return refuse("too_many_attachments");
  }
  const items = [];
  for (const item of value) {
    const decoded = decodeAttachment(item);
    if (decoded.error) {
      return decoded;
    }
    items.push(decoded);
  }
  return { items };
}

/**
 * A stored BLOB as bytes: D1 may hand back an Array, an ArrayBuffer or a
 * Uint8Array (the exact shape is unverified against live D1).
 * @param {unknown} value Column value.
 * @returns {Uint8Array} Bytes.
 */
export function blobBytes(value) {
  if (value instanceof Uint8Array) {
    return value;
  }
  if (value instanceof ArrayBuffer) {
    return new Uint8Array(value);
  }
  return Uint8Array.from(Array.isArray(value) ? value : []);
}
