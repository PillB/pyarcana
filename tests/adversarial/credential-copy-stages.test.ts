/**
 * Adversarial guard: the credential copy is true on every build and stage.
 *
 * PyArcana ships in three kinds of build, and a legal page shows the same words in all of them:
 *
 *   - the public static site on GitHub Pages (stage 'off'): no accounts, no server;
 *   - the public static site on pyarcana.dev (stage 'sync'; 'beta' and 'paid' are the later gated
 *     stages): learners sign in with a cloud account and progress also syncs to a server;
 *   - the dynamic LMS: a full server edition, with the section exams.
 *
 * The owner's rule of 4 Oct 2026: copy never says "only this browser" or "no accounts" where
 * accounts run. The draft's badge notice said "no hay inicio de sesión ni servidor" on every build,
 * which is false on the second. A sentence that depends on the build is now picked by the build
 * (ProgressWhere, which reuses the reviewed sentences of the Dashboard notice), and a paragraph that
 * exists in one edition only is rendered by that edition only (ExamGradingNote).
 *
 * One case per stage and edition below; the claims that must hold on all of them are checked on the
 * rendered pages themselves (each edition is rendered in its own process, because IS_STATIC_SITE is
 * read from the environment when the module loads).
 *
 * Run: node --import tsx --test tests/adversarial/credential-copy-stages.test.ts
 */
import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createElement as h } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { ProgressWhereFor } from '../../src/components/account/ProgressWhere.tsx'
import { ExamGradingNote } from '../../src/components/legal/ExamGradingNote.tsx'
import { LAUNCH_STAGES, type LaunchStage } from '../../src/lib/cloud/config.ts'
import { progressWhereKey } from '../../src/lib/cloud/ui-state.ts'
import { LANGUAGES, useI18n, type Language } from '../../src/lib/i18n.ts'

const ROOT = join(fileURLToPath(new URL('.', import.meta.url)), '..', '..')

const ONLY_THIS_BROWSER = /solo en este navegador|only in this browser|no tiene cuentas|has no accounts/i
const ACCOUNT_WORDS = /cuenta|sesión|servidor|account|sign in|server/i

function text(html: string): string {
  return html.replace(/<[^>]*>/g, ' ').replace(/&quot;/g, '"').replace(/\s+/g, ' ').trim()
}

function progressWhere(stage: LaunchStage, isStaticSite: boolean, lang: Language): string {
  useI18n.getState().setLang(lang)
  return text(renderToStaticMarkup(h(ProgressWhereFor, { stage, isStaticSite })))
}

/** Whether learners can sign in on this edition and stage (the dynamic LMS always has accounts). */
function accountsRun(stage: LaunchStage, isStaticSite: boolean): boolean {
  return !isStaticSite || stage !== 'off'
}

describe('where the progress is saved, by build', () => {
  it('the stage is one of the four the config knows, so no stage is skipped below', () => {
    assert.deepEqual([...LAUNCH_STAGES], ['off', 'sync', 'beta', 'paid'])
  })

  it("static build, stage 'off' (GitHub Pages): this browser only, and no account is offered", () => {
    assert.equal(progressWhereKey({ isStaticSite: true, stage: 'off' }), 'storage.where.localOnly')
    for (const { code } of LANGUAGES) {
      const shown = progressWhere('off', true, code)
      assert.match(shown, ONLY_THIS_BROWSER, code)
      assert.doesNotMatch(shown.replace(/¿Dónde se guarda tu progreso\?|Where is your progress saved\?/, ''), ACCOUNT_WORDS, code)
    }
  })

  for (const stage of ['sync', 'beta', 'paid'] as const) {
    it(`static build, stage '${stage}' (pyarcana.dev): this browser and, after signing in, the account; never "only this browser"`, () => {
      assert.equal(progressWhereKey({ isStaticSite: true, stage }), 'storage.where.localAndAccount')
      for (const { code } of LANGUAGES) {
        const shown = progressWhere(stage, true, code)
        assert.doesNotMatch(shown, ONLY_THIS_BROWSER, code)
        assert.match(shown, /cuenta|account/i, code)
      }
    })
  }

  for (const stage of LAUNCH_STAGES) {
    it(`dynamic LMS, stage '${stage}': this browser and the server; never "only this browser"`, () => {
      assert.equal(progressWhereKey({ isStaticSite: false, stage }), 'storage.where.dynamic')
      for (const { code } of LANGUAGES) {
        const shown = progressWhere(stage, false, code)
        assert.doesNotMatch(shown, ONLY_THIS_BROWSER, code)
        assert.match(shown, /servidores|servers/i, code)
      }
    })
  }

  it('on every edition and stage: "only this browser" appears exactly where accounts do not run', () => {
    for (const isStaticSite of [true, false]) {
      for (const stage of LAUNCH_STAGES) {
        for (const { code } of LANGUAGES) {
          const says = ONLY_THIS_BROWSER.test(progressWhere(stage, isStaticSite, code))
          assert.equal(says, !accountsRun(stage, isStaticSite), `${isStaticSite ? 'static' : 'dynamic'} / ${stage} / ${code}`)
        }
      }
    }
  })

  it('the page component takes its stage from the hook the Dashboard notice uses', () => {
    const component = readFileSync(join(ROOT, 'src/components/account/ProgressWhere.tsx'), 'utf8')
    assert.match(component, /const stage = useCloudStage\(\)/)
    assert.match(component, /<ProgressWhereFor stage=\{stage\} isStaticSite=\{IS_STATIC_SITE\} \/>/)
  })
})

describe('the exam paragraph, by edition', () => {
  it('shows nothing in a static build, whatever the stage (no exam exists there)', () => {
    assert.equal(renderToStaticMarkup(h(ExamGradingNote, { isStaticSite: true })), '')
  })

  it('states, in the dynamic LMS, that the server grades each exam', () => {
    const shown = text(renderToStaticMarkup(h(ExamGradingNote, { isStaticSite: false })))
    assert.match(shown, /el servidor califica cada examen de sección/)
    assert.doesNotMatch(shown, /sesión|cuenta|insignia|credencial/, 'it states how a score comes to exist, not what it earns')
  })
})

/** Renders a page in its own process, with the static-site flag the build would set. */
function renderPage(page: string, staticSite: boolean): string {
  const script = [
    "import { createElement as h } from 'react'",
    "import { renderToStaticMarkup } from 'react-dom/server'",
    `const mod = await import('./${page}')`,
    // tsx can hand the default export back one level down when a file is loaded from an inline module.
    'const Page = typeof mod.default === "function" ? mod.default : mod.default.default',
    'process.stdout.write(renderToStaticMarkup(h(Page)))',
  ].join('\n')
  const run = spawnSync(process.execPath, ['--import', 'tsx', '--input-type=module', '-e', script], {
    cwd: ROOT,
    encoding: 'utf8',
    env: { ...process.env, NEXT_PUBLIC_STATIC_SITE: staticSite ? '1' : '' },
  })
  assert.equal(run.status, 0, run.stderr)
  return run.stdout
}

/**
 * The page's text without the two paragraphs that depend on the build: the sentence ProgressWhere
 * picks by stage, and the exam paragraph that exists in the dynamic LMS only. Each has its own cases above.
 */
function withoutBuildSentences(html: string): string {
  return text(html.replace(/<p data-testid="(?:progress-where|exam-grading-note)"[^>]*>[\s\S]*?<\/p>/g, ''))
}

describe('the rendered pages, in each edition', () => {
  for (const staticSite of [true, false]) {
    const edition = staticSite ? 'static build' : 'dynamic LMS'

    it(`badge notice (${edition}): the exam paragraph is there only in the dynamic LMS, the storage sentence in both`, () => {
      const html = renderPage('src/app/badge-notice/page.tsx', staticSite)
      assert.match(html, /data-testid="progress-where"/)
      assert.equal(html.includes('data-testid="exam-grading-note"'), !staticSite)
    })

    it(`badge notice (${edition}): says nothing about sign-in or storage outside the build-picked sentences`, () => {
      const shown = withoutBuildSentences(renderPage('src/app/badge-notice/page.tsx', staticSite))
      assert.ok(shown.includes('Marcador de finalización'), 'the page did not render, so this proves nothing')
      assert.doesNotMatch(shown, /navegador|inicio de sesión|inicias sesión|servidor|edición con cuenta/i)
    })

    it(`credential policy (${edition}): names no edition by its accounts and says no build lacks a sign-in`, () => {
      const shown = text(renderPage('src/app/credential-policy/page.tsx', staticSite))
      assert.doesNotMatch(shown, /edición con cuenta|inicio de sesión|ni servidor|solo en este navegador/i)
      assert.match(shown, /LMS dinámico/)
    })
  }
})
