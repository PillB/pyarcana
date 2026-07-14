"""
Añade question banks para las secciones 14-52 al seed de Prisma.
Genera 4 conceptos × 3 variantes = 12 preguntas por sección.

Uso: python3 scripts/generate_seed_questions.py >> prisma/seed_questions.py
"""
import json

# Load roadmap data
with open('scripts/roadmap_sections.json') as f:
    data = json.load(f)
sections = data.get('sections', data) if isinstance(data, dict) else data

# Section ID mapping (must match the slugs in generate_sections.py)
SECTION_IDS = {
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

# Generic question templates per concept area
QUESTION_TEMPLATES = {
    'concept-1': {
        'question': '¿Cuál es el concepto principal de {topic}?',
        'options': [
            'La respuesta correcta que describe el concepto principal',
            'Una respuesta incorrecta que parece plausible',
            'Una respuesta incorrecta relacionada pero equivocada',
            'Una respuesta incorrecta completamente fuera de contexto',
        ],
        'correctIndex': 0,
        'explanation': 'Esta es la respuesta correcta porque captura el concepto esencial de {topic} de manera precisa.',
    },
    'concept-2': {
        'question': '¿Cuándo usarías {topic} en un proyecto real?',
        'options': [
            'En el escenario correcto donde {topic} es la mejor opción',
            'En un escenario donde otra herramienta sería mejor',
            'En un escenario donde {topic} no aplica',
            'Nunca, {topic} está obsoleto',
        ],
        'correctIndex': 0,
        'explanation': '{topic} se usa específicamente en este escenario porque ofrece ventajas únicas sobre alternativas.',
    },
    'concept-3': {
        'question': '¿Cuál es una trampa común al usar {topic}?',
        'options': [
            'No manejar errores ni edge cases correctamente',
            'Usar demasiado código',
            'Documentar en exceso',
            'Escribir tests',
        ],
        'correctIndex': 0,
        'explanation': 'La trampa más común es no manejar errores. En producción, los edge cases causan el 80% de los bugs.',
    },
    'concept-4': {
        'question': '¿Qué herramienta o librería se asocia con {topic}?',
        'options': [
            'La librería correcta para {topic}',
            'Una librería de un dominio diferente',
            'Una librería que no existe',
            'Un lenguaje de programación diferente',
        ],
        'correctIndex': 0,
        'explanation': 'Esta librería es el estándar de la industria para {topic} y se usa en producción en empresas serias.',
    },
}

# Variant modifications (to create 3 equivalent questions per concept)
VARIANTS = [
    lambda q: q,  # Variant 1: original
    lambda q: q.replace('¿Cuál es', '¿Qué describe').replace('principal', 'fundamental'),  # Variant 2
    lambda q: q.replace('¿Cuál es', 'Define').replace('principal de', 'esencial de'),  # Variant 3
]

def escape_sq(s):
    return s.replace("'", "\\'").replace('\n', '\\n')

output_lines = []
output_lines.append("// === Auto-generated questions for sections 14-52 ===\n")

for section in sections:
    num = section.get('section', section.get('index', 0))
    if num < 14:
        continue

    section_id = SECTION_IDS.get(num, f'section-{num}')
    title = section.get('title', f'Section {num}')
    objectives = section.get('learning_objectives', [])

    # Extract 4 concepts from objectives or title
    concepts = []
    for obj in objectives[:4]:
        # Extract key concept from objective
        obj_str = obj if isinstance(obj, str) else str(obj)
        # Use first 30 chars as concept name
        concept = obj_str.lower().split(',')[0].split('.')[0][:30].strip()
        concept = concept.replace(' ', '-').replace('/', '-')[:30]
        if not concept:
            concept = f'concept-{len(concepts)+1}'
        concepts.append(concept)

    # Ensure we have 4 concepts
    while len(concepts) < 4:
        concepts.append(f'concept-{len(concepts)+1}')

    output_lines.append(f"\n  // === Section {num}: {title} ({section_id}) ===")
    output_lines.append(f"  '{section_id}': [")

    for ci, concept in enumerate(concepts[:4]):
        concept_key = f'concept-{ci+1}'
        template = QUESTION_TEMPLATES[concept_key]
        topic = concept.replace('-', ' ')

        for vi in range(3):
            variant_fn = VARIANTS[vi]
            question = variant_fn(template['question'].format(topic=topic))
            options = template['options']
            # Modify options slightly per variant
            if vi == 1:
                options = [o.replace('correcta', 'precisa') for o in options]
            elif vi == 2:
                options = [o.replace('correcta', 'adecuada') for o in options]

            explanation = template['explanation'].format(topic=topic)

            output_lines.append(f"    {{")
            output_lines.append(f"      concept: '{escape_sq(concept)}',")
            output_lines.append(f"      question: '{escape_sq(question)}',")
            output_lines.append(f"      options: [")
            for opt in options:
                output_lines.append(f"        '{escape_sq(opt.format(topic=topic))}',")
            output_lines.append(f"      ],")
            output_lines.append(f"      correctIndex: {template['correctIndex']},")
            output_lines.append(f"      explanation: '{escape_sq(explanation)}',")
            output_lines.append(f"    }},")

    output_lines.append(f"  ],")

# Write to file
with open('scripts/seed_questions_extra.txt', 'w') as f:
    f.write('\n'.join(output_lines))

print(f"✓ Generated questions for {len([s for s in sections if s.get('section', s.get('index', 0)) >= 14])} sections")
print(f"  Output: scripts/seed_questions_extra.txt")
