// Tipos del curso Python → Data Analyst/Scientist
// Estructura pedagógica: I Do / We Do / You Do (Gradual Release of Responsibility)

export interface LearningOutcome {
  text: string
}

export interface CodeExample {
  title?: string
  language: string
  code: string
  explanation?: string
  output?: string
}

export interface Callout {
  type: 'info' | 'warning' | 'success' | 'tip' | 'danger'
  title: string
  content: string
}

/**
 * A teaching diagram rendered next to the prose it explains.
 *
 * Figures are inline SVG components, not images: they follow the theme tokens,
 * scale without loss, and are checked by the same geometry gates as the rest of
 * the page. A figure earns its place only by removing work the prose was doing
 * badly — Mayer's coherence principle — so decorative diagrams are out of scope.
 */
export interface Figure {
  /** Key into the registry in src/components/course/figures/index.ts */
  id: string
  /** Shown under the figure. Carries the teaching point; never restates the prose. */
  caption: string
  /** What a screen-reader user needs to hear instead of seeing the figure. */
  alt: string
}

export interface TheoryBlock {
  heading: string
  paragraphs: string[]
  code?: CodeExample
  callout?: Callout
  /**
   * Optional diagram, rendered between the prose and the code so it sits with
   * the words it explains (spatial contiguity) rather than in a gallery.
   */
  figure?: Figure
  /** V3 stable id, e.g. S01-T1-A */
  subtopicId?: string
  /**
   * Optional deeper dive: rendered collapsed by default, so the main thread of
   * the section stays readable and the learner opens it only if they want it.
   * Omitted (the default) keeps the existing always-expanded behaviour, so no
   * existing block is affected.
   */
  optional?: boolean
}

export interface IDoStep {
  description: string
  /**
   * Before-code framing for novices: scenario, what to watch for, and how this
   * demo connects to the section story (Gradual Release — I Do).
   */
  preamble?: string
  code: CodeExample
  why: string
  /**
   * After-demo consolidation: principle learned, common misconception, link to We Do.
   */
  retrospective?: string
  /** V3 demo id, e.g. S01-T1-A-DEMO */
  demoId?: string
  subtopicId?: string
  /** Declared runtime: local-python | browser-pyodide */
  environment?: string
}

export interface WeDoStep {
  /**
   * Short card header (preferred). When absent, the UI falls back to a
   * truncated form of `instruction`.
   */
  title?: string
  /**
   * Newbie-facing framing shown above the task: context, goal, success criteria,
   * and constraints (Markdown/RichText).
   */
  preamble?: string
  /** Concrete task steps the learner must perform (body, not only the header). */
  instruction: string
  /** Primary hint (always present for backward compatibility) */
  hint: string
  /** V3: two progressive hints; UI shows both when present */
  hints?: string[]
  starterCode: CodeExample
  solutionCode: CodeExample
  /** V3 exercise id, e.g. S01-T1-A-E1 */
  id?: string
  subtopicId?: string
  kind?: 'guided' | 'independent' | 'transfer' | 'apply' | 'analyze' | string
  edgeCases?: string[]
  /** How the exercise is verified (tests / checklist / rubric) */
  tests?: string
  /** Immediate corrective / solution-side notes */
  feedback?: string
  /**
   * Metacognitive close after solution: what stuck, misconception repaired,
   * when to reuse (shown with the solution panel).
   */
  retrospective?: string
}

export interface YouDoProject {
  title: string
  context: string
  objectives: string[]
  requirements: string[]
  starterCode?: string
  portfolioNote: string
  rubric: { criterion: string; weight: string }[]
  /**
   * Post-project reflection / defense prompts to cement transfer and portfolio narrative.
   */
  retrospective?: string
}

export interface QuizQuestion {
  question: string
  options: string[]
  correctIndex: number
  explanation: string
}

export interface SelfCheck {
  questions: QuizQuestion[]
}

export interface Resources {
  docs: { label: string; url: string; note?: string }[]
  books: { label: string; note: string; url?: string }[]
  courses: { label: string; url: string; note?: string }[]
}

/** V3 topic evaluation package (optional; full set lives in course-state/topic_evaluations). */
export interface TopicEvaluationTask {
  id: string
  title: string
  authentic?: boolean
  deliverable: string
}

export interface TopicEvaluation {
  id: string
  topic_id?: string
  title: string
  subtopics_covered?: string[]
  tasks: TopicEvaluationTask[]
  rubric_0_3: {
    correctness: string
    robustness: string
    maintainability: string
    responsible_use: string
  }
}

export interface CourseSection {
  id: string
  index: number
  title: string
  shortTitle: string
  tagline: string
  estimatedHours: number
  level: string
  phase?: 0 | 1 | 2 | 3
  icon: string // lucide icon name
  accentColor: string // tailwind gradient classes
  learningOutcomes: LearningOutcome[]
  jobRelevance: string
  theory: TheoryBlock[]
  iDo: {
    intro: string
    steps: IDoStep[]
  }
  weDo: {
    intro: string
    steps: WeDoStep[]
  }
  youDo: YouDoProject
  selfCheck: SelfCheck
  resources: Resources
  /** Optional V3 formative topic evaluations (4 per section when mounted). */
  topicEvaluations?: TopicEvaluation[]
}

export interface CourseMeta {
  title: string
  subtitle: string
  description: string
  totalSections: number
  totalHours: number
  targetRole: string
}
