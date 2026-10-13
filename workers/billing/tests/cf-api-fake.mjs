// A fake of Cloudflare's token-verify endpoints for operator-scripts.test.mjs (TEST DOUBLE: reported
// to the owner as a MUST item; the real endpoints are exercised by every real deploy).
//   GET /user/tokens/verify               -> active for tokens in FAKE_CF_TOKENS
//   GET /accounts/<id>/tokens/verify      -> active for tokens in FAKE_CF_ACCOUNT_TOKENS
//   tokens in FAKE_CF_EXPIRED             -> 200 with status "expired" (as Cloudflare reports one)
//   anything else                         -> 401 "Invalid API Token" (a revoked or mistyped token)
//   /blocked/...                          -> 403 plain text, as a proxy or firewall answers
// Response shapes follow Cloudflare's API v4 envelope ({success, errors, messages, result}).
// Prints the port it listens on, then serves until killed.
import { createServer } from 'node:http'

const list = (name) => (process.env[name] || '').split(',').filter(Boolean)
const user = list('FAKE_CF_TOKENS')
const account = list('FAKE_CF_ACCOUNT_TOKENS')
const expired = list('FAKE_CF_EXPIRED')

const send = (res, code, body) => {
  res.writeHead(code, { 'content-type': 'application/json' })
  res.end(JSON.stringify(body))
}

const server = createServer((req, res) => {
  // Under /blocked: what a proxy or firewall answers instead of Cloudflare (seen in the sandbox:
  // "Host not in allowlist"), plain text, not Cloudflare's JSON.
  if (req.url.startsWith('/blocked/')) {
    res.writeHead(403, { 'content-type': 'text/plain' })
    return res.end('Host not in allowlist: api.cloudflare.com.')
  }
  const token = (req.headers.authorization || '').replace(/^Bearer /, '')
  const isUser = req.url === '/user/tokens/verify'
  const isAccount = /^\/accounts\/[^/]+\/tokens\/verify$/.test(req.url)
  if (!isUser && !isAccount) return send(res, 404, { success: false, errors: [{ code: 7003, message: 'No route' }], messages: [], result: null })
  if (expired.includes(token)) return send(res, 200, { success: true, errors: [], messages: [], result: { id: 'x', status: 'expired' } })
  if ((isUser && user.includes(token)) || (isAccount && account.includes(token))) {
    return send(res, 200, { success: true, errors: [], messages: [{ code: 10000, message: 'This API Token is valid and active' }], result: { id: 'x', status: 'active' } })
  }
  return send(res, 401, { success: false, errors: [{ code: 1000, message: 'Invalid API Token' }], messages: [], result: null })
})
server.listen(0, '127.0.0.1', () => console.log(server.address().port))
