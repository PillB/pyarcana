/**
 * Familiarity scoring algorithm — entity resolution for client data.
 * Implements the Fellegi-Sunter model in pure TypeScript (browser-side).
 *
 * Scoring rubric:
 *   100 = same person (exact phone/email match)
 *   95-99 = likely same person (high fuzzy + same district)
 *   85-94 = family (same household — shared address + apellido)
 *   75-84 = probable family (shared apellido + same district)
 *   60-74 = neighbor (geocoded <200m, same district)
 *   40-59 = same district only
 *   <40 = no meaningful relation
 */

export interface ClientRecord {
  id: string
  nombre: string
  apellido_paterno: string
  apellido_materno: string
  dni?: string
  telefono?: string
  email?: string
  direccion?: string
  distrito?: string
  lat?: number
  lon?: number
  // raw fields for display
  _raw: Record<string, any>
}

export interface FamiliarityPair {
  a: ClientRecord
  b: ClientRecord
  score: number
  relationship: string
  signals: {
    phoneMatch: boolean
    emailMatch: boolean
    nameSimilarity: number
    addressSimilarity: number
    sameDistrict: boolean
    distanceKm: number | null
    sharedApellido: boolean
  }
}

export interface FamiliarityResult {
  pairs: FamiliarityPair[]
  duplicates: FamiliarityPair[] // score >= 95
  families: FamiliarityPair[] // 75-94
  neighbors: FamiliarityPair[] // 60-74
  clusters: ClientRecord[][] // connected components
  scoreDistribution: { range: string; count: number }[]
  totalRecords: number
  totalComparisons: number
}

// === String normalization ===
function normalize(str: string | undefined | null): string {
  if (!str) return ''
  return str
    .toString()
    .toUpperCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // strip accents
    .replace(/[^A-Z0-9@.\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function normalizePhone(phone: string | undefined | null): string {
  if (!phone) return ''
  return phone.toString().replace(/[^0-9]/g, '').replace(/^51/, '') // strip +51 prefix
}

function normalizeEmail(email: string | undefined | null): string {
  if (!email) return ''
  return email.toString().toLowerCase().trim()
}

// === Similarity functions ===

// Jaro-Winkler similarity (0-1) — good for short strings like names
export function jaroWinkler(s1: string, s2: string): number {
  if (!s1 || !s2) return 0
  if (s1 === s2) return 1

  const jaro = jaroSimilarity(s1, s2)
  // Winkler prefix bonus: up to 4 matching prefix chars
  const prefixLength = Math.min(4, commonPrefixLength(s1, s2))
  return jaro + prefixLength * 0.1 * (1 - jaro)
}

function jaroSimilarity(s1: string, s2: string): number {
  const len1 = s1.length
  const len2 = s2.length
  if (len1 === 0 || len2 === 0) return 0
  if (len1 === 1 && len2 === 1) return s1 === s2 ? 1 : 0

  const matchDistance = Math.floor(Math.max(len1, len2) / 2) - 1
  const s1Matches = new Array(len1).fill(false)
  const s2Matches = new Array(len2).fill(false)

  let matches = 0
  for (let i = 0; i < len1; i++) {
    const start = Math.max(0, i - matchDistance)
    const end = Math.min(i + matchDistance + 1, len2)
    for (let j = start; j < end; j++) {
      if (!s2Matches[j] && s1[i] === s2[j]) {
        s1Matches[i] = true
        s2Matches[j] = true
        matches++
        break
      }
    }
  }

  if (matches === 0) return 0

  // Count transpositions
  let transpositions = 0
  let k = 0
  for (let i = 0; i < len1; i++) {
    if (s1Matches[i]) {
      while (!s2Matches[k]) k++
      if (s1[i] !== s2[k]) transpositions++
      k++
    }
  }
  transpositions /= 2

  return (
    (matches / len1 + matches / len2 + (matches - transpositions) / matches) / 3
  )
}

function commonPrefixLength(s1: string, s2: string): number {
  let i = 0
  while (i < s1.length && i < s2.length && s1[i] === s2[i]) i++
  return i
}

// Token sort ratio — for multi-word strings like addresses
export function tokenSortRatio(s1: string, s2: string): number {
  if (!s1 || !s2) return 0
  const tokens1 = s1.split(' ').sort().join(' ')
  const tokens2 = s2.split(' ').sort().join(' ')
  return jaroWinkler(tokens1, tokens2)
}

// Haversine distance in km
export function haversineKm(
  lat1: number, lon1: number,
  lat2: number, lon2: number
): number {
  const R = 6371 // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(a))
}

// === Scoring ===
function scorePair(a: ClientRecord, b: ClientRecord): FamiliarityPair {
  const signals = {
    phoneMatch: false,
    emailMatch: false,
    nameSimilarity: 0,
    addressSimilarity: 0,
    sameDistrict: false,
    distanceKm: null as number | null,
    sharedApellido: false,
  }

  // Layer 1: deterministic anchors (phone/email = 100)
  const phoneA = normalizePhone(a.telefono)
  const phoneB = normalizePhone(b.telefono)
  if (phoneA && phoneB && phoneA === phoneB) {
    signals.phoneMatch = true
  }

  const emailA = normalizeEmail(a.email)
  const emailB = normalizeEmail(b.email)
  if (emailA && emailB && emailA === emailB) {
    signals.emailMatch = true
  }

  // Name similarity
  const fullNameA = normalize(`${a.nombre} ${a.apellido_paterno} ${a.apellido_materno}`)
  const fullNameB = normalize(`${b.nombre} ${b.apellido_paterno} ${b.apellido_materno}`)
  signals.nameSimilarity = jaroWinkler(fullNameA, fullNameB)

  // Address similarity
  const addrA = normalize(a.direccion)
  const addrB = normalize(b.direccion)
  signals.addressSimilarity = addrA && addrB ? tokenSortRatio(addrA, addrB) : 0

  // Same district
  const distA = normalize(a.distrito)
  const distB = normalize(b.distrito)
  signals.sameDistrict = !!(distA && distB && distA === distB)

  // Shared apellido (paterno or materno)
  const apPatA = normalize(a.apellido_paterno)
  const apPatB = normalize(b.apellido_paterno)
  const apMatA = normalize(a.apellido_materno)
  const apMatB = normalize(b.apellido_materno)
  signals.sharedApellido = !!(
    (apPatA && apPatB && apPatA === apPatB) ||
    (apMatA && apMatB && apMatA === apMatB)
  )

  // Distance
  if (a.lat && a.lon && b.lat && b.lon) {
    signals.distanceKm = haversineKm(a.lat, a.lon, b.lat, b.lon)
  }

  // Compute score
  let score = 0
  let relationship = 'Sin relación'

  if (signals.phoneMatch || signals.emailMatch) {
    score = 100
    relationship = 'Misma persona (match exacto)'
  } else {
    // Fuzzy scoring
    score += 35 * signals.nameSimilarity
    score += 25 * signals.addressSimilarity

    // Phone suffix match (same house line)
    if (phoneA && phoneB && phoneA.length >= 4 && phoneB.length >= 4) {
      if (phoneA.slice(-4) === phoneB.slice(-4)) {
        score += 15
      }
    }

    // Email local part similarity
    if (emailA && emailB) {
      const localA = emailA.split('@')[0]
      const localB = emailB.split('@')[0]
      score += 15 * jaroWinkler(localA, localB)
    }

    // Geographic proximity
    if (signals.distanceKm !== null) {
      if (signals.distanceKm < 0.2) score += 10
      else if (signals.distanceKm < 1.0) score += 5
    }

    score = Math.min(Math.round(score), 99)

    // Classify relationship
    if (score >= 95) {
      relationship = 'Probablemente misma persona'
    } else if (score >= 85) {
      relationship = signals.sharedApellido ? 'Familia (mismo hogar)' : 'Misma persona (alta similitud)'
    } else if (score >= 75) {
      relationship = signals.sharedApellido ? 'Probable familia' : 'Alta similitud'
    } else if (score >= 60) {
      relationship = signals.distanceKm !== null && signals.distanceKm < 0.2
        ? 'Vecino (mismo sector)'
        : 'Conocido / relación débil'
    } else if (score >= 40) {
      relationship = signals.sameDistrict ? 'Mismo distrito' : 'Similitud baja'
    } else {
      relationship = 'Sin relación significativa'
    }
  }

  return { a, b, score, relationship, signals }
}

// === Main computation ===
export function computeFamiliarity(records: ClientRecord[]): FamiliarityResult {
  const pairs: FamiliarityPair[] = []
  const n = records.length

  // Blocking: group by first letter of apellido_paterno + district to reduce N²
  const blocks = new Map<string, ClientRecord[]>()
  for (const r of records) {
    const apPat = normalize(r.apellido_paterno)
    const dist = normalize(r.distrito)
    const blockKey = `${apPat[0] || '?'}-${dist || '?'}`
    if (!blocks.has(blockKey)) blocks.set(blockKey, [])
    blocks.get(blockKey)!.push(r)
  }

  // Cross-block for exact phone/email matches (global)
  const phoneIndex = new Map<string, ClientRecord[]>()
  const emailIndex = new Map<string, ClientRecord[]>()
  for (const r of records) {
    const phone = normalizePhone(r.telefono)
    if (phone) {
      if (!phoneIndex.has(phone)) phoneIndex.set(phone, [])
      phoneIndex.get(phone)!.push(r)
    }
    const email = normalizeEmail(r.email)
    if (email) {
      if (!emailIndex.has(email)) emailIndex.set(email, [])
      emailIndex.get(email)!.push(r)
    }
  }

  const compared = new Set<string>()
  const compare = (a: ClientRecord, b: ClientRecord) => {
    const key = a.id < b.id ? `${a.id}-${b.id}` : `${b.id}-${a.id}`
    if (compared.has(key)) return
    compared.add(key)
    pairs.push(scorePair(a, b))
  }

  // Within-block comparisons
  for (const block of blocks.values()) {
    for (let i = 0; i < block.length; i++) {
      for (let j = i + 1; j < block.length; j++) {
        compare(block[i], block[j])
      }
    }
  }

  // Cross-block: phone/email matches
  for (const group of phoneIndex.values()) {
    if (group.length > 1) {
      for (let i = 0; i < group.length; i++) {
        for (let j = i + 1; j < group.length; j++) {
          compare(group[i], group[j])
        }
      }
    }
  }
  for (const group of emailIndex.values()) {
    if (group.length > 1) {
      for (let i = 0; i < group.length; i++) {
        for (let j = i + 1; j < group.length; j++) {
          compare(group[i], group[j])
        }
      }
    }
  }

  // Filter to meaningful pairs (score >= 40)
  const meaningful = pairs.filter((p) => p.score >= 40)

  // Categorize
  const duplicates = meaningful.filter((p) => p.score >= 95)
  const families = meaningful.filter((p) => p.score >= 75 && p.score < 95)
  const neighbors = meaningful.filter((p) => p.score >= 60 && p.score < 75)

  // Connected components (clusters)
  const clusters = findClusters(records, meaningful.filter((p) => p.score >= 60))

  // Score distribution
  const ranges = [
    { range: '95-100', min: 95, max: 100 },
    { range: '85-94', min: 85, max: 94 },
    { range: '75-84', min: 75, max: 84 },
    { range: '60-74', min: 60, max: 74 },
    { range: '40-59', min: 40, max: 59 },
  ]
  const scoreDistribution = ranges.map((r) => ({
    range: r.range,
    count: meaningful.filter((p) => p.score >= r.min && p.score <= r.max).length,
  }))

  return {
    pairs: meaningful,
    duplicates,
    families,
    neighbors,
    clusters,
    scoreDistribution,
    totalRecords: n,
    totalComparisons: compared.size,
  }
}

// Union-Find for connected components
function findClusters(records: ClientRecord[], pairs: FamiliarityPair[]): ClientRecord[][] {
  const parent = new Map<string, string>()
  const find = (id: string): string => {
    if (!parent.has(id)) parent.set(id, id)
    let root = id
    while (parent.get(root) !== root) root = parent.get(root)!
    // Path compression
    let current = id
    while (parent.get(current) !== root) {
      const next = parent.get(current)!
      parent.set(current, root)
      current = next
    }
    return root
  }
  const union = (a: string, b: string) => {
    const ra = find(a)
    const rb = find(b)
    if (ra !== rb) parent.set(ra, rb)
  }

  for (const p of pairs) {
    union(p.a.id, p.b.id)
  }

  const groups = new Map<string, ClientRecord[]>()
  for (const r of records) {
    const root = find(r.id)
    if (!groups.has(root)) groups.set(root, [])
    groups.get(root)!.push(r)
  }

  return Array.from(groups.values()).filter((g) => g.length > 1)
}

// === Excel parsing ===
export async function parseExcelData(data: ArrayBuffer): Promise<ClientRecord[]> {
  // Dynamic import to avoid SSR issues and satisfy linter
  const XLSX = await import('xlsx')
  const workbook = XLSX.read(data, { type: 'array' })
  const sheetName = workbook.SheetNames[0]
  const sheet = workbook.Sheets[sheetName]
  const rows: Record<string, any>[] = XLSX.utils.sheet_to_json(sheet, { defval: '' })

  return rows.map((row, i) => {
    // Try to find columns by common names (case-insensitive)
    const findCol = (patterns: string[]): string | undefined => {
      const keys = Object.keys(row)
      for (const p of patterns) {
        const found = keys.find((k) => k.toLowerCase().trim().includes(p.toLowerCase()))
        if (found && row[found]) return String(row[found])
      }
      return undefined
    }

    const nombre = findCol(['nombre', 'name', 'nombres']) || ''
    const apellido_paterno = findCol(['apellido_paterno', 'paterno', 'apellido pat', 'last_name', 'apellido']) || ''
    const apellido_materno = findCol(['apellido_materno', 'materno', 'apellido mat']) || ''
    const dni = findCol(['dni', 'documento', 'cedula'])
    const telefono = findCol(['telefono', 'celular', 'phone', 'movil', 'tel'])
    const email = findCol(['email', 'correo', 'mail'])
    const direccion = findCol(['direccion', 'address', 'dir'])
    const distrito = findCol(['distrito', 'district', 'ciudad', 'city', 'barrio'])
    const latStr = findCol(['lat', 'latitud', 'latitude'])
    const lonStr = findCol(['lon', 'lng', 'longitud', 'longitude'])

    return {
      id: `r${i}`,
      nombre,
      apellido_paterno,
      apellido_materno,
      dni,
      telefono,
      email,
      direccion,
      distrito,
      lat: latStr ? parseFloat(latStr) : undefined,
      lon: lonStr ? parseFloat(lonStr) : undefined,
      _raw: row,
    }
  })
}

// === Synthetic data generator (for demo) ===
export function generateSyntheticClients(n: number = 50): ClientRecord[] {
  const nombres = ['Ana', 'Luis', 'Carlos', 'Maria', 'Jose', 'Carmen', 'Pedro', 'Rosa', 'Miguel', 'Elena', 'Juan', 'Sofia', 'Diego', 'Lucia', 'Fernando', 'Patricia', 'Javier', 'Andrea', 'Ricardo', 'Marta']
  const apellidos = ['Garcia', 'Rodriguez', 'Flores', 'Quispe', 'Sanchez', 'Vargas', 'Castillo', 'Ramos', 'Mendoza', 'Cruz', 'Espinoza', 'Torres', 'Perez', 'Aguilar', 'Rios', 'Herrera', 'Salazar', 'Romero', 'Diaz', 'Vega']
  const distritos = ['Miraflores', 'Surco', 'San Isidro', 'La Victoria', 'Comas', 'SJL', 'Barranco', 'Magdalena', 'Pueblo Libre', 'Jesús María']
  const calles = ['Av. Larco', 'Av. Benavides', 'Av. Primavera', 'Jr. de la Union', 'Av. Arequipa', 'Av. Brasil', 'Jr. Miraflores', 'Av. Ejercito', 'Calle Las Begonias', 'Av. Salaverry']

  const records: ClientRecord[] = []
  let id = 0

  // Generate base records
  for (let i = 0; i < n; i++) {
    const nombre = nombres[Math.floor(Math.random() * nombres.length)]
    const apPat = apellidos[Math.floor(Math.random() * apellidos.length)]
    const apMat = apellidos[Math.floor(Math.random() * apellidos.length)]
    const distrito = distritos[Math.floor(Math.random() * distritos.length)]
    const calle = calles[Math.floor(Math.random() * calles.length)]
    const numero = Math.floor(Math.random() * 999) + 100

    records.push({
      id: `r${id++}`,
      nombre,
      apellido_paterno: apPat,
      apellido_materno: apMat,
      dni: String(Math.floor(Math.random() * 90000000) + 10000000),
      telefono: `999${String(Math.floor(Math.random() * 900000) + 100000)}`,
      email: `${nombre.toLowerCase()}.${apPat.toLowerCase()}${id}@email.pe`,
      direccion: `${calle} ${numero}`,
      distrito,
      lat: -12.05 + Math.random() * 0.1,
      lon: -77.05 + Math.random() * 0.1,
      _raw: {},
    })
  }

  // Inject anomalies
  // 1. Exact duplicates (5% → score 100)
  const dupCount = Math.floor(n * 0.05)
  for (let i = 0; i < dupCount; i++) {
    const original = records[Math.floor(Math.random() * records.length)]
    records.push({
      ...original,
      id: `r${id++}`,
      _raw: {},
    })
  }

  // 2. Family members (5% → score 85-94, same address + apellido)
  const famCount = Math.floor(n * 0.05)
  for (let i = 0; i < famCount; i++) {
    const original = records[Math.floor(Math.random() * records.length)]
    const nuevoNombre = nombres[Math.floor(Math.random() * nombres.length)]
    records.push({
      ...original,
      id: `r${id++}`,
      nombre: nuevoNombre,
      telefono: `999${String(Math.floor(Math.random() * 900000) + 100000)}`,
      email: `${nuevoNombre.toLowerCase()}.${original.apellido_paterno.toLowerCase()}${id}@email.pe`,
      _raw: {},
    })
  }

  // 3. Typos (3% → score 95-99)
  const typoCount = Math.floor(n * 0.03)
  for (let i = 0; i < typoCount; i++) {
    const original = records[Math.floor(Math.random() * records.length)]
    const typoNombre = original.nombre.length > 2
      ? original.nombre.slice(0, -1) + String.fromCharCode(original.nombre.charCodeAt(original.nombre.length - 1) + 1)
      : original.nombre + 'a'
    records.push({
      ...original,
      id: `r${id++}`,
      nombre: typoNombre,
      _raw: {},
    })
  }

  // 4. Neighbors (4% → score 60-74, same district, close geographically)
  const neighCount = Math.floor(n * 0.04)
  for (let i = 0; i < neighCount; i++) {
    const original = records[Math.floor(Math.random() * records.length)]
    const nuevoNombre = nombres[Math.floor(Math.random() * nombres.length)]
    const nuevoApPat = apellidos[Math.floor(Math.random() * apellidos.length)]
    records.push({
      ...original,
      id: `r${id++}`,
      nombre: nuevoNombre,
      apellido_paterno: nuevoApPat,
      apellido_materno: apellidos[Math.floor(Math.random() * apellidos.length)],
      telefono: `999${String(Math.floor(Math.random() * 900000) + 100000)}`,
      email: `${nuevoNombre.toLowerCase()}.${nuevoApPat.toLowerCase()}${id}@email.pe`,
      direccion: `${original.direccion?.split(' ').slice(0, -1).join(' ')} ${Math.floor(Math.random() * 50) + 1}`,
      // Very close lat/lon
      lat: (original.lat || -12.05) + (Math.random() - 0.5) * 0.001,
      lon: (original.lon || -77.05) + (Math.random() - 0.5) * 0.001,
      _raw: {},
    })
  }

  return records
}
