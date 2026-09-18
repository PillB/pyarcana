#!/usr/bin/env node
/**
 * Apply every section-id rename to the database in DATABASE_URL, whatever set it up.
 *
 * `prisma migrate deploy` runs each rename_section_ids_ migration under prisma/migrations once, from
 * the migration history. But the documented setup (README, DEPLOY.md, .zscripts/build.sh) is
 * `db:push`, which keeps no history and never runs a migration file - so without this, a
 * database built that way kept every row under the old slugs forever. `db:push` calls this
 * after syncing the schema. Each rename file is idempotent and runs as one transaction, so
 * running it again on an already-renamed database changes nothing.
 */
import { execFileSync } from 'node:child_process'
import { readdirSync } from 'node:fs'
import { join } from 'node:path'

const MIGRATIONS = 'prisma/migrations'

export function renameMigrations(dir = MIGRATIONS) {
  return readdirSync(dir, { withFileTypes: true })
    .filter((d) => d.isDirectory() && /_rename_section_ids_/.test(d.name))
    .map((d) => join(dir, d.name, 'migration.sql'))
    .sort()
}

function main() {
  const files = renameMigrations()
  for (const file of files) {
    execFileSync('npx', ['prisma', 'db', 'execute', '--file', file, '--schema', 'prisma/schema.prisma'],
      { stdio: 'inherit' })
    console.log(`section-id rename applied: ${file}`)
  }
  if (files.length === 0) console.log('no section-id rename migrations found')
}

if (import.meta.url === `file://${process.argv[1]}`) main()
