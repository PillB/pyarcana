/**
 * The payment-provider registry: provider name -> adapter.
 *
 * Today an adapter needs one method, used by DELETE /v1/me:
 *   cancel(ctx, subscriptionRow) -> Promise<{ok: true, status: string} | {ok: false, reason: string}>
 * where `status` is the state the provider CONFIRMED on a re-read.
 *
 * It is EMPTY until the payment stage adds Mercado Pago and Creem. With it
 * empty, deleting an account that still has a pending, active or past_due
 * subscription answers 502 cancel_failed and deletes nothing: the worker
 * never erases the only record tying a live charge to a person. Tests (and
 * the payment stage) pass their own registry through
 * handleRequest(request, env, {providers}).
 */

/** The production registry (empty in this stage). */
export const DEFAULT_PROVIDERS = Object.freeze({});
