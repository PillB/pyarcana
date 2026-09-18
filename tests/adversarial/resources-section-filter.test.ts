import assert from 'node:assert/strict'
import test from 'node:test'

import {
  RESOURCES,
  filterResources,
  resourceSectionLabel,
  type ResourceFilterCriteria,
  type ResourceSection,
} from '../../src/components/course/ResourcesPage'
import { COURSE_SECTIONS } from '../../src/lib/course'

// The Resources page's section select offers each section's `id`, while every catalogue entry
// tags its sections with file-style slugs ('s01-setup', 's14-security'). Comparing the two
// directly matched nothing, so choosing any section emptied the list and no card ever showed
// its section. Section ids are also mid-rename (Batch A done, B-D pending), so these tests
// hold the page to what survives a rename: the section number.

// The same projection src/app/page.tsx passes to <ResourcesPage sections>.
const SECTIONS: ResourceSection[] = COURSE_SECTIONS.map((s) => ({
  id: s.id,
  index: s.index,
  title: s.title,
  shortTitle: s.shortTitle,
}))

const NO_FILTERS: ResourceFilterCriteria = {
  search: '',
  types: new Set(),
  levels: new Set(),
  sectionId: '',
  topic: '',
}

function sectionNumbered(sections: ResourceSection[], index: number): ResourceSection {
  const section = sections.find((s) => s.index === index)
  assert.ok(section, `no active section with index ${index}`)
  return section
}

/** Oracle, independent of the page: the catalogue ids whose tags carry this literal prefix. */
function taggedWithPrefix(prefix: string): string[] {
  return RESOURCES.filter((r) => r.sectionIds.some((tag) => tag.startsWith(prefix))).map((r) => r.id)
}

function selectSection(sections: ResourceSection[], section: ResourceSection): string[] {
  return filterResources(RESOURCES, { ...NO_FILTERS, sectionId: section.id }, sections).map((r) => r.id)
}

test('choosing S01 in the section filter keeps the resources tagged for S01', () => {
  const expected = taggedWithPrefix('s01-')
  assert.ok(expected.length > 0, 'the catalogue has no S01 resources, so this test proves nothing')

  const shown = selectSection(SECTIONS, sectionNumbered(SECTIONS, 1))

  assert.deepEqual(shown, expected)
})

test('every section the catalogue tags yields exactly its tagged resources when selected', () => {
  const taggedIndexes = new Set(
    RESOURCES.flatMap((r) => r.sectionIds.map((tag) => Number(/^s(\d{2})-/.exec(tag)?.[1]))),
  )
  assert.ok(taggedIndexes.size > 1)

  for (const index of taggedIndexes) {
    const section = sectionNumbered(SECTIONS, index)
    const prefix = `s${String(index).padStart(2, '0')}-`
    assert.deepEqual(
      selectSection(SECTIONS, section),
      taggedWithPrefix(prefix),
      `selecting S${index} (${section.id}) should show the resources tagged ${prefix}*`,
    )
  }
})

test('every resource card resolves the section named by its first tag', () => {
  for (const resource of RESOURCES) {
    const index = Number(/^s(\d{2})-/.exec(resource.sectionIds[0] ?? '')?.[1])
    assert.equal(
      resourceSectionLabel(resource, SECTIONS),
      sectionNumbered(SECTIONS, index).shortTitle,
      `${resource.id} tagged ${resource.sectionIds[0]} shows no section label`,
    )
  }
  const downloads = RESOURCES.find((r) => r.id === 'python-downloads')
  assert.ok(downloads)
  assert.equal(resourceSectionLabel(downloads, SECTIONS), sectionNumbered(SECTIONS, 1).shortTitle)
})

test('the filter and the label survive renaming a section id', () => {
  // Simulate a pending Batch B-D rename: same section number, new id.
  const renamed = SECTIONS.map((s) => (s.index === 14 ? { ...s, id: 'renamed-for-this-test' } : s))
  const before = selectSection(SECTIONS, sectionNumbered(SECTIONS, 14))
  assert.ok(before.length > 0)

  assert.deepEqual(selectSection(renamed, sectionNumbered(renamed, 14)), before)
  const tagged14 = RESOURCES.find((r) => r.sectionIds[0]?.startsWith('s14-'))
  assert.ok(tagged14)
  assert.equal(resourceSectionLabel(tagged14, renamed), sectionNumbered(renamed, 14).shortTitle)
})

test('every catalogue tag names an active section, so none can silently match nothing', () => {
  const activeIndexes = new Set(SECTIONS.map((s) => s.index))
  for (const resource of RESOURCES) {
    assert.ok(resource.sectionIds.length > 0, `${resource.id} has no section tag`)
    for (const tag of resource.sectionIds) {
      const match = /^s(\d{2})-[a-z0-9-]+$/.exec(tag)
      assert.ok(match, `${resource.id}: tag '${tag}' is not of the form sNN-slug`)
      assert.ok(activeIndexes.has(Number(match[1])), `${resource.id}: tag '${tag}' names no active section`)
    }
  }
})
