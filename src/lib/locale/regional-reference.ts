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
