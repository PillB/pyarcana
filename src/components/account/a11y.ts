import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

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

/**
 * The final "delete" action in a confirm dialog. The shared destructive button measured 4.21:1 on
 * hover in light mode (destructive/90 over the background) and, used through AlertDialogAction
 * (default variant underneath), 3.59:1 at rest in dark mode (plain bg-destructive). Here: full
 * destructive at rest and on hover in light (4.74:1), destructive/60 in dark (7.32:1), and the
 * hover cue is a darker fill (brightness), which only raises the contrast with the white label.
 * A <Button variant="destructive"> adds DESTRUCTIVE_HOVER_CLASS so its size classes stay.
 */
export const DESTRUCTIVE_HOVER_CLASS = 'hover:bg-destructive dark:hover:bg-destructive/60 hover:brightness-90'
/** For AlertDialogAction, which builds on the default button: the whole destructive look. */
export const DESTRUCTIVE_ACTION_CLASS = cn(buttonVariants({ variant: 'destructive' }), DESTRUCTIVE_HOVER_CLASS)

/** Offset of the fixed bottom cards (bottom-4). */
const FIXED_CARD_GAP_PX = 16

/**
 * How much room the page keeps below the focus while fixed bottom cards are open (WCAG 2.4.11):
 * the tallest card plus its offset, as a scroll-padding-bottom value; '' when none is open.
 */
export function bottomReserve(heights: number[]): string {
  const tallest = Math.max(0, ...heights.filter((n) => Number.isFinite(n) && n > 0))
  return tallest === 0 ? '' : `${Math.ceil(tallest) + FIXED_CARD_GAP_PX}px`
}
