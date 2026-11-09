/**
 * Keyboard policy for the code editor textarea (WCAG 2.1.2, No Keyboard Trap).
 *
 * Tab inserts four spaces, because a learner writes Python with indentation. A textarea that
 * also keeps Tab for itself traps keyboard focus, so two ways out stay open:
 *   - Shift+Tab always moves focus to the previous control;
 *   - Escape arms the editor, and the next Tab moves focus to the next control.
 * Any other key disarms it.
 */
export type EditorKeyAction = 'indent' | 'leave' | 'none'

export interface EditorKeyState {
  action: EditorKeyAction
  escapeArmed: boolean
}

export function resolveEditorKey(
  key: string,
  shiftKey: boolean,
  escapeArmed: boolean,
): EditorKeyState {
  if (key === 'Escape') return { action: 'none', escapeArmed: true }
  if (key !== 'Tab') return { action: 'none', escapeArmed: false }
  if (shiftKey || escapeArmed) return { action: 'leave', escapeArmed: false }
  return { action: 'indent', escapeArmed: false }
}
