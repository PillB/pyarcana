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
}

export interface IDoStep {
  description: string
  code: CodeExample
  why: string
}

export interface WeDoStep {
  instruction: string
  hint: string
  starterCode: CodeExample
  solutionCode: CodeExample
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

export interface CourseSection {
  id: string
  index: number
  title: string
  shortTitle: string
  tagline: string
  estimatedHours: number
  level: 'Principiante' | 'Intermedio' | 'Avanzado' | 'Competente' | 'Senior' | 'Master'
  phase: 0 | 1 | 2 | 3
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
}

export interface CourseMeta {
  title: string
  subtitle: string
  description: string
  totalSections: number
  totalHours: number
  targetRole: string
}
