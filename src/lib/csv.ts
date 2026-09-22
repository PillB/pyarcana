/**
 * CSV fields that a spreadsheet opens as data, never as a program.
 *
 * The admin exports were built by string concatenation: `"${r.name}"`. Two defects followed.
 *
 * A learner controls their own `name`, and the local part of an address may legally begin with
 * `=`, `+`, `-` or `@`. Excel, LibreOffice Calc and Google Sheets read a cell starting with one
 * of those as a formula, so `=HYPERLINK("http://evil","click")` in a name became a live link in
 * the admin's spreadsheet — OWASP calls this CSV injection, and the export, not the spreadsheet,
 * is where it is fixed. A leading tab or carriage return triggers the same parse after the
 * spreadsheet trims it.
 *
 * And a `"` inside a value closed the quoted field early, so every later column on that row
 * shifted left; a comma or a newline in a value did the same. RFC 4180 answers both: quote the
 * field, double any `"` inside it.
 *
 * The fix is per cell, not per row, so a caller cannot add a column and forget it.
 */

/** Leading characters a spreadsheet reads as the start of a formula. */
const FORMULA_TRIGGERS = new Set(['=', '+', '-', '@', '\t', '\r'])

/**
 * One RFC 4180 field: always quoted, embedded `"` doubled, and a leading formula trigger
 * disarmed with a `'` prefix — the prefix a spreadsheet consumes to mean "this is text".
 *
 * Applied to every cell including numeric-looking ones. Quoting a number changes nothing for a
 * reader, and the alternative — deciding per cell whether a value is safe — is the judgement
 * that produced this bug.
 */
export function csvCell(value: string | number | null | undefined): string {
  const text = value == null ? '' : String(value)
  const disarmed = FORMULA_TRIGGERS.has(text[0] ?? '') ? `'${text}` : text
  return `"${disarmed.replace(/"/g, '""')}"`
}
