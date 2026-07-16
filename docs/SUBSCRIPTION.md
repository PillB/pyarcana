# Subscription System — El Arte de Python

> Multi-region subscription system supporting Peru (Yape, Plin, BCP) and worldwide (US, Europe, rest of world).

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     Pricing Page (UI)                        │
│  Country selector + Billing toggle + 3 plan cards            │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│              /api/subscription/checkout                      │
│  Validates: auth + plan + country → creates Subscription     │
│  In TEST MODE: creates TRIALING subscription (7-day trial)   │
│  In PRODUCTION: redirects to payment provider checkout       │
└──────────┬────────────────┬──────────────────┬──────────────┘
           │                │                  │
           ▼                ▼                  ▼
    ┌──────────┐    ┌────────────┐    ┌───────────────┐
    │MercadoPago│    │  Paddle    │    │ Lemon Squeezy │
    │  (Peru)   │    │ (Worldwide)│    │  (Fallback)   │
    │Yape/Plin  │    │Apple/Google│    │  MoR + VAT    │
    │BCP/IBK    │    │PayPal/Cards│    │  Cards+PayPal │
    └──────────┘    └────────────┘    └───────────────┘
           │                │                  │
           └────────────────┼──────────────────┘
                            ▼
                   ┌────────────────┐
                   │  Webhook Handler│
                   │  (mark payment  │
                   │  SUCCEEDED)     │
                   └────────────────┘
```

## Plans

| Plan | Peru (PEN) | US (USD) | EU (EUR) | Sections | Exams | Certificate |
|------|-----------|----------|----------|----------|-------|-------------|
| **Free** | S/ 0 | $0 | €0 | 1-5 only | ✗ | ✗ |
| **Pro** | S/ 29/mes | $9.99/mo | €8.99/mo | All 52 | ✓ | ✓ |
| **Team** | S/ 99/mes | $29.99/mo | €27.99/mo | All 52 | ✓ | ✓ + Mentoría |

**Annual discount**: 17% (pay 10 months, get 12).

## Pricing Rationale (based on market research)

### Peru (S/29/mes = ~$8 USD)
- PPP-adjusted: Peru's GDP per capita is ~1/4 of US
- Local competitors (Crehana, Platzi LATAM) charge S/20-50/mes
- Sweet spot for online vocal/singing/coding content in LATAM: $8-16/mes

### US ($9.99/mes)
- Industry standard for online course subscriptions: $9-29/mes
- Competitors: DataCamp ($25/mo), Kaggle Learn (free), Coursera Plus ($59/mo)
- Positioned as affordable alternative to DataCamp

### EU (€8.99/mes)
- ~$10 USD equivalent, competitive with EU-based platforms
- VAT handled by Paddle/Lemon Squeezy (Merchant of Record)

## Payment Provider Strategy

### Phase 1 (Current — Test Mode)
- All checkout is MANUAL (test mode): creates TRIALING subscription with 7-day trial
- No real payment is processed
- Suitable for friends & family testing

### Phase 2 (Peru Launch)
- **MercadoPago** for Peru: Yape (14M users), Plin, BCP/Interbank cards, PagoEfectivo
- MercadoPago Subscriptions API for recurring card billing
- Yape/Plin for annual passes only (no recurring support)

### Phase 3 (Global Launch)
- **Paddle** for worldwide: Apple Pay, Google Pay, PayPal, cards
- Paddle handles VAT/GST for EU (Merchant of Record)
- PEN currency support for Peruvian buyers

### Phase 4 (Scale)
- Add **Lemon Squeezy** as Paddle fallback (easier approval)
- Optional: Stripe via US LLC (Stripe Atlas) for power users

## Database Schema

### SubscriptionPlan (3 rows, seeded once)
- `code`: "free" | "pro" | "team"
- `pricingJSON`: `{"PE": {"monthly": 29, "yearly": 290, "currency": "PEN"}, ...}`
- `featuresJSON`: `["52 secciones", "Exámenes anti-plagio", ...]`
- `maxSections`: -1 (unlimited) or 5 (free tier limit)

### Subscription (1 per user)
- `userId`: unique (one active subscription per user)
- `planId`: FK to SubscriptionPlan
- `status`: ACTIVE | TRIALING | PAST_DUE | CANCELED | EXPIRED
- `billingCycle`: MONTHLY | YEARLY
- `provider`: MANUAL | MERCADOPAGO | PADDLE | LEMON_SQUEEZY | STRIPE
- `currentPeriodEnd`: when the current billing period ends
- `trialEnd`: when the trial ends (7 days from creation)

### Payment (1 per charge)
- `amount` + `currency`: what was charged
- `provider` + `providerPaymentId`: provider-specific tracking
- `status`: PENDING | SUCCEEDED | FAILED | REFUNDED

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/subscription/plans` | GET | List all active plans |
| `/api/subscription/plans` | POST | Seed/update plans (admin only) |
| `/api/subscription/checkout` | POST | Initiate checkout `{planCode, billingCycle, country}` |
| `/api/subscription/status` | GET | Get current user's subscription status |

## Country Detection

```typescript
// Auto-detect from timezone
function detectCountry(): CountryCode {
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
  if (tz.includes('America/Lima')) return 'PE'
  if (tz.startsWith('Europe/')) return 'EU'
  if (tz.includes('America/New_York') || ...) return 'US'
  return 'REST'
}
```

Users can override via the country dropdown on the pricing page.

## Environment Variables (for production)

```env
# Payment provider keys (set when going live)
PAYMENT_PROVIDER=MANUAL  # MANUAL | MERCADOPAGO | PADDLE | LEMON_SQUEEZY

# MercadoPago (Peru)
MERCADOPAGO_ACCESS_TOKEN=...
MERCADOPAGO_PUBLIC_KEY=...

# Paddle (Worldwide)
PADDLE_API_KEY=...
PADDLE_WEBHOOK_SECRET=...

# Lemon Squeezy (Fallback)
LEMON_SQUEEZY_API_KEY=...
LEMON_SQUEEZY_WEBHOOK_SECRET=...
```

## Test Accounts

See `docs/TEST_ACCOUNTS.md` (gitignored) for 2 admin + 10 test student accounts with strong passwords.

All test accounts are assigned the **Pro** plan for free (amount=0, provider=MANUAL) so testers have full access.

## Yape/Plin Limitation

**Important**: Yape and Plin do NOT support recurring/subscription payments. Peruvian subscribers must use a credit/debit card for monthly billing. Yape/Plin can only be used for:
- Annual pass (one-time payment)
- Single-course purchases

The pricing page shows this note for PE country:
> "Yape, Plin, BCP, Interbank · MercadoPago"
> (Yape/Plin for annual only; monthly requires card)

## References

- [MercadoPago Peru Docs](https://www.mercadopago.com.pe/developers)
- [Paddle Documentation](https://developer.paddle.com)
- [Lemon Squeezy Docs](https://docs.lemonsqueezy.com)
- [Yape Recurrente FAQ](https://web.flow.cl/en-pe/preguntas-frecuentes/yape-recurrente)
