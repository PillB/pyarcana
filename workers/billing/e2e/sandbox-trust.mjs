// Chromium arguments for reaching real third-party hosts (Google's sign-in script) from the
// Claude Code cloud sandbox, without any stand-in.
//
// Root cause (5 Oct 2026): the sandbox's egress proxy re-signs Chromium's HTTPS with its own
// "CCR agent-proxy interception CA", installed as a file in /usr/local/share/ca-certificates but
// absent from Chromium's own certificate store, so Chromium answers ERR_CERT_AUTHORITY_INVALID.
// The fix trusts exactly that CA's public key (--ignore-certificate-errors-spki-list), read from
// the file at run time; it never turns certificate checking off. On any other machine the file is
// absent and this returns no arguments, so the browser behaves as shipped.
import { createHash, X509Certificate } from 'node:crypto'
import { existsSync, readFileSync } from 'node:fs'

export const SANDBOX_CA = '/usr/local/share/ca-certificates/ccr-agent-proxy.crt'

/** base64(SHA-256(SubjectPublicKeyInfo)) of a PEM certificate: the form Chromium's flag takes. */
export function spkiHash(pem) {
  const spki = new X509Certificate(pem).publicKey.export({ type: 'spki', format: 'der' })
  return createHash('sha256').update(spki).digest('base64')
}

/** Extra Chromium arguments: one trusted key in the sandbox, nothing elsewhere. */
export function sandboxTrustArgs(caPath = SANDBOX_CA) {
  if (!existsSync(caPath)) return []
  return [`--ignore-certificate-errors-spki-list=${spkiHash(readFileSync(caPath, 'utf8'))}`]
}
