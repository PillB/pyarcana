"use client";

import * as React from "react";
import {
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Globe, Flag, Crown, Bot, Boxes, Server, ShieldCheck, Network, Combine,
  Workflow, FileText, BarChart3, LayoutDashboard, GitBranch, Terminal,
  Lock, AlertTriangle, CheckCircle2, XCircle, Play, RotateCcw, FileCheck,
  ListChecks, BookOpen, GraduationCap, ArrowRight, Info, Scale,
} from "lucide-react";
import { CAPSTONES, getCapstone, FINAL_INTERFACES } from "@/data/capstones";
import { LEVELS, CARDINALITY } from "@/data/levels";
import { SECTIONS } from "@/data/sections";
import { BADGES } from "@/data/badges";
import { RUBRICS } from "@/data/rubrics";
import { STRINGS, type Lang, type StringKey } from "@/data/i18n";
import { runCopilotHarness, type CopilotRunResult } from "@/lib/copilot-harness";

// ─────────────────────────────── helpers ───────────────────────────────

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Terminal, GitBranch, LayoutDashboard, BarChart3, FileText, Workflow, Combine,
  Network, ShieldCheck, Server, Boxes, Bot, Crown,
};

function useLang(): [Lang, () => void] {
  const [lang, setLang] = React.useState<Lang>("en");
  const toggle = React.useCallback(() => setLang((l) => (l === "en" ? "es" : "en")), []);
  return [lang, toggle];
}

function t(lang: Lang, key: StringKey): string {
  return STRINGS[lang][key];
}

// Learner progress is stored locally per capstone. Never used to forge a
// verified award — a localStorage flag cannot pass an authenticated assessment.
interface LearnerProgress {
  [capstoneId: string]: {
    evidenceCompleted: string[];
    evidenceMissing: string[];
    blockers: string[];
  };
}

const DEFAULT_PROGRESS: LearnerProgress = (() => {
  // Seed a realistic "in-progress" state so the learner sees what evidence
  // completed vs missing looks like. This is local-only; it is NOT a verified
  // award. Authenticated assessment happens server-side.
  const out: LearnerProgress = {};
  for (const c of CAPSTONES) {
    const completed = c.requiredArtifacts.slice(0, Math.floor(c.requiredArtifacts.length * 0.6));
    const missing = c.requiredArtifacts.slice(Math.floor(c.requiredArtifacts.length * 0.6));
    const blockers = c.criticalCriteria.filter((_, i) => i < 1).map(() => "missing-rollback");
    out[c.capstoneId] = { evidenceCompleted: completed, evidenceMissing: missing, blockers };
  }
  return out;
})();

function blockerToLearner(lang: Lang, blocker: string): string {
  const map: Record<string, StringKey> = {
    "missing-rollback": "missingRollback",
    "missing-citations": "missingCitations",
    "missing-approval": "missingApproval",
    "missing-tests": "missingTests",
    "missing-reproducibility": "missingReproducibility",
  };
  return t(lang, map[blocker] ?? "missingTests");
}

function statusColor(status: string): string {
  switch (status) {
    case "deployed": return "bg-emerald-100 text-emerald-800 border-emerald-300";
    case "verified": return "bg-emerald-100 text-emerald-800 border-emerald-300";
    case "implemented": return "bg-amber-100 text-amber-800 border-amber-300";
    case "partial": return "bg-orange-100 text-orange-800 border-orange-300";
    default: return "bg-red-100 text-red-800 border-red-300";
  }
}

// ─────────────────────────────── small components ───────────────────────────────

function Pill({ children, variant = "default" }: { children: React.ReactNode; variant?: "default" | "critical" | "ok" | "warn" }) {
  const cls = variant === "critical" ? "border-red-300 bg-red-50 text-red-800"
    : variant === "ok" ? "border-emerald-300 bg-emerald-50 text-emerald-800"
    : variant === "warn" ? "border-amber-300 bg-amber-50 text-amber-800"
    : "border-slate-300 bg-slate-50 text-slate-800";
  return <span className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-medium ${cls}`}>{children}</span>;
}

function BulletList({ items, icon: Icon }: { items: string[]; icon?: React.ComponentType<{ className?: string }> }) {
  return (
    <ul className="space-y-1.5 text-sm leading-relaxed">
      {items.map((it, i) => (
        <li key={i} className="flex gap-2">
          {Icon ? <Icon className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" /> : <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-slate-400" />}
          <span>{it}</span>
        </li>
      ))}
    </ul>
  );
}

// ─────────────────────────────── capstone card ───────────────────────────────

function CapstoneCard({ capstoneId, lang, onOpen }: { capstoneId: string; lang: Lang; onOpen: (id: string) => void }) {
  const c = getCapstone(capstoneId);
  const Icon = ICONS[c.badgeDependencies.length === 0 ? "Terminal" : ""] ?? GraduationCap;
  const badge = BADGES.find((b) => b.capstoneId === capstoneId);
  const IconBadge = badge ? (ICONS[badge.icon] ?? GraduationCap) : GraduationCap;
  const progress = DEFAULT_PROGRESS[capstoneId];
  const total = c.requiredArtifacts.length;
  const done = progress.evidenceCompleted.length;
  const pct = Math.round((done / total) * 100);
  const isFinal = capstoneId === "CP-FINAL";

  return (
    <Card className={`flex h-full flex-col ${isFinal ? "border-violet-300 bg-violet-50/40" : ""}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${isFinal ? "bg-violet-100 text-violet-700" : "bg-slate-100 text-slate-700"}`}>
              <IconBadge className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-semibold text-slate-500">{c.capstoneId}</span>
                <Pill variant={c.status === "implemented" ? "warn" : "ok"}>{c.status}</Pill>
              </div>
              <CardTitle className="text-base leading-tight">{lang === "es" ? c.titleEs : c.title}</CardTitle>
            </div>
          </div>
        </div>
        <CardDescription className="mt-1 line-clamp-3 text-xs">{lang === "es" ? c.problemStatementEs : c.problemStatement}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 space-y-3 text-sm">
        <div className="flex flex-wrap items-center gap-2">
          <Pill><Flag className="h-3 w-3" />{t(lang, "gateLabel")}: {c.gateSection}</Pill>
          <Pill variant="default">v{c.version}</Pill>
          {c.subGates.length > 0 && <Pill variant="warn">{c.subGates.length} {t(lang, "subGateLabel")}</Pill>}
        </div>
        <div>
          <div className="mb-1 flex items-center justify-between text-xs text-slate-500">
            <span>{t(lang, "progress")}</span>
            <span>{done}/{total}</span>
          </div>
          <Progress value={pct} className="h-1.5" />
        </div>
        {progress.blockers.length > 0 && (
          <div className="rounded-md border border-amber-200 bg-amber-50 p-2">
            <div className="mb-1 flex items-center gap-1 text-xs font-medium text-amber-800">
              <AlertTriangle className="h-3 w-3" />{t(lang, "criticalBlockers")}
            </div>
            <ul className="space-y-0.5 text-xs text-amber-800">
              {progress.blockers.map((b, i) => <li key={i}>• {blockerToLearner(lang, b)}</li>)}
            </ul>
          </div>
        )}
      </CardContent>
      <CardFooter className="gap-2 pt-0">
        <Button size="sm" variant="default" className="flex-1" onClick={() => onOpen(capstoneId)}>
          <BookOpen className="mr-1 h-3.5 w-3.5" />{t(lang, "viewBrief")}
        </Button>
        {(capstoneId === "CP-N4-C" || isFinal) && (
          <Button size="sm" variant="outline" onClick={() => onOpen(capstoneId)}>
            <Play className="mr-1 h-3.5 w-3.5" />{isFinal ? t(lang, "runFinal") : t(lang, "runCopilot")}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

// ─────────────────────────────── capstone detail dialog ───────────────────────────────

function CapstoneDialog({ capstoneId, lang, onClose, onRunCopilot, onRunFinal }: {
  capstoneId: string | null; lang: Lang; onClose: () => void;
  onRunCopilot: (id: string) => void; onRunFinal: (id: string) => void;
}) {
  const c = capstoneId ? getCapstone(capstoneId) : null;
  if (!c) return null;
  const sections = SECTIONS.filter((s) => s.capstoneId === c.capstoneId);
  const badge = BADGES.find((b) => b.capstoneId === c.capstoneId);
  const rubric = RUBRICS[c.capstoneId];
  const progress = DEFAULT_PROGRESS[c.capstoneId];
  const isFinal = c.capstoneId === "CP-FINAL";

  return (
    <Dialog open={!!capstoneId} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-hidden p-0">
        <DialogHeader className="border-b p-4">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-semibold text-slate-500">{c.capstoneId}</span>
            <Pill variant="default">v{c.version}</Pill>
            <Pill>{t(lang, "levelLabel")} {c.level}</Pill>
            <Pill><Flag className="h-3 w-3" />{t(lang, "gateLabel")}: {c.gateSection}</Pill>
            {c.subGates.map((sg) => (
              <Pill key={sg.id} variant="warn">{sg.id} · {sg.sectionId}</Pill>
            ))}
          </div>
          <DialogTitle className="text-xl">{lang === "es" ? c.titleEs : c.title}</DialogTitle>
          <DialogDescription className="text-xs">{isFinal ? t(lang, "finalCapstone") : t(lang, "principalCapstone")}</DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[calc(90vh-9rem)]">
          <div className="space-y-4 p-4">
            {/* Brief — Stephen Fry register */}
            <section>
              <h3 className="mb-1.5 text-sm font-semibold uppercase tracking-wide text-slate-500">{t(lang, "viewBrief")}</h3>
              <p className="text-sm leading-relaxed text-slate-700">{lang === "es" ? c.problemStatementEs : c.problemStatement}</p>
            </section>

            <div className="grid gap-4 md:grid-cols-2">
              <section>
                <h4 className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">{t(lang, "intendedUsers")}</h4>
                <BulletList items={c.intendedUsers} icon={GraduationCap} />
              </section>
              <section>
                <h4 className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">{t(lang, "jobsToBeDone")}</h4>
                <BulletList items={c.jobsToBeDone} icon={ListChecks} />
              </section>
              <section>
                <h4 className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">{t(lang, "prerequisites")}</h4>
                <BulletList items={c.prerequisites} icon={BookOpen} />
              </section>
              <section>
                <h4 className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">{t(lang, "learningOutcomes")}</h4>
                <BulletList items={c.learningOutcomes} icon={GraduationCap} />
              </section>
            </div>

            {/* Section contributions */}
            <section>
              <h3 className="mb-1.5 text-sm font-semibold uppercase tracking-wide text-slate-500">{t(lang, "sectionContributions")}</h3>
              <Accordion type="single" collapsible>
                {sections.map((s) => (
                  <AccordionItem key={s.sectionId} value={s.sectionId}>
                    <AccordionTrigger className="text-sm">
                      <span className="font-mono text-xs text-slate-500">{s.sectionId}</span> · {lang === "es" ? s.spanishTitle : s.title}
                    </AccordionTrigger>
                    <AccordionContent className="grid gap-2 text-xs md:grid-cols-2">
                      <div><strong className="text-slate-500">{t(lang, "requiredArtifacts")}:</strong> {s.artifactAdded}</div>
                      <div><strong className="text-slate-500">{t(lang, "viewSections")}:</strong> {s.theory}</div>
                      <div><strong className="text-slate-500">I Do:</strong> {s.iDo}</div>
                      <div><strong className="text-slate-500">We Do:</strong> {s.weDo}</div>
                      <div><strong className="text-slate-500">You Do:</strong> {s.youDo}</div>
                      <div><strong className="text-slate-500">{t(lang, "rubric")}:</strong> {s.assessment}</div>
                      <div className="md:col-span-2"><strong className="text-slate-500">{t(lang, "finalDependency")}:</strong> {s.finalInterfaceReuse}</div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>

            <div className="grid gap-4 md:grid-cols-2">
              <section>
                <h4 className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">{t(lang, "requiredArtifacts")}</h4>
                <BulletList items={c.requiredArtifacts} icon={FileCheck} />
              </section>
              <section>
                <h4 className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">{t(lang, "requiredEvidence")}</h4>
                <BulletList items={c.requiredEvidence} icon={CheckCircle2} />
              </section>
            </div>

            {/* Synthetic data */}
            <section className="rounded-md border border-slate-200 bg-slate-50 p-3">
              <h4 className="mb-1.5 flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
                <Lock className="h-3 w-3" />{t(lang, "syntheticData")}
              </h4>
              <div className="grid gap-1 text-xs md:grid-cols-2">
                <div><strong className="text-slate-500">Generator:</strong> {c.syntheticDataContract.generator}</div>
                <div><strong className="text-slate-500">Size:</strong> {c.syntheticDataContract.size}</div>
                <div><strong className="text-slate-500">License:</strong> {c.syntheticDataContract.license}</div>
                <div className="md:col-span-2"><strong className="text-slate-500">PII risk:</strong> {c.syntheticDataContract.piiRisk}</div>
                <div className="md:col-span-2"><strong className="text-slate-500">Schema:</strong> <code className="text-[11px]">{c.syntheticDataContract.schema}</code></div>
              </div>
            </section>

            {/* Acceptance + critical */}
            <div className="grid gap-4 md:grid-cols-2">
              <section>
                <h4 className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">{t(lang, "acceptanceCriteria")}</h4>
                <BulletList items={c.acceptanceCriteria} icon={CheckCircle2} />
              </section>
              <section className="rounded-md border border-red-200 bg-red-50/50 p-3">
                <h4 className="mb-1.5 flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-red-700">
                  <AlertTriangle className="h-3 w-3" />{t(lang, "criticalCriteria")}
                </h4>
                <BulletList items={c.criticalCriteria} icon={XCircle} />
              </section>
            </div>

            {/* Security / privacy / accessibility / responsible use */}
            <div className="grid gap-3 md:grid-cols-2">
              <section className="rounded-md border p-3">
                <h4 className="mb-1.5 flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-slate-500"><Lock className="h-3 w-3" />{t(lang, "securityRequirements")}</h4>
                <BulletList items={c.securityRequirements} />
              </section>
              <section className="rounded-md border p-3">
                <h4 className="mb-1.5 flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-slate-500"><ShieldCheck className="h-3 w-3" />{t(lang, "privacyRequirements")}</h4>
                <BulletList items={c.privacyRequirements} />
              </section>
              <section className="rounded-md border p-3">
                <h4 className="mb-1.5 flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-slate-500"><Scale className="h-3 w-3" />{t(lang, "accessibilityRequirements")}</h4>
                <BulletList items={c.accessibilityRequirements} />
              </section>
              <section className="rounded-md border p-3">
                <h4 className="mb-1.5 flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-slate-500"><Info className="h-3 w-3" />{t(lang, "responsibleUseRequirements")}</h4>
                <BulletList items={c.responsibleUseRequirements} />
              </section>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <section>
                <h4 className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">{t(lang, "testRequirements")}</h4>
                <BulletList items={c.testRequirements} icon={ListChecks} />
              </section>
              <section>
                <h4 className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">{t(lang, "demoRequirements")}</h4>
                <BulletList items={c.demoRequirements} icon={Play} />
              </section>
            </div>

            {/* Rubric */}
            <section className="rounded-md border p-3">
              <div className="mb-2 flex items-center justify-between">
                <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500">{t(lang, "rubric")} v{rubric.version}</h4>
                <Pill variant="warn">{t(lang, "passThreshold")}: {rubric.passThreshold}%</Pill>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b text-left text-slate-500">
                      <th className="py-1.5 pr-2 font-medium">Criterion</th>
                      <th className="py-1.5 pr-2 font-medium">Weight</th>
                      <th className="py-1.5 font-medium">Critical</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rubric.criteria.map((cr) => (
                      <tr key={cr.id} className="border-b last:border-0">
                        <td className="py-1.5 pr-2">{cr.name}</td>
                        <td className="py-1.5 pr-2 font-mono">{Math.round(cr.weight * 100)}%</td>
                        <td className="py-1.5">{cr.critical ? <XCircle className="h-3.5 w-3.5 text-red-600" /> : <span className="text-slate-300">—</span>}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-2">
                <div className="mb-1 text-xs font-semibold text-red-700">{t(lang, "criticalCriteria")} (auto-fail)</div>
                <BulletList items={rubric.criticalFailures} icon={XCircle} />
              </div>
            </section>

            {/* Remediation */}
            <section>
              <h4 className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">{t(lang, "remediationPaths")}</h4>
              <BulletList items={c.remediationPaths} icon={RotateCcw} />
            </section>

            {/* Badge + final integration */}
            <div className="grid gap-3 md:grid-cols-2">
              {badge && (
                <section className="rounded-md border border-violet-200 bg-violet-50/40 p-3">
                  <h4 className="mb-1.5 flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-violet-700"><Crown className="h-3 w-3" />{t(lang, "badgeRelationship")}</h4>
                  <div className="text-sm font-medium">{lang === "es" ? badge.spanishName : badge.name}</div>
                  <div className="text-xs text-slate-600">{badge.description}</div>
                  <div className="mt-1.5 text-xs font-semibold text-slate-500">{t(lang, "eligibility")}</div>
                  <BulletList items={badge.eligibility} />
                </section>
              )}
              <section className="rounded-md border p-3">
                <h4 className="mb-1.5 flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-slate-500"><ArrowRight className="h-3 w-3" />{t(lang, "finalIntegrationInterfaces")}</h4>
                <BulletList items={c.finalIntegrationInterfaces} />
              </section>
            </div>

            {/* Progress (learner-facing, not internal audit terms) */}
            <section className="rounded-md border border-slate-200 p-3">
              <div className="mb-2 flex items-center justify-between">
                <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500">{t(lang, "progress")}</h4>
                <span className="text-xs text-slate-500">{progress.evidenceCompleted.length}/{c.requiredArtifacts.length}</span>
              </div>
              <div className="grid gap-2 md:grid-cols-2">
                <div>
                  <div className="mb-1 flex items-center gap-1 text-xs font-medium text-emerald-700"><CheckCircle2 className="h-3 w-3" />{t(lang, "evidenceCompleted")}</div>
                  <BulletList items={progress.evidenceCompleted} />
                </div>
                <div>
                  <div className="mb-1 flex items-center gap-1 text-xs font-medium text-amber-700"><AlertTriangle className="h-3 w-3" />{t(lang, "evidenceMissing")}</div>
                  <BulletList items={progress.evidenceMissing} />
                </div>
              </div>
              {progress.blockers.length > 0 && (
                <div className="mt-2 rounded-md border border-amber-200 bg-amber-50 p-2">
                  <div className="mb-1 flex items-center gap-1 text-xs font-medium text-amber-800"><AlertTriangle className="h-3 w-3" />{t(lang, "criticalBlockers")}</div>
                  <ul className="space-y-0.5 text-xs text-amber-800">
                    {progress.blockers.map((b, i) => <li key={i}>• {blockerToLearner(lang, b)}</li>)}
                  </ul>
                </div>
              )}
            </section>
          </div>
        </ScrollArea>
        <DialogFooter className="border-t p-3">
          {c.capstoneId === "CP-N4-C" && (
            <Button onClick={() => onRunCopilot(c.capstoneId)} variant="default">
              <Play className="mr-1 h-3.5 w-3.5" />{t(lang, "runCopilot")}
            </Button>
          )}
          {isFinal && (
            <Button onClick={() => onRunFinal(c.capstoneId)} variant="default">
              <Play className="mr-1 h-3.5 w-3.5" />{t(lang, "runFinal")}
            </Button>
          )}
          <Button variant="outline" onClick={onClose}>{t(lang, "closeDialog")}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─────────────────────────────── N4-C interactive harness ───────────────────────────────

type ProviderMode = "no-key" | "local" | "commercial-test" | "commercial-approved";

function CopilotHarness({ lang, open, onClose }: { lang: Lang; open: boolean; onClose: () => void }) {
  const [mode, setMode] = React.useState<ProviderMode>("no-key");
  const [task, setTask] = React.useState("Summarise the synthetic compliance memo for client ACME-001 and propose a draft email to the allowlisted reviewer.");
  const [result, setResult] = React.useState<CopilotRunResult | null>(null);
  const [running, setRunning] = React.useState(false);
  const [approved, setApproved] = React.useState<null | boolean>(null);
  const [step, setStep] = React.useState<"" | "retrieve" | "tool" | "approve" | "verify" | "trace" | "budget" | "cited">("");

  const run = React.useCallback(async () => {
    setRunning(true); setApproved(null); setResult(null); setStep("retrieve");
    await new Promise((r) => setTimeout(r, 250));
    setStep("tool"); await new Promise((r) => setTimeout(r, 200));
    setStep("approve"); await new Promise((r) => setTimeout(r, 150));
    const res = runCopilotHarness({ task, providerMode: mode });
    setResult(res);
    setRunning(false);
  }, [task, mode]);

  const approve = React.useCallback((ok: boolean) => {
    setApproved(ok);
    if (ok && result) {
      setStep("verify"); setTimeout(() => setStep("trace"), 200);
      setTimeout(() => setStep("budget"), 350);
      setTimeout(() => setStep("cited"), 500);
    }
  }, [result]);

  const reset = React.useCallback(() => {
    setResult(null); setApproved(null); setStep(""); setRunning(false);
  }, []);

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-hidden p-0">
        <DialogHeader className="border-b p-4">
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-violet-600" />
            <DialogTitle className="text-lg">{t(lang, "runCopilot")} — CP-N4-C</DialogTitle>
            <Pill variant="warn">v2.0.0</Pill>
          </div>
          <DialogDescription className="text-xs">
            {t(lang, "selectModelMode")} → {t(lang, "executeBoundedTask")} → {t(lang, "inspectRetrieval")} → {t(lang, "inspectProposedTool")} → {t(lang, "approveOrReject")} → {t(lang, "inspectVerifier")} → {t(lang, "inspectTrace")} → {t(lang, "inspectBudget")} → {t(lang, "inspectCitedResult")}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[calc(90vh-8rem)]">
          <div className="space-y-4 p-4">
            {/* Provider mode */}
            <section>
              <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">{t(lang, "providerMode")}</h4>
              <div className="flex flex-wrap gap-2">
                {([
                  ["no-key", t(lang, "noKey")],
                  ["local", t(lang, "localModel")],
                  ["commercial-test", t(lang, "commercialTest")],
                  ["commercial-approved", t(lang, "commercialApproved")],
                ] as [ProviderMode, string][]).map(([m, label]) => (
                  <Button key={m} size="sm" variant={mode === m ? "default" : "outline"} onClick={() => setMode(m)} disabled={m === "commercial-approved"}>
                    {label}
                  </Button>
                ))}
              </div>
              <p className="mt-1.5 text-xs text-slate-500">
                {mode === "no-key" && "Deterministic test double. No paid key required for the basic validation suite."}
                {mode === "local" && "Local-model adapter (e.g. a small local server). Provider-neutral contract."}
                {mode === "commercial-test" && "Commercial-model adapter in test mode. Sandbox credentials, never live."}
                {mode === "commercial-approved" && "Commercial approved mode requires explicit operator sign-off (disabled in this demo)."}
              </p>
            </section>

            {/* Task */}
            <section>
              <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">{t(lang, "executeBoundedTask")}</h4>
              <textarea
                className="w-full rounded-md border p-2 text-sm"
                rows={2}
                value={task}
                onChange={(e) => setTask(e.target.value)}
                aria-label="task"
              />
              <div className="mt-2 flex gap-2">
                <Button size="sm" onClick={run} disabled={running}>
                  <Play className="mr-1 h-3.5 w-3.5" />{running ? "Running…" : t(lang, "executeBoundedTask")}
                </Button>
                <Button size="sm" variant="outline" onClick={reset}><RotateCcw className="mr-1 h-3.5 w-3.5" />Reset</Button>
              </div>
            </section>

            {/* Stepper */}
            {result && (
              <>
                <section className="rounded-md border border-slate-200 p-3">
                  <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">{t(lang, "inspectRetrieval")}</h4>
                  <div className="space-y-1 text-xs">
                    {result.retrieval.map((r, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <FileText className="mt-0.5 h-3 w-3 text-slate-400" />
                        <span><strong>{r.doc}</strong> <span className="text-slate-500">(scope: {r.scope}, score: {r.score})</span> — {r.snippet}</span>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="rounded-md border border-slate-200 p-3">
                  <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">{t(lang, "inspectProposedTool")}</h4>
                  <div className="font-mono text-xs">
                    <div><strong>tool:</strong> {result.proposedTool.name}</div>
                    <div><strong>args:</strong> {JSON.stringify(result.proposedTool.args)}</div>
                    <div><strong>idempotent:</strong> {result.proposedTool.idempotent ? "yes" : "no"}</div>
                    <div><strong>sandboxed:</strong> {result.proposedTool.sandboxed ? "yes" : "no"}</div>
                    <div><strong>side_effect:</strong> {result.proposedTool.sideEffect}</div>
                  </div>
                </section>

                <section className="rounded-md border border-amber-200 bg-amber-50 p-3">
                  <h4 className="mb-2 flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-amber-800">
                    <AlertTriangle className="h-3 w-3" />{t(lang, "approveOrReject")}
                  </h4>
                  {approved === null ? (
                    <div className="flex gap-2">
                      <Button size="sm" variant="default" onClick={() => approve(true)}><CheckCircle2 className="mr-1 h-3.5 w-3.5" />{t(lang, "approved")}</Button>
                      <Button size="sm" variant="outline" onClick={() => approve(false)}><XCircle className="mr-1 h-3.5 w-3.5" />{t(lang, "rejected")}</Button>
                    </div>
                  ) : (
                    <div className="text-xs">
                      {approved ? <Pill variant="ok">{t(lang, "approved")}</Pill> : <Pill variant="critical">{t(lang, "rejected")} — run stops safely, no side effect.</Pill>}
                    </div>
                  )}
                </section>

                {approved && (
                  <>
                    <section className="rounded-md border border-slate-200 p-3">
                      <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">{t(lang, "inspectVerifier")}</h4>
                      <div className="text-xs">
                        <Pill variant={result.verifier.passed ? "ok" : "critical"}>{result.verifier.passed ? "passed" : "rejected"}</Pill>
                        <p className="mt-1.5 text-slate-600">{result.verifier.reason}</p>
                        <p className="mt-1 text-slate-500">Faithfulness: {result.verifier.faithfulness} · Context precision: {result.verifier.contextPrecision}</p>
                      </div>
                    </section>

                    <section className="rounded-md border border-slate-200 p-3">
                      <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">{t(lang, "inspectTrace")} ({t(lang, "redacted")})</h4>
                      <pre className="overflow-x-auto rounded bg-slate-900 p-2 font-mono text-[11px] text-slate-100">{result.trace}</pre>
                    </section>

                    <section className="rounded-md border border-slate-200 p-3">
                      <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">{t(lang, "inspectBudget")}</h4>
                      <div className="grid grid-cols-2 gap-2 text-xs md:grid-cols-4">
                        <div><strong>{t(lang, "steps")}:</strong> {result.budget.steps}</div>
                        <div><strong>{t(lang, "toolCalls")}:</strong> {result.budget.toolCalls}</div>
                        <div><strong>{t(lang, "costUsd")}:</strong> ${result.budget.costUsd.toFixed(4)}</div>
                        <div><strong>{t(lang, "elapsed")}:</strong> {result.budget.elapsedMs}ms</div>
                      </div>
                      <div className="mt-2 text-xs">
                        {result.budget.withinBudget ? <Pill variant="ok">within budget</Pill> : <Pill variant="critical">budget exceeded — run stopped safely</Pill>}
                      </div>
                    </section>

                    <section className="rounded-md border border-emerald-200 bg-emerald-50/40 p-3">
                      <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-emerald-700">{t(lang, "inspectCitedResult")}</h4>
                      <p className="text-sm">{result.citedOutput.text}</p>
                      <div className="mt-2 space-y-1 text-xs">
                        <div className="font-semibold text-slate-500">{t(lang, "citations")}:</div>
                        {result.citedOutput.citations.map((cit, i) => (
                          <div key={i} className="flex items-start gap-1">
                            <span className="font-mono">[{i + 1}]</span>
                            <span>{cit.doc} — {cit.snippet}</span>
                          </div>
                        ))}
                      </div>
                    </section>
                  </>
                )}
              </>
            )}
          </div>
        </ScrollArea>
        <DialogFooter className="border-t p-3">
          <Button variant="outline" onClick={onClose}>{t(lang, "closeDialog")}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─────────────────────────────── CP-FINAL integration ───────────────────────────────

function FinalIntegration({ lang, open, onClose }: { lang: Lang; open: boolean; onClose: () => void }) {
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-hidden p-0">
        <DialogHeader className="border-b p-4">
          <div className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-violet-600" />
            <DialogTitle className="text-lg">{t(lang, "runFinal")} — CP-FINAL</DialogTitle>
            <Pill variant="warn">v1.1.0</Pill>
          </div>
          <DialogDescription className="text-xs">
            {t(lang, "verifyTwelveDeps")} → {t(lang, "launchDemo")} → {t(lang, "inspectArchitecture")} → {t(lang, "runTests")} → {t(lang, "inspectSecurity")} → {t(lang, "inspectRollback")} → {t(lang, "inspectContribution")}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[calc(90vh-8rem)]">
          <div className="space-y-4 p-4">
            <section>
              <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">{t(lang, "verifyTwelveDeps")}</h4>
              <div className="grid gap-2 md:grid-cols-2">
                {FINAL_INTERFACES.map((f) => (
                  <div key={f.capstoneId} className="rounded-md border p-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-semibold text-slate-500">{f.capstoneId}</span>
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                    </div>
                    <div className="font-mono text-xs">{f.interfaceName}</div>
                    <div className="text-[11px] text-slate-600">{f.contract}</div>
                  </div>
                ))}
              </div>
            </section>
            <section className="rounded-md border border-emerald-200 bg-emerald-50/40 p-3">
              <h4 className="mb-1 flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-emerald-700"><CheckCircle2 className="h-3 w-3" />Contract tests</h4>
              <p className="text-xs text-slate-600">All twelve upstream interfaces are exercised by a contract test. The end-to-end synthetic scenario (intake → ETL → ER → relationship → analytics → automation → triage → service → ML → RAG → copilot → governance) passes.</p>
            </section>
            <section className="rounded-md border border-slate-200 p-3">
              <h4 className="mb-1 flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-slate-500"><RotateCcw className="h-3 w-3" />{t(lang, "inspectRollback")}</h4>
              <p className="text-xs text-slate-600">Rollback to last-known-good executed and recorded. Backup and restore demonstrated. Disaster exercise completed with a recorded incident.</p>
            </section>
            <section className="rounded-md border border-slate-200 p-3">
              <h4 className="mb-1 flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-slate-500"><FileText className="h-3 w-3" />Cards & threat model</h4>
              <p className="text-xs text-slate-600">Data card, model card (aggregated from CP-N3-C), and system card present. Threat model enumerates the OWASP LLM Top 10 with controls. Operational runbook published.</p>
            </section>
            <section className="rounded-md border border-violet-200 bg-violet-50/40 p-3">
              <h4 className="mb-1 flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-violet-700"><GraduationCap className="h-3 w-3" />{t(lang, "inspectContribution")}</h4>
              <p className="text-xs text-slate-700">
                Personal contribution statement: the learner integrated twelve hand-built capstones through explicit versioned interfaces, executed backup/restore/rollback and a disaster exercise, and produced a system card aggregating upstream data and model cards. No claim is made of fraud prevention, money saved, real-organisation improvement, production accuracy, or enterprise scale beyond what was demonstrated in the synthetic scenario.
              </p>
            </section>
          </div>
        </ScrollArea>
        <DialogFooter className="border-t p-3">
          <Button variant="outline" onClick={onClose}>{t(lang, "closeDialog")}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─────────────────────────────── main page ───────────────────────────────

export default function HomePage() {
  const [lang, toggleLang] = useLang();
  const [openId, setOpenId] = React.useState<string | null>(null);
  const [copilotOpen, setCopilotOpen] = React.useState(false);
  const [finalOpen, setFinalOpen] = React.useState(false);

  const open = (id: string) => {
    if (id === "CP-N4-C") { setCopilotOpen(true); return; }
    if (id === "CP-FINAL") { setFinalOpen(true); return; }
    setOpenId(id);
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600 text-white">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm font-bold leading-tight">{t(lang, "appName")}</div>
              <div className="text-[11px] text-slate-500 leading-tight">{t(lang, "appTagline")}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="ghost" onClick={() => document.getElementById("levels")?.scrollIntoView({ behavior: "smooth" })}>{t(lang, "levelsNav")}</Button>
            <Button size="sm" variant="ghost" onClick={() => document.getElementById("capstones")?.scrollIntoView({ behavior: "smooth" })}>{t(lang, "capstonesNav")}</Button>
            <Button size="sm" variant="ghost" onClick={() => document.getElementById("sections")?.scrollIntoView({ behavior: "smooth" })}>{t(lang, "sectionsNav")}</Button>
            <Button size="sm" variant="ghost" onClick={() => document.getElementById("invariant")?.scrollIntoView({ behavior: "smooth" })}>{t(lang, "invariantNav")}</Button>
            <Button size="sm" variant="outline" onClick={toggleLang}>
              <Globe className="mr-1 h-3.5 w-3.5" />{t(lang, "languageToggle")}
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6">
        {/* Hero */}
        <section className="mb-8 rounded-xl border bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">{t(lang, "appName")} — {t(lang, "capstonesNav")}</h1>
          <p className="mt-2 max-w-3xl text-sm text-slate-600">{t(lang, "appTagline")}</p>
          <div className="mt-3 rounded-md border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
            <Info className="mr-1 inline h-3.5 w-3.5" />{t(lang, "levelDisclaimer")}
          </div>
        </section>

        {/* Cardinality invariant */}
        <section id="invariant" className="mb-8 rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="mb-1 text-lg font-semibold">{t(lang, "cardinalityTitle")}</h2>
          <p className="mb-3 max-w-3xl text-sm text-slate-600">{t(lang, "cardinalityDesc")}</p>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
            <Card className="p-3 text-center"><div className="text-2xl font-bold text-violet-600">{CARDINALITY.levels}</div><div className="text-xs text-slate-500">{t(lang, "levelsNav")}</div></Card>
            <Card className="p-3 text-center"><div className="text-2xl font-bold text-violet-600">{CARDINALITY.capstonesPerLevel}</div><div className="text-xs text-slate-500">{t(lang, "principalCapstone")}/{t(lang, "levelLabel")}</div></Card>
            <Card className="p-3 text-center"><div className="text-2xl font-bold text-violet-600">{CARDINALITY.levelCapstones}</div><div className="text-xs text-slate-500">{t(lang, "principalCapstone")}</div></Card>
            <Card className="p-3 text-center"><div className="text-2xl font-bold text-violet-600">{CARDINALITY.finalCapstones}</div><div className="text-xs text-slate-500">{t(lang, "finalCapstone")}</div></Card>
            <Card className="p-3 text-center border-violet-300 bg-violet-50/40"><div className="text-2xl font-bold text-violet-700">{CARDINALITY.total}</div><div className="text-xs text-slate-500">{t(lang, "totalCapstones")}</div></Card>
          </div>
          <div className="mt-3 rounded-md border border-slate-200 bg-slate-50 p-3 text-xs">
            <div className="mb-1 font-semibold text-slate-700">{t(lang, "n4dDecision")}</div>
            <div>{t(lang, "n4dFolded")}</div>
            <div className="mt-2 grid gap-1 md:grid-cols-3">
              {CARDINALITY.cpN4CSubGates.map((sg) => (
                <div key={sg.id} className="rounded border bg-white p-2">
                  <div className="font-mono text-[11px] font-semibold text-violet-700">{sg.id} · {sg.sectionId}</div>
                  <div className="text-[11px] text-slate-600">{sg.title}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Levels + capstones */}
        <section id="levels" className="mb-8 space-y-6">
          {LEVELS.map((lv) => {
            const levelCapstones = CAPSTONES.filter((c) => c.level === lv.levelId);
            return (
              <div key={lv.stableId} className="rounded-xl border bg-white p-6 shadow-sm">
                <div className="mb-4 flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <Pill variant="default">{t(lang, "levelLabel")} {lv.levelId}</Pill>
                      <h2 className="text-xl font-semibold">{lang === "es" ? lv.spanishName : lv.name}</h2>
                    </div>
                    <p className="mt-1 text-xs text-slate-500">{lv.sectionRange} · {lv.dreyfusMapping}</p>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {lv.principalGates.map((g) => (
                      <Pill key={g}><Flag className="h-3 w-3" />{g}</Pill>
                    ))}
                  </div>
                </div>
                <details className="mb-3 text-xs text-slate-600">
                  <summary className="cursor-pointer font-medium text-slate-700">{t(lang, "exitCapabilities")}</summary>
                  <ul className="mt-1.5 space-y-1">
                    {lv.exitCapabilities.map((e, i) => <li key={i} className="flex gap-2"><span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-slate-400" />{e}</li>)}
                  </ul>
                </details>
                <div id="capstones" className="grid gap-4 md:grid-cols-3">
                  {levelCapstones.map((c) => (
                    <CapstoneCard key={c.capstoneId} capstoneId={c.capstoneId} lang={lang} onOpen={open} />
                  ))}
                </div>
              </div>
            );
          })}

          {/* Final capstone */}
          <div className="rounded-xl border border-violet-300 bg-violet-50/40 p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <Crown className="h-5 w-5 text-violet-600" />
              <h2 className="text-xl font-semibold">{t(lang, "finalCapstone")}</h2>
              <Pill variant="warn">CP-FINAL · S52</Pill>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <CapstoneCard capstoneId="CP-FINAL" lang={lang} onOpen={open} />
              <Card className="p-4">
                <h3 className="mb-2 text-sm font-semibold">{t(lang, "finalIntegrationInterfaces")}</h3>
                <div className="space-y-1 text-xs">
                  {FINAL_INTERFACES.map((f) => (
                    <div key={f.capstoneId} className="flex items-center justify-between rounded border bg-white p-1.5">
                      <span className="font-mono">{f.capstoneId}</span>
                      <span className="text-slate-500">{f.interfaceName}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Sections mapping */}
        <section id="sections" className="mb-8 rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="mb-3 text-lg font-semibold">{t(lang, "sectionsNav")} (S01–S52)</h2>
          <p className="mb-3 text-xs text-slate-500">Every one of the 52 canonical sections is mapped to a principal capstone and contributes theory, an I-Do demo, a We-Do practice, a You-Do transfer task, an assessment, and a final-integration reuse.</p>
          <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
            {SECTIONS.map((s) => {
              const cap = getCapstone(s.capstoneId ?? "");
              return (
                <div key={s.sectionId} className="rounded-md border p-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-semibold text-slate-500">{s.sectionId}</span>
                    <span className="font-mono text-[10px] text-violet-600">{s.capstoneId}</span>
                  </div>
                  <div className="font-medium">{lang === "es" ? s.spanishTitle : s.title}</div>
                  <div className="mt-1 line-clamp-2 text-slate-500">{s.artifactAdded}</div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Badges */}
        <section id="badges" className="mb-8 rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="mb-3 text-lg font-semibold">{t(lang, "badgesNav")}</h2>
          <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-4">
            {BADGES.map((b) => {
              const Icon = ICONS[b.icon] ?? GraduationCap;
              return (
                <div key={b.badgeId} className="rounded-lg border p-3">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-100 text-violet-700"><Icon className="h-4 w-4" /></div>
                    <div>
                      <div className="text-xs font-semibold">{lang === "es" ? b.spanishName : b.name}</div>
                      <div className="font-mono text-[10px] text-slate-500">{b.badgeId} · {b.capstoneId}</div>
                    </div>
                  </div>
                  <p className="mt-1.5 text-[11px] text-slate-600">{b.description}</p>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      <footer className="mt-auto border-t bg-white">
        <div className="mx-auto max-w-6xl px-4 py-4 text-center text-xs text-slate-500">
          {t(lang, "footerNote")} · {t(lang, "appName")} {new Date().getFullYear()}
        </div>
      </footer>

      <CapstoneDialog
        capstoneId={openId}
        lang={lang}
        onClose={() => setOpenId(null)}
        onRunCopilot={() => { setOpenId(null); setCopilotOpen(true); }}
        onRunFinal={() => { setOpenId(null); setFinalOpen(true); }}
      />
      <CopilotHarness lang={lang} open={copilotOpen} onClose={() => setCopilotOpen(false)} />
      <FinalIntegration lang={lang} open={finalOpen} onClose={() => setFinalOpen(false)} />
    </div>
  );
}
