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

export interface TheoryBlock {
  heading: string
  paragraphs: string[]
  code?: CodeExample
  callout?: Callout
  /** V3 stable id, e.g. S01-T1-A */
  subtopicId?: string
}

export interface IDoStep {
  description: string
  code: CodeExample
  why: string
  /** V3 demo id, e.g. S01-T1-A-DEMO */
  demoId?: string
  subtopicId?: string
  /** Declared runtime: local-python | browser-pyodide */
  environment?: string
}

export interface WeDoStep {
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
  feedback?: string
}

export interface YouDoProject {
  title: string
  context: string
  objectives: string[]
  requirements: string[]
  starterCode?: string
  portfolioNote: string
  rubric: { criterion: string; weight: string }[]
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
  books: { label: string; note: string }[]
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
