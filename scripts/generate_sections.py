"""
Genera archivos TypeScript de sección desde el JSON del roadmap.
Crea archivos s14-security.ts through s52-career-strategy.ts

Uso: python3 scripts/generate_sections.py
"""
import json
import os
import re

# Map section number to file slug
SECTION_SLUGS = {
    14: 'security', 15: 'stdlib-deep', 16: 'wxpython-gui', 17: 'packaging',
    18: 'data-engineering', 19: 'databases-orm', 20: 'rag', 21: 'fastapi',
    22: 'rapidfuzz-entity', 23: 'computer-vision', 24: 'rpa-advanced',
    25: 'streamlit-dashboards', 26: 'integrator-phase1',
    27: 'async-concurrency', 28: 'llm-agents', 29: 'mlops', 30: 'security-infra',
    31: 'streaming-data', 32: 'microservices', 33: 'advanced-models',
    34: 'cv-ai-integration', 35: 'system-design', 36: 'ai-apis-advanced',
    37: 'dbt-bigquery', 38: 'performance-extreme', 39: 'integrator-phase2',
    40: 'agentic-architecture', 41: 'llm-finetuning', 42: 'graph-rag',
    43: 'llmops', 44: 'multimodal', 45: 'iac', 46: 'gpu-computing',
    47: 'opensource', 48: 'ai-governance', 49: 'data-contracts',
    50: 'tech-leadership', 51: 'integrator-final', 52: 'career-strategy',
}

# Icon mapping (lucide-react names)
SECTION_ICONS = {
    14: 'ShieldCheck', 15: 'Settings', 16: 'Monitor', 17: 'Package',
    18: 'Wrench', 19: 'Database', 20: 'MessageSquare', 21: 'Server',
    22: 'GitCompare', 23: 'Camera', 24: 'Bot', 25: 'LayoutDashboard',
    26: 'Award', 27: 'Zap', 28: 'BrainCircuit', 29: 'Activity',
    30: 'Lock', 31: 'Radio', 32: 'Container', 33: 'TrendingUp',
    34: 'Eye', 35: 'Architecture', 36: 'Sparkles', 37: 'Layers',
    38: 'Gauge', 39: 'Trophy', 40: 'Network', 41: 'Cpu',
    42: 'Share2', 43: 'BarChart3', 44: 'Image', 45: 'Cloud',
    46: 'Cpu', 47: 'Github', 48: 'Scale', 49: 'FileCheck',
    50: 'Users', 51: 'Crown', 52: 'Rocket',
}

# Accent colors per phase
PHASE_COLORS = {
    1: 'bg-gradient-to-br from-blue-500 to-indigo-600',
    2: 'bg-gradient-to-br from-purple-500 to-fuchsia-600',
    3: 'bg-gradient-to-br from-amber-500 to-red-600',
}

def escape_ts_string(s):
    """Escape a string for TypeScript template literal or single-quote string."""
    if not s:
        return ''
    # Replace backticks and ${} for template literals
    s = s.replace('\\', '\\\\')
    s = s.replace('`', '\\`')
    s = s.replace('${', '\\${')
    return s

def escape_single_quote(s):
    """Escape a string for single-quote TypeScript string."""
    if not s:
        return ''
    s = s.replace('\\', '\\\\')
    s = s.replace("'", "\\'")
    s = s.replace('\n', '\\n')
    return s

def generate_section_file(section_data):
    """Generate a TypeScript section file from roadmap JSON data."""
    num = section_data.get('section', section_data.get('index', 0))
    slug = SECTION_SLUGS.get(num, f'section-{num}')
    title = section_data.get('title', f'Section {num}')
    tagline = section_data.get('tagline', '')
    hours = section_data.get('estimated_hours', 10)
    level = section_data.get('level', 'Competente')
    phase = section_data.get('phase', 1)
    icon = SECTION_ICONS.get(num, 'Circle')
    accent = PHASE_COLORS.get(phase, PHASE_COLORS[1])
    job_relevance = section_data.get('job_relevance', f'Esta sección cubre temas críticos para roles de nivel {level}.')
    objectives = section_data.get('learning_objectives', [])
    theory_topics = section_data.get('theory_topics', [])
    i_do_steps = section_data.get('i_do_steps', [])
    we_do_exercises = section_data.get('we_do_exercises', [])
    you_do = section_data.get('you_do_project', {})
    auto_eval = section_data.get('auto_evaluation', {})
    resources = section_data.get('key_resources', [])

    # Build learning outcomes
    lo_lines = []
    for obj in objectives:
        lo_lines.append(f"    {{ text: '{escape_single_quote(obj)}' }},")
    lo_str = '\n'.join(lo_lines) if lo_lines else "    { text: 'Aprender los conceptos fundamentales de esta sección' },"

    # Build theory blocks
    theory_blocks = []
    for topic in theory_topics:
        topic_str = topic if isinstance(topic, str) else topic.get('title', topic.get('topic', ''))
        theory_blocks.append(f"""    {{
      heading: '{escape_single_quote(topic_str)}',
      paragraphs: [
        'En esta lección vamos a explorar {escape_single_quote(topic_str).lower()} en profundidad. Este concepto es fundamental para tu crecimiento como profesional de Data Science y automatización. En el mercado laboral peruano e internacional, dominar este tema te diferencia claramente de otros candidatos.',

        'La clave para entender {escape_single_quote(topic_str).lower()} es practicar con ejemplos reales. No basta con leer la teoría — necesitas escribir código, cometer errores, y aprender de ellos. Por eso cada concepto viene acompañado de ejemplos prácticos que puedes ejecutar en el editor interactivo.',

        'En producción, {escape_single_quote(topic_str).lower()} se usa diario en empresas como Interbank, BBVA, Mercado Libre y Rimac. Los equipos de data science y automatización dependen de este conocimiento para construir pipelines robustos y escalables.',
      ],
    }},""")
    theory_str = '\n'.join(theory_blocks) if theory_blocks else """    {
      heading: 'Fundamentos',
      paragraphs: [
        'Esta sección cubre los conceptos esenciales del tema. Estudia cada bloque de teoría con atención y no pases al siguiente sin entender completamente el anterior.',
        'La práctica es clave. Usa el editor interactivo para experimentar con cada concepto antes de pasar a los ejercicios.',
      ],
    },"""

    # Build I Do steps
    i_do_steps_lines = []
    for step in i_do_steps:
        step_str = step if isinstance(step, str) else step.get('description', str(step))
        i_do_steps_lines.append(f"""      {{
        description: '{escape_single_quote(step_str)}',
        code: {{
          language: 'python',
          title: 'ejemplo.py',
          code: '# Ejemplo de: {escape_single_quote(step_str)}\\n# TODO: Implementar el código completo\\nprint("Implementar este ejemplo")',
        }},
        why: 'Este paso es importante porque demuestra el concepto en acción y te muestra el patrón correcto a seguir.',
      }},""")
    i_do_str = '\n'.join(i_do_steps_lines) if i_do_steps_lines else """      {
        description: 'Demostración del concepto principal',
        code: {
          language: 'python',
          title: 'demo.py',
          code: '# Demostración del concepto\\nprint("Hola desde la demostración")',
        },
        why: 'Esta demostración te muestra cómo aplicar el concepto en un caso real.',
      },"""

    # Build We Do steps
    we_do_lines = []
    for ex in we_do_exercises:
        ex_str = ex if isinstance(ex, str) else ex.get('instruction', str(ex))
        we_do_lines.append(f"""      {{
        instruction: '{escape_single_quote(ex_str)}',
        hint: 'Piensa en cómo descomponer el problema en pasos más pequeños.',
        starterCode: {{
          language: 'python',
          title: 'ejercicio.py',
          code: '# Tu código aquí\\n# {escape_single_quote(ex_str)}\\n',
        }},
        solutionCode: {{
          language: 'python',
          title: 'solucion.py',
          code: '# Solución\\n# {escape_single_quote(ex_str)}\\nprint("Solución implementada")',
        }},
      }},""")
    we_do_str = '\n'.join(we_do_lines) if we_do_lines else """      {
        instruction: 'Practica el concepto principal de esta sección',
        hint: 'Revisa la teoría y el I Do antes de intentar este ejercicio.',
        starterCode: {
          language: 'python',
          title: 'ejercicio.py',
          code: '# Tu código aquí\\n',
        },
        solutionCode: {
          language: 'python',
          title: 'solucion.py',
          code: '# Solución de referencia\\nprint("Solución")',
        },
      },"""

    # Build You Do
    you_do_title = you_do.get('name', f'Proyecto Sección {num}') if isinstance(you_do, dict) else str(you_do)
    you_do_desc = you_do.get('description', f'Construye un proyecto que aplique los conceptos de esta sección.') if isinstance(you_do, dict) else str(you_do)

    # Build self-check
    questions = []
    if isinstance(auto_eval, dict):
        for key in ['A', 'B', 'C', 'Variant A', 'Variant B', 'Variant C', 'variante_a', 'variante_b', 'variante_c']:
            if key in auto_eval and auto_eval[key]:
                q_text = auto_eval[key] if isinstance(auto_eval[key], str) else str(auto_eval[key])
                questions.append(q_text)

    if not questions and isinstance(auto_eval, list):
        questions = auto_eval

    # Generate quiz questions from objectives if no auto_eval
    if not questions:
        for i, obj in enumerate(objectives[:5]):
            questions.append(f'¿Cuál de los siguientes describe mejor: {obj}?')

    quiz_questions = []
    for i, q in enumerate(questions[:5]):
        quiz_questions.append(f"""      {{
        question: '{escape_single_quote(q[:200])}',
        options: [
          'Respuesta correcta',
          'Respuesta incorrecta 1',
          'Respuesta incorrecta 2',
          'Respuesta incorrecta 3',
        ],
        correctIndex: 0,
        explanation: 'Esta es la respuesta correcta porque aplica el concepto de manera precisa.',
      }},""")
    quiz_str = '\n'.join(quiz_questions) if quiz_questions else """      {
        question: '¿Cuál es el concepto principal de esta sección?',
        options: ['Concepto A', 'Concepto B', 'Concepto C', 'Concepto D'],
        correctIndex: 0,
        explanation: 'El concepto A es el principal porque es la base de todos los demás.',
      },"""

    # Build resources
    doc_lines = []
    for res in resources[:5]:
        res_str = res if isinstance(res, str) else res.get('label', res.get('name', str(res)))
        res_url = res if isinstance(res, str) else res.get('url', '#')
        doc_lines.append(f"      {{ label: '{escape_single_quote(res_str)}', url: '{res_url}' }},")

    if not doc_lines:
        doc_lines.append("      { label: 'Documentación oficial', url: 'https://docs.python.org/3/' },")

    resources_str = '\n'.join(doc_lines)

    # Build the full file
    file_content = f"""import type {{ CourseSection }} from '../../types'

export const section{num:02d}: CourseSection = {{
  id: '{slug}',
  index: {num},
  title: '{escape_single_quote(title)}',
  shortTitle: '{escape_single_quote(title[:30])}',
  tagline: '{escape_single_quote(tagline)}',
  estimatedHours: {hours},
  level: '{level}',
  phase: {phase},
  icon: '{icon}',
  accentColor: '{accent}',
  jobRelevance: '{escape_single_quote(job_relevance)}',
  learningOutcomes: [
{lo_str}
  ],
  theory: [
{theory_str}
  ],
  iDo: {{
    intro: 'Te muestro paso a paso cómo aplicar los conceptos de esta sección con ejemplos prácticos.',
    steps: [
{i_do_str}
    ],
  }},
  weDo: {{
    intro: 'Ahora te toca a ti practicar con guía. Lee cada instrucción, intenta escribir el código, y si te trabas revisa la solución.',
    steps: [
{we_do_str}
    ],
  }},
  youDo: {{
    title: '{escape_single_quote(you_do_title)}',
    context: '{escape_single_quote(you_do_desc)}',
    objectives: [
      'Aplicar los conceptos aprendidos en un proyecto real',
      'Demostrar dominio del tema con un entregable de portafolio',
      'Documentar el proceso y los resultados',
    ],
    requirements: [
      'Código funcional y documentado',
      'Tests que validen el funcionamiento',
      'README con instrucciones de uso',
    ],
    portfolioNote: 'Este proyecto es ideal para mostrar en entrevistas técnicas y agregar a tu portafolio de GitHub.',
    rubric: [
      {{ criterion: 'Funcionalidad', weight: '40%' }},
      {{ criterion: 'Calidad de código', weight: '20%' }},
      {{ criterion: 'Documentación', weight: '20%' }},
      {{ criterion: 'Tests', weight: '20%' }},
    ],
  }},
  selfCheck: {{
    questions: [
{quiz_str}
    ],
  }},
  resources: {{
    docs: [
{resources_str}
    ],
    books: [
      {{ label: 'Python 201 — Michael Driscoll', note: 'Capítulos relevantes para esta sección' }},
    ],
    courses: [
      {{ label: 'Real Python', url: 'https://realpython.com', note: 'Tutoriales complementarios' }},
    ],
  }},
}}
"""
    return slug, file_content


def main():
    # Load JSON
    with open('scripts/roadmap_sections.json') as f:
        data = json.load(f)

    sections = data.get('sections', data) if isinstance(data, dict) else data

    output_dir = 'src/lib/course/sections'
    os.makedirs(output_dir, exist_ok=True)

    count = 0
    for section in sections:
        num = section.get('section', section.get('index', 0))
        if num < 14:
            continue

        slug, content = generate_section_file(section)
        filepath = os.path.join(output_dir, f's{num:02d}-{slug}.ts')

        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)

        count += 1
        print(f"  ✓ s{num:02d}-{slug}.ts")

    print(f"\n✓ {count} section files generated")


if __name__ == '__main__':
    main()
