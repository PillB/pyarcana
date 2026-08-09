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
  Moon, Sun, Search, Filter, TrendingUp, Layers, Sparkles,
  GitCompare, Printer, Share2, ArrowDown, Star, CheckSquare, Square,
  Download, Upload, BookMarked,
} from "lucide-react";
import { CAPSTONES, getCapstone, FINAL_INTERFACES } from "@/data/capstones";
import { LEVELS, CARDINALITY } from "@/data/levels";
import { SECTIONS } from "@/data/sections";
import { BADGES } from "@/data/badges";
import { RUBRICS } from "@/data/rubrics";
import { STRINGS, type Lang, type StringKey } from "@/data/i18n";
import { SYSTEM_CARDS } from "@/data/system-cards";
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

function useTheme(): [boolean, () => void] {
  const [dark, setDark] = React.useState(false);
  React.useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);
  const toggle = React.useCallback(() => {
    setDark((d) => {
      const next = !d;
      if (next) {
        document.documentElement.classList.add("dark");
        try { localStorage.setItem("pyarcana-theme", "dark"); } catch {}
      } else {
        document.documentElement.classList.remove("dark");
        try { localStorage.setItem("pyarcana-theme", "light"); } catch {}
      }
      return next;
    });
  }, []);
  return [dark, toggle];
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

const PROGRESS_KEY = "pyarcana-progress-v1";

function useProgress(): [LearnerProgress, (id: string, evidence: string, done: boolean) => void, () => void] {
  const [progress, setProgress] = React.useState<LearnerProgress>(DEFAULT_PROGRESS);
  React.useEffect(() => {
    try {
      const saved = localStorage.getItem(PROGRESS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Merge with defaults so new capstones appear
        setProgress({ ...DEFAULT_PROGRESS, ...parsed });
      }
    } catch {}
  }, []);
  const toggle = React.useCallback((id: string, evidence: string, done: boolean) => {
    setProgress((prev) => {
      const cap = prev[id] ?? { evidenceCompleted: [], evidenceMissing: [], blockers: [] };
      const completed = new Set(cap.evidenceCompleted);
      const missing = new Set(cap.evidenceMissing);
      if (done) { completed.add(evidence); missing.delete(evidence); }
      else { completed.delete(evidence); missing.add(evidence); }
      const next = { ...prev, [id]: { evidenceCompleted: [...completed], evidenceMissing: [...missing], blockers: cap.blockers } };
      try { localStorage.setItem(PROGRESS_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);
  const reset = React.useCallback(() => {
    setProgress(DEFAULT_PROGRESS);
    try { localStorage.removeItem(PROGRESS_KEY); } catch {}
  }, []);
  return [progress, toggle, reset];
}

// Keyboard shortcuts: / search, g c compare, g g graph, ? help, d dark, l lang, Esc close
function useKeyboardShortcuts(handlers: {
  onSearch: () => void;
  onCompare: () => void;
  onGraph: () => void;
  onHelp: () => void;
  onDark: () => void;
  onLang: () => void;
}) {
  const gPressed = React.useRef(false);
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // Don't trigger when typing in inputs
      const tag = (e.target as HTMLElement)?.tagName;
      const isInput = tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT";
      if (isInput && e.key !== "Escape") return;
      if (e.key === "Escape") { return; }
      if (e.key === "/") { e.preventDefault(); handlers.onSearch(); }
      else if (e.key === "?") { e.preventDefault(); handlers.onHelp(); }
      else if (e.key === "d") { e.preventDefault(); handlers.onDark(); }
      else if (e.key === "l") { e.preventDefault(); handlers.onLang(); }
      else if (e.key === "g") { gPressed.current = true; setTimeout(() => gPressed.current = false, 800); }
      else if (gPressed.current && e.key === "c") { e.preventDefault(); gPressed.current = false; handlers.onCompare(); }
      else if (gPressed.current && e.key === "g") { e.preventDefault(); gPressed.current = false; handlers.onGraph(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handlers]);
}

// Deep-linking: open capstone from URL hash on initial load
function useDeepLink(onOpenCapstone: (id: string) => void) {
  React.useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash.startsWith("cp-")) {
      const id = hash.toUpperCase();
      if (CAPSTONES.some((c) => c.capstoneId === id)) {
        onOpenCapstone(id);
      }
    }
  }, [onOpenCapstone]);
}

// Bookmark/favorite capstones (persisted to localStorage)
const BOOKMARKS_KEY = "pyarcana-bookmarks-v1";
function useBookmarks(): [Set<string>, (id: string) => void] {
  const [bookmarks, setBookmarks] = React.useState<Set<string>>(new Set());
  React.useEffect(() => {
    try {
      const saved = localStorage.getItem(BOOKMARKS_KEY);
      if (saved) setBookmarks(new Set(JSON.parse(saved)));
    } catch {}
  }, []);
  const toggle = React.useCallback((id: string) => {
    setBookmarks((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      try { localStorage.setItem(BOOKMARKS_KEY, JSON.stringify([...next])); } catch {}
      return next;
    });
  }, []);
  return [bookmarks, toggle];
}

// Section-level progress (persisted to localStorage)
const SECTION_PROGRESS_KEY = "pyarcana-section-progress-v1";
function useSectionProgress(): [Set<string>, (sectionId: string) => void] {
  const [completed, setCompleted] = React.useState<Set<string>>(new Set());
  React.useEffect(() => {
    try {
      const saved = localStorage.getItem(SECTION_PROGRESS_KEY);
      if (saved) setCompleted(new Set(JSON.parse(saved)));
    } catch {}
  }, []);
  const toggle = React.useCallback((sectionId: string) => {
    setCompleted((prev) => {
      const next = new Set(prev);
      if (next.has(sectionId)) next.delete(sectionId); else next.add(sectionId);
      try { localStorage.setItem(SECTION_PROGRESS_KEY, JSON.stringify([...next])); } catch {}
      return next;
    });
  }, []);
  return [completed, toggle];
}

// Recently viewed capstones (persisted, max 5)
const RECENT_KEY = "pyarcana-recent-v1";
function useRecent(): [string[], (id: string) => void, () => void] {
  const [recent, setRecent] = React.useState<string[]>([]);
  React.useEffect(() => {
    try {
      const saved = localStorage.getItem(RECENT_KEY);
      if (saved) setRecent(JSON.parse(saved));
    } catch {}
  }, []);
  const add = React.useCallback((id: string) => {
    setRecent((prev) => {
      const next = [id, ...prev.filter((x) => x !== id)].slice(0, 5);
      try { localStorage.setItem(RECENT_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);
  const clear = React.useCallback(() => {
    setRecent([]);
    try { localStorage.removeItem(RECENT_KEY); } catch {}
  }, []);
  return [recent, add, clear];
}

// Progress timeline: track when evidence was completed
const TIMELINE_KEY = "pyarcana-timeline-v1";
interface TimelineEntry { capstoneId: string; evidence: string; ts: string; }
function useTimeline(): [TimelineEntry[], (capstoneId: string, evidence: string, done: boolean) => void] {
  const [timeline, setTimeline] = React.useState<TimelineEntry[]>([]);
  React.useEffect(() => {
    try {
      const saved = localStorage.getItem(TIMELINE_KEY);
      if (saved) setTimeline(JSON.parse(saved));
    } catch {}
  }, []);
  const record = React.useCallback((capstoneId: string, evidence: string, done: boolean) => {
    setTimeline((prev) => {
      let next = prev.filter((e) => !(e.capstoneId === capstoneId && e.evidence === evidence));
      if (done) {
        next = [{ capstoneId, evidence, ts: new Date().toISOString() }, ...next].slice(0, 50);
      }
      try { localStorage.setItem(TIMELINE_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);
  return [timeline, record];
}

// Streak tracker: consecutive days with at least one evidence completion
const STREAK_KEY = "pyarcana-streak-v1";
function useStreak(timeline: TimelineEntry[]): { count: number; active: boolean } {
  const [streak, setStreak] = React.useState({ count: 0, active: false });
  React.useEffect(() => {
    if (timeline.length === 0) { setStreak({ count: 0, active: false }); return; }
    // Group completions by date (YYYY-MM-DD)
    const dates = new Set(timeline.map((e) => e.ts.slice(0, 10)));
    const sortedDates = [...dates].sort().reverse();
    if (sortedDates.length === 0) { setStreak({ count: 0, active: false }); return; }
    // Check if the most recent date is today or yesterday
    const today = new Date().toISOString().slice(0, 10);
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    const active = sortedDates[0] === today || sortedDates[0] === yesterday;
    // Count consecutive days backward from the most recent
    let count = 1;
    for (let i = 0; i < sortedDates.length - 1; i++) {
      const d1 = new Date(sortedDates[i]);
      const d2 = new Date(sortedDates[i + 1]);
      const diff = (d1.getTime() - d2.getTime()) / 86400000;
      if (Math.round(diff) === 1) count++;
      else break;
    }
    setStreak({ count, active });
    try { localStorage.setItem(STREAK_KEY, JSON.stringify({ count, active })); } catch {}
  }, [timeline]);
  return streak;
}

// Achievement notifications: check for milestones after evidence toggle
interface Achievement { id: string; title: string; desc: string; }
function useAchievements(progress: LearnerProgress): [Achievement | null, () => void] {
  const [current, setCurrent] = React.useState<Achievement | null>(null);
  const check = React.useCallback((capstoneId: string) => {
    const c = getCapstone(capstoneId);
    const p = progress[capstoneId];
    if (!c || !p) return;
    // Capstone complete: all artifacts done
    if (p.evidenceCompleted.length === c.requiredArtifacts.length && c.requiredArtifacts.length > 0) {
      setCurrent({ id: `capstone-${capstoneId}`, title: STRINGS.en.capstoneComplete, desc: STRINGS.en.capstoneCompleteDesc.replace("{capstone}", capstoneId) });
      return;
    }
    // Level complete: all 3 capstones in the level at 100%
    const levelCapstones = CAPSTONES.filter((x) => x.level === c.level && x.capstoneId !== "CP-FINAL");
    const allLevelDone = levelCapstones.every((x) => {
      const px = progress[x.capstoneId];
      return px && px.evidenceCompleted.length === x.requiredArtifacts.length;
    });
    if (allLevelDone) {
      setCurrent({ id: `level-${c.level}`, title: STRINGS.en.levelComplete, desc: STRINGS.en.levelCompleteDesc.replace("{level}", String(c.level)) });
      return;
    }
    // All 13 complete
    const allDone = CAPSTONES.every((x) => {
      const px = progress[x.capstoneId];
      return px && px.evidenceCompleted.length === x.requiredArtifacts.length;
    });
    if (allDone) {
      setCurrent({ id: "all", title: STRINGS.en.allCapstonesComplete, desc: STRINGS.en.allCapstonesCompleteDesc });
    }
  }, [progress]);
  // Re-check when progress changes
  React.useEffect(() => {
    // Find any newly-completed capstone and trigger
    for (const c of CAPSTONES) {
      const p = progress[c.capstoneId];
      if (p && p.evidenceCompleted.length === c.requiredArtifacts.length && c.requiredArtifacts.length > 0) {
        // Only show if not already shown (simple: show once per session via sessionStorage)
        const key = `achv-shown-${c.capstoneId}`;
        if (!sessionStorage.getItem(key)) {
          sessionStorage.setItem(key, "1");
          setCurrent({ id: `capstone-${c.capstoneId}`, title: STRINGS.en.capstoneComplete, desc: STRINGS.en.capstoneCompleteDesc.replace("{capstone}", c.capstoneId) });
          return;
        }
      }
    }
  }, [progress]);
  const dismiss = React.useCallback(() => setCurrent(null), []);
  return [current, dismiss];
}

// Capstone notes (persisted per capstone)
const NOTES_KEY = "pyarcana-notes-v1";
function useNotes(): [Record<string, string>, (id: string, note: string) => void] {
  const [notes, setNotes] = React.useState<Record<string, string>>({});
  React.useEffect(() => {
    try {
      const saved = localStorage.getItem(NOTES_KEY);
      if (saved) setNotes(JSON.parse(saved));
    } catch {}
  }, []);
  const set = React.useCallback((id: string, note: string) => {
    setNotes((prev) => {
      const next = { ...prev, [id]: note };
      try { localStorage.setItem(NOTES_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);
  return [notes, set];
}

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
    case "deployed": return "bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800";
    case "verified": return "bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800";
    case "implemented": return "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800";
    case "partial": return "bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-950/50 dark:text-orange-300 dark:border-orange-800";
    default: return "bg-red-100 text-red-800 border-red-300 dark:bg-red-950/50 dark:text-red-300 dark:border-red-800";
  }
}

function StatusIcon({ status }: { status: string }) {
  if (status === "deployed" || status === "verified") return <CheckCircle2 className="h-3 w-3" />;
  if (status === "implemented") return <Sparkles className="h-3 w-3" />;
  if (status === "partial") return <AlertTriangle className="h-3 w-3" />;
  return <XCircle className="h-3 w-3" />;
}

// ─────────────────────────────── small components ───────────────────────────────

function Pill({ children, variant = "default" }: { children: React.ReactNode; variant?: "default" | "critical" | "ok" | "warn" }) {
  const cls = variant === "critical" ? "border-red-300 bg-red-50 text-red-800 dark:bg-red-950/50 dark:text-red-300 dark:border-red-800"
    : variant === "ok" ? "border-emerald-300 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800"
    : variant === "warn" ? "border-amber-300 bg-amber-50 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800"
    : "border-slate-300 bg-slate-50 text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200";
  return <span className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-medium ${cls}`}>{children}</span>;
}

function BulletList({ items, icon: Icon }: { items: string[]; icon?: React.ComponentType<{ className?: string }> }) {
  return (
    <ul className="space-y-1.5 text-sm leading-relaxed">
      {items.map((it, i) => (
        <li key={i} className="flex gap-2">
          {Icon ? <Icon className="mt-0.5 h-4 w-4 shrink-0 text-slate-500 dark:text-slate-400" /> : <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-slate-400" />}
          <span>{it}</span>
        </li>
      ))}
    </ul>
  );
}

// ─────────────────────────────── capstone card ───────────────────────────────

function CapstoneCard({ capstoneId, lang, onOpen, prog, bookmarked, onBookmark, sectionsDone }: { capstoneId: string; lang: Lang; onOpen: (id: string) => void; prog: LearnerProgress; bookmarked: boolean; onBookmark: (id: string) => void; sectionsDone: number }) {
  const c = getCapstone(capstoneId);
  const badge = BADGES.find((b) => b.capstoneId === capstoneId);
  const IconBadge = badge ? (ICONS[badge.icon] ?? GraduationCap) : GraduationCap;
  const progress = prog[capstoneId] ?? DEFAULT_PROGRESS[capstoneId];
  const totalSections = SECTIONS.filter((s) => s.capstoneId === capstoneId).length;
  const total = c.requiredArtifacts.length;
  const done = progress.evidenceCompleted.length;
  const pct = Math.round((done / total) * 100);
  const isFinal = capstoneId === "CP-FINAL";
  const hasBlockers = progress.blockers.length > 0;
  // Difficulty: based on level + critical criteria count + artifacts count
  const difficultyScore = c.level * 2 + c.criticalCriteria.length + Math.floor(c.requiredArtifacts.length / 5);
  const difficulty = difficultyScore <= 8 ? "easy" : difficultyScore <= 12 ? "medium" : difficultyScore <= 16 ? "hard" : "expert";
  const difficultyColor = { easy: "bg-emerald-100 text-emerald-700 border-emerald-300 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800", medium: "bg-amber-100 text-amber-700 border-amber-300 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800", hard: "bg-orange-100 text-orange-700 border-orange-300 dark:bg-orange-950/50 dark:text-orange-300 dark:border-orange-800", expert: "bg-red-100 text-red-700 border-red-300 dark:bg-red-950/50 dark:text-red-300 dark:border-red-800" }[difficulty];

  return (
    <Card className={`card-hover flex h-full flex-col ${isFinal ? "border-violet-300 bg-violet-50/40 dark:bg-violet-950/20 dark:border-violet-800" : ""}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${isFinal ? "bg-violet-100 text-violet-700 dark:bg-violet-900 dark:text-violet-300" : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"}`}>
              <IconBadge className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-semibold text-slate-500 dark:text-slate-400">{c.capstoneId}</span>
                <span className={`inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-[10px] font-medium ${statusColor(c.status)}`}>
                  <StatusIcon status={c.status} />{c.status}
                </span>
              </div>
              <CardTitle className="text-base leading-tight">{lang === "es" ? c.titleEs : c.title}</CardTitle>
            </div>
          </div>
          <button
            onClick={() => onBookmark(c.capstoneId)}
            className="focus-ring rounded-md p-1 text-slate-400 hover:text-amber-500 dark:hover:text-amber-400"
            aria-label={bookmarked ? t(lang, "bookmarked") : t(lang, "bookmark")}
            aria-pressed={bookmarked}
          >
            <Star className={`h-4 w-4 ${bookmarked ? "fill-amber-400 text-amber-400" : ""}`} />
          </button>
        </div>
        <CardDescription className="mt-1 line-clamp-3 text-xs">{lang === "es" ? c.problemStatementEs : c.problemStatement}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 space-y-3 text-sm">
        <div className="flex flex-wrap items-center gap-2">
          <Pill><Flag className="h-3 w-3" />{t(lang, "gateLabel")}: {c.gateSection}</Pill>
          <Pill variant="default">v{c.version}</Pill>
          {c.subGates.length > 0 && <Pill variant="warn">{c.subGates.length} {t(lang, "subGateLabel")}</Pill>}
          <span className={`inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-[10px] font-medium ${difficultyColor}`} title={t(lang, "difficulty")}>
            {t(lang, `difficulty${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}` as StringKey)}
          </span>
        </div>
        <div>
          <div className="mb-1 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1"><TrendingUp className="h-3 w-3" />{t(lang, "evidenceLabel")}</span>
            <span className="font-mono">{done} {t(lang, "of")} {total} · {pct}%</span>
          </div>
          <Progress value={pct} className="h-2" />
        </div>
        {totalSections > 0 && (
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1"><CheckSquare className="h-3 w-3" />{t(lang, "sectionsInCapstone")}</span>
            <span className="font-mono">{sectionsDone}/{totalSections}</span>
          </div>
        )}
        {hasBlockers && (
          <div className="rounded-md border border-amber-200 bg-amber-50 p-2 dark:border-amber-800 dark:bg-amber-950/40">
            <div className="mb-1 flex items-center gap-1 text-xs font-medium text-amber-800 dark:text-amber-300">
              <AlertTriangle className="h-3 w-3" />{t(lang, "criticalBlockers")}
            </div>
            <ul className="space-y-0.5 text-xs text-amber-800 dark:text-amber-300">
              {progress.blockers.map((b, i) => <li key={i}>• {blockerToLearner(lang, b)}</li>)}
            </ul>
          </div>
        )}
      </CardContent>
      <CardFooter className="gap-2 pt-0">
        <Button size="sm" variant="default" className="flex-1 focus-ring" onClick={() => onOpen(capstoneId)}>
          <BookOpen className="mr-1 h-3.5 w-3.5" />{t(lang, "viewBrief")}
        </Button>
        {(capstoneId === "CP-N4-C" || isFinal) && (
          <Button size="sm" variant="outline" className="focus-ring" onClick={() => onOpen(capstoneId)}>
            <Play className="mr-1 h-3.5 w-3.5" />{isFinal ? t(lang, "runFinal") : t(lang, "runCopilot")}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

// ─────────────────────────────── capstone detail dialog ───────────────────────────────

function CapstoneDialog({ capstoneId, lang, onClose, onRunCopilot, onRunFinal, onViewSystemCard, prog, onToggleEvidence, notes, onSetNote }: {
  capstoneId: string | null; lang: Lang; onClose: () => void;
  onRunCopilot: (id: string) => void; onRunFinal: (id: string) => void;
  onViewSystemCard?: (id: string) => void;
  prog: LearnerProgress;
  onToggleEvidence?: (id: string, evidence: string, done: boolean) => void;
  notes: Record<string, string>;
  onSetNote: (id: string, note: string) => void;
}) {
  const c = capstoneId ? getCapstone(capstoneId) : null;
  if (!c) return null;
  const sections = SECTIONS.filter((s) => s.capstoneId === c.capstoneId);
  const badge = BADGES.find((b) => b.capstoneId === c.capstoneId);
  const hasSystemCard = !!SYSTEM_CARDS[c.capstoneId];
  const rubric = RUBRICS[c.capstoneId];
  const progress = prog[c.capstoneId] ?? DEFAULT_PROGRESS[c.capstoneId];
  const isFinal = c.capstoneId === "CP-FINAL";

  return (
    <Dialog open={!!capstoneId} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-hidden p-0">
        <DialogHeader className="border-b p-4">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-semibold text-slate-500 dark:text-slate-400">{c.capstoneId}</span>
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
              <h3 className="mb-1.5 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{t(lang, "viewBrief")}</h3>
              <p className="text-sm leading-relaxed text-slate-700">{lang === "es" ? c.problemStatementEs : c.problemStatement}</p>
            </section>

            <div className="grid gap-4 md:grid-cols-2">
              <section>
                <h4 className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{t(lang, "intendedUsers")}</h4>
                <BulletList items={c.intendedUsers} icon={GraduationCap} />
              </section>
              <section>
                <h4 className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{t(lang, "jobsToBeDone")}</h4>
                <BulletList items={c.jobsToBeDone} icon={ListChecks} />
              </section>
              <section>
                <h4 className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{t(lang, "prerequisites")}</h4>
                <BulletList items={c.prerequisites} icon={BookOpen} />
                {/* Prerequisite capstone chain */}
                {c.badgeDependencies.length > 0 ? (
                  <div className="mt-2 rounded-md border p-2 dark:border-slate-700 dark:bg-slate-800">
                    <div className="mb-1 text-[11px] font-medium text-slate-500 dark:text-slate-400">{t(lang, "prerequisitesDesc")}</div>
                    <div className="flex flex-wrap items-center gap-1">
                      {c.badgeDependencies.map((bd, i) => {
                        const fromBadge = BADGES.find((b) => b.badgeId === bd);
                        const fromId = fromBadge?.capstoneId ?? bd;
                        return (
                          <React.Fragment key={bd}>
                            <button onClick={() => { onClose(); setTimeout(() => window.location.hash = fromId.toLowerCase(), 100); }} className="focus-ring rounded border border-violet-200 bg-violet-50 px-1.5 py-0.5 font-mono text-[10px] text-violet-700 hover:bg-violet-100 dark:border-violet-800 dark:bg-violet-950/40 dark:text-violet-300" title={fromBadge?.name}>
                              {fromId}
                            </button>
                            {i < c.badgeDependencies.length - 1 && <ArrowRight className="h-3 w-3 text-slate-400" />}
                          </React.Fragment>
                        );
                      })}
                      <ArrowRight className="h-3 w-3 text-slate-400" />
                      <span className="rounded border border-violet-400 bg-violet-100 px-1.5 py-0.5 font-mono text-[10px] font-bold text-violet-800 dark:bg-violet-900 dark:text-violet-200">{c.capstoneId}</span>
                    </div>
                  </div>
                ) : (
                  <div className="mt-2 rounded-md border border-emerald-200 bg-emerald-50 p-2 text-[11px] text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-300">
                    <CheckCircle2 className="mr-1 inline h-3 w-3" />{t(lang, "noPrerequisites")}
                  </div>
                )}
              </section>
              <section>
                <h4 className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{t(lang, "learningOutcomes")}</h4>
                <BulletList items={c.learningOutcomes} icon={GraduationCap} />
              </section>
            </div>

            {/* Section contributions */}
            <section>
              <h3 className="mb-1.5 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{t(lang, "sectionContributions")}</h3>
              <Accordion type="single" collapsible>
                {sections.map((s) => (
                  <AccordionItem key={s.sectionId} value={s.sectionId}>
                    <AccordionTrigger className="text-sm">
                      <span className="font-mono text-xs text-slate-500 dark:text-slate-400">{s.sectionId}</span> · {lang === "es" ? s.spanishTitle : s.title}
                    </AccordionTrigger>
                    <AccordionContent className="grid gap-2 text-xs md:grid-cols-2">
                      <div><strong className="text-slate-500 dark:text-slate-400">{t(lang, "requiredArtifacts")}:</strong> {s.artifactAdded}</div>
                      <div><strong className="text-slate-500 dark:text-slate-400">{t(lang, "viewSections")}:</strong> {s.theory}</div>
                      <div><strong className="text-slate-500 dark:text-slate-400">I Do:</strong> {s.iDo}</div>
                      <div><strong className="text-slate-500 dark:text-slate-400">We Do:</strong> {s.weDo}</div>
                      <div><strong className="text-slate-500 dark:text-slate-400">You Do:</strong> {s.youDo}</div>
                      <div><strong className="text-slate-500 dark:text-slate-400">{t(lang, "rubric")}:</strong> {s.assessment}</div>
                      <div className="md:col-span-2"><strong className="text-slate-500 dark:text-slate-400">{t(lang, "finalDependency")}:</strong> {s.finalInterfaceReuse}</div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>

            <div className="grid gap-4 md:grid-cols-2">
              <section>
                <h4 className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{t(lang, "requiredArtifacts")}</h4>
                <BulletList items={c.requiredArtifacts} icon={FileCheck} />
              </section>
              <section>
                <h4 className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{t(lang, "requiredEvidence")}</h4>
                <BulletList items={c.requiredEvidence} icon={CheckCircle2} />
              </section>
            </div>

            {/* Synthetic data */}
            <section className="rounded-md border border-slate-200 bg-slate-50 p-3">
              <h4 className="mb-1.5 flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                <Lock className="h-3 w-3" />{t(lang, "syntheticData")}
              </h4>
              <div className="grid gap-1 text-xs md:grid-cols-2">
                <div><strong className="text-slate-500 dark:text-slate-400">Generator:</strong> {c.syntheticDataContract.generator}</div>
                <div><strong className="text-slate-500 dark:text-slate-400">Size:</strong> {c.syntheticDataContract.size}</div>
                <div><strong className="text-slate-500 dark:text-slate-400">License:</strong> {c.syntheticDataContract.license}</div>
                <div className="md:col-span-2"><strong className="text-slate-500 dark:text-slate-400">PII risk:</strong> {c.syntheticDataContract.piiRisk}</div>
                <div className="md:col-span-2"><strong className="text-slate-500 dark:text-slate-400">Schema:</strong> <code className="text-[11px]">{c.syntheticDataContract.schema}</code></div>
              </div>
            </section>

            {/* Acceptance + critical */}
            <div className="grid gap-4 md:grid-cols-2">
              <section>
                <h4 className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{t(lang, "acceptanceCriteria")}</h4>
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
                <h4 className="mb-1.5 flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400"><Lock className="h-3 w-3" />{t(lang, "securityRequirements")}</h4>
                <BulletList items={c.securityRequirements} />
              </section>
              <section className="rounded-md border p-3">
                <h4 className="mb-1.5 flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400"><ShieldCheck className="h-3 w-3" />{t(lang, "privacyRequirements")}</h4>
                <BulletList items={c.privacyRequirements} />
              </section>
              <section className="rounded-md border p-3">
                <h4 className="mb-1.5 flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400"><Scale className="h-3 w-3" />{t(lang, "accessibilityRequirements")}</h4>
                <BulletList items={c.accessibilityRequirements} />
              </section>
              <section className="rounded-md border p-3">
                <h4 className="mb-1.5 flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400"><Info className="h-3 w-3" />{t(lang, "responsibleUseRequirements")}</h4>
                <BulletList items={c.responsibleUseRequirements} />
              </section>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <section>
                <h4 className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{t(lang, "testRequirements")}</h4>
                <BulletList items={c.testRequirements} icon={ListChecks} />
              </section>
              <section>
                <h4 className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{t(lang, "demoRequirements")}</h4>
                <BulletList items={c.demoRequirements} icon={Play} />
              </section>
            </div>

            {/* Rubric */}
            <section className="rounded-md border p-3">
              <div className="mb-2 flex items-center justify-between">
                <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{t(lang, "rubric")} v{rubric.version}</h4>
                <Pill variant="warn">{t(lang, "passThreshold")}: {rubric.passThreshold}%</Pill>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b text-left text-slate-500 dark:text-slate-400">
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
              <h4 className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{t(lang, "remediationPaths")}</h4>
              <BulletList items={c.remediationPaths} icon={RotateCcw} />
            </section>

            {/* Notes */}
            <section className="rounded-md border border-slate-200 p-3 dark:border-slate-700">
              <h4 className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{t(lang, "notes")}</h4>
              <textarea
                value={notes[c.capstoneId] ?? ""}
                onChange={(e) => onSetNote(c.capstoneId, e.target.value)}
                placeholder={t(lang, "notesPlaceholder")}
                className="w-full rounded-md border border-slate-300 bg-white p-2 text-xs dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-500 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
                rows={3}
                aria-label={t(lang, "notes")}
              />
              <div className="mt-1 text-[10px] text-slate-400">{t(lang, "notesSaved")}</div>
            </section>

            {/* Badge + final integration */}
            <div className="grid gap-3 md:grid-cols-2">
              {badge && (
                <section className="rounded-md border border-violet-200 bg-violet-50/40 p-3">
                  <h4 className="mb-1.5 flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-violet-700"><Crown className="h-3 w-3" />{t(lang, "badgeRelationship")}</h4>
                  <div className="text-sm font-medium">{lang === "es" ? badge.spanishName : badge.name}</div>
                  <div className="text-xs text-slate-600">{badge.description}</div>
                  <div className="mt-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">{t(lang, "eligibility")}</div>
                  <BulletList items={badge.eligibility} />
                </section>
              )}
              <section className="rounded-md border p-3">
                <h4 className="mb-1.5 flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400"><ArrowRight className="h-3 w-3" />{t(lang, "finalIntegrationInterfaces")}</h4>
                <BulletList items={c.finalIntegrationInterfaces} />
              </section>
            </div>

            {/* Progress (learner-facing, not internal audit terms) */}
            <section className="rounded-md border border-slate-200 p-3 dark:border-slate-700">
              <div className="mb-2 flex items-center justify-between">
                <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{t(lang, "progress")}</h4>
                <span className="text-xs text-slate-500 dark:text-slate-400">{progress.evidenceCompleted.length}/{c.requiredArtifacts.length}</span>
              </div>
              <div className="space-y-1">
                <div className="mb-1 flex items-center gap-1 text-xs font-medium text-slate-600 dark:text-slate-400">
                  <CheckSquare className="h-3 w-3" />{t(lang, "evidenceLabel")} — {t(lang, "markComplete")}
                </div>
                {c.requiredArtifacts.map((artifact) => {
                  const isDone = progress.evidenceCompleted.includes(artifact);
                  return (
                    <label key={artifact} className="flex cursor-pointer items-start gap-2 rounded p-1 text-xs hover:bg-slate-50 dark:hover:bg-slate-800">
                      <button
                        type="button"
                        onClick={() => onToggleEvidence?.(c.capstoneId, artifact, !isDone)}
                        className="focus-ring mt-0.5 shrink-0 rounded"
                        aria-label={isDone ? t(lang, "markIncomplete") : t(lang, "markComplete")}
                        aria-pressed={isDone}
                      >
                        {isDone
                          ? <CheckSquare className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                          : <Square className="h-3.5 w-3.5 text-slate-400" />}
                      </button>
                      <span className={isDone ? "text-slate-400 line-through dark:text-slate-500" : "text-slate-700 dark:text-slate-300"}>{artifact}</span>
                    </label>
                  );
                })}
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
          {hasSystemCard && onViewSystemCard && (
            <Button variant="outline" onClick={() => onViewSystemCard(c.capstoneId)}>
              <FileText className="mr-1 h-3.5 w-3.5" />System card
            </Button>
          )}
          <Button variant="outline" onClick={() => window.print()}>
            <Printer className="mr-1 h-3.5 w-3.5" />{t(lang, "printBrief")}
          </Button>
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
  const [webSearch, setWebSearch] = React.useState(true);
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
              <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{t(lang, "providerMode")}</h4>
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
              <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
                {mode === "no-key" && "Deterministic test double. No paid key required for the basic validation suite."}
                {mode === "local" && "Local-model adapter (e.g. a small local server). Provider-neutral contract."}
                {mode === "commercial-test" && "Commercial-model adapter in test mode. Sandbox credentials, never live."}
                {mode === "commercial-approved" && "Commercial approved mode requires explicit operator sign-off (disabled in this demo)."}
              </p>
            </section>

            {/* Web search toggle */}
            <section className="rounded-md border border-slate-200 p-3">
              <label className="flex items-center gap-2 text-xs">
                <input type="checkbox" checked={webSearch} onChange={(e) => setWebSearch(e.target.checked)} className="h-4 w-4" />
                <Globe className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
                <span className="font-medium">Web/SERP search</span>
                <span className="text-slate-400">— provider-neutral, budget-bounded, untrusted-content-wrapped, injection-defended</span>
              </label>
            </section>

            {/* Task */}
            <section>
              <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{t(lang, "executeBoundedTask")}</h4>
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
                  <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{t(lang, "inspectRetrieval")}</h4>
                  <div className="space-y-1 text-xs">
                    {result.retrieval.map((r, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <FileText className="mt-0.5 h-3 w-3 text-slate-400" />
                        <span><strong>{r.doc}</strong> <span className="text-slate-500 dark:text-slate-400">(scope: {r.scope}, score: {r.score})</span> — {r.snippet}</span>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="rounded-md border border-slate-200 p-3">
                  <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{t(lang, "inspectProposedTool")}</h4>
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
                      <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{t(lang, "inspectVerifier")}</h4>
                      <div className="text-xs">
                        <Pill variant={result.verifier.passed ? "ok" : "critical"}>{result.verifier.passed ? "passed" : "rejected"}</Pill>
                        <p className="mt-1.5 text-slate-600">{result.verifier.reason}</p>
                        <p className="mt-1 text-slate-500 dark:text-slate-400">Faithfulness: {result.verifier.faithfulness} · Context precision: {result.verifier.contextPrecision}</p>
                      </div>
                    </section>

                    <section className="rounded-md border border-slate-200 p-3">
                      <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{t(lang, "inspectTrace")} ({t(lang, "redacted")})</h4>
                      <pre className="overflow-x-auto rounded bg-slate-900 p-2 font-mono text-[11px] text-slate-100">{result.trace}</pre>
                    </section>

                    <section className="rounded-md border border-slate-200 p-3">
                      <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{t(lang, "inspectBudget")}</h4>
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
                        <div className="font-semibold text-slate-500 dark:text-slate-400">{t(lang, "citations")}:</div>
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
              <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{t(lang, "verifyTwelveDeps")}</h4>
              <div className="grid gap-2 md:grid-cols-2">
                {FINAL_INTERFACES.map((f) => (
                  <div key={f.capstoneId} className="rounded-md border p-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-semibold text-slate-500 dark:text-slate-400">{f.capstoneId}</span>
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
              <h4 className="mb-1 flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400"><RotateCcw className="h-3 w-3" />{t(lang, "inspectRollback")}</h4>
              <p className="text-xs text-slate-600">Rollback to last-known-good executed and recorded. Backup and restore demonstrated. Disaster exercise completed with a recorded incident.</p>
            </section>
            <section className="rounded-md border border-slate-200 p-3">
              <h4 className="mb-1 flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400"><FileText className="h-3 w-3" />Cards & threat model</h4>
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

// ─────────────────────────────── system card viewer ───────────────────────────────

function SystemCardDialog({ capstoneId, lang, open, onClose }: { capstoneId: string | null; lang: Lang; open: boolean; onClose: () => void }) {
  const card = capstoneId ? SYSTEM_CARDS[capstoneId] : null;
  if (!card) return null;
  const sections: [string, string][] = [
    ["Summary", card.summary],
    ["Intended use", card.intendedUse],
    ["Out of scope", card.outOfScope],
    ["Architecture & components", card.architecture],
    ["Evaluation", card.evaluation],
    ["Ethical considerations", card.ethicalConsiderations],
    ["Threat model (OWASP LLM Top 10)", card.threatModel.overview + "\n" + card.threatModel.matrix.map((t) => `${t.id} ${t.threat}: ${t.controls.join("; ")}`).join("\n")],
    ["Governance", card.governance.overview + "\nApproval gates: " + card.governance.approvalGates.join(", ") + "\nRACI: " + card.governance.raci.map((r) => `${r.role}: ${r.responsibilities.join("; ")}`).join("\n")],
    ["Incident response", card.incidentResponse.overview + "\n" + card.incidentResponse.severityMatrix.map((s) => `${s.severity}: ${s.definition}`).join("\n") + "\nRunbook: " + card.incidentResponse.runbook.join("; ")],
    ["Rollback & recovery", card.rollbackRecovery.overview + "\nLast known good: " + card.rollbackRecovery.lastKnownGood + "\nDrill cadence: " + card.rollbackRecovery.drillCadence + "\nRTO/RPO: " + card.rollbackRecovery.rtoRpo],
    ["Audit history", card.auditHistory.overview + "\n" + card.auditHistory.entries.map((e) => `${e.timestamp}: ${e.action} by ${e.actor} (${e.artifactRef})`).join("\n")],
    ["Correction & appeal", card.correctionAppeal.overview + "\nSLA: " + card.correctionAppeal.sla + "\nChannel: " + card.correctionAppeal.channel],
    ["No-go conditions", card.noGoConditions.join("\n• ")],
    ["Regulatory mapping (EU AI Act Annex IV)", card.regulatoryMapping.overview + "\n" + card.regulatoryMapping.entries.map((r) => `${r.annexIvSection} → ${r.systemCardSection}: ${r.evidence}`).join("\n")],
  ];
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-hidden p-0">
        <DialogHeader className="border-b p-4">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-violet-600" />
            <DialogTitle className="text-lg">System Card — {capstoneId}</DialogTitle>
            <Pill variant="warn">v{card.version}</Pill>
          </div>
          <DialogDescription className="text-xs">14 canonical sections (Annex IV + Anthropic + OWASP LLM Top 10 + NIST AI 600-1)</DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[calc(90vh-8rem)]">
          <div className="space-y-3 p-4">
            {sections.map(([title, body]) => (
              <section key={title} className="rounded-md border p-3">
                <h4 className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{title}</h4>
                <p className="whitespace-pre-line text-xs leading-relaxed text-slate-700">• {body}</p>
              </section>
            ))}
          </div>
        </ScrollArea>
        <DialogFooter className="border-t p-3">
          <Button variant="outline" onClick={onClose}>{t(lang, "closeDialog")}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─────────────────────────────── capstone comparison ───────────────────────────────

function ComparisonDialog({ lang, open, onClose }: { lang: Lang; open: boolean; onClose: () => void }) {
  const [aId, setAId] = React.useState("CP-N1-A");
  const [bId, setBId] = React.useState("CP-N4-C");
  const a = getCapstone(aId);
  const b = getCapstone(bId);

  const dims: { label: string; aVal: string; bVal: string; diff: boolean }[] = [
    { label: "Level", aVal: String(a.level), bVal: String(b.level), diff: a.level !== b.level },
    { label: "Gate", aVal: a.gateSection, bVal: b.gateSection, diff: a.gateSection !== b.gateSection },
    { label: "Version", aVal: a.version, bVal: b.version, diff: a.version !== b.version },
    { label: "Status", aVal: a.status, bVal: b.status, diff: a.status !== b.status },
    { label: "Artifacts", aVal: String(a.requiredArtifacts.length), bVal: String(b.requiredArtifacts.length), diff: a.requiredArtifacts.length !== b.requiredArtifacts.length },
    { label: "Acceptance criteria", aVal: String(a.acceptanceCriteria.length), bVal: String(b.acceptanceCriteria.length), diff: a.acceptanceCriteria.length !== b.acceptanceCriteria.length },
    { label: "Critical criteria", aVal: String(a.criticalCriteria.length), bVal: String(b.criticalCriteria.length), diff: a.criticalCriteria.length !== b.criticalCriteria.length },
    { label: "Tests", aVal: String(a.testRequirements.length), bVal: String(b.testRequirements.length), diff: a.testRequirements.length !== b.testRequirements.length },
    { label: "Security reqs", aVal: String(a.securityRequirements.length), bVal: String(b.securityRequirements.length), diff: a.securityRequirements.length !== b.securityRequirements.length },
    { label: "Prerequisites", aVal: String(a.prerequisites.length), bVal: String(b.prerequisites.length), diff: a.prerequisites.length !== b.prerequisites.length },
    { label: "Badge deps", aVal: String(a.badgeDependencies.length), bVal: String(b.badgeDependencies.length), diff: a.badgeDependencies.length !== b.badgeDependencies.length },
    { label: "Rubric criteria", aVal: String(a.rubric.criteria.length), bVal: String(b.rubric.criteria.length), diff: a.rubric.criteria.length !== b.rubric.criteria.length },
  ];

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-hidden p-0">
        <DialogHeader className="border-b p-4">
          <div className="flex items-center gap-2">
            <GitCompare className="h-5 w-5 text-violet-600 dark:text-violet-400" />
            <DialogTitle className="text-lg">{t(lang, "compareCapstones")}</DialogTitle>
          </div>
          <DialogDescription className="text-xs">{t(lang, "compareSelectTwo")}</DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[calc(90vh-9rem)]">
          <div className="space-y-4 p-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">{t(lang, "capstoneA")}</label>
                <select value={aId} onChange={(e) => setAId(e.target.value)} className="w-full rounded-md border border-slate-300 bg-white p-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 focus-ring">
                  {CAPSTONES.map((c) => <option key={c.capstoneId} value={c.capstoneId}>{c.capstoneId} — {lang === "es" ? c.titleEs : c.title}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">{t(lang, "capstoneB")}</label>
                <select value={bId} onChange={(e) => setBId(e.target.value)} className="w-full rounded-md border border-slate-300 bg-white p-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 focus-ring">
                  {CAPSTONES.map((c) => <option key={c.capstoneId} value={c.capstoneId}>{c.capstoneId} — {lang === "es" ? c.titleEs : c.title}</option>)}
                </select>
              </div>
            </div>

            {/* Titles */}
            <div className="grid grid-cols-2 gap-3">
              <Card className="card-hover p-3 dark:bg-slate-800 dark:border-slate-700">
                <div className="font-mono text-xs text-violet-600 dark:text-violet-400">{a.capstoneId}</div>
                <div className="text-sm font-semibold">{lang === "es" ? a.titleEs : a.title}</div>
              </Card>
              <Card className="card-hover p-3 dark:bg-slate-800 dark:border-slate-700">
                <div className="font-mono text-xs text-violet-600 dark:text-violet-400">{b.capstoneId}</div>
                <div className="text-sm font-semibold">{lang === "es" ? b.titleEs : b.title}</div>
              </Card>
            </div>

            {/* Comparison table */}
            <div className="overflow-x-auto rounded-md border dark:border-slate-700">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b bg-slate-50 dark:bg-slate-800">
                    <th className="p-2 text-left font-medium text-slate-500 dark:text-slate-400">{t(lang, "differences")}</th>
                    <th className="p-2 text-left font-medium text-slate-700 dark:text-slate-300">{a.capstoneId}</th>
                    <th className="p-2 text-left font-medium text-slate-700 dark:text-slate-300">{b.capstoneId}</th>
                    <th className="p-2 text-center font-medium text-slate-500 dark:text-slate-400">≠</th>
                  </tr>
                </thead>
                <tbody>
                  {dims.map((d) => (
                    <tr key={d.label} className="border-b last:border-0 dark:border-slate-700">
                      <td className="p-2 font-medium text-slate-600 dark:text-slate-400">{d.label}</td>
                      <td className="p-2 font-mono">{d.aVal}</td>
                      <td className="p-2 font-mono">{d.bVal}</td>
                      <td className="p-2 text-center">{d.diff ? <span className="text-amber-600 dark:text-amber-400">≠</span> : <span className="text-emerald-600 dark:text-emerald-400">=</span>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Shared vs unique prerequisites */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <h4 className="mb-1 text-xs font-semibold text-slate-500 dark:text-slate-400">{t(lang, "prerequisites")} ({a.capstoneId})</h4>
                <BulletList items={a.prerequisites} />
              </div>
              <div>
                <h4 className="mb-1 text-xs font-semibold text-slate-500 dark:text-slate-400">{t(lang, "prerequisites")} ({b.capstoneId})</h4>
                <BulletList items={b.prerequisites} />
              </div>
            </div>

            {/* Shared critical criteria */}
            <div>
              <h4 className="mb-1 text-xs font-semibold text-slate-500 dark:text-slate-400">{t(lang, "criticalCriteria")}</h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-md border border-red-200 bg-red-50/50 p-2 dark:border-red-800 dark:bg-red-950/30">
                  <div className="mb-1 text-xs font-medium text-red-700 dark:text-red-400">{a.capstoneId}</div>
                  <BulletList items={a.criticalCriteria} icon={XCircle} />
                </div>
                <div className="rounded-md border border-red-200 bg-red-50/50 p-2 dark:border-red-800 dark:bg-red-950/30">
                  <div className="mb-1 text-xs font-medium text-red-700 dark:text-red-400">{b.capstoneId}</div>
                  <BulletList items={b.criticalCriteria} icon={XCircle} />
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
        <DialogFooter className="border-t p-3">
          <Button variant="outline" onClick={onClose}>{t(lang, "closeDialog")}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─────────────────────────────── dependency graph ───────────────────────────────

function DependencyGraphDialog({ lang, open, onClose }: { lang: Lang; open: boolean; onClose: () => void }) {
  // Nodes: 13 capstones positioned by level
  const nodes = React.useMemo(() => {
    const positions: { id: string; x: number; y: number; level: number; isFinal: boolean }[] = [];
    for (const lv of LEVELS) {
      lv.capstoneIds.forEach((id, i) => {
        positions.push({ id, x: 15 + i * 30, y: 10 + (lv.levelId - 1) * 22, level: lv.levelId, isFinal: false });
      });
    }
    positions.push({ id: "CP-FINAL", x: 45, y: 100, level: 4, isFinal: true });
    return positions;
  }, []);

  // Edges: badgeDependencies (prerequisites) + final integration
  const edges = React.useMemo(() => {
    const e: { from: string; to: string; type: "prereq" | "integration" }[] = [];
    for (const c of CAPSTONES) {
      for (const dep of c.badgeDependencies) {
        const fromCap = BADGES.find((b) => b.badgeId === dep);
        if (fromCap) e.push({ from: fromCap.capstoneId, to: c.capstoneId, type: "prereq" });
      }
      if (c.capstoneId !== "CP-FINAL") {
        e.push({ from: c.capstoneId, to: "CP-FINAL", type: "integration" });
      }
    }
    return e;
  }, []);

  const getNode = (id: string) => nodes.find((n) => n.id === id);

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-hidden p-0">
        <DialogHeader className="border-b p-4">
          <div className="flex items-center gap-2">
            <Network className="h-5 w-5 text-violet-600 dark:text-violet-400" />
            <DialogTitle className="text-lg">{t(lang, "dependencyGraph")}</DialogTitle>
          </div>
          <DialogDescription className="text-xs">{t(lang, "dependencyGraphDesc")}</DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[calc(90vh-9rem)]">
          <div className="p-4">
            {/* Legend */}
            <div className="mb-4 flex flex-wrap items-center gap-4 text-xs">
              <div className="flex items-center gap-1">
                <div className="h-3 w-3 rounded-full bg-violet-200 border border-violet-500" />
                <span className="text-slate-600 dark:text-slate-400">{t(lang, "principalCapstoneNode")}</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="h-3 w-3 rounded-full bg-violet-500 border border-violet-700" />
                <span className="text-slate-600 dark:text-slate-400">{t(lang, "finalCapstoneNode")}</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="h-4 w-6 border-t border-dashed border-slate-400" />
                <span className="text-slate-600 dark:text-slate-400">{t(lang, "prerequisiteEdge")}</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="h-4 w-6 border-t-2 border-violet-500" />
                <span className="text-slate-600 dark:text-slate-400">{t(lang, "integrationEdge")}</span>
              </div>
            </div>

            {/* SVG graph */}
            <div className="overflow-x-auto rounded-md border dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
              <svg viewBox="0 0 100 120" className="w-full min-w-[600px]" style={{ height: "600px" }}>
                {/* Edges */}
                {edges.map((e, i) => {
                  const from = getNode(e.from); const to = getNode(e.to);
                  if (!from || !to) return null;
                  return (
                    <line key={i} x1={from.x} y1={from.y} x2={to.x} y2={to.y}
                      stroke={e.type === "integration" ? "rgb(139 92 246)" : "rgb(148 163 184)"}
                      strokeWidth={e.type === "integration" ? 0.4 : 0.2}
                      strokeDasharray={e.type === "prereq" ? "0.5,0.5" : "none"}
                      opacity={0.6}
                    />
                  );
                })}
                {/* Nodes */}
                {nodes.map((n) => (
                  <g key={n.id}>
                    <circle cx={n.x} cy={n.y} r={n.isFinal ? 2.5 : 1.8}
                      fill={n.isFinal ? "rgb(139 92 246)" : n.level === 4 ? "rgb(196 181 253)" : n.level === 3 ? "rgb(216 180 254)" : n.level === 2 ? "rgb(221 214 254)" : "rgb(237 233 254)"}
                      stroke="rgb(139 92 246)" strokeWidth={0.3}
                    />
                    <text x={n.x} y={n.y - 3} textAnchor="middle" fontSize="1.8" fill="currentColor" className="fill-slate-700 dark:fill-slate-300">
                      {n.id.replace("CP-", "")}
                    </text>
                  </g>
                ))}
                {/* Level labels */}
                {LEVELS.map((lv) => (
                  <text key={lv.stableId} x={2} y={10 + (lv.levelId - 1) * 22} fontSize="2" fill="currentColor" className="fill-slate-500 dark:fill-slate-400">
                    L{lv.levelId}
                  </text>
                ))}
                <text x={2} y={100} fontSize="2" fill="currentColor" className="fill-slate-500 dark:fill-slate-400">FIN</text>
              </svg>
            </div>

            {/* Table view for accessibility */}
            <details className="mt-4 text-xs">
              <summary className="cursor-pointer font-medium text-slate-600 dark:text-slate-400">{t(lang, "upstream")} / {t(lang, "downstream")} (table)</summary>
              <div className="mt-2 overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b dark:border-slate-700">
                      <th className="p-1.5 text-left font-medium text-slate-500 dark:text-slate-400">Capstone</th>
                      <th className="p-1.5 text-left font-medium text-slate-500 dark:text-slate-400">{t(lang, "upstream")}</th>
                      <th className="p-1.5 text-left font-medium text-slate-500 dark:text-slate-400">{t(lang, "downstream")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {CAPSTONES.map((c) => {
                      const up = edges.filter((e) => e.to === c.capstoneId).map((e) => e.from);
                      const down = edges.filter((e) => e.from === c.capstoneId).map((e) => e.to);
                      return (
                        <tr key={c.capstoneId} className="border-b last:border-0 dark:border-slate-700">
                          <td className="p-1.5 font-mono text-violet-600 dark:text-violet-400">{c.capstoneId}</td>
                          <td className="p-1.5 text-slate-600 dark:text-slate-400">{up.join(", ") || "—"}</td>
                          <td className="p-1.5 text-slate-600 dark:text-slate-400">{down.join(", ") || "—"}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </details>
          </div>
        </ScrollArea>
        <DialogFooter className="border-t p-3">
          <Button variant="outline" onClick={onClose}>{t(lang, "closeDialog")}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─────────────────────────────── keyboard help ───────────────────────────────

function KeyboardHelpDialog({ lang, open, onClose }: { lang: Lang; open: boolean; onClose: () => void }) {
  const shortcuts: [string, string][] = [
    ["/", t(lang, "shortcutSearch")],
    ["g c", t(lang, "shortcutCompare")],
    ["g g", t(lang, "shortcutGraph")],
    ["?", t(lang, "shortcutHelp")],
    ["d", t(lang, "shortcutDark")],
    ["l", t(lang, "shortcutLang")],
    ["Esc", t(lang, "shortcutEscape")],
  ];
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-md p-0">
        <DialogHeader className="border-b p-4">
          <DialogTitle className="text-lg">{t(lang, "keyboardShortcuts")}</DialogTitle>
          <DialogDescription className="text-xs">{t(lang, "shortcutsHelp")}</DialogDescription>
        </DialogHeader>
        <div className="p-4">
          <div className="space-y-2">
            {shortcuts.map(([key, desc]) => (
              <div key={key} className="flex items-center justify-between rounded-md border p-2 text-sm dark:border-slate-700">
                <span className="text-slate-600 dark:text-slate-400">{desc}</span>
                <kbd className="rounded border bg-slate-50 px-2 py-0.5 font-mono text-xs font-semibold dark:bg-slate-800 dark:border-slate-600">{key}</kbd>
              </div>
            ))}
          </div>
        </div>
        <DialogFooter className="border-t p-3">
          <Button variant="outline" onClick={onClose}>{t(lang, "closeDialog")}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─────────────────────────────── progress dashboard ───────────────────────────────

function ProgressDashboardDialog({ lang, open, onClose, progress, learningPath }: {
  lang: Lang; open: boolean; onClose: () => void;
  progress: LearnerProgress;
  learningPath: { capstone: typeof CAPSTONES[0]; status: string; done: number; total: number }[];
}) {
  const byLevel = LEVELS.map((lv) => {
    const caps = CAPSTONES.filter((c) => c.level === lv.levelId && c.capstoneId !== "CP-FINAL");
    const totalDone = caps.reduce((s, c) => s + (progress[c.capstoneId]?.evidenceCompleted.length ?? 0), 0);
    const totalArt = caps.reduce((s, c) => s + c.requiredArtifacts.length, 0);
    return { level: lv, pct: Math.round((totalDone / totalArt) * 100), done: totalDone, total: totalArt };
  });
  const statusCounts = {
    ready: learningPath.filter((x) => x.status === "ready").length,
    "in-progress": learningPath.filter((x) => x.status === "in-progress").length,
    completed: learningPath.filter((x) => x.status === "completed").length,
    blocked: learningPath.filter((x) => x.status === "blocked").length,
  };
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-hidden p-0">
        <DialogHeader className="border-b p-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-violet-600 dark:text-violet-400" />
            <DialogTitle className="text-lg">{t(lang, "progressDashboard")}</DialogTitle>
          </div>
          <DialogDescription className="text-xs">{t(lang, "progressDashboardDesc")}</DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[calc(90vh-8rem)]">
          <div className="space-y-4 p-4">
            {/* Status summary */}
            <section>
              <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{t(lang, "learningPath")}</h4>
              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="rounded-lg border border-emerald-300 bg-emerald-50/50 p-2 dark:border-emerald-800 dark:bg-emerald-950/20">
                  <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{statusCounts.ready}</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">{t(lang, "ready")}</div>
                </div>
                <div className="rounded-lg border border-amber-300 bg-amber-50/50 p-2 dark:border-amber-800 dark:bg-amber-950/20">
                  <div className="text-xl font-bold text-amber-600 dark:text-amber-400">{statusCounts["in-progress"]}</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">{t(lang, "inProgress")}</div>
                </div>
                <div className="rounded-lg border border-violet-300 bg-violet-50/50 p-2 dark:border-violet-800 dark:bg-violet-950/20">
                  <div className="text-xl font-bold text-violet-600 dark:text-violet-400">{statusCounts.completed}</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">{t(lang, "completed2")}</div>
                </div>
                <div className="rounded-lg border border-slate-300 bg-slate-50 p-2 dark:border-slate-700 dark:bg-slate-800/50">
                  <div className="text-xl font-bold text-slate-400">{statusCounts.blocked}</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">{t(lang, "blocked")}</div>
                </div>
              </div>
            </section>
            {/* By level */}
            <section>
              <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{t(lang, "byLevel")}</h4>
              <div className="space-y-2">
                {byLevel.map(({ level, pct, done, total }) => (
                  <div key={level.stableId} className="rounded-md border p-2 dark:border-slate-700 dark:bg-slate-800">
                    <div className="mb-1 flex items-center justify-between text-xs">
                      <span className="font-medium">{t(lang, "levelLabel")} {level.levelId} — {lang === "es" ? level.spanishName : level.name}</span>
                      <span className="font-mono text-slate-500 dark:text-slate-400">{done}/{total} · {pct}%</span>
                    </div>
                    <Progress value={pct} className="h-2" />
                  </div>
                ))}
              </div>
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
  const [dark, toggleTheme] = useTheme();
  const [openId, setOpenId] = React.useState<string | null>(null);
  const [copilotOpen, setCopilotOpen] = React.useState(false);
  const [finalOpen, setFinalOpen] = React.useState(false);
  const [sysCardId, setSysCardId] = React.useState<string | null>(null);
  const [compareOpen, setCompareOpen] = React.useState(false);
  const [graphOpen, setGraphOpen] = React.useState(false);
  const [helpOpen, setHelpOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [filter, setFilter] = React.useState<"all" | "implemented" | "missing" | "blocked" | "bookmarked">("all");
  const [progress, toggleProgress, resetProgress] = useProgress();
  const [bookmarks, toggleBookmark] = useBookmarks();
  const [sectionCompleted, toggleSection] = useSectionProgress();
  const [recent, addRecent, clearRecent] = useRecent();
  const [timeline, recordTimeline] = useTimeline();
  const streak = useStreak(timeline);
  const [achievement, dismissAchievement] = useAchievements(progress);
  const [notes, setNote] = useNotes();
  const [dashboardOpen, setDashboardOpen] = React.useState(false);
  const searchRef = React.useRef<HTMLInputElement>(null);

  const open = React.useCallback((id: string) => {
    if (id === "CP-N4-C") { setCopilotOpen(true); return; }
    if (id === "CP-FINAL") { setFinalOpen(true); return; }
    setOpenId(id);
  }, []);

  const closeAll = React.useCallback(() => {
    setOpenId(null); setCopilotOpen(false); setFinalOpen(false);
  }, []);

  // Deep-linking
  useDeepLink(open);

  // Update URL hash when opening a capstone
  const openWithHash = React.useCallback((id: string) => {
    if (typeof window !== "undefined") {
      window.location.hash = id.toLowerCase();
    }
    addRecent(id);
    open(id);
  }, [open, addRecent]);

  // Toggle evidence + record timeline
  const toggleEvidenceWithTimeline = React.useCallback((id: string, evidence: string, done: boolean) => {
    toggleProgress(id, evidence, done);
    recordTimeline(id, evidence, done);
  }, [toggleProgress, recordTimeline]);

  // Keyboard shortcuts
  useKeyboardShortcuts({
    onSearch: () => searchRef.current?.focus(),
    onCompare: () => setCompareOpen(true),
    onGraph: () => setGraphOpen(true),
    onHelp: () => setHelpOpen(true),
    onDark: toggleTheme,
    onLang: toggleLang,
  });

  // Compute overall progress from persisted state
  const totalArtifacts = CAPSTONES.reduce((s, c) => s + c.requiredArtifacts.length, 0);
  const totalDone = CAPSTONES.reduce((s, c) => s + (progress[c.capstoneId]?.evidenceCompleted.length ?? 0), 0);
  const overallPct = Math.round((totalDone / totalArtifacts) * 100);
  const totalBlockers = CAPSTONES.reduce((s, c) => s + (progress[c.capstoneId]?.blockers.length ?? 0), 0);
  const implementedCount = CAPSTONES.filter((c) => c.status === "implemented").length;
  const sectionsDone = SECTIONS.filter((s) => sectionCompleted.has(s.sectionId)).length;

  // Learning path: classify each capstone as ready/in-progress/completed/blocked
  const learningPath = React.useMemo(() => {
    return CAPSTONES.map((c) => {
      const p = progress[c.capstoneId] ?? DEFAULT_PROGRESS[c.capstoneId];
      const done = p.evidenceCompleted.length;
      const total = c.requiredArtifacts.length;
      // Check prerequisites: all badgeDependencies' capstones must be complete
      const prereqsMet = c.badgeDependencies.every((bd) => {
        const fromBadge = BADGES.find((b) => b.badgeId === bd);
        if (!fromBadge) return true;
        const fp = progress[fromBadge.capstoneId] ?? DEFAULT_PROGRESS[fromBadge.capstoneId];
        const fc = getCapstone(fromBadge.capstoneId);
        return fp.evidenceCompleted.length === fc.requiredArtifacts.length;
      });
      let status: "ready" | "in-progress" | "completed" | "blocked";
      if (done === total && total > 0) status = "completed";
      else if (done > 0) status = "in-progress";
      else if (prereqsMet) status = "ready";
      else status = "blocked";
      return { capstone: c, status, done, total };
    });
  }, [progress]);

  // Filter capstones
  const filteredCapstones = React.useMemo(() => {
    const q = search.toLowerCase().trim();
    return CAPSTONES.filter((c) => {
      if (q && !c.capstoneId.toLowerCase().includes(q) && !(lang === "es" ? c.titleEs : c.title).toLowerCase().includes(q) && !c.problemStatement.toLowerCase().includes(q)) return false;
      const p = progress[c.capstoneId] ?? DEFAULT_PROGRESS[c.capstoneId];
      if (filter === "implemented" && c.status !== "implemented") return false;
      if (filter === "missing" && p.evidenceMissing.length === 0) return false;
      if (filter === "blocked" && p.blockers.length === 0) return false;
      if (filter === "bookmarked" && !bookmarks.has(c.capstoneId)) return false;
      return true;
    });
  }, [search, filter, lang, progress, bookmarks]);

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b bg-white/95 backdrop-blur dark:bg-slate-900/95 dark:border-slate-800">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-purple-700 text-white shadow-sm">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm font-bold leading-tight">{t(lang, "appName")}</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight hidden sm:block">{t(lang, "appTagline")}</div>
            </div>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <Button size="sm" variant="ghost" className="hidden md:inline-flex focus-ring" onClick={() => document.getElementById("levels")?.scrollIntoView({ behavior: "smooth" })}>{t(lang, "levelsNav")}</Button>
            <Button size="sm" variant="ghost" className="hidden md:inline-flex focus-ring" onClick={() => document.getElementById("capstones")?.scrollIntoView({ behavior: "smooth" })}>{t(lang, "capstonesNav")}</Button>
            <Button size="sm" variant="ghost" className="hidden md:inline-flex focus-ring" onClick={() => document.getElementById("sections")?.scrollIntoView({ behavior: "smooth" })}>{t(lang, "sectionsNav")}</Button>
            <Button size="sm" variant="ghost" className="hidden lg:inline-flex focus-ring" onClick={() => document.getElementById("invariant")?.scrollIntoView({ behavior: "smooth" })}>{t(lang, "invariantNav")}</Button>
            <Button size="sm" variant="ghost" className="hidden md:inline-flex focus-ring" onClick={() => setCompareOpen(true)}>
              <GitCompare className="mr-1 h-3.5 w-3.5" />{t(lang, "compare")}
            </Button>
            <Button size="sm" variant="ghost" className="hidden md:inline-flex focus-ring" onClick={() => setGraphOpen(true)}>
              <Network className="mr-1 h-3.5 w-3.5" />{t(lang, "dependencyGraph")}
            </Button>
            <Button size="sm" variant="outline" className="focus-ring" onClick={toggleTheme} aria-label={dark ? t(lang, "lightMode") : t(lang, "darkMode")}>
              {dark ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
            </Button>
            <Button size="sm" variant="outline" className="focus-ring" onClick={toggleLang}>
              <Globe className="mr-1 h-3.5 w-3.5" />{t(lang, "languageToggle")}
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6">
        {/* Hero */}
        <section className="mb-6 overflow-hidden rounded-xl border bg-gradient-to-br from-white via-violet-50/30 to-purple-50/20 p-6 shadow-sm dark:from-slate-900 dark:via-violet-950/20 dark:to-purple-950/10 dark:border-slate-800">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-5 w-5 text-violet-600 dark:text-violet-400" />
            <h1 className="gradient-text text-2xl font-bold tracking-tight md:text-3xl">{t(lang, "appName")} — {t(lang, "capstonesNav")}</h1>
          </div>
          <p className="mt-1 max-w-3xl text-sm text-slate-600 dark:text-slate-300">{t(lang, "appTagline")}</p>
          <div className="mt-3 rounded-md border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-200">
            <Info className="mr-1 inline h-3.5 w-3.5" />{t(lang, "levelDisclaimer")}
          </div>
        </section>

        {/* Progress overview */}
        <section className="mb-6 grid gap-4 md:grid-cols-4">
          <Card className="card-hover p-4 dark:bg-slate-900 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-medium text-slate-500 dark:text-slate-400">{t(lang, "overallCompletion")}</div>
                <div className="mt-1 text-2xl font-bold text-violet-600 dark:text-violet-400">{overallPct}%</div>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-100 text-violet-600 dark:bg-violet-950/50 dark:text-violet-400">
                <TrendingUp className="h-5 w-5" />
              </div>
            </div>
            <Progress value={overallPct} className="mt-2 h-1.5" />
            <div className="mt-1 text-[11px] text-slate-400">{totalDone} {t(lang, "of")} {totalArtifacts}</div>
          </Card>
          <Card className="card-hover p-4 dark:bg-slate-900 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-medium text-slate-500 dark:text-slate-400">{t(lang, "capstonesImplemented")}</div>
                <div className="mt-1 text-2xl font-bold text-emerald-600 dark:text-emerald-400">{implementedCount}/13</div>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
                <CheckCircle2 className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-2 flex gap-1">
              {CAPSTONES.map((c) => (
                <div key={c.capstoneId} className={`h-1.5 flex-1 rounded-full ${c.status === "implemented" ? "bg-emerald-500" : "bg-slate-200 dark:bg-slate-700"}`} title={c.capstoneId} />
              ))}
            </div>
          </Card>
          <Card className="card-hover p-4 dark:bg-slate-900 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-medium text-slate-500 dark:text-slate-400">{t(lang, "sectionsCompleted")}</div>
                <div className="mt-1 text-2xl font-bold text-emerald-600 dark:text-emerald-400">{sectionsDone}/52</div>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
                <CheckSquare className="h-5 w-5" />
              </div>
            </div>
          </Card>
          <Card className="card-hover p-4 dark:bg-slate-900 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-medium text-slate-500 dark:text-slate-400">{t(lang, "streak")}</div>
                <div className="mt-1 text-2xl font-bold text-amber-600 dark:text-amber-400">{streak.count} <span className="text-sm font-normal">{t(lang, "streakDays")}</span></div>
                <div className="mt-0.5 text-[10px] text-slate-400">{streak.active ? "🔥" : ""}</div>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400">
                <Sparkles className="h-5 w-5" />
              </div>
            </div>
          </Card>
        </section>

        {/* Recently viewed + Timeline */}
        {(recent.length > 0 || timeline.length > 0) && (
          <section className="mb-6 grid gap-4 md:grid-cols-2">
            {recent.length > 0 && (
              <Card className="card-hover p-4 dark:bg-slate-900 dark:border-slate-800">
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="flex items-center gap-1 text-sm font-semibold"><BookOpen className="h-4 w-4 text-violet-600 dark:text-violet-400" />{t(lang, "recentlyViewed")}</h3>
                  <Button size="sm" variant="ghost" className="h-6 text-xs focus-ring" onClick={clearRecent}>{t(lang, "clear")}</Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recent.map((id) => {
                    const c = getCapstone(id);
                    return (
                      <button key={id} onClick={() => openWithHash(id)} className="focus-ring rounded-md border border-slate-200 bg-white px-2 py-1 text-xs font-mono hover:border-violet-300 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-violet-700" title={lang === "es" ? c.titleEs : c.title}>
                        {id}
                      </button>
                    );
                  })}
                </div>
              </Card>
            )}
            {timeline.length > 0 && (
              <Card className="card-hover p-4 dark:bg-slate-900 dark:border-slate-800">
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="flex items-center gap-1 text-sm font-semibold"><TrendingUp className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />{t(lang, "timeline")}</h3>
                </div>
                <p className="mb-2 text-xs text-slate-500 dark:text-slate-400">{t(lang, "timelineDesc")}</p>
                <div className="max-h-40 space-y-1 overflow-y-auto scrollbar-thin">
                  {timeline.slice(0, 10).map((e, i) => (
                    <div key={i} className="flex items-center justify-between rounded border p-1.5 text-xs dark:border-slate-700 dark:bg-slate-800">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                        <span className="font-mono text-violet-600 dark:text-violet-400">{e.capstoneId}</span>
                        <span className="text-slate-600 dark:text-slate-400 truncate max-w-[120px]">{e.evidence}</span>
                      </div>
                      <span className="text-slate-400 text-[10px]">{new Date(e.ts).toLocaleDateString()}</span>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </section>
        )}

        {/* Learning path */}
        <section className="mb-6 rounded-xl border bg-white p-6 shadow-sm dark:bg-slate-900 dark:border-slate-800">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h2 className="flex items-center gap-1 text-lg font-semibold"><Sparkles className="h-5 w-5 text-violet-600 dark:text-violet-400" />{t(lang, "learningPath")}</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">{t(lang, "learningPathDesc")}</p>
            </div>
            <Button size="sm" variant="outline" className="focus-ring" onClick={() => setDashboardOpen(true)}>
              <BarChart3 className="mr-1 h-3.5 w-3.5" />{t(lang, "progressDashboard")}
            </Button>
          </div>
          <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
            {learningPath.map(({ capstone: c, status, done, total }) => {
              const statusConfig = {
                ready: { color: "border-emerald-300 bg-emerald-50/50 dark:border-emerald-800 dark:bg-emerald-950/20", label: t(lang, "ready"), icon: CheckCircle2, iconColor: "text-emerald-600 dark:text-emerald-400" },
                "in-progress": { color: "border-amber-300 bg-amber-50/50 dark:border-amber-800 dark:bg-amber-950/20", label: t(lang, "inProgress"), icon: Play, iconColor: "text-amber-600 dark:text-amber-400" },
                completed: { color: "border-violet-300 bg-violet-50/50 dark:border-violet-800 dark:bg-violet-950/20", label: t(lang, "completed2"), icon: CheckCircle2, iconColor: "text-violet-600 dark:text-violet-400" },
                blocked: { color: "border-slate-300 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/50", label: t(lang, "blocked"), icon: XCircle, iconColor: "text-slate-400" },
              }[status];
              const Icon = statusConfig.icon;
              return (
                <button key={c.capstoneId} onClick={() => openWithHash(c.capstoneId)} className={`card-hover focus-ring rounded-lg border p-2 text-left ${statusConfig.color}`}>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-semibold text-slate-600 dark:text-slate-400">{c.capstoneId}</span>
                    <Icon className={`h-3.5 w-3.5 ${statusConfig.iconColor}`} />
                  </div>
                  <div className="text-xs font-medium text-slate-700 dark:text-slate-300 truncate">{lang === "es" ? c.titleEs : c.title}</div>
                  <div className="mt-1 flex items-center justify-between text-[10px]">
                    <span className={statusConfig.iconColor}>{statusConfig.label}</span>
                    <span className="text-slate-400">{done}/{total}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Tools row: share, reset progress, keyboard help */}
        <section className="mb-6 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
            <span>{t(lang, "progressSaved")}</span>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="ghost" className="focus-ring h-7 text-xs" onClick={() => {
              const data = { progress, bookmarks: [...bookmarks], sectionCompleted: [...sectionCompleted], exportedAt: new Date().toISOString() };
              const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a"); a.href = url; a.download = "pyarcana-progress.json"; a.click();
              URL.revokeObjectURL(url);
            }}>
              <Download className="mr-1 h-3 w-3" />{t(lang, "exportProgress")}
            </Button>
            <label className="inline-flex cursor-pointer items-center rounded-md px-3 h-7 text-xs font-medium hover:bg-slate-100 dark:hover:bg-slate-800 focus-ring">
              <Upload className="mr-1 h-3 w-3" />{t(lang, "importProgress")}
              <input type="file" accept=".json" className="hidden" onChange={(e) => {
                const file = e.target.files?.[0]; if (!file) return;
                const reader = new FileReader();
                reader.onload = () => {
                  try {
                    const data = JSON.parse(reader.result as string);
                    if (data.progress) { try { localStorage.setItem(PROGRESS_KEY, JSON.stringify(data.progress)); } catch {} }
                    if (data.bookmarks) { try { localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(data.bookmarks)); } catch {} }
                    if (data.sectionCompleted) { try { localStorage.setItem(SECTION_PROGRESS_KEY, JSON.stringify(data.sectionCompleted)); } catch {} }
                    window.location.reload();
                  } catch { alert(t(lang, "progressImportError")); }
                };
                reader.readAsText(file);
              }} />
            </label>
            <Button size="sm" variant="ghost" className="focus-ring h-7 text-xs" onClick={() => {
              navigator.clipboard?.writeText(window.location.href).catch(() => {});
            }}>
              <Share2 className="mr-1 h-3 w-3" />{t(lang, "shareLink")}
            </Button>
            <Button size="sm" variant="ghost" className="focus-ring h-7 text-xs" onClick={() => { if (confirm(t(lang, "resetProgress") + "?")) { resetProgress(); try { localStorage.removeItem(BOOKMARKS_KEY); localStorage.removeItem(SECTION_PROGRESS_KEY); } catch {} window.location.reload(); } }}>
              <RotateCcw className="mr-1 h-3 w-3" />{t(lang, "resetProgress")}
            </Button>
            <Button size="sm" variant="ghost" className="focus-ring h-7 text-xs" onClick={() => setHelpOpen(true)}>
              <Info className="mr-1 h-3 w-3" />{t(lang, "shortcutsHelp")}
            </Button>
          </div>
        </section>

        {/* Search + filter */}
        <section className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              ref={searchRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t(lang, "searchPlaceholder")}
              className="w-full rounded-md border border-slate-300 bg-white py-2 pl-9 pr-3 text-sm shadow-sm focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder-slate-500"
              aria-label={t(lang, "searchPlaceholder")}
            />
          </div>
          <div className="flex items-center gap-1">
            <Filter className="h-4 w-4 text-slate-400" />
            {(["all", "implemented", "missing", "blocked", "bookmarked"] as const).map((f) => (
              <Button
                key={f}
                size="sm"
                variant={filter === f ? "default" : "outline"}
                className="focus-ring"
                onClick={() => setFilter(f)}
              >
                {f === "bookmarked" && <Star className="mr-1 h-3 w-3" />}
                {t(lang, `filter${f.charAt(0).toUpperCase() + f.slice(1)}` as StringKey)}
              </Button>
            ))}
          </div>
        </section>

        {/* Cardinality invariant */}
        <section id="invariant" className="mb-8 rounded-xl border bg-white p-6 shadow-sm dark:bg-slate-900 dark:border-slate-800">
          <h2 className="mb-1 text-lg font-semibold">{t(lang, "cardinalityTitle")}</h2>
          <p className="mb-3 max-w-3xl text-sm text-slate-600 dark:text-slate-300">{t(lang, "cardinalityDesc")}</p>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
            <Card className="card-hover p-3 text-center dark:bg-slate-800 dark:border-slate-700"><div className="text-2xl font-bold text-violet-600 dark:text-violet-400">{CARDINALITY.levels}</div><div className="text-xs text-slate-500 dark:text-slate-400">{t(lang, "levelsNav")}</div></Card>
            <Card className="card-hover p-3 text-center dark:bg-slate-800 dark:border-slate-700"><div className="text-2xl font-bold text-violet-600 dark:text-violet-400">{CARDINALITY.capstonesPerLevel}</div><div className="text-xs text-slate-500 dark:text-slate-400">{t(lang, "principalCapstone")}/{t(lang, "levelLabel")}</div></Card>
            <Card className="card-hover p-3 text-center dark:bg-slate-800 dark:border-slate-700"><div className="text-2xl font-bold text-violet-600 dark:text-violet-400">{CARDINALITY.levelCapstones}</div><div className="text-xs text-slate-500 dark:text-slate-400">{t(lang, "principalCapstone")}</div></Card>
            <Card className="card-hover p-3 text-center dark:bg-slate-800 dark:border-slate-700"><div className="text-2xl font-bold text-violet-600 dark:text-violet-400">{CARDINALITY.finalCapstones}</div><div className="text-xs text-slate-500 dark:text-slate-400">{t(lang, "finalCapstone")}</div></Card>
            <Card className="card-hover p-3 text-center border-violet-300 bg-violet-50/40 dark:bg-violet-950/20 dark:border-violet-800"><div className="text-2xl font-bold text-violet-700 dark:text-violet-300">{CARDINALITY.total}</div><div className="text-xs text-slate-500 dark:text-slate-400">{t(lang, "totalCapstones")}</div></Card>
          </div>
          <div className="mt-3 rounded-md border border-slate-200 bg-slate-50 p-3 text-xs dark:border-slate-700 dark:bg-slate-800/50">
            <div className="mb-1 font-semibold text-slate-700 dark:text-slate-300">{t(lang, "n4dDecision")}</div>
            <div className="text-slate-600 dark:text-slate-400">{t(lang, "n4dFolded")}</div>
            <div className="mt-2 grid gap-1 md:grid-cols-3">
              {CARDINALITY.cpN4CSubGates.map((sg) => (
                <div key={sg.id} className="rounded border bg-white p-2 dark:bg-slate-900 dark:border-slate-700">
                  <div className="font-mono text-[11px] font-semibold text-violet-700 dark:text-violet-400">{sg.id} · {sg.sectionId}</div>
                  <div className="text-[11px] text-slate-600 dark:text-slate-400">{sg.title}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Levels + capstones */}
        <section id="levels" className="mb-8 space-y-6">
          {LEVELS.map((lv) => {
            const levelCapstones = CAPSTONES.filter((c) => c.level === lv.levelId)
              .filter((c) => filteredCapstones.some((f) => f.capstoneId === c.capstoneId));
            if (levelCapstones.length === 0) return null;
            return (
              <div key={lv.stableId} className="rounded-xl border bg-white p-6 shadow-sm dark:bg-slate-900 dark:border-slate-800">
                <div className="mb-4 flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <Pill variant="default">{t(lang, "levelLabel")} {lv.levelId}</Pill>
                      <h2 className="text-xl font-semibold">{lang === "es" ? lv.spanishName : lv.name}</h2>
                    </div>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{lv.sectionRange} · {lv.dreyfusMapping}</p>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {lv.principalGates.map((g) => (
                      <Pill key={g}><Flag className="h-3 w-3" />{g}</Pill>
                    ))}
                  </div>
                </div>
                <details className="mb-3 text-xs text-slate-600 dark:text-slate-400">
                  <summary className="cursor-pointer font-medium text-slate-700 dark:text-slate-300">{t(lang, "exitCapabilities")}</summary>
                  <ul className="mt-1.5 space-y-1">
                    {lv.exitCapabilities.map((e, i) => <li key={i} className="flex gap-2"><span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-slate-400" />{e}</li>)}
                  </ul>
                </details>
                <div id="capstones" className="grid gap-4 md:grid-cols-3">
                  {levelCapstones.map((c) => (
                    <CapstoneCard key={c.capstoneId} capstoneId={c.capstoneId} lang={lang} onOpen={openWithHash} prog={progress} bookmarked={bookmarks.has(c.capstoneId)} onBookmark={toggleBookmark} sectionsDone={SECTIONS.filter((s) => s.capstoneId === c.capstoneId && sectionCompleted.has(s.sectionId)).length} />
                  ))}
                </div>
              </div>
            );
          })}
          {filteredCapstones.length === 0 && (
            <div className="rounded-xl border bg-white p-8 text-center text-sm text-slate-500 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400">
              {t(lang, "noResults")}
            </div>
          )}

          {/* Final capstone */}
          <div className="rounded-xl border border-violet-300 bg-violet-50/40 p-6 shadow-sm dark:bg-violet-950/20 dark:border-violet-800">
            <div className="mb-4 flex items-center gap-2">
              <Crown className="h-5 w-5 text-violet-600 dark:text-violet-400" />
              <h2 className="text-xl font-semibold">{t(lang, "finalCapstone")}</h2>
              <Pill variant="warn">CP-FINAL · S52</Pill>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <CapstoneCard capstoneId="CP-FINAL" lang={lang} onOpen={openWithHash} prog={progress} bookmarked={bookmarks.has("CP-FINAL")} onBookmark={toggleBookmark} sectionsDone={SECTIONS.filter((s) => s.capstoneId === "CP-FINAL" && sectionCompleted.has(s.sectionId)).length} />
              <Card className="card-hover p-4 dark:bg-slate-900 dark:border-slate-800 md:col-span-2">
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="text-sm font-semibold">{t(lang, "finalIntegrationInterfaces")}</h3>
                  <Pill variant="ok">12 / 12</Pill>
                </div>
                <div className="grid gap-1 text-xs sm:grid-cols-2">
                  {FINAL_INTERFACES.map((f) => (
                    <div key={f.capstoneId} className="flex items-center justify-between rounded border bg-white p-1.5 dark:bg-slate-800 dark:border-slate-700">
                      <span className="font-mono text-violet-600 dark:text-violet-400">{f.capstoneId}</span>
                      <span className="text-slate-500 dark:text-slate-400 text-[11px]">{f.interfaceName}</span>
                    </div>
                  ))}
                </div>
                <Button size="sm" variant="outline" className="mt-3 w-full focus-ring" onClick={() => setSysCardId("CP-FINAL")}>
                  <FileText className="mr-1 h-3.5 w-3.5" />View system card
                </Button>
              </Card>
            </div>
          </div>
        </section>

        {/* Sections mapping — grouped by level */}
        <section id="sections" className="mb-8 rounded-xl border bg-white p-6 shadow-sm dark:bg-slate-900 dark:border-slate-800">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">{t(lang, "sectionsByLevel")}</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">S01–S52 · {SECTIONS.length} {t(lang, "sectionsNav").toLowerCase()}</p>
            </div>
          </div>
          <p className="mb-4 text-xs text-slate-500 dark:text-slate-400">Every one of the 52 canonical sections is mapped to a principal capstone and contributes theory, an I-Do demo, a We-Do practice, a You-Do transfer task, an assessment, and a final-integration reuse.</p>
          <div className="space-y-4">
            {LEVELS.map((lv) => {
              const lvSections = SECTIONS.filter((s) => s.levelId === lv.levelId);
              return (
                <div key={lv.stableId}>
                  <div className="mb-2 flex items-center gap-2">
                    <Pill variant="default">{t(lang, "levelLabel")} {lv.levelId}</Pill>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{lang === "es" ? lv.spanishName : lv.name}</span>
                    <span className="text-xs text-slate-400">{lv.sectionRange}</span>
                  </div>
                  <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
                    {lvSections.map((s) => {
                      const cap = getCapstone(s.capstoneId ?? "");
                      const sDone = sectionCompleted.has(s.sectionId);
                      return (
                        <div key={s.sectionId} className={`card-hover rounded-md border p-2 text-xs dark:border-slate-700 dark:bg-slate-800 ${sDone ? "border-emerald-300 dark:border-emerald-700 bg-emerald-50/30 dark:bg-emerald-950/20" : ""}`}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => toggleSection(s.sectionId)}
                                className="focus-ring shrink-0 rounded"
                                aria-label={sDone ? t(lang, "markIncomplete") : t(lang, "markComplete")}
                                aria-pressed={sDone}
                              >
                                {sDone
                                  ? <CheckSquare className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                                  : <Square className="h-3.5 w-3.5 text-slate-400" />}
                              </button>
                              <span className="font-mono font-semibold text-slate-500 dark:text-slate-400">{s.sectionId}</span>
                            </div>
                            <span className="font-mono text-[10px] text-violet-600 dark:text-violet-400">{s.capstoneId}</span>
                          </div>
                          <div className={`font-medium text-slate-700 dark:text-slate-200 ${sDone ? "line-through text-slate-400 dark:text-slate-500" : ""}`}>{lang === "es" ? s.spanishTitle : s.title}</div>
                          <div className="mt-1 line-clamp-2 text-slate-500 dark:text-slate-400">{s.artifactAdded}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Badges */}
        <section id="badges" className="mb-8 rounded-xl border bg-white p-6 shadow-sm dark:bg-slate-900 dark:border-slate-800">
          <h2 className="mb-3 text-lg font-semibold">{t(lang, "badgesNav")}</h2>
          <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-4">
            {BADGES.map((b) => {
              const Icon = ICONS[b.icon] ?? GraduationCap;
              return (
                <div key={b.badgeId} className="card-hover rounded-lg border p-3 dark:border-slate-700 dark:bg-slate-800">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-100 text-violet-700 dark:bg-violet-900/50 dark:text-violet-300"><Icon className="h-4 w-4" /></div>
                    <div>
                      <div className="text-xs font-semibold text-slate-800 dark:text-slate-100">{lang === "es" ? b.spanishName : b.name}</div>
                      <div className="font-mono text-[10px] text-slate-500 dark:text-slate-400">{b.badgeId} · {b.capstoneId}</div>
                    </div>
                  </div>
                  <p className="mt-1.5 text-[11px] text-slate-600 dark:text-slate-400">{b.description}</p>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      <footer className="mt-auto border-t bg-white dark:bg-slate-900 dark:border-slate-800">
        <div className="mx-auto max-w-6xl px-4 py-4 text-center text-xs text-slate-500 dark:text-slate-400">
          {t(lang, "footerNote")} · {t(lang, "appName")} {new Date().getFullYear()}
        </div>
      </footer>

      <CapstoneDialog
        capstoneId={openId}
        lang={lang}
        onClose={() => { setOpenId(null); if (typeof window !== "undefined") history.replaceState(null, "", window.location.pathname); }}
        onRunCopilot={() => { setOpenId(null); setCopilotOpen(true); }}
        onRunFinal={() => { setOpenId(null); setFinalOpen(true); }}
        onViewSystemCard={(id) => { setOpenId(null); setSysCardId(id); }}
        prog={progress}
        onToggleEvidence={toggleEvidenceWithTimeline}
        notes={notes}
        onSetNote={setNote}
      />
      <CopilotHarness lang={lang} open={copilotOpen} onClose={() => setCopilotOpen(false)} />
      <FinalIntegration lang={lang} open={finalOpen} onClose={() => setFinalOpen(false)} />
      <SystemCardDialog capstoneId={sysCardId} lang={lang} open={!!sysCardId} onClose={() => setSysCardId(null)} />
      <ComparisonDialog lang={lang} open={compareOpen} onClose={() => setCompareOpen(false)} />
      <DependencyGraphDialog lang={lang} open={graphOpen} onClose={() => setGraphOpen(false)} />
      <KeyboardHelpDialog lang={lang} open={helpOpen} onClose={() => setHelpOpen(false)} />
      <ProgressDashboardDialog lang={lang} open={dashboardOpen} onClose={() => setDashboardOpen(false)} progress={progress} learningPath={learningPath} />

      {/* Achievement toast */}
      {achievement && (
        <div className="fixed bottom-4 right-4 z-50 max-w-sm rounded-lg border border-violet-300 bg-white p-4 shadow-lg dark:border-violet-700 dark:bg-slate-900">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-100 text-violet-600 dark:bg-violet-950/50 dark:text-violet-400">
              <Crown className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-semibold text-violet-700 dark:text-violet-300">{achievement.title}</div>
              <div className="text-xs text-slate-600 dark:text-slate-400">{achievement.desc}</div>
            </div>
            <button onClick={dismissAchievement} className="focus-ring rounded p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200" aria-label={t(lang, "dismiss")}>
              <XCircle className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
