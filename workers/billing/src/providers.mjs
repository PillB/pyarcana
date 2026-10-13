/**
 * The payment-provider registry: provider name -> adapter.
 *
 * An adapter has:
 *   configured(env, plan) -> boolean      the rail can take this plan now
 *   startCheckout(ctx, args) -> {ok, providerRef, url} | {ok: false}
 *   pendingSubscription: boolean          whether a checkout already
 *                                         creates a (pending) subscription
 *   cancel(ctx, sub, {mode}) -> {ok: true, status} | {ok: false, reason}
 *                                         `status` is what a RE-READ of the
 *                                         provider confirmed, already stored
 *   sync(ctx, sub), syncCheckout(ctx, checkout) -> {ok}
 *                                         re-read and apply (refresh,
 *                                         reconciliation)
 *
 * DELETE /v1/me, the cancel route, refresh and reconciliation all go through
 * ctx.providers, which is this registry unless a test injects its own
 * (handleRequest(request, env, {providers})). A provider that is not
 * configured answers {ok: false} everywhere, so deleting an account with a
 * live subscription on an unconfigured rail is 502 cancel_failed with
 * nothing deleted: the worker never erases the only record tying a live
 * charge to a person.
 */

import { creemAdapter } from "./creem-sync.mjs";
import { mercadopagoAdapter } from "./mp-sync.mjs";

/** The production registry. */
export const DEFAULT_PROVIDERS = Object.freeze({ mercadopago: mercadopagoAdapter, creem: creemAdapter });
