/**
 * Classes whose contrast is checked by src/lib/cloud/__tests__/a11y-render.test.ts against the
 * site tokens in globals.css. Change them there and the test recomputes the ratios.
 *
 * - Error messages: body text in the foreground colour (WCAG 1.4.3, 4.5:1), the error signalled by
 *   a destructive border and tint plus role="alert". text-destructive on bg-destructive/5 measured
 *   4.05:1 on the light background.
 * - Checkboxes that carry legal weight (age, terms, 18+): a muted-foreground border for a 3:1
 *   boundary (WCAG 1.4.11); the shared border-input measured about 1.2:1.
 */
export const ERROR_ALERT_CLASS = 'rounded-md border border-destructive/60 bg-destructive/10 px-3 py-2 text-sm text-foreground'
export const LEGAL_CHECKBOX_CLASS = 'border-muted-foreground'
