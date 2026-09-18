/**
 * The framer-motion `initial` for a fade-and-rise entrance, or `false` to
 * mount at rest (at the `animate` values).
 *
 * framer-motion writes `initial` into server-rendered HTML, so whatever is
 * prerendered has to mount at rest. At opacity 0 it is blank without
 * JavaScript, blank until hydration plus an animation frame, and Chrome does
 * not count an opacity-0 paint for Largest Contentful Paint.
 */
export function riseIn(animate: boolean, y: number): { opacity: number; y: number } | false {
  return animate ? { opacity: 0, y } : false
}
