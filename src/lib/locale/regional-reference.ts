/**
 * What a reader outside Peru needs in order to read the course's fixtures.
 *
 * The curriculum is deliberately set in Peru: the cases are Peruvian, the
 * amounts are in soles, the identifiers are RUC and DNI. That is not decoration
 * -- a course that teaches data work with invented, placeless data teaches
 * something less real. The problem is narrower than the setting: a reader in
 * Bogota or Madrid meets "PEN", "RUC" or "SUNAT" with no idea whether the token
 * matters to the exercise or is just local colour.
 *
 * So this does not translate or replace anything. It answers, at the point of
 * use, two questions: what is this, and does its Peruvian-ness matter here?
 * Every entry therefore carries an `equivalentIn` map -- the reader's own
 * country's version of the same thing -- because "RUC is like your CUIT" lands
 * where "RUC is a taxpayer id" does not.
 *
 * DETECTION. Deliberately not IP-based. Reading a visitor's IP means either a
 * server this static export does not have, or shipping every visitor's address
 * to a third-party geolocation service -- in a course that spends S25 teaching
 * learners not to send data to endpoints they cannot justify. `navigator.language`
 * and the IANA time zone are already in the browser, travel with the reader,
 * cost no request, and leave the device never. They are also what
 * `detectCountry()` in subscription-plans.ts already uses, so the site has one
 * answer to "where is this reader" rather than two that can disagree.
 */

export type RegionCode =
  | 'PE' | 'MX' | 'CO' | 'AR' | 'CL' | 'ES' | 'US' | 'BR' | 'LATAM' | 'REST'

/** A term whose local form differs, with the reader's own version of it. */
export interface RegionalTerm {
  /** How it appears in the lesson text. */
  token: string
  /** What it is, said plainly, independent of country. */
  gloss: string
  /** Whether the Peruvian specificity affects the exercise's answer. */
  matters: 'no' | 'format' | 'yes'
  /** The same thing where the reader lives. */
  equivalentIn: Partial<Record<RegionCode, string>>
}

export const REGIONAL_TERMS: Record<string, RegionalTerm> = {
  PEN: {
    token: 'PEN',
    gloss: 'el sol peruano, la moneda de los casos sintéticos del curso',
    matters: 'no',
    equivalentIn: {
      MX: 'como MXN, el peso mexicano',
      CO: 'como COP, el peso colombiano',
      AR: 'como ARS, el peso argentino',
      CL: 'como CLP, el peso chileno',
      ES: 'como EUR, el euro',
      US: 'como USD, el dólar',
      BR: 'como BRL, el real',
    },
  },
  'S/': {
    token: 'S/',
    gloss: 'el símbolo del sol peruano, como $ o €',
    matters: 'no',
    equivalentIn: { MX: 'como $', CO: 'como $', AR: 'como $', ES: 'como €', US: 'como $', BR: 'como R$' },
  },
  RUC: {
    token: 'RUC',
    gloss: 'el identificador tributario de una empresa en Perú: 11 dígitos',
    matters: 'format',
    equivalentIn: {
      MX: 'como el RFC mexicano',
      CO: 'como el NIT colombiano',
      AR: 'como el CUIT argentino',
      CL: 'como el RUT chileno',
      ES: 'como el NIF/CIF español',
      US: 'como el EIN estadounidense',
      BR: 'como o CNPJ brasileiro',
    },
  },
  DNI: {
    token: 'DNI',
    gloss: 'el documento de identidad de una persona en Perú: 8 dígitos',
    matters: 'format',
    equivalentIn: {
      MX: 'como la CURP mexicana',
      CO: 'como la cédula colombiana',
      AR: 'como el DNI argentino, con el mismo nombre',
      CL: 'como el RUT chileno',
      ES: 'como el DNI español, con el mismo nombre',
      US: 'como el SSN estadounidense',
      BR: 'como o CPF brasileiro',
    },
  },
  SUNAT: {
    token: 'SUNAT',
    gloss: 'la administración tributaria peruana',
    matters: 'no',
    equivalentIn: {
      MX: 'como el SAT mexicano',
      CO: 'como la DIAN colombiana',
      AR: 'como ARCA (antes AFIP) en Argentina',
      CL: 'como el SII chileno',
      ES: 'como la Agencia Tributaria española',
      US: 'como el IRS estadounidense',
      BR: 'como a Receita Federal',
    },
  },
  soles: {
    token: 'soles',
    gloss: 'el plural de sol, la moneda peruana en la que están los montos del curso',
    matters: 'no',
    equivalentIn: {
      MX: 'como decir pesos en México',
      CO: 'como decir pesos en Colombia',
      AR: 'como decir pesos en Argentina',
      CL: 'como decir pesos en Chile',
      ES: 'como decir euros en España',
      US: 'como decir dólares en Estados Unidos',
      BR: 'como dizer reais no Brasil',
    },
  },
  IGV: {
    token: 'IGV',
    gloss: 'el impuesto al consumo en Perú, 18% sobre el monto sin impuesto',
    matters: 'format',
    equivalentIn: {
      MX: 'como el IVA mexicano, 16%',
      CO: 'como el IVA colombiano, 19%',
      AR: 'como el IVA argentino, 21%',
      CL: 'como el IVA chileno, 19%',
      ES: 'como el IVA español, 21%',
      US: 'como el sales tax, que allá varía por estado',
      BR: 'como o ICMS/ISS, que lá variam por estado',
    },
  },
  RENIEC: {
    token: 'RENIEC',
    gloss: 'el registro civil peruano, la fuente del DNI',
    matters: 'no',
    equivalentIn: {
      MX: 'como el RENAPO mexicano',
      CO: 'como la Registraduría colombiana',
      AR: 'como el RENAPER argentino',
      CL: 'como el Registro Civil chileno',
      ES: 'como el Registro Civil español',
      US: 'como la Social Security Administration',
      BR: 'como o registro civil brasileiro',
    },
  },
  // A city name reads as a city, so the gloss answers the question a reader
  // actually has -- does this one matter to the exercise -- rather than telling
  // them what Lima is. Only Lima is listed: it carries 62 of the ~130 place
  // mentions, and once a reader knows the fixtures are Peruvian the rest follow
  // without an underline on every one.
  Lima: {
    token: 'Lima',
    gloss: 'la capital de Perú; en los casos del curso es solo la ciudad de la sucursal, nunca parte de la respuesta',
    matters: 'no',
    equivalentIn: {
      MX: 'léelo como leerías Guadalajara',
      CO: 'léelo como leerías Medellín',
      AR: 'léelo como leerías Córdoba',
      CL: 'léelo como leerías Valparaíso',
      ES: 'léelo como leerías Sevilla',
      US: 'read it the way you would read Denver',
      BR: 'leia como leria Recife',
    },
  },
  // The one place a Peruvian surname changes the answer: S07 normalises names
  // with Unicode, and the tilde in Huamán is the whole exercise.
  Huamán: {
    token: 'Huamán',
    gloss: 'apellido andino frecuente; su tilde es justamente lo que se normaliza en los ejercicios de texto',
    matters: 'yes',
    equivalentIn: {
      MX: 'el mismo problema que tienen Peña o Muñoz',
      CO: 'el mismo problema que tienen Peña o Muñoz',
      AR: 'el mismo problema que tienen Peña o Muñoz',
      CL: 'el mismo problema que tienen Peña o Muñoz',
      ES: 'el mismo problema que tienen Peña o Muñoz',
      US: 'the same problem any accented surname has',
      BR: 'o mesmo problema de Conceição ou Assunção',
    },
  },
  Quispe: {
    token: 'Quispe',
    gloss: 'apellido andino muy frecuente, usado en los casos sintéticos por lo mismo que Smith en inglés',
    matters: 'no',
    equivalentIn: {
      MX: 'como Hernández en México',
      CO: 'como Rodríguez en Colombia',
      AR: 'como González en Argentina',
      CL: 'como González en Chile',
      ES: 'como García en España',
      US: 'like Smith in the United States',
      BR: 'como Silva no Brasil',
    },
  },
}

/**
 * Where the reader is, from data the browser already holds.
 *
 * Returns 'REST' during server rendering, which is correct rather than a
 * fallback: the static export has no reader yet, and the annotation degrades to
 * the country-independent gloss.
 */
export function detectRegion(): RegionCode {
  if (typeof window === 'undefined') return 'REST'
  let tz = ''
  try {
    tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ''
  } catch {
    tz = ''
  }
  const lang = (typeof navigator !== 'undefined' && navigator.language) || ''

  // Time zone first: it survives a browser set to English by someone in Lima.
  const byZone: Array<[string, RegionCode]> = [
    ['America/Lima', 'PE'],
    ['America/Mexico', 'MX'],
    ['America/Bogota', 'CO'],
    ['America/Argentina', 'AR'],
    ['America/Santiago', 'CL'],
    ['America/Sao_Paulo', 'BR'],
    ['Europe/Madrid', 'ES'],
  ]
  for (const [zone, code] of byZone) if (tz.startsWith(zone)) return code

  const byLang: Array<[string, RegionCode]> = [
    ['es-PE', 'PE'], ['es-MX', 'MX'], ['es-CO', 'CO'], ['es-AR', 'AR'],
    ['es-CL', 'CL'], ['es-ES', 'ES'], ['pt-BR', 'BR'], ['en-US', 'US'],
  ]
  for (const [tag, code] of byLang) if (lang.startsWith(tag)) return code

  if (tz.startsWith('America/')) return 'LATAM'
  if (lang.startsWith('en')) return 'US'
  return 'REST'
}

/** The sentence shown to this reader for this token, or null if none applies. */
export function explain(token: string, region: RegionCode): string | null {
  const t = REGIONAL_TERMS[token]
  if (!t) return null
  // A reader in Peru already knows what a RUC is; saying so is noise.
  if (region === 'PE') return null
  const local = t.equivalentIn[region]
  return local ? `${t.gloss} — ${local}` : t.gloss
}

/**
 * The region as a snapshot React can read directly, with no effect.
 *
 * `detectRegion()` reads browser APIs, so it cannot run during static export.
 * The obvious shape -- useState('REST') plus useEffect(setRegion) -- is exactly
 * the cascading-render pattern react-hooks/set-state-in-effect rejects, and CI
 * catches it. useSyncExternalStore is built for this: React supports the server
 * and client snapshots differing, so there is no setState and no hydration
 * mismatch. SteppedCode.tsx already reads its reveal preference this way.
 *
 * The snapshot must be referentially stable or React re-renders forever, hence
 * the module-level cache. A reader's time zone does not change mid-session, so
 * nothing ever needs to invalidate it.
 */
let cachedRegion: RegionCode | null = null

export function subscribeRegion(): () => void {
  // Nothing to subscribe to: the value is fixed for the life of the document.
  return () => {}
}

export function getRegionSnapshot(): RegionCode {
  if (cachedRegion === null) cachedRegion = detectRegion()
  return cachedRegion
}

/** Static export has no reader yet; 'REST' renders the country-independent gloss. */
export function getRegionServerSnapshot(): RegionCode {
  return 'REST'
}

const REGION_STASH = String.fromCharCode(3)

/**
 * `seen` is shared with the glossary annotator on purpose: both mark a term the
 * first time a reader meets it in a section and leave it alone after that.
 * Regional tokens used to be annotated on every occurrence, so a section
 * mentioning PEN eleven times carried eleven dotted underlines -- which stops
 * reading as help and starts reading as damage, and made adding common tokens
 * like "soles" or "Lima" impossible without burying the prose.
 */
export function annotateRegional(html: string, region: RegionCode, seen: Set<string>): string {
  if (region === 'PE') return html

  // Stash the parts that must not be touched: <code> spans, because a lesson's
  // code is quoted verbatim, and every tag, because a token can appear inside
  // an attribute. Excluding '>' from the preceding character class was the
  // cheaper guard and it silently skipped **PEN**, which is how the token
  // usually appears -- an annotation that quietly does nothing where it is
  // most needed is worse than none.
  const stash: string[] = []
  const keep = (m: string) => {
    const i = stash.length
    stash.push(m)
    return REGION_STASH + i + REGION_STASH
  }
  let out = html.replace(/<code\b[^>]*>[\s\S]*?<\/code>/g, keep).replace(/<[^>]+>/g, keep)

  for (const token of Object.keys(REGIONAL_TERMS)) {
    const key = `regional:${token}`
    if (seen.has(key)) continue
    const sentence = explain(token, region)
    if (!sentence) continue
    const escaped = token.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&')
    // A word boundary does not work for "S/", so bound on non-word neighbours.
    // Case-sensitive, and not global: tokens are written the way they appear,
    // and matching case-insensitively would put a dotted underline on the
    // lowercase "lima" in S15's example about why "lima" and "Lima" are two
    // different category strings -- annotating the very distinction the
    // paragraph is drawing. No 'g' flag: one mark per section, like the
    // glossary, which is what makes common words safe to add at all.
    const rx = new RegExp(`(^|[^A-Za-z0-9_])(${escaped})(?![A-Za-z0-9_])`)
    const before = out
    out = out.replace(rx, (_m, lead: string, hit: string) =>
      `${lead}<abbr title="${sentence.replace(/"/g, '&quot;')}" class="cursor-help underline decoration-dotted decoration-muted-foreground/60 underline-offset-2">${hit}</abbr>`,
    )
    if (out !== before) seen.add(key)
  }

  return out.replace(
    new RegExp(REGION_STASH + '(\\d+)' + REGION_STASH, 'g'),
    (_m, i: string) => stash[Number(i)],
  )
}
