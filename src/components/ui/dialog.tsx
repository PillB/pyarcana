"use client"

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { XIcon } from "lucide-react"

import { cn } from "@/lib/utils"

function Dialog({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />
}

function DialogTrigger({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />
}

function DialogPortal({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Portal>) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />
}

function DialogClose({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />
}

function DialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      data-slot="dialog-overlay"
      className={cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
        className
      )}
      {...props}
    />
  )
}

/**
 * Dialog widths, as one clamp per size.
 *
 * The base used to end in `sm:max-w-lg`. That is a responsive-prefixed utility,
 * so it outranks any unprefixed `max-w-*` a caller passes in `className` and
 * wins silently above the sm breakpoint: the QA workspace asked for 1180px and
 * rendered at 512, and the glossary still asks for `max-w-3xl` and renders at
 * 512 too. Nothing warns you; the dialog is just narrow.
 *
 * Sizes live here instead, unprefixed, and every one is clamped with a 2rem
 * gutter so no choice can produce a horizontally scrolling page.
 *
 * The clamp is `100%`, not `100vw`. For a fixed element the percentage resolves
 * against the initial containing block, which excludes the classic scrollbar;
 * `100vw` includes it, so on a short window where the page scrolls vertically
 * the dialog came out a scrollbar-width too wide and pushed the page sideways.
 * The probe caught exactly that at 1024x480 in three separate dialogs.
 */
const DIALOG_SIZES = {
  sm: 'max-w-[min(24rem,calc(100%-2rem))]',
  md: 'max-w-[min(32rem,calc(100%-2rem))]',
  lg: 'max-w-[min(48rem,calc(100%-2rem))]',
  xl: 'max-w-[min(64rem,calc(100%-2rem))]',
  workspace: 'max-w-[min(1180px,calc(100%-2rem))]',
} as const

function DialogContent({
  className,
  children,
  showCloseButton = true,
  size = 'md',
  suspended = false,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & {
  showCloseButton?: boolean
  /**
   * How wide this dialog is allowed to get. Always clamped to the viewport
   * with a 2rem gutter, so no size can produce a horizontally scrolling page.
   */
  size?: keyof typeof DIALOG_SIZES
  /**
   * Step the dialog aside without closing it. The content stays mounted -- so a
   * half-written report survives -- but it stops being visible and stops taking
   * clicks, and the backdrop goes away entirely so the page underneath is
   * usable. Pair with `modal={false}` on the Dialog root, or Radix will keep
   * blocking pointer events on the body.
   */
  suspended?: boolean
}) {
  return (
    <DialogPortal data-slot="dialog-portal">
      {!suspended && <DialogOverlay />}
      <DialogPrimitive.Content
        data-slot="dialog-content"
        className={cn(
          "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full translate-x-[-50%] translate-y-[-50%] grid-rows-[minmax(0,1fr)] gap-4 rounded-lg border p-6 shadow-lg duration-200",
          // Height first: dvh, not vh, because mobile browser chrome makes vh
          // taller than what you can actually see, which is how a dialog's own
          // footer buttons end up under the URL bar with no way to scroll to
          // them. The row track is minmax(0,1fr) so a tall child shrinks and
          // scrolls instead of pushing the controls past the bottom edge.
          "max-h-[90dvh]",
          DIALOG_SIZES[size],
          suspended && 'pointer-events-none opacity-0',
          className
        )}
        {...props}
      >
        {children}
        {showCloseButton && (
          <DialogPrimitive.Close
            data-slot="dialog-close"
            // The hit area used to be the 16px icon itself, which is under the 24px
            // floor in WCAG 2.2 SC 2.5.8 and awkward on a trackpad. The padding
            // grows the target to 44px; the matching negative margin keeps the
            // glyph painted exactly where it was, so no dialog moves.
            className="ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground text-muted-foreground hover:text-foreground absolute top-4 right-4 -m-3.5 rounded-xs p-3.5 transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
          >
            <XIcon />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPortal>
  )
}

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-header"
      className={cn("flex flex-col gap-2 text-center sm:text-left", className)}
      {...props}
    />
  )
}

function DialogFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className
      )}
      {...props}
    />
  )
}

function DialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn("text-lg leading-none font-semibold", className)}
      {...props}
    />
  )
}

function DialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  )
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
}
