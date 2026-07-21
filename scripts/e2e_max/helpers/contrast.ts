import type { Page, Locator } from '@playwright/test'

export type ContrastPair = {
  family: string
  selector: string
  ratio: number
  fg: string
  bg: string
  min: number
  pass: boolean
}

/** Inject contrast helpers into the page and measure pairs. */
export async function measureContrastInPanel(
  page: Page,
  panel: Locator,
  family: string,
  selectors: string[],
  minRatio = 4.5
): Promise<ContrastPair[]> {
  const handle = await panel.elementHandle()
  if (!handle) return []

  return page.evaluate(
    ({ root, selectors: sels, family: fam, minRatio: min }) => {
      const paint = (css: string): { rgb: [number, number, number]; a: number } | null => {
        if (!css || css === 'transparent') return null
        const c = document.createElement('canvas')
        c.width = c.height = 1
        const ctx = c.getContext('2d')!
        ctx.clearRect(0, 0, 1, 1)
        ctx.fillStyle = 'rgba(0,0,0,0)'
        ctx.fillStyle = css
        ctx.fillRect(0, 0, 1, 1)
        const d = ctx.getImageData(0, 0, 1, 1).data
        if (d[3] < 16) return null
        return { rgb: [d[0], d[1], d[2]], a: d[3] / 255 }
      }

      const lin = (c: number) => {
        const x = c / 255
        return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4)
      }
      const L = (rgb: [number, number, number]) =>
        0.2126 * lin(rgb[0]) + 0.7152 * lin(rgb[1]) + 0.0722 * lin(rgb[2])
      const ratio = (fg: [number, number, number], bg: [number, number, number]) => {
        const a = L(fg)
        const b = L(bg)
        return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)
      }

      /** Composite semi-transparent fill over opaque ancestor until solid enough. */
      const solidBg = (el: Element): { css: string; rgb: [number, number, number] } => {
        let n: Element | null = el
        let r = 255
        let g = 255
        let b = 255
        // start from body bg
        const bodyP = paint(getComputedStyle(document.body).backgroundColor)
        if (bodyP) {
          r = bodyP.rgb[0]
          g = bodyP.rgb[1]
          b = bodyP.rgb[2]
        }
        const stack: { rgb: [number, number, number]; a: number }[] = []
        while (n && n !== document.documentElement) {
          const bg = getComputedStyle(n).backgroundColor
          const p = paint(bg)
          if (p && p.a > 0.02) stack.push(p)
          n = n.parentElement
        }
        // stack bottom-up
        for (const layer of stack.reverse()) {
          const a = layer.a
          r = Math.round(layer.rgb[0] * a + r * (1 - a))
          g = Math.round(layer.rgb[1] * a + g * (1 - a))
          b = Math.round(layer.rgb[2] * a + b * (1 - a))
        }
        return { css: `rgb(${r}, ${g}, ${b})`, rgb: [r, g, b] }
      }

      const out: {
        family: string
        selector: string
        ratio: number
        fg: string
        bg: string
        min: number
        pass: boolean
      }[] = []

      const rootEl = root as Element
      for (const sel of sels) {
        const nodes = rootEl.querySelectorAll(sel)
        let i = 0
        for (const el of Array.from(nodes)) {
          if (i++ > 8) break // cap per selector
          const cs = getComputedStyle(el)
          if (cs.visibility === 'hidden' || cs.display === 'none' || cs.opacity === '0') continue
          // Skip gradient-clipped headings (color often white, paint is background)
          if (cs.backgroundClip === 'text' || (cs as CSSStyleDeclaration & { webkitBackgroundClip?: string }).webkitBackgroundClip === 'text') {
            continue
          }
          const fgCss = cs.color
          const fgP = paint(fgCss)
          if (!fgP || fgP.a < 0.5) continue
          const bg = solidBg(el)
          const r = ratio(fgP.rgb, bg.rgb)
          out.push({
            family: fam,
            selector: sel,
            ratio: Math.round(r * 100) / 100,
            fg: fgCss,
            bg: bg.css,
            min,
            pass: r >= min,
          })
        }
      }
      return out
    },
    { root: handle, selectors, family, minRatio }
  )
}

export async function measureTooltipContrast(page: Page): Promise<ContrastPair[]> {
  return page.evaluate(() => {
    const toRgb = (css: string): [number, number, number] | null => {
      if (!css || css === 'transparent') return null
      const c = document.createElement('canvas')
      c.width = c.height = 1
      const ctx = c.getContext('2d')!
      ctx.fillStyle = '#000'
      ctx.fillStyle = css
      ctx.fillRect(0, 0, 1, 1)
      const d = ctx.getImageData(0, 0, 1, 1).data
      if (d[3] < 10) return null
      return [d[0], d[1], d[2]]
    }
    const lin = (c: number) => {
      const x = c / 255
      return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4)
    }
    const L = (rgb: [number, number, number]) =>
      0.2126 * lin(rgb[0]) + 0.7152 * lin(rgb[1]) + 0.0722 * lin(rgb[2])
    const ratio = (fg: [number, number, number], bg: [number, number, number]) => {
      const a = L(fg)
      const b = L(bg)
      return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)
    }

    const tip = document.querySelector('[data-testid^="term-tooltip-"]') as HTMLElement | null
    if (!tip) return []
    const bgCss = getComputedStyle(tip).backgroundColor
    const bg = toRgb(bgCss)
    if (!bg) return []

    const roles = [
      { sel: '[data-term-hint-role="title"]', min: 4.5 },
      { sel: '[data-term-hint-role="title"] .text-primary, [data-term-hint-role="title"] span', min: 4.5 },
      { sel: '[data-term-hint-role="body"]', min: 4.5 },
      { sel: '[data-term-hint-role="meta"]', min: 4.5 },
    ]
    const out: {
      family: string
      selector: string
      ratio: number
      fg: string
      bg: string
      min: number
      pass: boolean
    }[] = []
    for (const r of roles) {
      const el = tip.querySelector(r.sel) as HTMLElement | null
      if (!el) continue
      const fgCss = getComputedStyle(el).color
      const fg = toRgb(fgCss)
      if (!fg) continue
      const rat = ratio(fg, bg)
      out.push({
        family: 'term_hint',
        selector: r.sel,
        ratio: Math.round(rat * 100) / 100,
        fg: fgCss,
        bg: bgCss,
        min: r.min,
        pass: rat >= r.min,
      })
    }
    return out
  })
}

export async function measureCodeTokens(page: Page, panel: Locator): Promise<ContrastPair[]> {
  const handle = await panel.elementHandle()
  if (!handle) return []
  return page.evaluate((root) => {
    const toRgb = (css: string): [number, number, number] | null => {
      if (!css || css === 'transparent') return null
      const c = document.createElement('canvas')
      c.width = c.height = 1
      const ctx = c.getContext('2d')!
      ctx.fillStyle = '#000'
      ctx.fillStyle = css
      ctx.fillRect(0, 0, 1, 1)
      const d = ctx.getImageData(0, 0, 1, 1).data
      if (d[3] < 10) return null
      return [d[0], d[1], d[2]]
    }
    const lin = (c: number) => {
      const x = c / 255
      return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4)
    }
    const L = (rgb: [number, number, number]) =>
      0.2126 * lin(rgb[0]) + 0.7152 * lin(rgb[1]) + 0.0722 * lin(rgb[2])
    const ratio = (fg: [number, number, number], bg: [number, number, number]) => {
      const a = L(fg)
      const b = L(bg)
      return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)
    }

    const out: {
      family: string
      selector: string
      ratio: number
      fg: string
      bg: string
      min: number
      pass: boolean
    }[] = []
    const panes = (root as Element).querySelectorAll('.code-block-dark')
    for (const pane of Array.from(panes).slice(0, 3)) {
      const bgCss = getComputedStyle(pane).backgroundColor
      const bg = toRgb(bgCss)
      if (!bg) continue
      // default text
      const fgCss = getComputedStyle(pane).color
      const fg = toRgb(fgCss)
      if (fg) {
        const r = ratio(fg, bg)
        out.push({
          family: 'code_fg',
          selector: '.code-block-dark',
          ratio: Math.round(r * 100) / 100,
          fg: fgCss,
          bg: bgCss,
          min: 4.5,
          pass: r >= 4.5,
        })
      }
      const tokens = pane.querySelectorAll(
        '.code-tok-comment,.code-tok-string,.code-tok-keyword,.code-tok-builtin,.code-tok-number,.code-tok-decorator,.code-tok-line-num,[style*="color"]'
      )
      let i = 0
      for (const tok of Array.from(tokens)) {
        if (i++ > 20) break
        const tFg = getComputedStyle(tok).color
        const tRgb = toRgb(tFg)
        if (!tRgb) continue
        const r = ratio(tRgb, bg)
        const isLine = (tok as HTMLElement).classList.contains('code-tok-line-num')
        const min = isLine ? 3 : 4.5
        out.push({
          family: isLine ? 'code_line_num' : 'code_token',
          selector: (tok as HTMLElement).className || 'inline-style',
          ratio: Math.round(r * 100) / 100,
          fg: tFg,
          bg: bgCss,
          min,
          pass: r >= min,
        })
      }
    }
    return out
  }, handle)
}

export async function setTheme(page: Page, dark: boolean) {
  await page.evaluate((isDark) => {
    if (isDark) document.documentElement.classList.add('dark')
    else document.documentElement.classList.remove('dark')
  }, dark)
}
