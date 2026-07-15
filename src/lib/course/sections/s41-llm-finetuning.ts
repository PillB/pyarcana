import type { CourseSection } from '../../types'

export const section41: CourseSection = {
  id: 'llm-finetuning',
  index: 41,
  title: 'Fine-Tuning de LLMs (QLoRA, LoRA, SFT)',
  shortTitle: 'Fine-Tuning de LLMs (QLoRA, Lo',
  tagline: 'Un modelo genérico sabe todo. Un modelo fine-tuned sabe exactamente lo que necesitas.',
  estimatedHours: 14,
  level: 'Master',
  phase: 3,
  icon: 'Cpu',
  accentColor: 'bg-gradient-to-br from-amber-500 to-red-600',
  jobRelevance: 'Fine-tuning es el skill más diferenciador en el mercado AI 2026. Las empresas que no pueden pagar GPT-4 en producción fine-tunean Llama/Mistral para tareas específicas. Los roles de ML Engineer / Applied AI con fine-tuning experience reciben $150K-$200K en USA.',
  learningOutcomes: [
    { text: 'Entender cuándo fine-tuning vs RAG vs prompt engineering es la solución correcta' },
    { text: 'Implementar QLoRA (4-bit quantization + LoRA adapters) con transformers + peft + trl' },
    { text: 'Preparar datasets de fine-tuning: formatos Alpaca, ShareGPT, instruction-response pairs' },
    { text: 'Fine-tunear Llama 3.2 (3B) en Google Colab T4 gratuito (sin GPU propia)' },
    { text: 'Evaluar modelos fine-tuned: perplexity, benchmark tasks, human evaluation' },
    { text: 'Servir modelos fine-tuned con Ollama localmente y con HuggingFace Inference Endpoints' },
    { text: 'Aplicar fine-tuning a casos de uso específicos: extracción de datos, clasificación, Q&A' },
  ],
  theory: [
    {
      heading: 'LoRA fundamentals: low-rank adaptation, rango r, scaling factor α, módulos target (q_proj, v_proj)',
      paragraphs: [
        'En esta lección vamos a explorar lora fundamentals: low-rank adaptation, rango r, scaling factor α, módulos target (q_proj, v_proj) en profundidad. Este concepto es fundamental para tu crecimiento como profesional de Data Science y automatización. En el mercado laboral peruano e internacional, dominar este tema te diferencia claramente de otros candidatos.',

        'La clave para entender lora fundamentals: low-rank adaptation, rango r, scaling factor α, módulos target (q_proj, v_proj) es practicar con ejemplos reales. No basta con leer la teoría — necesitas escribir código, cometer errores, y aprender de ellos. Por eso cada concepto viene acompañado de ejemplos prácticos que puedes ejecutar en el editor interactivo.',

        'En producción, lora fundamentals: low-rank adaptation, rango r, scaling factor α, módulos target (q_proj, v_proj) se usa diario en empresas como Interbank, BBVA, Mercado Libre y Rimac. Los equipos de data science y automatización dependen de este conocimiento para construir pipelines robustos y escalables.',
      ],
    },
    {
      heading: 'QLoRA: 4-bit NormalFloat quantization + doble quantization + paged optimizers — fine-tuning en 6GB VRAM',
      paragraphs: [
        'En esta lección vamos a explorar qlora: 4-bit normalfloat quantization + doble quantization + paged optimizers — fine-tuning en 6gb vram en profundidad. Este concepto es fundamental para tu crecimiento como profesional de Data Science y automatización. En el mercado laboral peruano e internacional, dominar este tema te diferencia claramente de otros candidatos.',

        'La clave para entender qlora: 4-bit normalfloat quantization + doble quantization + paged optimizers — fine-tuning en 6gb vram es practicar con ejemplos reales. No basta con leer la teoría — necesitas escribir código, cometer errores, y aprender de ellos. Por eso cada concepto viene acompañado de ejemplos prácticos que puedes ejecutar en el editor interactivo.',

        'En producción, qlora: 4-bit normalfloat quantization + doble quantization + paged optimizers — fine-tuning en 6gb vram se usa diario en empresas como Interbank, BBVA, Mercado Libre y Rimac. Los equipos de data science y automatización dependen de este conocimiento para construir pipelines robustos y escalables.',
      ],
    },
    {
      heading: 'SFT (Supervised Fine-Tuning): SFTTrainer de TRL, chat templates, instruction formatting',
      paragraphs: [
        'En esta lección vamos a explorar sft (supervised fine-tuning): sfttrainer de trl, chat templates, instruction formatting en profundidad. Este concepto es fundamental para tu crecimiento como profesional de Data Science y automatización. En el mercado laboral peruano e internacional, dominar este tema te diferencia claramente de otros candidatos.',

        'La clave para entender sft (supervised fine-tuning): sfttrainer de trl, chat templates, instruction formatting es practicar con ejemplos reales. No basta con leer la teoría — necesitas escribir código, cometer errores, y aprender de ellos. Por eso cada concepto viene acompañado de ejemplos prácticos que puedes ejecutar en el editor interactivo.',

        'En producción, sft (supervised fine-tuning): sfttrainer de trl, chat templates, instruction formatting se usa diario en empresas como Interbank, BBVA, Mercado Libre y Rimac. Los equipos de data science y automatización dependen de este conocimiento para construir pipelines robustos y escalables.',
      ],
    },
    {
      heading: 'Dataset preparation: curación, balanceo de clases, decontaminación, formato correcto',
      paragraphs: [
        'En esta lección vamos a explorar dataset preparation: curación, balanceo de clases, decontaminación, formato correcto en profundidad. Este concepto es fundamental para tu crecimiento como profesional de Data Science y automatización. En el mercado laboral peruano e internacional, dominar este tema te diferencia claramente de otros candidatos.',

        'La clave para entender dataset preparation: curación, balanceo de clases, decontaminación, formato correcto es practicar con ejemplos reales. No basta con leer la teoría — necesitas escribir código, cometer errores, y aprender de ellos. Por eso cada concepto viene acompañado de ejemplos prácticos que puedes ejecutar en el editor interactivo.',

        'En producción, dataset preparation: curación, balanceo de clases, decontaminación, formato correcto se usa diario en empresas como Interbank, BBVA, Mercado Libre y Rimac. Los equipos de data science y automatización dependen de este conocimiento para construir pipelines robustos y escalables.',
      ],
    },
    {
      heading: 'Evaluation: loss curves, benchmark en dataset de holdout, comparación con base model',
      paragraphs: [
        'En esta lección vamos a explorar evaluation: loss curves, benchmark en dataset de holdout, comparación con base model en profundidad. Este concepto es fundamental para tu crecimiento como profesional de Data Science y automatización. En el mercado laboral peruano e internacional, dominar este tema te diferencia claramente de otros candidatos.',

        'La clave para entender evaluation: loss curves, benchmark en dataset de holdout, comparación con base model es practicar con ejemplos reales. No basta con leer la teoría — necesitas escribir código, cometer errores, y aprender de ellos. Por eso cada concepto viene acompañado de ejemplos prácticos que puedes ejecutar en el editor interactivo.',

        'En producción, evaluation: loss curves, benchmark en dataset de holdout, comparación con base model se usa diario en empresas como Interbank, BBVA, Mercado Libre y Rimac. Los equipos de data science y automatización dependen de este conocimiento para construir pipelines robustos y escalables.',
      ],
    },
    {
      heading: 'Serving: merge LoRA adapters → modelo completo, Ollama modelfile, GGUF quantization',
      paragraphs: [
        'En esta lección vamos a explorar serving: merge lora adapters → modelo completo, ollama modelfile, gguf quantization en profundidad. Este concepto es fundamental para tu crecimiento como profesional de Data Science y automatización. En el mercado laboral peruano e internacional, dominar este tema te diferencia claramente de otros candidatos.',

        'La clave para entender serving: merge lora adapters → modelo completo, ollama modelfile, gguf quantization es practicar con ejemplos reales. No basta con leer la teoría — necesitas escribir código, cometer errores, y aprender de ellos. Por eso cada concepto viene acompañado de ejemplos prácticos que puedes ejecutar en el editor interactivo.',

        'En producción, serving: merge lora adapters → modelo completo, ollama modelfile, gguf quantization se usa diario en empresas como Interbank, BBVA, Mercado Libre y Rimac. Los equipos de data science y automatización dependen de este conocimiento para construir pipelines robustos y escalables.',
      ],
    },
    {
      heading: 'Fine-tuning vs RAG vs prompting: framework de decisión — cuándo usar qué',
      paragraphs: [
        'En esta lección vamos a explorar fine-tuning vs rag vs prompting: framework de decisión — cuándo usar qué en profundidad. Este concepto es fundamental para tu crecimiento como profesional de Data Science y automatización. En el mercado laboral peruano e internacional, dominar este tema te diferencia claramente de otros candidatos.',

        'La clave para entender fine-tuning vs rag vs prompting: framework de decisión — cuándo usar qué es practicar con ejemplos reales. No basta con leer la teoría — necesitas escribir código, cometer errores, y aprender de ellos. Por eso cada concepto viene acompañado de ejemplos prácticos que puedes ejecutar en el editor interactivo.',

        'En producción, fine-tuning vs rag vs prompting: framework de decisión — cuándo usar qué se usa diario en empresas como Interbank, BBVA, Mercado Libre y Rimac. Los equipos de data science y automatización dependen de este conocimiento para construir pipelines robustos y escalables.',
      ],
    },
  ],
  iDo: {
    intro: 'Te muestro paso a paso cómo aplicar los conceptos de esta sección con ejemplos prácticos.',
    steps: [
      {
        description: 'Fine-tunear Llama 3.2-3B con QLoRA en Colab T4 para extracción de entidades en textos peruanos (RUC, DNI, razón social)',
        code: {
          language: 'python',
          title: 'ejemplo.py',
          code: '# Ejemplo de: Fine-tunear Llama 3.2-3B con QLoRA en Colab T4 para extracción de entidades en textos peruanos (RUC, DNI, razón social)\n# TODO: Implementar el código completo\nprint("Implementar este ejemplo")',
        },
        why: 'Este paso es importante porque demuestra el concepto en acción y te muestra el patrón correcto a seguir.',
      },
      {
        description: 'Evaluar el modelo fine-tuned vs el base model en 50 ejemplos del dominio',
        code: {
          language: 'python',
          title: 'ejemplo.py',
          code: '# Ejemplo de: Evaluar el modelo fine-tuned vs el base model en 50 ejemplos del dominio\n# TODO: Implementar el código completo\nprint("Implementar este ejemplo")',
        },
        why: 'Este paso es importante porque demuestra el concepto en acción y te muestra el patrón correcto a seguir.',
      },
      {
        description: 'Exportar en formato GGUF y servir con Ollama localmente',
        code: {
          language: 'python',
          title: 'ejemplo.py',
          code: '# Ejemplo de: Exportar en formato GGUF y servir con Ollama localmente\n# TODO: Implementar el código completo\nprint("Implementar este ejemplo")',
        },
        why: 'Este paso es importante porque demuestra el concepto en acción y te muestra el patrón correcto a seguir.',
      },
    ],
  },
  weDo: {
    intro: 'Ahora te toca a ti practicar con guía. Lee cada instrucción, intenta escribir el código, y si te trabas revisa la solución.',
    steps: [
      {
        instruction: 'Preparar un dataset de fine-tuning de 500+ ejemplos para clasificación de soporte técnico',
        hint: 'Piensa en cómo descomponer el problema en pasos más pequeños.',
        starterCode: {
          language: 'python',
          title: 'ejercicio.py',
          code: '# Tu código aquí\n# Preparar un dataset de fine-tuning de 500+ ejemplos para clasificación de soporte técnico\n',
        },
        solutionCode: {
          language: 'python',
          title: 'solucion.py',
          code: '# Solución\n# Preparar un dataset de fine-tuning de 500+ ejemplos para clasificación de soporte técnico\nprint("Solución implementada")',
        },
      },
      {
        instruction: 'Fine-tunear Mistral-7B-Instruct con LoRA (sin cuantización si hay GPU disponible)',
        hint: 'Piensa en cómo descomponer el problema en pasos más pequeños.',
        starterCode: {
          language: 'python',
          title: 'ejercicio.py',
          code: '# Tu código aquí\n# Fine-tunear Mistral-7B-Instruct con LoRA (sin cuantización si hay GPU disponible)\n',
        },
        solutionCode: {
          language: 'python',
          title: 'solucion.py',
          code: '# Solución\n# Fine-tunear Mistral-7B-Instruct con LoRA (sin cuantización si hay GPU disponible)\nprint("Solución implementada")',
        },
      },
      {
        instruction: 'Construir un endpoint FastAPI que sirve el modelo fine-tuned para producción',
        hint: 'Piensa en cómo descomponer el problema en pasos más pequeños.',
        starterCode: {
          language: 'python',
          title: 'ejercicio.py',
          code: '# Tu código aquí\n# Construir un endpoint FastAPI que sirve el modelo fine-tuned para producción\n',
        },
        solutionCode: {
          language: 'python',
          title: 'solucion.py',
          code: '# Solución\n# Construir un endpoint FastAPI que sirve el modelo fine-tuned para producción\nprint("Solución implementada")',
        },
      },
    ],
  },
  youDo: {
    title: 'Modelo Dominio-Específico',
    context: 'llm-domain-expert: fine-tunes un LLM de 3-7B para un dominio específico (ej: extracción de datos tributarios peruanos, análisis de contratos, clasificación de soporte); dataset cuidadosamente curado de ≥ 1,000 ejemplos con train/val/test splits; evaluación rigurosa con métricas específicas del dominio; modelo publicado en HuggingFace Hub con model card completo; demo en Streamlit o HuggingFace Spaces con link público; blog post técnico explicando el proceso, hallazgos y benchmarks.',
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
      { criterion: 'Funcionalidad', weight: '40%' },
      { criterion: 'Calidad de código', weight: '20%' },
      { criterion: 'Documentación', weight: '20%' },
      { criterion: 'Tests', weight: '20%' },
    ],
  },
  selfCheck: {
    questions: [
      {
        question: '¿Qué es QLoRA y por qué es revolucionario?',
        options: [
          'Cuantiza el modelo a 4-bit y solo entrena adapters LoRA (0.1% de parámetros) — permite fine-tunear un LLM de 8B en una GPU consumer de 24GB',
          'QLoRA es un modelo de lenguaje',
          'QLoRA es un framework web',
          'QLoRA es un sistema de colas',
        ],
        correctIndex: 0,
        explanation: 'QLoRA (Quantized LoRA): cuantiza el modelo base a 4-bit NF4 (8B params caben en 8GB) y entrena solo adapters LoRA (8M params, 0.1%). Una RTX 3090 de 24GB puede fine-tunear Llama 3.1 8B en 3 horas con 1000 ejemplos.',
      },
      {
        question: '¿Cuál es la diferencia entre LoRA y full fine-tuning?',
        options: [
          'LoRA entrena solo adapters pequeños (0.1% params) sobre el modelo congelado; full fine-tuning actualiza todos los parámetros (100%) — LoRA es 10x más barato',
          'LoRA es más preciso que full fine-tuning',
          'No hay diferencia',
          'LoRA solo funciona con modelos pequeños',
        ],
        correctIndex: 0,
        explanation: 'Full fine-tuning: actualiza los 8B parámetros → necesita 8x VRAM del modelo (64GB+). LoRA: congela el modelo, añade adapters pequeños (8M params) → necesita 1x VRAM. LoRA logra 95-99% del performance de full FT a 10% del costo.',
      },
      {
        question: '¿Qué es SFT (Supervised Fine-Tuning)?',
        options: [
          'Entrenar el modelo con ejemplos de input-output (prompt → respuesta ideal) para que aprenda a responder en un estilo/dominio específico',
          'SFT es un sistema de archivos',
          'SFT es un tipo de cuantización',
          'SFT es un framework de testing',
        ],
        correctIndex: 0,
        explanation: 'SFT: das al modelo 1000 ejemplos de {"prompt": "Resume este contrato", "response": "[resumen ideal]"}. El modelo aprende el patrón. Es la forma más simple de fine-tuning. Se usa antes de RLHF (Reinforcement Learning from Human Feedback).',
      },
      {
        question: '¿Cuándo necesitas fine-tuning vs RAG?',
        options: [
          'Fine-tuning cuando el modelo necesita aprender un estilo, tono, o conocimiento especializado permanente. RAG cuando necesita información actualizable sin reentrenar',
          'Siempre fine-tuning, RAG no sirve',
          'Siempre RAG, fine-tuning no sirve',
          'Son lo mismo',
        ],
        correctIndex: 0,
        explanation: 'Fine-tuning: el modelo aprende a responder como un abogado peruano (estilo, jerga, formato). RAG: el modelo busca leyes actualizadas sin reentrenar. En producción, se combinan: fine-tune para estilo + RAG para datos actualizados.',
      },
      {
        question: '¿Qué es la cuantización de modelos y por qué importa?',
        options: [
          'Reducir la precisión de los pesos (FP16 → INT4) para que el modelo ocupe menos memoria — un modelo de 16GB en FP16 cabe en 4GB en INT4',
          'Es comprimir el modelo con zip',
          'Es dividir el modelo en partes',
          'Es un algoritmo de pruning',
        ],
        correctIndex: 0,
        explanation: 'Cuantización: FP32 (32-bit) → FP16 (16-bit) → INT8 (8-bit) → INT4 (4-bit). Un LLM de 8B: 32GB en FP32, 16GB en FP16, 4GB en INT4. Trade-off: menos precisión pero el modelo cabe en GPUs más pequeñas. GPTQ y AWQ son los algoritmos estándar.',
      },
    ],
  },
  resources: {
    docs: [
      { label: 'Fine-tuning open LLMs in 2025 — Philschmid', url: 'Fine-tuning open LLMs in 2025 — Philschmid' },
      { label: 'QLoRA — artidoro/qlora GitHub', url: 'QLoRA — artidoro/qlora GitHub' },
      { label: 'TRL SFTTrainer docs', url: 'TRL SFTTrainer docs' },
      { label: 'Fine-tuning LLMs with QLoRA 2026 tutorial', url: 'Fine-tuning LLMs with QLoRA 2026 tutorial' },
      { label: 'MLflow + PEFT fine-tuning', url: 'MLflow + PEFT fine-tuning' },
    ],
    books: [
      { label: 'Python 201 — Michael Driscoll', note: 'Capítulos relevantes para esta sección' },
    ],
    courses: [
      { label: 'Real Python', url: 'https://realpython.com', note: 'Tutoriales complementarios' },
    ],
  },
}
