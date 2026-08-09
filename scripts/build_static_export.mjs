import { cpSync, existsSync, mkdtempSync, rmSync, symlinkSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const scriptDir = dirname(fileURLToPath(import.meta.url))
const projectRoot = join(scriptDir, '..')
const nodeModules = join(projectRoot, 'node_modules')
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '/pyarcana'

if (!existsSync(nodeModules)) {
  throw new Error('node_modules no existe. Ejecuta el gestor de paquetes antes del build estático.')
}

const workspace = mkdtempSync(join(tmpdir(), 'pyarcana-static-'))
const requiredEntries = [
  'src',
  'public',
  'package.json',
  'tsconfig.json',
  'next.config.ts',
  'postcss.config.mjs',
  'components.json',
]

try {
  for (const entry of requiredEntries) {
    const source = join(projectRoot, entry)
    if (existsSync(source)) {
      cpSync(source, join(workspace, entry), { recursive: true })
    }
  }

  // Static hosting cannot execute App Router API handlers. They are removed
  // only from the disposable copy; the working tree is never renamed/mutated.
  rmSync(join(workspace, 'src', 'app', 'api'), { recursive: true, force: true })
  symlinkSync(nodeModules, join(workspace, 'node_modules'), 'dir')

  const nextBinary = join(nodeModules, '.bin', process.platform === 'win32' ? 'next.cmd' : 'next')
  // Turbopack intentionally rejects node_modules symlinks outside its project
  // root. Webpack supports this isolated-copy layout and is a documented Next
  // build mode, so use it explicitly for the static safety build.
  const result = spawnSync(nextBinary, ['build', '--webpack'], {
    cwd: workspace,
    env: {
      ...process.env,
      NODE_ENV: 'production',
      NEXT_OUTPUT: 'export',
      NEXT_PUBLIC_STATIC_SITE: '1',
      NEXT_PUBLIC_BASE_PATH: basePath,
      NEXT_TELEMETRY_DISABLED: '1',
    },
    stdio: 'inherit',
  })

  if (result.error) throw result.error
  if (result.status !== 0) {
    throw new Error(`El build estático terminó con código ${result.status ?? 'desconocido'}`)
  }

  const builtOutput = join(workspace, 'out')
  if (!existsSync(builtOutput)) throw new Error('Next.js no produjo el directorio out/')

  const finalOutput = join(projectRoot, 'out')
  rmSync(finalOutput, { recursive: true, force: true })
  cpSync(builtOutput, finalOutput, { recursive: true })
} finally {
  rmSync(workspace, { recursive: true, force: true })
}
