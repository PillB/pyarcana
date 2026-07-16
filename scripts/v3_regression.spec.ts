/**
 * V3 Compliance Regression Tests
 *
 * These tests verify that the course structure complies with the V3 invariant vector
 * and that the state machine infrastructure is intact.
 *
 * Run: npx playwright test scripts/v3_regression.spec.ts --reporter=list
 */
import { test, expect } from '@playwright/test'
import * as fs from 'fs/promises'
import * as path from 'path'

const COURSE_STATE_DIR = 'course-state'

// ═══════════════════════════════════════════════════════════
// TEST 1: State machine infrastructure exists
// ═══════════════════════════════════════════════════════════
test.describe('V3 State Machine Infrastructure', () => {
  test('all required JSON state files exist and validate', async () => {
    const requiredFiles = [
      'course_requirements.json',
      'section_ledger.json',
      'capstone_ledger.json',
      'issue_registry.json',
      'checkpoint.json',
    ]

    for (const file of requiredFiles) {
      const filePath = path.join(COURSE_STATE_DIR, file)
      const content = await fs.readFile(filePath, 'utf-8')
      expect(content.length, `${file} should not be empty`).toBeGreaterThan(10)

      // Validate JSON
      const data = JSON.parse(content)
      expect(data.version, `${file} should have version`).toBeDefined()
      expect(data.generated_at, `${file} should have generated_at`).toBeDefined()
    }
  })

  test('invariant vector in course_requirements.json matches canonical values', async () => {
    const content = await fs.readFile(
      path.join(COURSE_STATE_DIR, 'course_requirements.json'),
      'utf-8'
    )
    const data = JSON.parse(content)
    const iv = data.invariant_vector

    // Canonical invariant vector from V3 prompt
    expect(iv.levels).toBe(4)
    expect(iv.sections).toBe(52)
    expect(iv.sections_per_level).toBe(13)
    expect(iv.topics_per_section).toBe(4)
    expect(iv.subtopics_per_topic).toBe(2)
    expect(iv.subtopics).toBe(416)
    expect(iv.demos_per_subtopic).toBe(1)
    expect(iv.demos).toBe(416)
    expect(iv.student_exercises_per_subtopic).toBe(3)
    expect(iv.student_exercises).toBe(1248)
    expect(iv.topic_evaluations).toBe(208)
    expect(iv.variants_per_subtopic).toBe(3)
    expect(iv.exam_variants).toBe(1248)
    expect(iv.section_exams).toBe(52)
    expect(iv.section_project_increments).toBe(52)
    expect(iv.level_capstones).toBe(12)
    expect(iv.final_capstones).toBe(1)
    expect(iv.capstones_total).toBe(13)
  })
})

// ═══════════════════════════════════════════════════════════
// TEST 2: Section ledger has 52 entries
// ═══════════════════════════════════════════════════════════
test.describe('Section Ledger Integrity', () => {
  test('section_ledger.json has exactly 52 section entries', async () => {
    const content = await fs.readFile(
      path.join(COURSE_STATE_DIR, 'section_ledger.json'),
      'utf-8'
    )
    const data = JSON.parse(content)

    expect(data.sections).toHaveLength(52)
    expect(data.summary.total_sections).toBe(52)
  })

  test('every section has required fields', async () => {
    const content = await fs.readFile(
      path.join(COURSE_STATE_DIR, 'section_ledger.json'),
      'utf-8'
    )
    const data = JSON.parse(content)

    for (const section of data.sections) {
      expect(section.id, `Section should have id`).toBeDefined()
      expect(section.section_id, `Section should have section_id`).toBeDefined()
      expect(section.level, `Section ${section.id} should have level`).toBeGreaterThanOrEqual(1)
      expect(section.level, `Section ${section.id} level should be ≤ 4`).toBeLessThanOrEqual(4)
      expect(section.state, `Section ${section.id} should have state`).toBeDefined()
      expect(section.next_phase, `Section ${section.id} should have next_phase`).toBeDefined()
    }
  })

  test('sections are numbered S01 through S52', async () => {
    const content = await fs.readFile(
      path.join(COURSE_STATE_DIR, 'section_ledger.json'),
      'utf-8'
    )
    const data = JSON.parse(content)

    for (let i = 0; i < 52; i++) {
      const expectedId = `S${String(i + 1).padStart(2, '0')}`
      expect(data.sections[i].id, `Section ${i} should be ${expectedId}`).toBe(expectedId)
    }
  })

  test('levels are correctly distributed (13 sections per level)', async () => {
    const content = await fs.readFile(
      path.join(COURSE_STATE_DIR, 'section_ledger.json'),
      'utf-8'
    )
    const data = JSON.parse(content)

    const levelCounts = { 1: 0, 2: 0, 3: 0, 4: 0 }
    for (const section of data.sections) {
      levelCounts[section.level as 1 | 2 | 3 | 4]++
    }
    expect(levelCounts[1]).toBe(13)
    expect(levelCounts[2]).toBe(13)
    expect(levelCounts[3]).toBe(13)
    expect(levelCounts[4]).toBe(13)
  })
})

// ═══════════════════════════════════════════════════════════
// TEST 3: Capstone ledger has 13 capstones + 5 checkpoints
// ═══════════════════════════════════════════════════════════
test.describe('Capstone Ledger Integrity', () => {
  test('capstone_ledger.json has exactly 13 capstones', async () => {
    const content = await fs.readFile(
      path.join(COURSE_STATE_DIR, 'capstone_ledger.json'),
      'utf-8'
    )
    const data = JSON.parse(content)

    expect(data.capstones).toHaveLength(13)
    expect(data.summary.total_capstones).toBe(13)
  })

  test('capstone gates match V3 specification', async () => {
    const content = await fs.readFile(
      path.join(COURSE_STATE_DIR, 'capstone_ledger.json'),
      'utf-8'
    )
    const data = JSON.parse(content)

    const expectedGates = {
      'CP-N1-A': 'S04',
      'CP-N1-B': 'S08',
      'CP-N1-C': 'S13',
      'CP-N2-A': 'S17',
      'CP-N2-B': 'S21',
      'CP-N2-C': 'S26',
      'CP-N3-A': 'S30',
      'CP-N3-B': 'S34',
      'CP-N3-C': 'S39',
      'CP-N4-A': 'S43',
      'CP-N4-B': 'S47',
      'CP-N4-C': 'S51',
      'CP-FINAL': 'S52',
    }

    for (const capstone of data.capstones) {
      expect(capstone.id, `Capstone ${capstone.id} should exist`).toBeDefined()
      expect(capstone.gate_section, `Capstone ${capstone.id} should have gate_section`).toBe(expectedGates[capstone.id])
      expect(capstone.name, `Capstone ${capstone.id} should have name`).toBeDefined()
      expect(capstone.evidence_required, `Capstone ${capstone.id} should have evidence_required`).toBeDefined()
    }
  })

  test('transversal checkpoints match V3 specification', async () => {
    const content = await fs.readFile(
      path.join(COURSE_STATE_DIR, 'capstone_ledger.json'),
      'utf-8'
    )
    const data = JSON.parse(content)

    expect(data.transversal_checkpoints).toHaveLength(5)

    const expectedCheckpoints = {
      'CF-1': 'S13',
      'CF-2': 'S26',
      'CF-3': 'S39',
      'CF-4': 'S47',
      'CF-5': 'S51',
    }

    for (const cp of data.transversal_checkpoints) {
      expect(cp.id, `Checkpoint ${cp.id} should exist`).toBeDefined()
      expect(cp.gate_section, `Checkpoint ${cp.id} should have gate_section`).toBe(expectedCheckpoints[cp.id])
    }
  })
})

// ═══════════════════════════════════════════════════════════
// TEST 4: Issue registry tracks known issues
// ═══════════════════════════════════════════════════════════
test.describe('Issue Registry Integrity', () => {
  test('issue_registry.json has issues with required fields', async () => {
    const content = await fs.readFile(
      path.join(COURSE_STATE_DIR, 'issue_registry.json'),
      'utf-8'
    )
    const data = JSON.parse(content)

    expect(data.issues.length, 'Should have at least 1 issue').toBeGreaterThan(0)
    expect(data.summary.total_issues, 'Summary should match').toBe(data.issues.length)

    for (const issue of data.issues) {
      expect(issue.issue_id, `Issue should have issue_id`).toBeDefined()
      expect(issue.severity, `Issue ${issue.issue_id} should have severity`).toMatch(/P[0-3]/)
      expect(issue.status, `Issue ${issue.issue_id} should have status`).toMatch(/open|fixed|blocked|accepted/)
      expect(issue.observed_evidence, `Issue ${issue.issue_id} should have observed_evidence`).toBeDefined()
      expect(issue.expected, `Issue ${issue.issue_id} should have expected`).toBeDefined()
    }
  })

  test('no P0 issues should be open (ship-blocker)', async () => {
    const content = await fs.readFile(
      path.join(COURSE_STATE_DIR, 'issue_registry.json'),
      'utf-8'
    )
    const data = JSON.parse(content)

    const openP0 = data.issues.filter((i: any) => i.severity === 'P0' && i.status === 'open')
    expect(openP0, `Should have 0 open P0 issues, got ${openP0.length}`).toHaveLength(0)
  })
})

// ═══════════════════════════════════════════════════════════
// TEST 5: Checkpoint is valid and resumable
// ═══════════════════════════════════════════════════════════
test.describe('Checkpoint Integrity', () => {
  test('checkpoint.json has required fields for resumption', async () => {
    const content = await fs.readFile(
      path.join(COURSE_STATE_DIR, 'checkpoint.json'),
      'utf-8'
    )
    const data = JSON.parse(content)

    expect(data.current_section, 'Should have current_section').toBeDefined()
    expect(data.current_phase, 'Should have current_phase').toBeDefined()
    expect(data.prompt_version, 'Should have prompt_version').toBe('3.1')
    expect(data.model, 'Should have model').toBe('glm-5.2')
    expect(data.next_single_action, 'Should have next_single_action').toBeDefined()
    expect(data.resume_preconditions, 'Should have resume_preconditions').toBeInstanceOf(Array)
    expect(data.decisions, 'Should have decisions').toBeInstanceOf(Array)
    expect(data.files_changed, 'Should have files_changed').toBeInstanceOf(Array)
    expect(data.open_issues, 'Should have open_issues').toBeInstanceOf(Array)
  })
})

// ═══════════════════════════════════════════════════════════
// TEST 6: V3 roadmap file exists and has 52 sections
// ═══════════════════════════════════════════════════════════
test.describe('V3 Roadmap File Integrity', () => {
  test('V3 roadmap file exists and has 52 section headers', async () => {
    const content = await fs.readFile(
      'upload/learning_roadmap_52_V3.md',
      'utf-8'
    )

    // Count ### S## headers
    const sectionHeaders = content.match(/^### S\d+ —/gm) || []
    expect(sectionHeaders, `V3 roadmap should have 52 section headers`).toHaveLength(52)
  })

  test('V3 roadmap has 4 level headers', async () => {
    const content = await fs.readFile(
      'upload/learning_roadmap_52_V3.md',
      'utf-8'
    )

    const levelHeaders = content.match(/^## Nivel \d —/gm) || []
    expect(levelHeaders, `V3 roadmap should have 4 level headers`).toHaveLength(4)
  })

  test('V3 roadmap has 13 capstone entries in table', async () => {
    const content = await fs.readFile(
      'upload/learning_roadmap_52_V3.md',
      'utf-8'
    )

    // Count CP- entries in the capstone table
    const capstoneEntries = content.match(/CP-N\d-[ABC]|CP-FINAL/g) || []
    // Should appear at least 13 times (once in table, possibly more in text)
    const uniqueCapstones = new Set(capstoneEntries)
    expect(uniqueCapstones.size, `V3 roadmap should reference 13 unique capstones`).toBe(13)
  })
})
