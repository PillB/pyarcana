/**
 * Sesión 0 diagrams, as data for the course's figure archetypes.
 *
 * They live here rather than in src/components/course/figures/data because every entry there must
 * hang on one of the 52 sections (tests/adversarial/figure-data-schema.test.mjs, "every data entry
 * is attached to a section"), and Sesión 0 is not a section. Same archetypes, same frame
 * (FigureShell), so the diagrams read as one family with the course's.
 *
 * Each one removes work the prose did badly (D5): a search order, a two-place relationship and a
 * dependency map are what sentences serialise worst.
 */
import type { FigureData } from '@/components/course/figures/archetypes/types'

export interface SetupFigure {
  id: string
  caption: string
  alt: string
  data: FigureData
}

export const SETUP_FIGURES: Record<string, SetupFigure> = {
  'setup-map': {
    id: 'setup-map',
    caption:
      'Cada pieza se apoya en la de abajo. Sin terminal no puedes comprobar Python, y Git necesita el editor y el correo de tu cuenta.',
    alt:
      'Pila de siete capas, de abajo arriba: terminal, Python 3.12, VS Code, cuenta de GitHub, Git, conexión con GitHub y comprobación final. Cada capa necesita la anterior.',
    data: {
      kind: 'stack',
      headline: 'Lo que vas a preparar, de abajo arriba',
      layers: [
        { label: '1. Terminal', sub: 'donde escribes órdenes', tint: 3 },
        { label: '2. Python 3.12', sub: 'ejecuta tu código', tint: 1 },
        { label: '3. VS Code', sub: 'el editor donde escribes', tint: 5 },
        { label: '4. Cuenta de GitHub', sub: 'tu espacio en internet', tint: 4 },
        { label: '5. Git', sub: 'guarda la historia de tus archivos', tint: 2 },
        { label: '6. Conexión con GitHub', sub: 'tu computadora entra a tu cuenta', tint: 4 },
        { label: '7. Comprobación final', sub: 'todo responde', tint: 2 },
      ],
      note: 'Si una capa falla, arréglala antes de subir a la siguiente.',
    },
  },
  'setup-terminal': {
    id: 'setup-terminal',
    caption:
      'La terminal no piensa: lleva tu texto a la shell, la shell busca el programa que nombraste, y la respuesta vuelve como texto.',
    alt:
      'Cuatro pasos en fila: escribes una orden y pulsas Enter; la shell la lee; el programa nombrado se ejecuta; la respuesta aparece como texto en la misma ventana.',
    data: {
      kind: 'flow',
      headline: 'Qué pasa cuando escribes una orden y pulsas Enter',
      stages: [
        { label: 'escribes', sub: 'una orden', tint: 3 },
        { label: 'la shell', sub: 'la lee', tint: 1 },
        { label: 'el programa', sub: 'se ejecuta', tint: 2 },
        { label: 'respuesta', sub: 'en texto', tint: 4 },
      ],
      outcome: 'Si la shell no encuentra el programa, la respuesta es un mensaje de error, no una ventana nueva.',
    },
  },
  'setup-path': {
    id: 'setup-path',
    caption:
      'El PATH es una lista de carpetas. La shell las revisa en orden y usa el primer programa que encuentra con ese nombre.',
    alt:
      'Diagrama de búsqueda: escribes python. La shell revisa la primera carpeta del PATH y no lo encuentra; revisa la segunda y lo encuentra, así que ejecuta ese. Si no estuviera en ninguna carpeta, la shell respondería que no reconoce el comando.',
    data: {
      kind: 'decision',
      headline: 'Cómo encuentra la shell el programa python',
      input: 'python',
      branches: [
        { test: '¿Está en la carpeta 1?', result: 'no: pasa a la siguiente', tint: 3 },
        { test: '¿Está en la carpeta 2?', result: 'sí: ejecuta ese y deja de buscar', tint: 2 },
        { test: '¿No está en ninguna?', result: 'error: «no se reconoce» o «command not found»', tint: 5 },
      ],
      note: 'Instalar Python no basta: su carpeta debe estar en esa lista. Y una terminal abierta antes de instalar guarda la lista vieja.',
    },
  },
  'setup-local-remote': {
    id: 'setup-local-remote',
    caption:
      'Tu carpeta y GitHub guardan el mismo proyecto en dos lugares. `git clone` y `git pull` traen; `git push` envía. Nada viaja solo.',
    alt:
      'Dos tablas lado a lado. A la izquierda, tu computadora: la carpeta practica-pyarcana con README.md y su historia. A la derecha, GitHub: el mismo repositorio en tu cuenta. Una flecha de izquierda a derecha dice git push; otra de derecha a izquierda dice git clone y git pull.',
    data: {
      kind: 'table',
      headline: 'Un proyecto, dos copias: la tuya y la de GitHub',
      left: {
        title: 'Tu computadora',
        head: ['practica-pyarcana/'],
        rows: [['README.md'], ['historia: 2 commits']],
        tint: 1,
      },
      right: {
        title: 'GitHub',
        head: ['tu-usuario/practica-pyarcana'],
        rows: [['README.md'], ['historia: 2 commits']],
        tint: 2,
      },
      forward: 'git push',
      backward: 'git clone / git pull',
      note: 'Un commit guarda un cambio en tu computadora. Solo git push lo copia a GitHub.',
    },
  },
}
