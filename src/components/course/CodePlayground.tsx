'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Loader2, RotateCcw, Terminal, CheckCircle2, XCircle, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

// Pyodide is loaded from CDN — only once per session
let pyodidePromise: Promise<any> | null = null
const PYODIDE_VERSION = '0.26.2'
const PYODIDE_CDN = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`

function loadPyodide(): Promise<any> {
  if (pyodidePromise) return pyodidePromise

  pyodidePromise = new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      reject(new Error('Window not available'))
      return
    }

    // Load the script
    const existingScript = document.getElementById('pyodide-script')
    if (!existingScript) {
      const script = document.createElement('script')
      script.id = 'pyodide-script'
      script.src = `${PYODIDE_CDN}pyodide.js`
      script.async = true
      script.onload = async () => {
        try {
          // @ts-ignore - loadPyodide is injected by the script
          const pyodide = await window.loadPyodide({
            indexURL: PYODIDE_CDN,
          })
          resolve(pyodide)
        } catch (err) {
          reject(err)
        }
      }
      script.onerror = () => reject(new Error('Failed to load Pyodide script'))
      document.head.appendChild(script)
    } else {
      // Script already loaded, try to get pyodide
      // @ts-ignore
      if (window.pyodide) {
        // @ts-ignore
        resolve(window.pyodide)
      } else {
        // Wait for it
        const interval = setInterval(() => {
          // @ts-ignore
          if (window.pyodide) {
            clearInterval(interval)
            // @ts-ignore
            resolve(window.pyodide)
          }
        }, 200)
        setTimeout(() => {
          clearInterval(interval)
          reject(new Error('Pyodide load timeout'))
        }, 30000)
      }
    }
  })

  return pyodidePromise
}

interface CodePlaygroundProps {
  initialCode?: string
  expectedOutput?: string
  hint?: string
  title?: string
  className?: string
}

interface OutputLine {
  type: 'stdout' | 'stderr' | 'result' | 'system'
  content: string
}

export function CodePlayground({
  initialCode = '',
  expectedOutput,
  hint,
  title = 'Editor interactivo',
  className,
}: CodePlaygroundProps) {
  const [code, setCode] = useState(initialCode)
  const [output, setOutput] = useState<OutputLine[]>([])
  const [loading, setLoading] = useState(false)
  const [pyodideReady, setPyodideReady] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [showHint, setShowHint] = useState(false)
  const [passed, setPassed] = useState<boolean | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const lineNumbersRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    loadPyodide()
      .then(() => setPyodideReady(true))
      .catch((err) => setLoadError(err.message || 'Error cargando Pyodide'))
  }, [])

  const runCode = useCallback(async () => {
    if (!pyodideReady) return
    setLoading(true)
    setOutput([])
    setPassed(null)

    try {
      // @ts-ignore
      const pyodide = window.pyodide

      // Capture stdout/stderr
      const captured: OutputLine[] = []
      pyodide.setStdout({
        batched: (text: string) => {
          captured.push({ type: 'stdout', content: text })
        },
      })
      pyodide.setStderr({
        batched: (text: string) => {
          captured.push({ type: 'stderr', content: text })
        },
      })

      // Run the code
      await pyodide.runPythonAsync(code)

      if (captured.length === 0) {
        captured.push({ type: 'system', content: '✓ Código ejecutado (sin output)' })
      }
      setOutput(captured)

      // Check expected output
      if (expectedOutput) {
        const actualOutput = captured
          .filter((l) => l.type === 'stdout')
          .map((l) => l.content)
          .join('\n')
          .trim()
        const expected = expectedOutput.trim()
        setPassed(actualOutput === expected)
      }
    } catch (err: any) {
      const errorMsg = err.message || String(err)
      // Extract just the Python error (last line usually)
      const lines = errorMsg.split('\n').filter((l: string) => l.trim())
      const pythonError = lines[lines.length - 1] || errorMsg
      setOutput([{ type: 'stderr', content: pythonError }])
      setPassed(false)
    } finally {
      setLoading(false)
    }
  }, [code, pyodideReady, expectedOutput])

  const reset = () => {
    setCode(initialCode)
    setOutput([])
    setPassed(null)
    setShowHint(false)
  }

  // Sync line numbers with scroll
  const handleScroll = () => {
    if (textareaRef.current && lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop
    }
  }

  // Tab key support
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault()
      const start = e.currentTarget.selectionStart
      const end = e.currentTarget.selectionEnd
      const newCode = code.substring(0, start) + '    ' + code.substring(end)
      setCode(newCode)
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 4
        }
      }, 0)
    }
  }

  const lineCount = code.split('\n').length

  return (
    <div className={cn('group relative overflow-hidden rounded-xl border border-border/60 shadow-card', className)}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/60 bg-muted/40 px-4 py-2">
        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
          <Terminal className="h-3.5 w-3.5" />
          <span>{title}</span>
          {pyodideReady && (
            <span className="flex items-center gap-1 rounded-full bg-green-500/10 px-2 py-0.5 text-[10px] text-green-600">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
              Python listo
            </span>
          )}
          {loading && (
            <span className="flex items-center gap-1 text-[10px] text-amber-600">
              <Loader2 className="h-3 w-3 animate-spin" />
              Ejecutando...
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={reset}
            className="h-7 gap-1 px-2 text-xs"
          >
            <RotateCcw className="h-3 w-3" />
            Reset
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={runCode}
            disabled={!pyodideReady || loading}
            className="h-7 gap-1 px-3 text-xs"
          >
            {loading ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <Play className="h-3 w-3" />
            )}
            Run
          </Button>
        </div>
      </div>

      {/* Load error */}
      {loadError && (
        <div className="border-b border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-700 dark:text-amber-300">
          ⚠️ No se pudo cargar el editor Python (Pyodide). Verifica tu conexión. Las imágenes del curso siguen funcionando.
          <details className="mt-1 text-[10px] opacity-70">
            <summary>Detalles técnicos</summary>
            {loadError}
          </details>
        </div>
      )}

      {/* Editor area */}
      <div className="flex bg-[oklch(0.13_0.02_280)]">
        {/* Line numbers */}
        <div
          ref={lineNumbersRef}
          className="code-block select-none overflow-hidden py-4 pl-3 pr-2 text-right text-xs text-muted-foreground/40"
          style={{ minWidth: '3rem' }}
        >
          {Array.from({ length: lineCount }, (_, i) => (
            <div key={i} className="leading-[1.65]">
              {i + 1}
            </div>
          ))}
        </div>
        {/* Code textarea */}
        <textarea
          ref={textareaRef}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onScroll={handleScroll}
          onKeyDown={handleKeyDown}
          spellCheck={false}
          className="code-block flex-1 resize-none bg-transparent py-4 pl-2 pr-4 text-[0.875rem] leading-[1.65] text-foreground/90 outline-none"
          style={{ fontFamily: 'var(--font-geist-mono), monospace', tabSize: 4, minHeight: '120px' }}
        />
      </div>

      {/* Output area */}
      <div className="border-t border-border/60 bg-muted/20">
        <div className="px-4 py-1.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
          Output
        </div>
        <div className="code-block code-block-dark min-h-[60px] overflow-x-auto p-4">
          {output.length === 0 ? (
            <span className="text-muted-foreground/40">
              {pyodideReady ? 'Presiona Run para ejecutar tu código...' : 'Cargando Python...'}
            </span>
          ) : (
            output.map((line, i) => (
              <div
                key={i}
                className={cn(
                  'whitespace-pre-wrap',
                  line.type === 'stderr' && 'text-red-400',
                  line.type === 'stdout' && 'text-foreground/90',
                  line.type === 'system' && 'text-green-400',
                  line.type === 'result' && 'text-blue-400'
                )}
              >
                {line.content}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Result indicator */}
      <AnimatePresence>
        {passed !== null && expectedOutput && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={cn(
              'flex items-center gap-2 px-4 py-2 text-sm font-medium',
              passed ? 'bg-green-500/10 text-green-700 dark:text-green-300' : 'bg-amber-500/10 text-amber-700 dark:text-amber-300'
            )}
          >
            {passed ? (
              <>
                <CheckCircle2 className="h-4 w-4" />
                ¡Correcto! El output coincide con lo esperado.
              </>
            ) : (
              <>
                <XCircle className="h-4 w-4" />
                Output diferente al esperado. Revisa tu código.
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hint */}
      {hint && (
        <div className="border-t border-border/60 bg-violet-500/5 px-4 py-2">
          <button
            onClick={() => setShowHint(!showHint)}
            className="flex items-center gap-1.5 text-xs font-medium text-violet-600 hover:underline"
          >
            <Zap className="h-3 w-3" />
            {showHint ? 'Ocultar pista' : 'Ver pista'}
          </button>
          {showHint && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-1 text-xs text-foreground/70"
            >
              {hint}
            </motion.p>
          )}
        </div>
      )}
    </div>
  )
}
