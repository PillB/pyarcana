'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Upload, FileSpreadsheet, Users, AlertTriangle, MapPin,
  Loader2, Download, Sparkles, Network, BarChart3,
  Table2, GitBranch, Zap, Eye
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'
import {
  parseExcelData,
  computeFamiliarity,
  generateSyntheticClients,
  type ClientRecord,
  type FamiliarityResult,
  type FamiliarityPair,
} from '@/lib/familiarity'
import { DividerVine, CornerOrnament } from '@/components/ornaments/Ornaments'

export function FamiliarityDashboard() {
  const { toast } = useToast()
  const [records, setRecords] = useState<ClientRecord[]>([])
  const [result, setResult] = useState<FamiliarityResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [selectedPair, setSelectedPair] = useState<FamiliarityPair | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = useCallback(async (file: File) => {
    setLoading(true)
    try {
      const data = await file.arrayBuffer()
      const parsed = await parseExcelData(data)
      if (parsed.length === 0) {
        toast({ title: 'Archivo vacío', description: 'No se encontraron datos en el Excel', variant: 'destructive' })
        return
      }
      setRecords(parsed)
      const res = computeFamiliarity(parsed)
      setResult(res)
      toast({
        title: `✓ ${parsed.length} registros procesados`,
        description: `${res.duplicates.length} duplicados, ${res.families.length} familias, ${res.neighbors.length} vecinos`,
      })
    } catch (err) {
      toast({ title: 'Error al leer Excel', description: String(err), variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }, [toast])

  const handleDemoData = useCallback(() => {
    setLoading(true)
    setTimeout(() => {
      const synthetic = generateSyntheticClients(50)
      setRecords(synthetic)
      const res = computeFamiliarity(synthetic)
      setResult(res)
      setLoading(false)
      toast({
        title: `✓ ${synthetic.length} registros sintéticos cargados`,
        description: 'Datos de demo con anomalías inyectadas (duplicados, familias, vecinos)',
      })
    }, 500)
  }, [toast])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file && (file.name.endsWith('.xlsx') || file.name.endsWith('.xls') || file.name.endsWith('.csv'))) {
      handleFileUpload(file)
    } else {
      toast({ title: 'Formato no soportado', description: 'Sube un archivo .xlsx, .xls o .csv', variant: 'destructive' })
    }
  }, [handleFileUpload, toast])

  const exportResults = useCallback(() => {
    if (!result) return
    const csv = [
      ['ID_A', 'Nombre_A', 'ID_B', 'Nombre_B', 'Score', 'Relacion', 'Phone_Match', 'Email_Match', 'Name_Sim', 'Addr_Sim', 'Same_District', 'Distance_km', 'Shared_Apellido'].join(','),
      ...result.pairs.map(p => [
        p.a.id, `"${p.a.nombre} ${p.a.apellido_paterno}"`,
        p.b.id, `"${p.b.nombre} ${p.b.apellido_paterno}"`,
        p.score, `"${p.relationship}"`,
        p.signals.phoneMatch, p.signals.emailMatch,
        p.signals.nameSimilarity.toFixed(3),
        p.signals.addressSimilarity.toFixed(3),
        p.signals.sameDistrict,
        p.signals.distanceKm ? p.signals.distanceKm.toFixed(3) : '',
        p.signals.sharedApellido,
      ].join(',')),
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'familiarity_results.csv'
    a.click()
    URL.revokeObjectURL(url)
    toast({ title: '✓ Resultados exportados a CSV' })
  }, [result, toast])

  // === Empty state ===
  if (!result) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Badge variant="outline" className="mb-3 gap-1.5 border-gold text-gold">
            <Sparkles className="h-3 w-3" />
            Herramienta del VP
          </Badge>
          <h1 className="font-display text-4xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
            <span className="gradient-text">Familiarity Score Dashboard</span>
          </h1>
          <p className="mt-2 text-muted-foreground">
            Sube un Excel con datos de clientes para detectar duplicados, familias y relaciones por proximidad geográfica.
          </p>
        </motion.div>

        <Card
          className="mt-8 border-2 border-dashed border-border p-8 transition-colors hover:border-primary/40"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
          <div className="text-center">
            <div className="relative mx-auto mb-4 flex h-20 w-20 items-center justify-center">
              <div className="mucha-halo absolute inset-0 rounded-full" />
              <FileSpreadsheet className="relative h-10 w-10 text-primary" />
            </div>
            <h3 className="font-display text-lg font-semibold" style={{ fontFamily: 'var(--font-display)' }}>
              Sube tu archivo Excel
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Arrastra un .xlsx aquí o haz clic para seleccionar
            </p>
            <div className="mt-4 flex justify-center gap-2">
              <Button onClick={() => fileInputRef.current?.click()} className="gap-2">
                <Upload className="h-4 w-4" />
                Seleccionar archivo
              </Button>
              <Button variant="outline" onClick={handleDemoData} disabled={loading} className="gap-2 border-gold">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4 text-gold" />}
                Probar con datos sintéticos
              </Button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls,.csv"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) handleFileUpload(file)
              }}
            />
          </div>
        </Card>

        {/* Expected columns info */}
        <Card className="mt-6 p-5">
          <h4 className="text-sm font-semibold">Columnas esperadas (se detectan automáticamente)</h4>
          <div className="mt-3 grid grid-cols-2 gap-2 text-xs sm:grid-cols-3">
            {[
              ['nombre', 'Nombres del cliente'],
              ['apellido_paterno', 'Apellido paterno'],
              ['apellido_materno', 'Apellido materno'],
              ['dni', 'DNI (opcional)'],
              ['telefono', 'Teléfono / celular'],
              ['email', 'Correo electrónico'],
              ['direccion', 'Dirección'],
              ['distrito', 'Distrito / ciudad'],
              ['lat, lon', 'Coordenadas (opcional)'],
            ].map(([col, desc]) => (
              <div key={col} className="flex items-center gap-2 rounded-md border border-border/60 p-2">
                <code className="rounded bg-muted px-1.5 py-0.5 text-[11px] font-mono text-primary">{col}</code>
                <span className="text-muted-foreground">{desc}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Scoring rubric */}
        <Card className="mt-6 p-5">
          <h4 className="text-sm font-semibold">¿Cómo se calcula el score?</h4>
          <div className="mt-3 space-y-1.5 text-xs">
            {[
              { score: '100', label: 'Misma persona (match exacto de teléfono o email)', color: 'bg-red-500' },
              { score: '95-99', label: 'Probablemente la misma persona', color: 'bg-amber-500' },
              { score: '85-94', label: 'Familia (mismo hogar + apellido compartido)', color: 'bg-orange-500' },
              { score: '75-84', label: 'Probable familia', color: 'bg-yellow-500' },
              { score: '60-74', label: 'Vecino (mismo sector geográfico)', color: 'bg-green-500' },
              { score: '40-59', label: 'Mismo distrito', color: 'bg-blue-500' },
            ].map((r) => (
              <div key={r.score} className="flex items-center gap-2">
                <div className={cn('h-3 w-12 rounded text-center text-[10px] font-bold text-white flex items-center justify-center', r.color)}>
                  {r.score}
                </div>
                <span className="text-foreground/80">{r.label}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    )
  }

  // === Results dashboard ===
  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <div>
          <Badge variant="outline" className="mb-2 gap-1.5 border-gold text-gold">
            <Sparkles className="h-3 w-3" />
            Familiarity Score
          </Badge>
          <h1 className="font-display text-3xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
            Resultados del análisis
          </h1>
          <p className="text-sm text-muted-foreground">
            {result.totalRecords} registros · {result.totalComparisons} comparaciones · {result.pairs.length} pares significativos
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={exportResults} className="gap-2">
            <Download className="h-4 w-4" />
            Exportar CSV
          </Button>
          <Button variant="ghost" size="sm" onClick={() => { setResult(null); setRecords([]) }} className="gap-2">
            Nuevo análisis
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatBox icon={AlertTriangle} label="Duplicados" value={String(result.duplicates.length)} color="text-red-600" bg="bg-red-500/10" />
        <StatBox icon={Users} label="Familias" value={String(result.families.length)} color="text-orange-600" bg="bg-orange-500/10" />
        <StatBox icon={MapPin} label="Vecinos" value={String(result.neighbors.length)} color="text-green-600" bg="bg-green-500/10" />
        <StatBox icon={GitBranch} label="Clústeres" value={String(result.clusters.length)} color="text-violet-600" bg="bg-violet-500/10" />
        <StatBox icon={BarChart3} label="Total pares" value={String(result.pairs.length)} color="text-blue-600" bg="bg-blue-500/10" />
      </div>

      <DividerVine className="my-6" opacity={0.3} />

      {/* Tabs */}
      <Tabs defaultValue="duplicates">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-5">
          <TabsTrigger value="duplicates" className="gap-1.5 text-xs">
            <AlertTriangle className="h-3.5 w-3.5" />
            Duplicados
          </TabsTrigger>
          <TabsTrigger value="families" className="gap-1.5 text-xs">
            <Users className="h-3.5 w-3.5" />
            Familias
          </TabsTrigger>
          <TabsTrigger value="neighbors" className="gap-1.5 text-xs">
            <MapPin className="h-3.5 w-3.5" />
            Vecinos
          </TabsTrigger>
          <TabsTrigger value="map" className="gap-1.5 text-xs">
            <MapPin className="h-3.5 w-3.5" />
            Mapa
          </TabsTrigger>
          <TabsTrigger value="distribution" className="gap-1.5 text-xs">
            <BarChart3 className="h-3.5 w-3.5" />
            Distribución
          </TabsTrigger>
        </TabsList>

        {/* Duplicates tab */}
        <TabsContent value="duplicates" className="mt-4">
          <PairList
            pairs={result.duplicates}
            onSelect={setSelectedPair}
            emptyMessage="No se encontraron duplicados (score ≥95)"
            colorClass="border-red-500/30"
          />
        </TabsContent>

        {/* Families tab */}
        <TabsContent value="families" className="mt-4">
          <PairList
            pairs={result.families}
            onSelect={setSelectedPair}
            emptyMessage="No se encontraron familias (score 75-94)"
            colorClass="border-orange-500/30"
          />
        </TabsContent>

        {/* Neighbors tab */}
        <TabsContent value="neighbors" className="mt-4">
          <PairList
            pairs={result.neighbors}
            onSelect={setSelectedPair}
            emptyMessage="No se encontraron vecinos (score 60-74)"
            colorClass="border-green-500/30"
          />
        </TabsContent>

        {/* Map tab */}
        <TabsContent value="map" className="mt-4">
          <Card className="p-4">
            <h3 className="mb-3 text-sm font-semibold">Mapa de clientes (Lima)</h3>
            {records.filter(r => r.lat && r.lon).length > 0 ? (
              <MapView records={records} clusters={result.clusters} />
            ) : (
              <div className="py-12 text-center text-sm text-muted-foreground">
                Los registros no tienen coordenadas (lat/lon). Sube un Excel con columnas 'lat' y 'lon' para ver el mapa.
              </div>
            )}
          </Card>
        </TabsContent>

        {/* Distribution tab */}
        <TabsContent value="distribution" className="mt-4">
          <Card className="p-5">
            <h3 className="mb-4 text-sm font-semibold">Distribución de scores</h3>
            <div className="space-y-3">
              {result.scoreDistribution.map((s) => {
                const maxCount = Math.max(...result.scoreDistribution.map(d => d.count), 1)
                const pct = (s.count / maxCount) * 100
                return (
                  <div key={s.range} className="flex items-center gap-3">
                    <div className="w-16 text-xs font-mono text-muted-foreground">{s.range}</div>
                    <div className="flex-1">
                      <div className="h-6 overflow-hidden rounded bg-muted">
                        <motion.div
                          className="h-full gradient-primary"
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                    </div>
                    <div className="w-8 text-right text-xs font-bold">{s.count}</div>
                  </div>
                )
              })}
            </div>
          </Card>

          {result.clusters.length > 0 && (
            <Card className="mt-4 p-5">
              <h3 className="mb-3 text-sm font-semibold">Clústeres familiares (connected components)</h3>
              <div className="space-y-3">
                {result.clusters.map((cluster, i) => (
                  <div key={i} className="rounded-lg border border-violet-500/20 bg-violet-500/5 p-3">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-violet-500 text-white">Clúster {i + 1}</Badge>
                      <span className="text-xs text-muted-foreground">{cluster.length} personas</span>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {cluster.map(r => (
                        <span key={r.id} className="rounded-full border border-border bg-card px-2 py-0.5 text-[10px]">
                          {r.nombre} {r.apellido_paterno}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Pair detail modal */}
      <AnimatePresence>
        {selectedPair && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={() => setSelectedPair(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="max-h-[85vh] w-full max-w-3xl overflow-y-auto scroll-area-thin"
            >
              <PairDetail pair={selectedPair} onClose={() => setSelectedPair(null)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// === Sub-components ===

function StatBox({ icon: Icon, label, value, color, bg }: {
  icon: React.ElementType; label: string; value: string; color: string; bg: string
}) {
  return (
    <Card className={cn('p-4', bg)}>
      <Icon className={cn('h-5 w-5', color)} />
      <div className="mt-2 text-2xl font-bold">{value}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </Card>
  )
}

function PairList({ pairs, onSelect, emptyMessage, colorClass }: {
  pairs: FamiliarityPair[]
  onSelect: (p: FamiliarityPair) => void
  emptyMessage: string
  colorClass: string
}) {
  if (pairs.length === 0) {
    return (
      <Card className="p-8 text-center text-sm text-muted-foreground">
        {emptyMessage}
      </Card>
    )
  }

  return (
    <div className="space-y-2 max-h-[600px] overflow-y-auto scroll-area-thin">
      {pairs.map((pair, i) => (
        <Card
          key={i}
          className={cn('cursor-pointer p-4 transition-all hover:shadow-card-hover', colorClass)}
          onClick={() => onSelect(pair)}
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <div className={cn(
                'flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white',
                pair.score >= 95 ? 'bg-red-500' :
                pair.score >= 85 ? 'bg-orange-500' :
                pair.score >= 75 ? 'bg-amber-500' :
                pair.score >= 60 ? 'bg-green-500' : 'bg-blue-500'
              )}>
                {pair.score}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="truncate text-sm font-medium">
                    {pair.a.nombre} {pair.a.apellido_paterno}
                  </span>
                  <span className="text-muted-foreground">↔</span>
                  <span className="truncate text-sm font-medium">
                    {pair.b.nombre} {pair.b.apellido_paterno}
                  </span>
                </div>
                <div className="mt-0.5 flex flex-wrap gap-1">
                  {pair.signals.phoneMatch && <Badge variant="secondary" className="text-[10px] gap-0.5"><Zap className="h-2.5 w-2.5" /> Teléfono</Badge>}
                  {pair.signals.emailMatch && <Badge variant="secondary" className="text-[10px] gap-0.5"><Zap className="h-2.5 w-2.5" /> Email</Badge>}
                  {pair.signals.sharedApellido && <Badge variant="secondary" className="text-[10px]">Apellido</Badge>}
                  {pair.signals.sameDistrict && <Badge variant="secondary" className="text-[10px]">Distrito</Badge>}
                </div>
              </div>
            </div>
            <Eye className="h-4 w-4 shrink-0 text-muted-foreground" />
          </div>
          <div className="mt-2 text-xs text-muted-foreground">{pair.relationship}</div>
        </Card>
      ))}
    </div>
  )
}

function PairField({ label, valueA, valueB, match }: { label: string; valueA: string; valueB: string; match?: boolean }) {
  return (
    <div className={cn('rounded-lg border p-3', match ? 'border-green-500/30 bg-green-500/5' : 'border-border')}>
      <div className="text-xs font-medium text-muted-foreground">{label}</div>
      <div className="mt-1 grid grid-cols-2 gap-2 text-sm">
        <div>
          <div className="text-[10px] text-muted-foreground">A</div>
          <div className="font-mono text-xs">{valueA || '—'}</div>
        </div>
        <div>
          <div className="text-[10px] text-muted-foreground">B</div>
          <div className="font-mono text-xs">{valueB || '—'}</div>
        </div>
      </div>
      {match && <Badge className="mt-1 bg-green-500 text-white text-[10px]">MATCH</Badge>}
    </div>
  )
}

function PairDetail({ pair, onClose }: { pair: FamiliarityPair; onClose: () => void }) {
  const { a, b, score, relationship, signals } = pair

  return (
    <Card className="relative p-6">
      <CornerOrnament className="absolute right-0 top-0 h-16 w-16" opacity={0.2} rotate={90} />
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className={cn(
              'flex h-14 w-14 items-center justify-center rounded-full text-lg font-bold text-white',
              score >= 95 ? 'bg-red-500' :
              score >= 85 ? 'bg-orange-500' :
              score >= 75 ? 'bg-amber-500' :
              score >= 60 ? 'bg-green-500' : 'bg-blue-500'
            )}>
              {score}
            </div>
            <div>
              <h3 className="font-display text-xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>{relationship}</h3>
              <p className="text-xs text-muted-foreground">Score de familiaridad: {score}/100</p>
            </div>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>Cerrar</Button>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <PairField label="Nombre completo" valueA={`${a.nombre} ${a.apellido_paterno} ${a.apellido_materno}`} valueB={`${b.nombre} ${b.apellido_paterno} ${b.apellido_materno}`} />
        <PairField label="DNI" valueA={a.dni || ''} valueB={b.dni || ''} match={a.dni && b.dni && a.dni === b.dni ? true : false} />
        <PairField label="Teléfono" valueA={a.telefono || ''} valueB={b.telefono || ''} match={signals.phoneMatch} />
        <PairField label="Email" valueA={a.email || ''} valueB={b.email || ''} match={signals.emailMatch} />
        <PairField label="Dirección" valueA={a.direccion || ''} valueB={b.direccion || ''} />
        <PairField label="Distrito" valueA={a.distrito || ''} valueB={b.distrito || ''} match={signals.sameDistrict} />
      </div>

      {/* Signal breakdown */}
      <div className="mt-6">
        <h4 className="text-sm font-semibold mb-3">Desglose de signals</h4>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <SignalBox label="Similitud nombre" value={`${(signals.nameSimilarity * 100).toFixed(1)}%`} />
          <SignalBox label="Similitud dirección" value={`${(signals.addressSimilarity * 100).toFixed(1)}%`} />
          <SignalBox label="Apellido compartido" value={signals.sharedApellido ? 'Sí' : 'No'} />
          <SignalBox label="Distancia" value={signals.distanceKm !== null ? `${signals.distanceKm.toFixed(2)} km` : 'N/A'} />
        </div>
      </div>
    </Card>
  )
}

function SignalBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-card p-3 text-center">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-1 text-sm font-bold">{value}</div>
    </div>
  )
}

// Leaflet map with real tiles — loaded dynamically to avoid SSR issues
function MapView({ records, clusters }: { records: ClientRecord[]; clusters: ClientRecord[][] }) {
  const withCoords = records.filter(r => r.lat && r.lon)
  const [LeafletMap, setLeafletMap] = useState<any>(null)

  useEffect(() => {
    // Dynamic import to avoid SSR
    import('react-leaflet').then((mod) => {
      setLeafletMap(() => ({ MapContainer: mod.MapContainer, TileLayer: mod.TileLayer, CircleMarker: mod.CircleMarker, Popup: mod.Popup, Polyline: mod.Polyline, useMap: mod.useMap }))
    })
    // Load Leaflet CSS
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link')
      link.id = 'leaflet-css'
      link.rel = 'stylesheet'
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
      document.head.appendChild(link)
    }
  }, [])

  if (withCoords.length === 0) {
    return (
      <div className="py-12 text-center text-sm text-muted-foreground">
        Los registros no tienen coordenadas (lat/lon).
      </div>
    )
  }

  if (!LeafletMap) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <span className="ml-2 text-sm text-muted-foreground">Cargando mapa...</span>
      </div>
    )
  }

  const { MapContainer, TileLayer, CircleMarker, Popup, Polyline } = LeafletMap

  // Build cluster lookup
  const clusterMap = new Map<string, number>()
  clusters.forEach((cluster, i) => {
    cluster.forEach(r => clusterMap.set(r.id, i))
  })

  const clusterColors = ['#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c', '#e67e22', '#34495e']
  const getColor = (id: string) => {
    const ci = clusterMap.get(id)
    return ci !== undefined ? clusterColors[ci % clusterColors.length] : '#95a5a6'
  }

  // Center on average of all points
  const avgLat = withCoords.reduce((s, r) => s + r.lat!, 0) / withCoords.length
  const avgLon = withCoords.reduce((s, r) => s + r.lon!, 0) / withCoords.length

  // Cluster connection lines
  const lines: { positions: [number, number][]; color: string }[] = []
  for (const cluster of clusters) {
    const color = clusterColors[(clusterMap.get(cluster[0].id) || 0) % clusterColors.length]
    for (let i = 0; i < cluster.length; i++) {
      for (let j = i + 1; j < cluster.length; j++) {
        if (cluster[i].lat && cluster[i].lon && cluster[j].lat && cluster[j].lon) {
          lines.push({
            positions: [[cluster[i].lat!, cluster[i].lon!], [cluster[j].lat!, cluster[j].lon!]],
            color,
          })
        }
      }
    }
  }

  return (
    <div>
      <MapContainer
        center={[avgLat, avgLon]}
        zoom={12}
        style={{ height: '400px', width: '100%', borderRadius: '8px' }}
        scrollWheelZoom={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />
        {/* Cluster connection lines */}
        {lines.map((l, i) => (
          <Polyline key={i} positions={l.positions} pathOptions={{ color: l.color, opacity: 0.4, dashArray: '5 5' }} />
        ))}
        {/* Client markers */}
        {withCoords.map(r => {
          const color = getColor(r.id)
          const ci = clusterMap.get(r.id)
          const isClustered = ci !== undefined
          return (
            <CircleMarker
              key={r.id}
              center={[r.lat!, r.lon!]}
              radius={isClustered ? 8 : 5}
              pathOptions={{ color: color, fillColor: color, fillOpacity: 0.7, weight: 1 }}
            >
              <Popup>
                <div className="text-xs">
                  <strong>{r.nombre} {r.apellido_paterno}</strong><br />
                  📍 {r.distrito}<br />
                  📞 {r.telefono}<br />
                  {ci !== undefined && <span>👥 Clúster #{ci + 1}</span>}
                </div>
              </Popup>
            </CircleMarker>
          )
        })}
      </MapContainer>
      <div className="mt-2 text-center text-xs text-muted-foreground">
        {withCoords.length} clientes geolocalizados · {clusters.length} clústeres familiares · Mapa con tiles reales de OpenStreetMap
      </div>
    </div>
  )
}
