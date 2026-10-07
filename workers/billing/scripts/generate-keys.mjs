#!/usr/bin/env node
/**
 * Generate the ECDSA P-256 key pair the worker signs licence tokens (PAL) with
 * (DESIGN-v3-delta D-ORCH-03). Ported from Vocal Studio's generate-keys.mjs.
 *
 * Node 20+, no dependencies, nothing written to disk:
 *   node workers/billing/scripts/generate-keys.mjs [kid]      (kid default "k1")
 *
 * Prints:
 *   1. the base64 PKCS#8 private key: the value for
 *        npx wrangler secret put LICENSE_PRIVATE_KEY_PKCS8_B64
 *      (wrangler prompts for it; paste it there, never in chat, a file or git);
 *   2. the public JWK: safe to commit; it goes into the site's public config
 *      (licence.publicKeys) and the worker publishes it at GET /v1/jwks;
 *   3. the LICENSE_KEY_ID line for wrangler.toml.
 *
 * Rotation: keep the old public JWK in the site config and set it as the
 * worker var LICENSE_PREV_PUBLIC_JWK until every old token has expired (72 h).
 */

import { webcrypto } from "node:crypto";
import { pathToFileURL } from "node:url";

const KID_RE = /^[A-Za-z0-9_.-]{1,64}$/;

/**
 * Generate a key pair.
 * @param {string} kid Key id.
 * @returns {Promise<{pkcs8: string, jwk: Object}>} Private key (base64 PKCS#8) and public JWK.
 */
export async function generateLicenceKeys(kid) {
  if (!KID_RE.test(kid)) {
    throw new Error("the key id must be 1-64 characters from A-Z a-z 0-9 _ . -");
  }
  const pair = await webcrypto.subtle.generateKey({ name: "ECDSA", namedCurve: "P-256" }, true, ["sign", "verify"]);
  const pkcs8 = Buffer.from(await webcrypto.subtle.exportKey("pkcs8", pair.privateKey)).toString("base64");
  const pub = await webcrypto.subtle.exportKey("jwk", pair.publicKey);
  return { pkcs8, jwk: { kty: "EC", crv: "P-256", x: pub.x, y: pub.y, alg: "ES256", use: "sig", kid, key_ops: ["verify"] } };
}

/**
 * Print both halves with the owner's instructions.
 * @param {string} kid Key id.
 * @returns {Promise<void>} Resolves when printed.
 */
async function main(kid) {
  const { pkcs8, jwk } = await generateLicenceKeys(kid);
  const lines = [
    "",
    "=== PRIVATE KEY (base64 PKCS#8): SECRET ===",
    "",
    pkcs8,
    "",
    "From workers/billing/, run this and paste the key at wrangler's prompt:",
    "  npx wrangler secret put LICENSE_PRIVATE_KEY_PKCS8_B64",
    "Never commit it, paste it into the site, or send it in chat or email: whoever holds it",
    "can mint Pro licences. If it leaks, generate a new pair with a new kid and redeploy.",
    "Clear this terminal's scrollback afterwards.",
    "",
    "=== PUBLIC JWK (safe to commit) ===",
    "",
    "Add it to the site's public config (licence.publicKeys):",
    "",
    JSON.stringify(jwk),
    "",
    "And in workers/billing/wrangler.toml [vars]:",
    `  LICENSE_KEY_ID = "${kid}"`,
    ""
  ];
  console.log(lines.join("\n"));
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main(process.argv[2] || "k1").catch((error) => {
    console.error(`key generation failed: ${error && error.message ? error.message : "unknown"}`);
    process.exit(1);
  });
}
