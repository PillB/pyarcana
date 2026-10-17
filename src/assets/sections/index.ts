// The seven section screenshots the owner approved (decision D23, audit/fixer/decisions.md).
// Imported from src/ so the build emits them under _next/static/media with the /pyarcana base
// path, like src/assets/setup. Each one has a record in shots.json; the section-screenshots test
// fails when a PNG, an import or a record is missing.
import type { StaticImageData } from 'next/image'
import shot_s01_compare_pr_banner from './s01-compare-pr-banner.png'
import shot_s01_new_repository_menu from './s01-new-repository-menu.png'
import shot_s01_pr_files_changed_tab from './s01-pr-files-changed-tab.png'
import shot_s01_ruff_quickfix_f401 from './s01-ruff-quickfix-f401.png'
import shot_s01_vscode_extensions_python from './s01-vscode-extensions-python.png'
import shot_s23_trace_viewer from './s23-trace-viewer.png'
import shot_s44_merge_blocked from './s44-merge-blocked.png'

export const SECTION_SHOT_IMAGES: Record<string, StaticImageData> = {
  's01-compare-pr-banner': shot_s01_compare_pr_banner,
  's01-new-repository-menu': shot_s01_new_repository_menu,
  's01-pr-files-changed-tab': shot_s01_pr_files_changed_tab,
  's01-ruff-quickfix-f401': shot_s01_ruff_quickfix_f401,
  's01-vscode-extensions-python': shot_s01_vscode_extensions_python,
  's23-trace-viewer': shot_s23_trace_viewer,
  's44-merge-blocked': shot_s44_merge_blocked,
}

/**
 * The licence texts that must travel with two of the pictures (decision D23). MIT requires its
 * copyright and permission notice in every copy; Apache-2.0 §4 requires a copy of the licence
 * and the source's NOTICE. A link to the upstream file does not ship them, so verbatim copies
 * are bundled next to the images (taken from each repository's main branch on 2026-10-17) and
 * the credit links these copies.
 */
export const SECTION_SHOT_LICENCE_FILES: Record<string, { licence: string; notice?: string }> = {
  's01-ruff-quickfix-f401': {
    licence: new URL('./licences/ruff-vscode-LICENSE.txt', import.meta.url).href,
  },
  's23-trace-viewer': {
    licence: new URL('./licences/playwright-LICENSE.txt', import.meta.url).href,
    notice: new URL('./licences/playwright-NOTICE.txt', import.meta.url).href,
  },
}
