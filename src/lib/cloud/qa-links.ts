/**
 * Two constants the QA harness needs on every route. A leaf module on purpose: the harness is
 * mounted in the root layout, so importing qa-report.ts (which pulls the account client) from it
 * would put the account code into every page's bundle.
 */

/** Where the deployed commit is published (public/deployment.json), under the site base path. */
export function deploymentJsonUrl(basePath: string): string {
  return `${basePath}/deployment.json`
}

/** Window event that asks the QA harness to open (the /qa page's "Abrir el workspace de QA"). */
export const QA_OPEN_EVENT = 'pyarcana:qa-open'
