'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  Bug,
  Camera,
  Download,
  FileUp,
  Mail,
  MapPin,
  Crosshair,
  MonitorCheck,
  Send,
  Trash2,
  GraduationCap,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { QATour } from './QATour'
import { ElementPicker } from './ElementPicker'
import { QAHint } from './QAHint'
import { QA_TOUR_STORAGE_KEY } from '@/lib/qa-tour-content'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  QA_CATEGORIES,
  QA_CAUSES,
  QA_SEVERITIES,
  buildQaPackage,
  clearQaIssues,
  createQaIssueId,
  deleteQaIssue,
  getQaTester,
  importQaPackage,
  listQaIssues,
  parseQaPackage,
  qaPackageFile,
  saveQaIssue,
  setQaTester,
  type QACategory,
  type QACause,
  type QAContext,
  type QAIssue,
  type QASeverity,
} from '@/lib/qa-session'

interface QAHarnessProps {
  sectionId: string | null
  sectionIndex: number | null
  sectionTitle: string | null
  activeSubStep: string | null
}

type Tab = 'report' | 'session' | 'review'

const EMPTY_FORM = {
  category: 'functionality' as QACategory,
  cause: 'unknown' as QACause,
  severity: 'medium' as QASeverity,
  title: '',
  description: '',
  expected: '',
  actual: '',
  reproductionSteps: '',
  improvement: '',
}

function dataUrlFromFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result ?? ''))
    reader.onerror = () => reject(reader.error ?? new Error('No se pudo leer la captura.'))
    reader.readAsDataURL(file)
  })
}

async function captureDisplay(): Promise<string> {
  if (!navigator.mediaDevices?.getDisplayMedia) {
    throw new Error('Este navegador no permite captura de pantalla desde la página.')
  }
  const stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: false })
  try {
    const video = document.createElement('video')
    video.srcObject = stream
    video.muted = true
    await video.play()
    await new Promise((resolve) => window.setTimeout(resolve, 180))
    const width = video.videoWidth || window.innerWidth
    const height = video.videoHeight || window.innerHeight
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('No se pudo crear la captura.')
    ctx.drawImage(video, 0, 0, width, height)
    return canvas.toDataURL('image/jpeg', 0.82)
  } finally {
    for (const track of stream.getTracks()) track.stop()
  }
}

function downloadFile(file: File): void {
  const url = URL.createObjectURL(file)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = file.name
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 1000)
}

function contextLabel(issue: QAIssue): string {
  const bits: string[] = []
  if (issue.context.sectionIndex) bits.push(`S${String(issue.context.sectionIndex).padStart(2, '0')}`)
  if (issue.context.sectionTitle) bits.push(issue.context.sectionTitle)
  if (issue.context.subStep) bits.push(issue.context.subStep)
  return bits.length ? bits.join(' › ') : issue.context.hash || issue.context.path
}

function severityClasses(severity: QASeverity): string {
  if (severity === 'blocker') return 'border-red-500/50 bg-red-500/10 text-red-700 dark:text-red-300'
  if (severity === 'high') return 'border-orange-500/50 bg-orange-500/10 text-orange-700 dark:text-orange-300'
  if (severity === 'medium') return 'border-amber-500/50 bg-amber-500/10 text-amber-700 dark:text-amber-300'
  return 'border-slate-500/40 bg-slate-500/10 text-muted-foreground'
}

export function QAHarness({ sectionId, sectionIndex, sectionTitle, activeSubStep }: QAHarnessProps) {
  const [open, setOpen] = useState(false)
  const [tab, setTab] = useState<Tab>('report')
  const [tourOpen, setTourOpen] = useState(false)

  // Shown once per browser, the first time the workspace is opened. A tester
  // who dismisses it can reopen it from the Tutorial button at any time; the
  // key is its own, so completing the platform tour never suppresses this.
  useEffect(() => {
    if (!open) return
    let seen = '1'
    try {
      seen = localStorage.getItem(QA_TOUR_STORAGE_KEY) ?? ''
    } catch {
      seen = '1'
    }
    if (!seen) setTourOpen(true)
  }, [open])
  const [issues, setIssues] = useState<QAIssue[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [tester, setTesterState] = useState('')
  const [deploymentSha, setDeploymentSha] = useState<string | null>(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [screenshotDataUrl, setScreenshotDataUrl] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const capturedContext = useRef<QAContext | null>(null)
  const [picking, setPicking] = useState(false)
  // capturedContext is a ref, so writing the picked element into it does not
  // repaint the preview on its own. This is the nudge that does.
  const [contextRevision, setContextRevision] = useState(0)
  const importRef = useRef<HTMLInputElement | null>(null)
  const screenshotRef = useRef<HTMLInputElement | null>(null)

  const refreshIssues = useCallback(async () => {
    const next = await listQaIssues()
    setIssues(next)
    setSelectedId((current) => current && next.some((item) => item.id === current) ? current : next[0]?.id ?? null)
  }, [])

  useEffect(() => {
    setTesterState(getQaTester())
    void refreshIssues()
  }, [refreshIssues])

  useEffect(() => {
    let cancelled = false
    async function loadDeployment() {
      try {
        const base = window.location.pathname.startsWith('/pyarcana') ? '/pyarcana' : ''
        const response = await fetch(`${base}/deployment.json`, { cache: 'no-store' })
        if (!response.ok) return
        const data = await response.json() as { git_sha?: unknown }
        if (!cancelled && typeof data.git_sha === 'string') setDeploymentSha(data.git_sha)
      } catch {
        // Development builds may not publish deployment.json.
      }
    }
    void loadDeployment()
    return () => { cancelled = true }
  }, [])

  const snapshotContext = useCallback((): QAContext => ({
    path: window.location.pathname,
    hash: window.location.hash,
    sectionId,
    sectionIndex,
    sectionTitle,
    subStep: activeSubStep,
    viewport: { width: window.innerWidth, height: window.innerHeight },
    // Clamped at zero: Safari's rubber-band overscroll reports a negative
    // scrollY, which is a real value and not a useful one. Capturing it made
    // the validator quarantine the issue on the very next refresh, so the
    // tester was told the report saved and then could not find it.
    scrollY: Math.max(0, Math.round(window.scrollY || 0)),
    userAgent: navigator.userAgent,
    language: navigator.language,
    deploymentSha,
    // Not document.activeElement: unless the tester happened to have something
    // focused that is <body>, and every report claimed the problem was in the
    // body element. Null means "not pointed at anything yet", and the tester
    // can point with the picker.
    elementHint: null,
  }), [activeSubStep, deploymentSha, sectionId, sectionIndex, sectionTitle])

  const openHarness = useCallback((nextTab: Tab = 'report') => {
    capturedContext.current = snapshotContext()
    setMessage(null)
    setTab(nextTab)
    setOpen(true)
    void refreshIssues()
  }, [refreshIssues, snapshotContext])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.altKey && event.key.toLowerCase() === 'q') {
        event.preventDefault()
        openHarness('report')
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [openHarness])

  const selected = useMemo(
    () => issues.find((issue) => issue.id === selectedId) ?? null,
    [issues, selectedId],
  )

  const issueCountText = issues.length === 1 ? '1 incidencia guardada' : `${issues.length} incidencias guardadas`

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setMessage(null)
    if (!form.title.trim() || !form.description.trim()) {
      setMessage('Añade un título breve y una descripción para guardar la incidencia.')
      return
    }
    setBusy(true)
    try {
      const now = new Date().toISOString()
      const issue: QAIssue = {
        id: createQaIssueId(),
        createdAt: now,
        updatedAt: now,
        status: 'open',
        category: form.category,
        cause: form.cause,
        severity: form.severity,
        title: form.title.trim(),
        description: form.description.trim(),
        expected: form.expected.trim(),
        actual: form.actual.trim(),
        reproductionSteps: form.reproductionSteps.trim(),
        improvement: form.improvement.trim(),
        context: capturedContext.current ?? snapshotContext(),
        screenshotDataUrl,
      }
      await saveQaIssue(issue)
      await refreshIssues()
      setSelectedId(issue.id)
      setForm(EMPTY_FORM)
      setScreenshotDataUrl(null)
      setMessage(`Guardado localmente como ${issue.id.slice(0, 8)}.`)
      setTab('review')
    } catch (error) {
      const detail = error instanceof Error ? error.message : 'No se pudo persistir la incidencia.'
      setMessage(`${detail} El formulario y la captura se conservaron. Libera espacio o quita/comprime la evidencia y vuelve a intentar.`)
      setTab('report')
    } finally {
      setBusy(false)
    }
  }

  const handleScreenshotFile = async (file: File | undefined) => {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setMessage('La evidencia visual debe ser un archivo de imagen.')
      return
    }
    if (file.size > 6 * 1024 * 1024) {
      setMessage('La captura supera 6 MB. Recórtala o comprímela antes de adjuntarla.')
      return
    }
    try {
      setScreenshotDataUrl(await dataUrlFromFile(file))
      setMessage('Captura adjuntada; se guardará solo en este navegador y en el paquete exportado.')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'No se pudo leer la captura.')
    }
  }

  const handleScreenCapture = async () => {
    setMessage(null)
    setBusy(true)
    setOpen(false)
    await new Promise((resolve) => window.setTimeout(resolve, 120))
    try {
      const dataUrl = await captureDisplay()
      setScreenshotDataUrl(dataUrl)
      setMessage('Captura añadida. Revisa que no contenga datos sensibles antes de exportar.')
    } catch (error) {
      const name = error instanceof DOMException ? error.name : ''
      if (name !== 'NotAllowedError' && name !== 'AbortError') {
        setMessage(error instanceof Error ? error.message : 'No se pudo capturar la pantalla.')
      }
    } finally {
      setOpen(true)
      setBusy(false)
    }
  }

  const currentPackage = useCallback(() => buildQaPackage(issues, tester), [issues, tester])

  const handleDownload = () => {
    if (!issues.length) {
      setMessage('No hay incidencias que exportar.')
      return
    }
    const file = qaPackageFile(currentPackage())
    downloadFile(file)
    setMessage(`Paquete generado: ${file.name}`)
  }

  const handleShare = async () => {
    if (!issues.length) {
      setMessage('No hay incidencias que compartir.')
      return
    }
    const file = qaPackageFile(currentPackage())
    try {
      if (navigator.share && (!navigator.canShare || navigator.canShare({ files: [file] }))) {
        await navigator.share({
          title: 'PyArcana · reporte QA interno',
          text: `${issues.length} incidencias de QA interno`,
          files: [file],
        })
        setMessage('Reporte compartido desde el navegador.')
        return
      }
    } catch (error) {
      if (error instanceof DOMException && (error.name === 'AbortError' || error.name === 'NotAllowedError')) return
    }
    downloadFile(file)
    setMessage('Tu navegador no comparte archivos directamente; se descargó el paquete como alternativa.')
  }

  const handleEmail = () => {
    if (!issues.length) {
      setMessage('No hay incidencias que enviar.')
      return
    }
    const file = qaPackageFile(currentPackage())
    downloadFile(file)
    const subject = encodeURIComponent(`PyArcana QA interno · ${issues.length} incidencias`)
    const body = encodeURIComponent(
      `Adjunto el paquete ${file.name}.\n\n` +
      `Tester: ${tester || 'sin alias'}\n` +
      `Incidencias: ${issues.length}\n` +
      `Deployment: ${deploymentSha ?? 'no disponible'}\n\n` +
      'El navegador no permite adjuntar un archivo automáticamente a mailto; adjunta el JSON descargado antes de enviar.',
    )
    window.location.href = `mailto:?subject=${subject}&body=${body}`
  }

  const handleImport = async (file: File | undefined) => {
    if (!file) return
    setBusy(true)
    setMessage(null)
    try {
      const text = await file.text()
      const pkg = parseQaPackage(text)
      await importQaPackage(pkg)
      if (pkg.tester) setTesterState(pkg.tester)
      await refreshIssues()
      setTab('review')
      setMessage(`Importadas ${pkg.issues.length} incidencias desde ${file.name}.`)
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'No se pudo importar el paquete QA.')
    } finally {
      setBusy(false)
      if (importRef.current) importRef.current.value = ''
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteQaIssue(id)
      await refreshIssues()
      setMessage('Incidencia eliminada de esta sesión local.')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'No se pudo eliminar la incidencia local.')
    }
  }

  const handleClear = async () => {
    if (!window.confirm('¿Eliminar todas las incidencias QA guardadas en este navegador?')) return
    try {
      await clearQaIssues()
      await refreshIssues()
      setMessage('Sesión QA local vaciada.')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'No se pudo vaciar la sesión QA local.')
    }
  }

  const updateTester = (value: string) => {
    setTesterState(value)
    setQaTester(value)
  }

  return (
    <>
      <QAHint label="Abre el workspace de QA para reportar lo que encuentres. Atajo: Ctrl/⌘ + Alt + Q." side="top">
        <button
          type="button"
          onClick={() => openHarness('report')}
          className="inline-flex items-center gap-1 rounded px-1.5 py-1 text-[11px] text-muted-foreground/70 underline decoration-dotted underline-offset-4 transition hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          data-testid="qa-harness-open"
        >
          <Bug className="h-3 w-3" aria-hidden="true" />
          QA interna
        </button>
      </QAHint>

      {/*
        modal={!picking}: while the tester is aiming, Radix must stop trapping
        focus and stop putting pointer-events:none on the body, or the page
        underneath cannot be clicked at all. The content stays mounted either
        way, so a half-written report survives the detour.
      */}
      <Dialog open={open} onOpenChange={setOpen} modal={!picking}>
        <DialogContent
          suspended={picking}
          size="workspace"
          // The `sm:!max-w-…` override this replaced was fighting the base
          // `sm:max-w-lg` with an !important, which worked and told the next
          // dialog nothing. The width is a size now, and the height cap lives
          // in the primitive.
          className="flex flex-col gap-0 overflow-hidden p-0"
          data-testid="qa-harness-dialog"
          // While the tutorial is up, a pointerdown on its overlay is an
          // interaction outside this content, so Radix closed the workspace
          // underneath it -- dismissing the tutorial threw the tester out of
          // the form they were about to fill. Moving the tour out of the
          // Dialog tree did not help, because the detector is global.
          // Aiming at the page is, by construction, an interaction outside this
          // content -- so picking an element closed the workspace out from under
          // the half-written report it belonged to. Escape is the same story:
          // while aiming it cancels the aim, not the report.
          onInteractOutside={(event) => { if (tourOpen || picking) event.preventDefault() }}
          onEscapeKeyDown={(event) => { if (tourOpen || picking) event.preventDefault() }}
        >
          <DialogHeader className="border-b border-border px-5 py-4 pr-12">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <DialogTitle className="flex items-center gap-2 text-xl">
                  <MonitorCheck className="h-5 w-5 text-primary" />
                  Workspace de QA interno
                </DialogTitle>
                <DialogDescription className="mt-1 max-w-3xl text-left">
                  Reporta evidencia reproducible. Todo se guarda primero en este navegador; nada se envía automáticamente.
                </DialogDescription>
              </div>
              <div className="flex items-center gap-2">
                {/* Placed in the header rather than buried in a tab: a tester
                    who does not know the taxonomy needs to find this before
                    filling anything in, not after. */}
                <QAHint label="Recorrido guiado: qué significa cada campo y cómo moverte por el workspace. Puedes repetirlo cuando quieras." side="bottom">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setTourOpen(true)}
                    data-testid="qa-tour-open"
                    className="gap-1.5"
                  >
                    <GraduationCap className="h-4 w-4" />
                    Tutorial
                  </Button>
                </QAHint>
                <QAHint label="Incidencias guardadas en este navegador. No se envían solas a ningún sitio: se exportan desde la pestaña Sesión." side="bottom">
                  <div className="cursor-help rounded-full border border-border bg-muted/50 px-3 py-1 text-xs text-muted-foreground" data-testid="qa-issue-count" tabIndex={0}>
                    {issueCountText}
                  </div>
                </QAHint>
              </div>
            </div>
          </DialogHeader>

          <div className="flex border-b border-border bg-muted/20 px-4" role="tablist" aria-label="Secciones del workspace QA">
            {([
              ['report', 'Reportar', 'Escribes una incidencia nueva: qué viste, dónde y cómo reproducirlo.'],
              ['session', 'Sesión', 'Quién prueba y qué haces con lo reunido: exportar, importar, compartir o borrar.'],
              ['review', 'Revisión', 'Lees lo ya reportado, con su contexto y su evidencia, y lo cierras o lo borras.'],
            ] as const).map(([value, label, hint]) => (
              <QAHint key={value} label={hint} side="bottom">
                <button
                  type="button"
                  role="tab"
                  aria-selected={tab === value}
                  onClick={() => setTab(value)}
                  className={`border-b-2 px-4 py-3 text-sm font-medium transition ${tab === value ? 'border-primary text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
                  data-testid={`qa-tab-${value}`}
                >
                  {label}
                </button>
              </QAHint>
            ))}
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto">
            {message && (
              <div className="mx-5 mt-4 rounded-lg border border-border bg-muted/50 px-4 py-2.5 text-sm" role="status" data-testid="qa-message">
                {message}
              </div>
            )}

            {tab === 'report' && (
              <form onSubmit={handleSubmit} className="grid gap-5 p-5 lg:grid-cols-[minmax(0,1fr)_320px]" data-testid="qa-report-form">
                <div className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-3">
                    <Field label="Tipo">
                      <select
                        value={form.category}
                        onChange={(event) => setForm({ ...form, category: event.target.value as QACategory })}
                        className="qa-input"
                        data-testid="qa-category"
                      >
                        {QA_CATEGORIES.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                      </select>
                    </Field>
                    <Field label="Causa probable">
                      <select
                        value={form.cause}
                        onChange={(event) => setForm({ ...form, cause: event.target.value as QACause })}
                        className="qa-input"
                        data-testid="qa-cause"
                      >
                        {QA_CAUSES.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                      </select>
                    </Field>
                    <Field label="Severidad">
                      <select
                        value={form.severity}
                        onChange={(event) => setForm({ ...form, severity: event.target.value as QASeverity })}
                        className="qa-input"
                        data-testid="qa-severity"
                      >
                        {QA_SEVERITIES.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                      </select>
                    </Field>
                  </div>

                  <Field label="Título breve" required>
                    <input
                      value={form.title}
                      onChange={(event) => setForm({ ...form, title: event.target.value })}
                      className="qa-input"
                      placeholder="Ej.: La pregunta no puede responderse con la teoría previa"
                      data-testid="qa-title"
                    />
                  </Field>
                  <Field label="Qué ocurre" required hint="Describe el problema sin interpretar todavía la causa.">
                    <textarea
                      value={form.description}
                      onChange={(event) => setForm({ ...form, description: event.target.value })}
                      className="qa-input min-h-24 resize-y"
                      data-testid="qa-description"
                    />
                  </Field>

                  <div className="grid gap-4 md:grid-cols-2">
                    <Field label="Resultado esperado">
                      <textarea value={form.expected} onChange={(event) => setForm({ ...form, expected: event.target.value })} className="qa-input min-h-20 resize-y" />
                    </Field>
                    <Field label="Resultado observado">
                      <textarea value={form.actual} onChange={(event) => setForm({ ...form, actual: event.target.value })} className="qa-input min-h-20 resize-y" />
                    </Field>
                  </div>

                  <Field label="Pasos para reproducir" hint="Uno por línea. Incluye los datos o respuestas que usaste.">
                    <textarea
                      value={form.reproductionSteps}
                      onChange={(event) => setForm({ ...form, reproductionSteps: event.target.value })}
                      className="qa-input min-h-24 resize-y font-mono text-xs"
                      placeholder={'1. Abrir S01\n2. Ir a You Do\n3. Responder …'}
                      data-testid="qa-repro"
                    />
                  </Field>
                  <Field label="Mejora sugerida" hint="Opcional: qué cambio haría que la experiencia sea más clara o verificable.">
                    <textarea value={form.improvement} onChange={(event) => setForm({ ...form, improvement: event.target.value })} className="qa-input min-h-20 resize-y" />
                  </Field>
                </div>

                <aside className="space-y-4">
                  <div className="rounded-xl border border-border bg-muted/30 p-4">
                    <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
                      <MapPin className="h-4 w-4 text-primary" /> Contexto capturado
                    </div>
                    <ContextPreview key={contextRevision} context={capturedContext.current ?? snapshotContext()} />
                    <QAHint label="Aparta el workspace y te deja hacer clic en el elemento del que hablas. Anota un selector que quien revise puede pegar en devtools." side="left">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="mt-3 w-full"
                      data-testid="qa-pick-element"
                      onClick={() => { setMessage(null); setPicking(true) }}
                    >
                      <Crosshair className="mr-1.5 h-3.5 w-3.5" />
                      {capturedContext.current?.elementHint ? 'Señalar otro elemento' : 'Señalar elemento'}
                    </Button>
                    </QAHint>
                    {capturedContext.current?.elementHint && (
                      <QAHint label="Borra el selector guardado. La incidencia sigue apuntando a la sección y la vista, solo deja de señalar un elemento concreto." side="left">
                      <button
                        type="button"
                        data-testid="qa-clear-element"
                        className="mt-1 w-full text-xs text-muted-foreground underline-offset-2 hover:underline"
                        onClick={() => {
                          if (capturedContext.current) capturedContext.current.elementHint = null
                          setContextRevision((n) => n + 1)
                        }}
                      >
                        Quitar el elemento señalado
                      </button>
                      </QAHint>
                    )}
                    <QAHint label="Vuelve a capturar sección, scroll y tamaño de ventana. Úsalo si navegaste después de abrir el formulario." side="left">
                      <Button type="button" variant="outline" size="sm" className="mt-2 w-full" onClick={() => { const picked = capturedContext.current?.elementHint ?? null; capturedContext.current = { ...snapshotContext(), elementHint: picked }; setContextRevision((n) => n + 1); setMessage('Ubicación actualizada.') }}>
                        Actualizar ubicación
                      </Button>
                    </QAHint>
                  </div>

                  <div className="rounded-xl border border-border p-4">
                    <div className="mb-2 text-sm font-semibold">Evidencia visual</div>
                    <p className="mb-3 text-xs text-muted-foreground">Opcional. Revisa siempre que no aparezcan datos personales, credenciales o información sensible.</p>
                    {screenshotDataUrl ? (
                      <img src={screenshotDataUrl} alt="Captura adjunta a la incidencia" className="mb-3 max-h-44 w-full rounded-lg border border-border object-contain bg-black/5" />
                    ) : (
                      <div className="mb-3 flex h-28 items-center justify-center rounded-lg border border-dashed border-border text-xs text-muted-foreground">Sin captura</div>
                    )}
                    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                      <QAHint label="Pide al navegador una captura de pantalla. Tú eliges qué ventana compartir, y la imagen no sale de este equipo." side="left">
                        <Button type="button" variant="outline" size="sm" onClick={handleScreenCapture} disabled={busy} className="gap-1.5">
                          <Camera className="h-3.5 w-3.5" /> Capturar
                        </Button>
                      </QAHint>
                      <QAHint label="Sube una imagen que ya tengas. Revísala antes: se guarda dentro del paquete que exportes." side="left">
                        <Button type="button" variant="outline" size="sm" onClick={() => screenshotRef.current?.click()} className="gap-1.5">
                          <FileUp className="h-3.5 w-3.5" /> Adjuntar
                        </Button>
                      </QAHint>
                    </div>
                    <input ref={screenshotRef} type="file" accept="image/*" className="hidden" onChange={(event) => void handleScreenshotFile(event.target.files?.[0])} />
                    {screenshotDataUrl && (
                      <QAHint label="Descarta la imagen adjunta. El resto del formulario no se toca." side="left">
                        <button type="button" onClick={() => setScreenshotDataUrl(null)} className="mt-2 text-xs text-muted-foreground underline hover:text-foreground">Quitar captura</button>
                      </QAHint>
                    )}
                  </div>

                  <QAHint label="Guarda la incidencia en este navegador y limpia el formulario. Nada se envía: para entregarla, exporta desde Sesión." side="top">
                    <Button type="submit" className="w-full" disabled={busy} data-testid="qa-save-issue">
                      Guardar incidencia local
                    </Button>
                  </QAHint>
                </aside>
              </form>
            )}

            {tab === 'session' && (
              <div className="grid gap-5 p-5 lg:grid-cols-2" data-testid="qa-session-panel">
                <section className="space-y-4 rounded-xl border border-border p-5">
                  <div>
                    <h3 className="font-semibold">Identidad de la sesión</h3>
                    <p className="mt-1 text-sm text-muted-foreground">Usa un alias o nombre del tester. Se guarda solo en este navegador y en el archivo exportado.</p>
                  </div>
                  <Field label="Tester / alias">
                    <input value={tester} onChange={(event) => updateTester(event.target.value)} className="qa-input" data-testid="qa-tester" />
                  </Field>
                  <dl className="grid gap-2 text-sm">
                    <div className="flex justify-between gap-4"><dt className="text-muted-foreground">Incidencias</dt><dd>{issues.length}</dd></div>
                    <div className="flex justify-between gap-4"><dt className="text-muted-foreground">Deployment</dt><dd className="max-w-[18rem] truncate font-mono text-xs" title={deploymentSha ?? ''}>{deploymentSha ?? 'no disponible'}</dd></div>
                    <div className="flex justify-between gap-4"><dt className="text-muted-foreground">Persistencia</dt><dd>IndexedDB local-first</dd></div>
                    <div className="flex justify-between gap-4"><dt className="text-muted-foreground">Formato</dt><dd className="font-mono text-xs">pyarcana.qa.v1</dd></div>
                  </dl>
                </section>

                <section className="space-y-3 rounded-xl border border-border p-5">
                  <div>
                    <h3 className="font-semibold">Entregar o continuar una sesión</h3>
                    <p className="mt-1 text-sm text-muted-foreground">El JSON es autosuficiente: al importarlo aquí se reconstruyen lista, contexto y capturas.</p>
                  </div>
                  <div className="grid gap-2 sm:grid-cols-2">
                    <QAHint label="Descarga todas las incidencias en un archivo JSON. Ese archivo es la entrega: incluye contexto, repro y capturas." side="top">
                    <Button type="button" variant="outline" onClick={handleDownload} className="gap-2" data-testid="qa-export">
                      <Download className="h-4 w-4" /> Descargar
                    </Button>
                    </QAHint>
                    <QAHint label="Carga un paquete exportado para seguir una sesión en otro equipo. Se añade a lo que ya tienes, no lo reemplaza." side="top">
                    <Button type="button" variant="outline" onClick={() => importRef.current?.click()} className="gap-2" data-testid="qa-import">
                      <FileUp className="h-4 w-4" /> Importar
                    </Button>
                    </QAHint>
                    <QAHint label="Usa el menú de compartir del sistema si tu navegador lo soporta; si no, descarga el archivo." side="top">
                      <Button type="button" variant="outline" onClick={() => void handleShare()} className="gap-2">
                        <Send className="h-4 w-4" /> Compartir
                      </Button>
                    </QAHint>
                    <QAHint label="Descarga el paquete y abre tu cliente de correo con las instrucciones. El adjunto lo pones tú: mailto: no puede." side="top">
                      <Button type="button" variant="outline" onClick={handleEmail} className="gap-2">
                        <Mail className="h-4 w-4" /> Correo
                      </Button>
                    </QAHint>
                  </div>
                  <input ref={importRef} type="file" accept="application/json,.json" className="hidden" onChange={(event) => void handleImport(event.target.files?.[0])} />
                  <p className="text-xs text-muted-foreground">El botón Correo descarga primero el archivo y abre tu cliente de correo con instrucciones para adjuntarlo; los navegadores no permiten que `mailto:` añada adjuntos automáticamente.</p>
                  <QAHint label="Borra todas las incidencias de este navegador y no se puede deshacer. Exporta antes si aún no has entregado." side="top">
                    <Button type="button" variant="ghost" onClick={() => void handleClear()} className="text-destructive hover:text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" /> Vaciar sesión local
                    </Button>
                  </QAHint>
                </section>
              </div>
            )}

            {tab === 'review' && (
              <div className="grid min-h-[500px] lg:grid-cols-[360px_minmax(0,1fr)]" data-testid="qa-review-dashboard">
                <aside className="border-r border-border bg-muted/20">
                  <div className="border-b border-border px-4 py-3">
                    <h3 className="font-semibold">Incidencias</h3>
                    <p className="text-xs text-muted-foreground">Selecciona una para ver ubicación, repro y preview.</p>
                  </div>
                  <div className="max-h-[58vh] overflow-y-auto p-2">
                    {!issues.length && <div className="p-6 text-center text-sm text-muted-foreground">Todavía no hay incidencias.</div>}
                    {issues.map((issue) => (
                      <QAHint key={issue.id} label="Abre la incidencia: su ubicación exacta, los pasos para reproducirla y la captura si la tiene." side="right">
                      <button
                        type="button"
                        onClick={() => setSelectedId(issue.id)}
                        className={`mb-2 w-full rounded-lg border p-3 text-left transition ${selectedId === issue.id ? 'border-primary bg-primary/5' : 'border-border bg-background hover:bg-muted/50'}`}
                        data-testid="qa-issue-row"
                      >
                        <div className="mb-1 flex items-start justify-between gap-2">
                          <span className="line-clamp-2 text-sm font-medium">{issue.title}</span>
                          <span className={`shrink-0 rounded border px-1.5 py-0.5 text-[10px] font-semibold uppercase ${severityClasses(issue.severity)}`}>{issue.severity}</span>
                        </div>
                        <div className="truncate text-xs text-muted-foreground">{contextLabel(issue)}</div>
                      </button>
                      </QAHint>
                    ))}
                  </div>
                </aside>

                <section className="min-w-0 p-5">
                  {!selected ? (
                    <div className="flex h-full items-center justify-center text-sm text-muted-foreground">Selecciona una incidencia para revisar su evidencia.</div>
                  ) : (
                    <div className="space-y-5" data-testid="qa-issue-detail">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <div className="mb-1 text-xs font-mono text-muted-foreground">{selected.id}</div>
                          <h3 className="text-xl font-semibold">{selected.title}</h3>
                          <div className="mt-2 flex flex-wrap gap-2 text-xs">
                            <span className={`rounded border px-2 py-1 ${severityClasses(selected.severity)}`}>{selected.severity}</span>
                            <span className="rounded border border-border bg-muted/40 px-2 py-1">{QA_CATEGORIES.find((item) => item.value === selected.category)?.label ?? selected.category}</span>
                            <span className="rounded border border-border bg-muted/40 px-2 py-1">{QA_CAUSES.find((item) => item.value === selected.cause)?.label ?? selected.cause}</span>
                          </div>
                        </div>
                        <QAHint label="Borra solo esta incidencia, sin deshacer. Las demás y el resto de la sesión quedan intactas." side="left">
                          <Button type="button" variant="ghost" size="sm" onClick={() => void handleDelete(selected.id)} className="text-destructive hover:text-destructive">
                            <Trash2 className="mr-1.5 h-4 w-4" /> Eliminar
                          </Button>
                        </QAHint>
                      </div>

                      <div className="rounded-xl border border-border bg-muted/20 p-4">
                        <div className="mb-2 flex items-center gap-2 font-semibold"><MapPin className="h-4 w-4 text-primary" /> Sitemap de la incidencia</div>
                        <div className="rounded-lg border border-border bg-background px-3 py-2 font-mono text-sm" data-testid="qa-location-breadcrumb">Curso › {contextLabel(selected)}</div>
                        <ContextPreview context={selected.context} />
                      </div>

                      {selected.screenshotDataUrl && (
                        <div>
                          <h4 className="mb-2 text-sm font-semibold">Preview de pantalla</h4>
                          <img src={selected.screenshotDataUrl} alt={`Evidencia visual de ${selected.title}`} className="max-h-[360px] w-full rounded-xl border border-border object-contain bg-black/5" data-testid="qa-screenshot-preview" />
                        </div>
                      )}

                      <ReviewBlock title="Descripción" text={selected.description} />
                      <div className="grid gap-4 md:grid-cols-2">
                        <ReviewBlock title="Esperado" text={selected.expected} />
                        <ReviewBlock title="Observado" text={selected.actual} />
                      </div>
                      <ReviewBlock title="Pasos para reproducir" text={selected.reproductionSteps} mono />
                      <ReviewBlock title="Mejora sugerida" text={selected.improvement} />
                    </div>
                  )}
                </section>
              </div>
            )}
          </div>
          {/*
            Inside DialogContent, not a sibling portal. Radix keeps focus inside
            its own content, so a tour portalled to <body> could be clicked but
            never tabbed into: a keyboard-only tester could not reach the exercise
            options at all. Mounted here it shares the focus scope, and
            DialogContent is a transformed containing block, so the overlay is
            absolute to the workspace instead of fixed to the viewport.
          */}
          <QATour open={tourOpen} onClose={() => setTourOpen(false)} />
        </DialogContent>
      </Dialog>

      {/*
        Outside the Dialog on purpose. While picking, the workspace is suspended
        and non-modal; the picker has to keep painting over the live page and
        keep receiving events from it, which it cannot do from inside a
        pointer-events:none subtree.
      */}
      {picking && <ElementPicker
        onCancel={() => setPicking(false)}
        onPick={(hint) => {
          const base = capturedContext.current ?? snapshotContext()
          capturedContext.current = { ...base, elementHint: hint }
          setContextRevision((n) => n + 1)
          setPicking(false)
          setMessage('Elemento señalado.')
        }}
      />}
      {/* Outside <Dialog>, not merely portalled out of it. Rendered as a child
          of the Dialog tree, Radix reads a click on the tour's overlay as an
          outside-click and closes the workspace underneath -- so dismissing the
          tutorial threw the tester out of the form they were about to fill. */}
    </>
  )
}

function Field({ label, hint, required = false, children }: { label: string; hint?: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="block space-y-1.5 text-sm">
      <span className="font-medium">{label}{required && <span className="text-destructive"> *</span>}</span>
      {children}
      {hint && <span className="block text-xs text-muted-foreground">{hint}</span>}
    </label>
  )
}

function ContextPreview({ context }: { context: QAContext }) {
  return (
    <dl className="mt-2 grid gap-1.5 text-xs">
      <div className="flex justify-between gap-3"><dt className="text-muted-foreground">Ubicación</dt><dd className="truncate text-right" title={context.hash}>{context.sectionIndex ? `S${String(context.sectionIndex).padStart(2, '0')} · ${context.subStep ?? 'vista'}` : context.hash || context.path}</dd></div>
      <div className="flex justify-between gap-3"><dt className="text-muted-foreground">Viewport</dt><dd>{context.viewport.width}×{context.viewport.height}</dd></div>
      <div className="flex justify-between gap-3"><dt className="text-muted-foreground">Scroll</dt><dd>{context.scrollY}px</dd></div>
      {context.elementHint && <div className="flex justify-between gap-3"><dt className="text-muted-foreground">Elemento</dt><dd className="max-w-[15rem] truncate font-mono" title={context.elementHint}>{context.elementHint}</dd></div>}
      <div className="flex justify-between gap-3"><dt className="text-muted-foreground">SHA</dt><dd className="max-w-[15rem] truncate font-mono" title={context.deploymentSha ?? ''}>{context.deploymentSha?.slice(0, 12) ?? 'n/a'}</dd></div>
    </dl>
  )
}

function ReviewBlock({ title, text, mono = false }: { title: string; text: string; mono?: boolean }) {
  if (!text) return null
  return (
    <div>
      <h4 className="mb-1.5 text-sm font-semibold">{title}</h4>
      <div className={`whitespace-pre-wrap rounded-lg border border-border bg-muted/20 p-3 text-sm ${mono ? 'font-mono text-xs' : ''}`}>{text}</div>
    </div>
  )
}
