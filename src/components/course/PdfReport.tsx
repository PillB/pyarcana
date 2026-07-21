'use client'

import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Award, Download, FileText, Loader2, CheckCircle2,
  Sparkles, TrendingUp, Clock, Trophy
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { useProgressStore } from '@/lib/progress-store'

interface ProgressData {
  progress: Record<string, string[]>
  bookmarks: string[]
  examAttempts: Record<string, Array<{
    id: string
    attemptNumber: number
    score: number
    completedAt: string | null
    timeSpentSec: number
  }>>
  exerciseAttempts: Array<{
    id: string
    sectionId: string
    exerciseId: string
    usedHint: boolean
    correct: boolean
  }>
}

interface PdfReportProps {
  open: boolean
  onClose: () => void
}

const SECTION_NAMES: Record<string, string> = {
  setup: '1. Setup',
  basics: '2. Basics',
  "data-structures": '3. Data Struct',
  "functions-modules": '4. Functions',
  oop: '5. OOP',
  numpy: '6. NumPy',
  "data-acquisition": '7. Data Acq',
  pandas: '8. Pandas',
  visualization: '9. Viz',
  sklearn: '10. sklearn',
  testing: '11. Testing',
  performance: '12. Perf',
  "rpa-automation": '13. RPA',
  security: '14. Security',
  "stdlib-deep": '15. stdlib',
  "wxpython-gui": '16. GUI',
  packaging: '17. Packaging',
  "data-engineering": '18. Data Eng',
  "databases-orm": '19. DB/ORM',
  rag: '20. RAG',
  fastapi: '21. FastAPI',
  "rapidfuzz-entity": '22. RapidFuzz',
  "computer-vision": '23. CV',
  "rpa-advanced": '24. RPA+',
  "streamlit-dashboards": '25. Streamlit',
  "integrator-phase1": '26. Capstone P1',
  "async-concurrency": '27. Async',
  "llm-agents": '28. LLM Agents',
  mlops: '29. MLOps',
  "security-infra": '30. Sec/Infra',
  "streaming-data": '31. Streaming',
  microservices: '32. Microsvc',
  "advanced-models": '33. ML+',
  "cv-ai-integration": '34. CV+AI',
  "system-design": '35. SysDesign',
  "ai-apis-advanced": '36. AI APIs',
  "dbt-bigquery": '37. dbt/BQ',
  "performance-extreme": '38. Perf+',
  "integrator-phase2": '39. Capstone P2',
  "agentic-architecture": '40. Agentic',
  "llm-finetuning": '41. FineTune',
  "graph-rag": '42. GraphRAG',
  llmops: '43. LLMOps',
  multimodal: '44. Multi-Modal',
  iac: '45. IaC',
  "gpu-computing": '46. GPU',
  opensource: '47. OSS',
  "ai-governance": '48. Governance',
  "data-contracts": '49. Contracts',
  "tech-leadership": '50. Leadership',
  "integrator-final": '51. Capstone F',
  "career-strategy": '52. Career',

}

export function PdfReport({ open, onClose }: PdfReportProps) {
  const { data: session } = useSession()
  const { toast } = useToast()
  const [data, setData] = useState<ProgressData | null>(null)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const { completedSubSteps } = useProgressStore()

  useEffect(() => {
    if (open && session?.user) {
      fetch('/api/progress')
        .then((r) => r.json())
        .then((d) => setData(d))
        .catch(() => {})
        .finally(() => setLoading(false))
    }
  }, [open, session])

  const generatePDF = async () => {
    if (!data || !session?.user) return
    setGenerating(true)

    try {
      // Compute stats
      const sectionsCompleted = Object.entries(data.progress).filter(
        ([, steps]) => steps.length >= 5
      ).length
      const totalExams = Object.values(data.examAttempts).flat().length
      const avgScore = totalExams > 0
        ? Math.round(
            Object.values(data.examAttempts)
              .flat()
              .reduce((acc, e) => acc + e.score, 0) / totalExams
          )
        : 0
      const totalTime = Object.values(data.examAttempts)
        .flat()
        .reduce((acc, e) => acc + e.timeSpentSec, 0)

      // Generate HTML report
      const html = generateReportHTML({
        userName: session.user.name || 'Estudiante',
        userEmail: session.user.email,
        sectionsCompleted,
        totalSections: 52,
        totalExams,
        avgScore,
        totalTimeSec: totalTime,
        progress: data.progress,
        examAttempts: data.examAttempts,
        exerciseAttempts: data.exerciseAttempts,
        completedSubSteps,
      })

      // Open in new window for print-to-PDF
      const printWindow = window.open('', '_blank')
      if (!printWindow) {
        toast({ title: 'Bloqueado popup', description: 'Permite popups para generar el PDF', variant: 'destructive' })
        return
      }
      printWindow.document.write(html)
      printWindow.document.close()
      setTimeout(() => {
        printWindow.print()
      }, 500)

      toast({ title: '✓ Reporte generado', description: 'Usa "Guardar como PDF" en el diálogo de impresión' })
    } catch (err) {
      toast({ title: 'Error generando PDF', variant: 'destructive' })
    } finally {
      setGenerating(false)
    }
  }

  const generateCertificate = async () => {
    if (!session?.user) return
    setGenerating(true)

    try {
      const sectionsCompleted = Object.entries(data?.progress || {}).filter(
        ([, steps]) => steps.length >= 5
      ).length

      if (sectionsCompleted < 8) {
        toast({
          title: 'Aún no puedes generar certificado',
          description: `Completa al menos 8 secciones (tienes ${sectionsCompleted}/52)`,
          variant: 'destructive',
        })
        return
      }

      const html = generateCertificateHTML({
        userName: session.user.name || 'Estudiante',
        sectionsCompleted,
        totalSections: 52,
        date: new Date().toLocaleDateString('es-PE', { year: 'numeric', month: 'long', day: 'numeric' }),
      })

      const printWindow = window.open('', '_blank')
      if (!printWindow) {
        toast({ title: 'Bloqueado popup', description: 'Permite popups para generar el certificado', variant: 'destructive' })
        return
      }
      printWindow.document.write(html)
      printWindow.document.close()
      setTimeout(() => {
        printWindow.print()
      }, 500)

      toast({ title: '✓ Certificado generado', description: 'Usa "Guardar como PDF" en el diálogo de impresión' })
    } catch (err) {
      toast({ title: 'Error generando certificado', variant: 'destructive' })
    } finally {
      setGenerating(false)
    }
  }

  if (!open) return null

  if (!session?.user) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
        <Card className="max-w-md p-6" onClick={(e) => e.stopPropagation()}>
          <Award className="mx-auto h-10 w-10 text-primary" />
          <h3 className="mt-3 text-center text-lg font-semibold">Inicia sesión</h3>
          <p className="mt-1 text-center text-sm text-muted-foreground">
            Necesitas una cuenta para generar reportes y certificados.
          </p>
          <Button onClick={onClose} className="mt-4 w-full">Cerrar</Button>
        </Card>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  const sectionsCompleted = Object.entries(data?.progress || {}).filter(
    ([, steps]) => steps.length >= 5
  ).length
  const totalExams = Object.values(data?.examAttempts || {}).flat().length
  const avgScore = totalExams > 0
    ? Math.round(
        Object.values(data?.examAttempts || {})
          .flat()
          .reduce((acc, e) => acc + e.score, 0) / totalExams
      )
    : 0
  const canGetCertificate = sectionsCompleted >= 8

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[85vh] w-full max-w-2xl overflow-y-auto scroll-area-thin"
      >
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Reportes y certificados</h2>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>Cerrar</Button>
          </div>

          <p className="mt-2 text-sm text-muted-foreground">
            Genera un PDF de tu progreso o un certificado de finalización del curso.
          </p>

          {/* Stats summary */}
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatBox icon={CheckCircle2} label="Secciones" value={`${sectionsCompleted}/52`} color="text-emerald-600" />
            <StatBox icon={Trophy} label="Exámenes" value={String(totalExams)} color="text-amber-600" />
            <StatBox icon={TrendingUp} label="Score prom." value={`${avgScore}%`} color="text-violet-600" />
            <StatBox icon={Clock} label="Tiempo" value={`${Math.round((Object.values(data?.examAttempts || {}).flat().reduce((a, e) => a + e.timeSpentSec, 0)) / 60)}m`} color="text-sky-600" />
          </div>

          {/* Reports */}
          <div className="mt-6 space-y-3">
            <Card className="border-primary/20 bg-primary/5 p-4">
              <div className="flex items-start gap-3">
                <FileText className="mt-0.5 h-5 w-5 text-primary" />
                <div className="flex-1">
                  <h3 className="font-semibold">Reporte de progreso detallado</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    PDF con todas tus secciones, intentos de examen, scores, tiempo y gaps. Ideal para mostrar a empleadores.
                  </p>
                  <Button
                    onClick={generatePDF}
                    disabled={generating}
                    className="mt-3 gap-2"
                    size="sm"
                  >
                    {generating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                    Descargar reporte PDF
                  </Button>
                </div>
              </div>
            </Card>

            <Card className={canGetCertificate ? 'border-amber-500/30 bg-amber-500/5 p-4' : 'border-border p-4 opacity-60'}>
              <div className="flex items-start gap-3">
                <Award className={canGetCertificate ? 'mt-0.5 h-5 w-5 text-amber-600' : 'mt-0.5 h-5 w-5 text-muted-foreground'} />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">Certificado de finalización</h3>
                    {canGetCertificate && (
                      <Badge className="gap-1 bg-amber-500 text-white">
                        <Sparkles className="h-3 w-3" />
                        Disponible
                      </Badge>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {canGetCertificate
                      ? '¡Felicidades! Has completado suficientes secciones para generar tu certificado.'
                      : `Completa al menos 8 secciones (tienes ${sectionsCompleted}/52) para desbloquear el certificado.`}
                  </p>
                  <Button
                    onClick={generateCertificate}
                    disabled={generating || !canGetCertificate}
                    className="mt-3 gap-2"
                    size="sm"
                    variant={canGetCertificate ? 'default' : 'outline'}
                  >
                    {generating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                    Descargar certificado PDF
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}

function StatBox({ icon: Icon, label, value, color }: { icon: React.ElementType; label: string; value: string; color: string }) {
  return (
    <div className="rounded-lg border border-border/60 bg-card p-3 text-center">
      <Icon className={`mx-auto h-4 w-4 ${color}`} />
      <div className="mt-1 text-lg font-bold">{value}</div>
      <div className="text-[10px] text-muted-foreground">{label}</div>
    </div>
  )
}

// === HTML generators for print-to-PDF ===
function generateReportHTML(params: {
  userName: string
  userEmail: string
  sectionsCompleted: number
  totalSections: number
  totalExams: number
  avgScore: number
  totalTimeSec: number
  progress: Record<string, string[]>
  examAttempts: Record<string, any[]>
  exerciseAttempts: any[]
  completedSubSteps: Record<string, string[]>
}): string {
  const { userName, userEmail, sectionsCompleted, totalSections, totalExams, avgScore, totalTimeSec, progress, examAttempts } = params
  const completionPct = Math.round((sectionsCompleted / totalSections) * 100)
  const totalMinutes = Math.round(totalTimeSec / 60)

  const sectionRows = Object.entries(SECTION_NAMES).map(([id, name]) => {
    const steps = progress[id] || []
    const completed = steps.length >= 5
    const attempts = (examAttempts[id] || []).filter((a) => a.completedAt)
    const bestScore = attempts.length > 0 ? Math.max(...attempts.map((a) => a.score)) : null
    return `
      <tr>
        <td>${name}</td>
        <td style="text-align: center">${steps.length}/5</td>
        <td style="text-align: center">${completed ? '✓' : '—'}</td>
        <td style="text-align: center">${attempts.length}</td>
        <td style="text-align: center">${bestScore !== null ? bestScore + '%' : '—'}</td>
      </tr>
    `
  }).join('')

  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<title>Reporte de Progreso - ${userName}</title>
<style>
  @page { size: A4; margin: 2cm; }
  body { font-family: 'Inter', -apple-system, sans-serif; color: #1a1a2e; max-width: 800px; margin: 0 auto; padding: 20px; }
  .header { text-align: center; border-bottom: 3px solid #6d28d9; padding-bottom: 20px; margin-bottom: 30px; }
  .header h1 { color: #6d28d9; margin: 0; font-size: 28px; }
  .header p { color: #666; margin: 5px 0 0; }
  .stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin: 20px 0; }
  .stat { text-align: center; padding: 15px; border: 1px solid #e5e7eb; border-radius: 8px; }
  .stat .value { font-size: 24px; font-weight: bold; color: #6d28d9; }
  .stat .label { font-size: 11px; color: #666; text-transform: uppercase; }
  table { width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 13px; }
  th { background: #f3f4f6; padding: 10px; text-align: left; border-bottom: 2px solid #6d28d9; }
  td { padding: 8px 10px; border-bottom: 1px solid #e5e7eb; }
  .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; color: #666; font-size: 11px; }
  .badge { display: inline-block; padding: 3px 10px; border-radius: 12px; font-size: 11px; font-weight: bold; }
  .badge-pass { background: #d1fae5; color: #065f46; }
  .badge-fail { background: #fee2e2; color: #991b1b; }
</style>
</head>
<body>
  <div class="header">
    <h1>PyArcana</h1>
    <p>Reporte de Progreso Individual</p>
  </div>

  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
    <div>
      <strong>Estudiante:</strong> ${userName}<br>
      <strong>Email:</strong> ${userEmail}<br>
      <strong>Fecha:</strong> ${new Date().toLocaleDateString('es-PE')}
    </div>
    <div style="text-align: right;">
      <div class="badge ${completionPct >= 70 ? 'badge-pass' : 'badge-fail'}">
        ${completionPct}% completado
      </div>
    </div>
  </div>

  <div class="stats">
    <div class="stat">
      <div class="value">${sectionsCompleted}/${totalSections}</div>
      <div class="label">Secciones</div>
    </div>
    <div class="stat">
      <div class="value">${totalExams}</div>
      <div class="label">Exámenes</div>
    </div>
    <div class="stat">
      <div class="value">${avgScore}%</div>
      <div class="label">Score prom.</div>
    </div>
    <div class="stat">
      <div class="value">${totalMinutes}m</div>
      <div class="label">Tiempo</div>
    </div>
  </div>

  <h2>Detalle por sección</h2>
  <table>
    <thead>
      <tr>
        <th>Sección</th>
        <th style="text-align: center">Sub-steps</th>
        <th style="text-align: center">Completado</th>
        <th style="text-align: center">Intentos</th>
        <th style="text-align: center">Mejor score</th>
      </tr>
    </thead>
    <tbody>
      ${sectionRows}
    </tbody>
  </table>

  <div class="footer">
    Generado por PyArcana · Curso online autónomo de Python para Data Analyst/Scientist<br>
    ${new Date().toISOString()}
  </div>
</body>
</html>`
}

function generateCertificateHTML(params: {
  userName: string
  sectionsCompleted: number
  totalSections: number
  date: string
}): string {
  const { userName, sectionsCompleted, totalSections, date } = params
  const certId = `PYDS-${Date.now().toString(36).toUpperCase()}`

  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<title>Certificado - ${userName}</title>
<style>
  @page { size: A4 landscape; margin: 0; }
  body { font-family: 'Georgia', 'Inter', serif; margin: 0; padding: 0; }
  .cert {
    width: 297mm; height: 210mm;
    background: linear-gradient(135deg, #fef3c7 0%, #ffffff 50%, #ede9fe 100%);
    border: 20px solid #6d28d9;
    "border-radius": 8px;
    padding: 40px 60px;
    "box-sizing": border-box;
    position: relative;
    display: flex;
    "flex-direction": column;
    "align-items": center;
    "justify-content": center;
  }
  .cert::before {
    content: '';
    position: absolute;
    top: 10px; left: 10px; right: 10px; bottom: 10px;
    border: 2px solid #c4b5fd;
    "border-radius": 4px;
  }
  .badge-top {
    width: 80px; height: 80px;
    background: linear-gradient(135deg, #6d28d9, #4c1d95);
    "border-radius": 50%;
    display: flex; align-items: center; justify-content: center;
    color: white; font-size: 36px; font-weight: bold;
    "margin-bottom": 20px;
    "box-shadow": 0 4px 20px rgba(109, 40, 217, 0.3);
  }
  h1 {
    color: #6d28d9;
    "font-size": 42px;
    margin: 0 0 5px;
    "letter-spacing": 2px;
    "text-align": center;
  }
  .subtitle {
    color: #666;
    "font-size": 16px;
    "margin-bottom": 30px;
    "text-transform": uppercase;
    "letter-spacing": 3px;
  }
  .name {
    "font-size": 36px;
    color: #1a1a2e;
    margin: 20px 0;
    "border-bottom": 2px solid #c4b5fd;
    "padding-bottom": 10px;
    "text-align": center;
    "min-width": 400px;
  }
  .body-text {
    "font-size": 16px;
    color: #333;
    "text-align": center;
    "max-width": 600px;
    "line-height": 1.6;
    margin: 15px 0;
  }
  .stats-row {
    display: flex;
    gap: 40px;
    margin: 25px 0;
  }
  .stat-item {
    "text-align": center;
  }
  .stat-value {
    "font-size": 24px;
    "font-weight": bold;
    color: #6d28d9;
  }
  .stat-label {
    "font-size": 11px;
    color: #666;
    "text-transform": uppercase;
    "letter-spacing": 1px;
  }
  .footer-row {
    display: flex;
    "justify-content": space-between;
    width: 80%;
    "margin-top": 30px;
    "border-top": 1px solid #c4b5fd;
    "padding-top": 15px;
  }
  .footer-item {
    "text-align": center;
  }
  .footer-label {
    "font-size": 10px;
    color: #666;
    "text-transform": uppercase;
    "letter-spacing": 1px;
  }
  .footer-value {
    "font-size": 14px;
    color: #1a1a2e;
    "margin-top": 4px;
  }
  .cert-id {
    position: absolute;
    bottom: 20px;
    right: 30px;
    "font-size": 10px;
    color: #999;
    "font-family": monospace;
  }
</style>
</head>
<body>
  <div class="cert">
    <div class="badge-top">Py</div>
    <h1>Certificado de Finalización</h1>
    <div class="subtitle">PyArcana</div>
    <div class="body-text">Se certifica que</div>
    <div class="name">${userName}</div>
    <div class="body-text">
      ha completado satisfactoriamente el curso <strong>PyArcana</strong>,
      demostrando dominio de Python para Data Analysis y Data Science con método
      pedagógico I Do / We Do / You Do.
    </div>

    <div class="stats-row">
      <div class="stat-item">
        <div class="stat-value">${sectionsCompleted}/${totalSections}</div>
        <div class="stat-label">Secciones completadas</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">70h+</div>
        <div class="stat-label">Contenido</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">11</div>
        <div class="stat-label">Proyectos</div>
      </div>
    </div>

    <div class="footer-row">
      <div class="footer-item">
        <div class="footer-label">Fecha</div>
        <div class="footer-value">${date}</div>
      </div>
      <div class="footer-item">
        <div class="footer-label">Firma</div>
        <div class="footer-value">PyArcana</div>
      </div>
    </div>

    <div class="cert-id">ID: ${certId}</div>
  </div>
</body>
</html>`
}
