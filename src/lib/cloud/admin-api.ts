/* stub for RED */
export type Target = { email: string } | { accountId: string }
export type Built = { ok: true; body: Record<string, unknown> } | { ok: false; key: string }
export interface AdminGrant { id: string; accountId: string; email: string | null; kind: string; days: number | null; note: string | null; createdAt: number; issuedBy: string | null; state: string; start: number | null; end: number | null; revokedAt: number | null; revokeReason: string | null }
export interface AdminRole { accountId: string; email: string | null; role: string; createdAt: number; expiresAt: number | null; revokedAt: number | null; note: string | null; grantedBy: string | null; state: string }
export interface ReportRow { id: string; context: { sectionIndex: number | null }; mine: boolean; accountEmail: string | null }
export const parseTarget = (_t: string): Target | null => null
export const grantRequest = (_f: { target: string; daysText: string; indefinite: boolean; kind: 'gift' | 'tester'; note: string }, _r: string): Built => ({ ok: false, key: '' })
export const revokeGrantRequest = (_g: string, _r: string): Built => ({ ok: false, key: '' })
export const roleRequest = (_f: { target: string; daysText: string; indefinite: boolean; note: string }): Built => ({ ok: false, key: '' })
export const roleRevokeRequest = (_a: string, _r: string): Built => ({ ok: false, key: '' })
export const lookupRequest = (_t: string): Built => ({ ok: false, key: '' })
export const accountActionRequest = (_t: string, _r: string): Built => ({ ok: false, key: '' })
export const rectifyRequest = (_a: string, _e: string, _r: string): Built => ({ ok: false, key: '' })
export const encodeQuery = (_p: Record<string, string | number | null | undefined>): string => 'x'
export const grantsPath = (_q: { kind: string; state: string }): string => 'email='
export const rolesPath = (_s: string): string => ''
export const reportsPath = (_s: 'qa' | 'admin', _f: Record<string, string>, _c: string | null): string => ''
export const reportPath = (_id: string): string | null => ''
export const attachmentPath = (_r: string, _a: string): string | null => ''
export const experimentResultsPath = (_k: string): string | null => ''
export const surveysPath = (_k: 'nps'): string | null => ''
export const reportPatch = (_c: { status: string; adminNote: string | null; duplicateOf: string | null }, _n: { status: string; adminNote: string; duplicateOf: string }): Built => ({ ok: false, key: '' })
export const parseGrantList = (_d: unknown): { grants: AdminGrant[]; partial: boolean } => ({ grants: [], partial: false })
export const grantWindow = (_g: AdminGrant): { kind: string; start: number | null; end: number | null } => ({ kind: '', start: null, end: null })
export const parseRoleList = (_d: unknown): AdminRole[] => []
export const parseReportList = (_d: unknown): { reports: ReportRow[]; nextCursor: string | null } => ({ reports: [], nextCursor: 'x' })
