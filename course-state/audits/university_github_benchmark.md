# PyArcana benchmark: universidades, Coursera y repositorios docentes

Fecha: 2026-07-22

Alcance: criterios de diseño para S01–S52. Estas fuentes orientan al equipo de contenido; nunca se entregan como respuestas a los principiantes durante el gate agentic.

## Reconciliación de los roadmaps entregados

Los documentos no usan siempre la misma numeración temática. Para evitar mezclar prerrequisitos o enseñar una respuesta futura, se aplicó esta jerarquía explícita:

1. `learning_roadmap_52_V3.md` es el contrato autoritativo para títulos S01–S52, 8 subtemas, 8 demos, 24 ejercicios y progresión de capstones.
2. `learning_roadmap.md`, `el_arte_de_python_roadmap_maestro_52_secciones.md` y el roadmap maestro v2 aportan casos, profundidad, criterios de evaluación y antecedentes; no sustituyen la numeración V3 cuando discrepan.
3. `docs/CROSS_REFERENCE_REPORT.md` y los inventarios de recursos sirven para detectar huecos y fuentes; no autorizan a adelantar conocimientos.
4. `src/lib/course/index.ts` define las 52 lecciones realmente publicadas. Un gate permanente sigue esos imports y contrasta cada título y conteo con V3, de modo que archivos huérfanos no puedan producir un falso positivo.

La validación web del 2026-07-22 confirmó además que MIT 6.100L está dirigido a alumnado con poca o ninguna experiencia; CS106A practica fundamentos antes de funciones, contenedores y clases; Python for Everybody progresa hacia web data, bases de datos y capstone; y CS329S trata monitoreo, privacidad, equidad y seguridad como trabajo de sistemas ML con prerrequisitos. Esos patrones apoyan la progresión V3 sin copiar contenido ni exponer fuentes a los newbies.

## Diez rondas pre-fix

El boilerplate repetido encontrado en S40–S52 activó diez rondas diferenciadas antes de reescribir contenido.

| Ronda | Pregunta | Fuente primaria / repositorio | Criterio derivado |
|---|---|---|---|
| 1 | ¿Cómo inicia un alumno sin programación? | [MIT 6.100L](https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/) y [6.0001](https://ocw.mit.edu/courses/6-0001-introduction-to-computer-science-and-programming-in-python-fall-2016/) | Un concepto, ejercicio pequeño y luego problema acumulativo; el entorno no se asume. |
| 2 | ¿Qué hace reproducible un proyecto Python? | [Harvard CS50P](https://cs50.harvard.edu/python/syllabus/) y su [proyecto final](https://cs50.harvard.edu/python/project/) | Archivos/funciones definidos, tests, dependencias, README y demo verificable. |
| 3 | ¿Cómo se retira el andamiaje? | [Stanford CS106A](https://cs106a.stanford.edu/schedule) | Entorno restringido al inicio; retirar una ayuda por vez antes de transferencia abierta. |
| 4 | ¿Qué secuencia sirve a data learners? | [Python for Everybody](https://www.coursera.org/specializations/python) y [Applied Data Science with Python](https://www.coursera.org/specializations/data-science-python) | Ingesta/manipulación antes de visualización, modelos y automatización. |
| 5 | ¿Cómo introducir incertidumbre? | [Yale YData](https://summer.yale.edu/academics/course-list/ydata-introduction-data-science-2) y [S&DS](https://catalog.yale.edu/ycps/subjects-of-instruction/statistics/) | Pregunta y ejemplo antes de fórmula; declarar muestra, denominador, límites y decisión. |
| 6 | ¿Qué precede a modelos sofisticados? | [Stanford CS229](https://cs229.stanford.edu/syllabus-new.html) | Baseline, split, métrica y error analysis antes del algoritmo avanzado. |
| 7 | ¿Qué evidencia vuelve operable un sistema ML? | [Stanford CS329S](https://stanford-cs329s.github.io/) | Stakeholders, SLO, ownership, privacidad/equidad/seguridad, monitoreo y rollback. |
| 8 | ¿Qué hace auténtica la práctica de repositorio? | [Practical Python](https://github.com/dabeaz-course/practical-python) y [Python Data Science Handbook](https://github.com/jakevdp/PythonDataScienceHandbook) | Entorno exacto, artefactos ejecutables ordenados, outputs visibles y ejercicios con propósito. |
| 9 | ¿Cómo culmina MLOps? | [Made With ML](https://github.com/GokuMohandas/Made-With-ML) y [MLOps Zoomcamp](https://github.com/DataTalksClub/mlops-zoomcamp) | Un caso evolutivo con tests, packaging, CI, deployment, monitoring y proyecto final. |
| 10 | ¿Cuándo enseñar RAG/agentes y cómo limitarlos? | [Generative AI for Beginners](https://github.com/microsoft/generative-ai-for-beginners) y [AI Agents for Beginners](https://github.com/microsoft/ai-agents-for-beginners) | Evaluar retrieval antes de agentes; schema/permiso/presupuesto/terminación/aprobación humana. |

## Patrones de repositorios adicionales

- [Hands-On Machine Learning 3](https://github.com/ageron/handson-ml3): notebooks reproducibles, setup y checklist end-to-end.
- [TheAlgorithms/Python](https://github.com/TheAlgorithms/Python): implementaciones educativas protegidas por CI y reglas de contribución, con límites frente a producción.
- [Real Python materials](https://github.com/realpython/materials): material ejecutable con style/format checks.
- [OSSU Computer Science](https://github.com/ossu/computer-science): prerrequisitos y etapas ordenadas, con proyecto consolidante.
- [Microsoft ML for Beginners](https://github.com/microsoft/ML-For-Beginners): plantillas consistentes, quizzes/labs y organización multilingüe.

## Reglas de aceptación para PyArcana

1. Toda tarea evaluada declara conocimiento permitido, input, output y éxito observable.
2. Un ejercicio de un solo concepto precede cada transferencia combinada.
3. Los casos evolucionan; un `print` aislado no basta en nivel Master.
4. La evaluación exige interpretar, justificar y comunicar evidencia, no solo obtener output.
5. Baseline y diseño de evaluación preceden ML avanzado.
6. Fiabilidad, privacidad, equidad, seguridad, observabilidad y rollback son criterios cuando aplican.
7. RAG se evalúa antes de agentes; herramientas tienen permisos y escalamiento humano.
8. S13/S26/S39/S52 entregan bundles reproducibles de portafolio.
9. La UI española/inglesa mantiene paridad; el estado de traducción del corpus se declara con honestidad.
10. Repositorios con soluciones de alumnos permanecen aislados del contenido evaluado.

## Hallazgo que motivó la reescritura

La base recuperada repetía en S40–S52 frases genéricas equivalentes a “Practica con código ejecutable”, “Demuestra el outcome” y “Si el assert/print no refleja” 104 veces cada una (312 repeticiones). Eso no aporta dominio, contrato, fallo ni evidencia operativa y no cumple los benchmarks anteriores.
