export interface ResumeGroup {
  id: string
  title: string
  stepIds: readonly string[]
}
/** First unfinished visible group; independent of historical awards and scroll coordinates. */
export function nextLearningGroup(groups: readonly ResumeGroup[], done: readonly string[]): ResumeGroup | null {
  const completed = new Set(done)
  return groups.find(g => g.stepIds.some(id => !completed.has(id))) ?? null
}
