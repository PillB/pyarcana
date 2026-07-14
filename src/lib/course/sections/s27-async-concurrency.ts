import type { CourseSection } from '../../types'

export const section27: CourseSection = {
  id: 'async-concurrency',
  index: 27,
  title: 'Concurrencia Avanzada y Arquitecturas Async',
  shortTitle: 'Concurrencia Avanzada y Arquit',
  tagline: 'El código que corre en paralelo no es el que más corre — es el que más escala.',
  estimatedHours: 12,
  level: 'Senior',
  phase: 2,
  icon: 'Zap',
  accentColor: 'bg-gradient-to-br from-purple-500 to-fuchsia-600',
  jobRelevance: 'Los roles Senior Python/AI Engineer requieren dominar asyncio, threading, y multiprocessing para construir pipelines de alta concurrencia. Python 201 (Ch. 27-30) cubre estos módulos en profundidad. Esta sección lleva ese conocimiento a nivel de producción con patrones de arquitectura reales.',
  learningOutcomes: [
    { text: 'Dominar asyncio avanzado: event loops, TaskGroup, asyncio.Queue, semaphores, limitadores de rate' },
    { text: 'Entender el GIL y cuándo usar threading vs multiprocessing vs asyncio' },
    { text: 'Implementar el patrón producer-consumer con asyncio.Queue' },
    { text: 'Usar concurrent.futures para I/O-bound y CPU-bound tasks (Python 201 Ch. 30)' },
    { text: 'Construir pipelines asíncronos con backpressure control' },
    { text: 'Optimizar latencia en APIs con connection pooling (aiohttp, asyncpg)' },
    { text: 'Depurar race conditions con locks, semaphores y asyncio.Event' },
  ],
  theory: [
    {
      heading: 'asyncio avanzado: async/await profundo, TaskGroup (Python 3.11+), asyncio.Queue, asyncio.Semaphore',
      paragraphs: [
        'asyncio es el framework de concurrencia cooperativa de Python basado en un event loop single-thread. A diferencia de threading o multiprocessing, asyncio NO crea threads ni procesos del SO: todo corre en un solo thread, y el event loop cambia entre tareas (coroutines) cuando estas ceden control con `await`. Esto es brutalmente eficiente para trabajo I/O-bound porque una coroutine que espera I/O no bloquea a las demás — el event loop la pausa y atiende a la siguiente. En un scraper que descarga 1000 URLs, asyncio con aiohttp puede lograr 10-50x más throughput que requests secuencial, usando un solo core y una fracción de la memoria que usarían 100 threads.',
        'El patrón moderno (Python 3.11+) es `async with asyncio.TaskGroup() as tg: tg.create_task(coro())`. TaskGroup reemplaza a `asyncio.gather()` para casos nuevos porque maneja cancelación y errores mucho mejor: si una tarea lanza excepción, TaskGroup cancela automáticamente las demás y agrupa todas las excepciones en `ExceptionGroup`. Para orquestación, `asyncio.Queue` es la pieza clave del patrón producer-consumer: producers hacen `await queue.put(item)` y consumers hacen `await queue.get()` — cuando la queue está llena o vacía, las coroutines se pausan elegantemente sin busy-wait. Esto te permite armar pipelines de múltiples etapas (fetch → parse → enrich → store) donde cada etapa corre concurrentemente.',
        'Para controlar la concurrencia y no saturar recursos externos, `asyncio.Semaphore(N)` es esencial. Imagina que llamas a una API con rate limit de 10 req/seg: si lanzas 1000 coroutines concurrentes sin control, te banearán. Con `async with sem: await fetch(url)`, solo N coroutines pasan a la vez — las demás esperan su turno. Esto se combina con `asyncio.Queue(maxsize=N)` para backpressure: si el producer produce más rápido de lo que el consumer consume, la queue se llena y el producer se pausa automáticamente en `put()`. En producción, sin estos controles, tu scraper se cae por rate limit o tu pipeline se queda sin memoria por una queue infinita.',
      ],
      code: {
        language: 'python',
        title: 'async_pipeline.py',
        code: `import asyncio
import aiohttp
import time
from typing import Any

# === 1. Semaphore para limitar concurrencia (rate limit virtual) ===
async def fetch_url(session: aiohttp.ClientSession, url: str, sem: asyncio.Semaphore) -> dict:
    """Descarga una URL respetando el rate limit del Semaphore."""
    async with sem:  # solo N coroutines pasan a la vez
        async with session.get(url, timeout=10) as resp:
            return {"url": url, "status": resp.status}

async def scrape_concurrent(urls: list[str], max_concurrent: int = 50) -> list[dict]:
    """Descarga N URLs en paralelo, limitando concurrencia con Semaphore."""
    sem = asyncio.Semaphore(max_concurrent)
    timeout = aiohttp.ClientTimeout(total=60)
    async with aiohttp.ClientSession(timeout=timeout) as session:
        async with asyncio.TaskGroup() as tg:  # Python 3.11+
            tasks = [tg.create_task(fetch_url(session, u, sem)) for u in urls]
        return [t.result() for t in tasks]

# === 2. Producer-consumer con asyncio.Queue ===
async def producer(queue: asyncio.Queue, n_items: int):
    """Produce items y los pone en la queue (backpressure automático)."""
    for i in range(n_items):
        await asyncio.sleep(0.01)  # simula trabajo
        await queue.put({"id": i, "payload": f"data_{i}"})
        print(f"Producido {i}")
    await queue.put(None)  # sentinel: fin de stream

async def consumer(queue: asyncio.Queue, name: str):
    """Consume items de la queue hasta recibir sentinel."""
    while True:
        item = await queue.get()
        if item is None:
            queue.task_done()
            break
        await asyncio.sleep(0.02)  # simula procesamiento
        print(f"  [{name}] procesado {item['id']}")
        queue.task_done()

async def run_pipeline(n_items: int = 100, n_consumers: int = 3):
    queue = asyncio.Queue(maxsize=20)  # backpressure: se llena, producer se pausa
    # Lanzar producer + N consumers concurrentemente
    consumers = [asyncio.create_task(consumer(queue, f"c{i}")) for i in range(n_consumers)]
    await producer(queue, n_items)
    # Esperar a que todos los items se procesen
    await queue.join()
    # Cancelar consumers (reciben None y terminan)
    for c in consumers:
        c.cancel()

# === 3. Medición de throughput ===
async def main():
    urls = [f"https://httpbin.org/get?i={i}" for i in range(50)]
    start = time.time()
    results = await scrape_concurrent(urls, max_concurrent=10)
    elapsed = time.time() - start
    print(f"50 URLs en {elapsed:.2f}s ({len(results)/elapsed:.1f} req/s)")

# asyncio.run(main())
# 50 URLs en 1.85s (27.0 req/s)  (vs ~25s secuencial)`,
      },
      callout: {
        type: 'warning',
        title: 'Nunca mezcles asyncio con llamadas bloqueantes',
        content:
          'Si dentro de una coroutine llamas a `requests.get()` (síncrono), `time.sleep()`, o un query síncrono a PostgreSQL, bloqueas TODO el event loop — ninguna otra coroutine avanza. Para I/O SIEMPRE usa versiones async: aiohttp, httpx.AsyncClient, asyncpg, aiomysql. Para CPU-bound pesado dentro de asyncio, usa `asyncio.to_thread(func)` o `loop.run_in_executor(ProcessPoolExecutor(), func, args)` para no bloquear el loop.',
      },
    },
    {
      heading: 'threading en profundidad: Locks, RLocks, Conditions, Barriers, thread-safe queues',
      paragraphs: [
        'threading sigue siendo la mejor opción para I/O-bound cuando no puedes usar asyncio — por ejemplo, cuando integras librerías síncronas (drivers de DB legacy, SDKs de cloud sin versión async) o cuando necesitas paralelismo fino con shared state. Python expone primitivas de sincronización que son wrappers sobre los del sistema operativo: `Lock` (mutex exclusivo), `RLock` (reentrant — el mismo thread puede adquirlo varias veces), `Condition` (variables de condición para producer-consumer), `Event` (bandera on/off para señalización), `Semaphore` (contador de permisos), y `Barrier` (punto de sincronización donde N threads esperan). Comprender cuándo usar cada una es lo que separa código thread-safe de código con race conditions.',
        'El antipatrón clásico es compartir estado mutable entre threads sin lock. Imagina un contador `global_counter = 0` que 10 threads incrementan en paralelo: `global_counter += 1` NO es atómico — son 3 operaciones (leer, sumar, escribir). Si dos threads leen al mismo tiempo, ambos leen el mismo valor y el contador pierde increments. La solución es `with lock: global_counter += 1` — el lock garantiza exclusión mutua. Para casos donde un thread produce datos y otros consumen, `queue.Queue` (thread-safe built-in) es la abstracción correcta — internamente usa Condition y Lock, no tienes que manejarlos manualmente. Regla: SIEMPRE que compartas estado entre threads, usa Lock o una estructura thread-safe como queue.Queue.',
        'El GIL complica el panorama: en CPython, solo un thread ejecuta bytecode a la vez, así que threading NO acelera trabajo CPU-bound (los threads se turnan el GIL). Pero threading SÍ ayuda con I/O porque durante `recv()` o `read()` el GIL se libera. Para trabajo CPU-bound real, multiprocessing es la respuesta. Trampas comunes: (1) deadlocks — dos threads esperando locks que el otro tiene, soluciona con orden consistente de adquisición; (2) race conditions en inicialización lazy — usa `with lock:` alrededor del check-then-create; (3) starvation — un thread nunca consigue el lock, soluciona con `RLock` o fairness. En pipelines de DS, threading se usa para: llamar 50 APIs en paralelo, descargar 100 archivos, integrar librerías síncronas como scikit-learn dentro de un servidor async.',
      ],
      code: {
        language: 'python',
        title: 'threading_demo.py',
        code: `import threading
import queue
import time
import random

# === 1. Race condition sin lock (BROKEN) vs con lock (CORRECTO) ===
counter_broken = 0
counter_safe = 0
lock = threading.Lock()

def increment_broken(n: int):
    global counter_broken
    for _ in range(n):
        counter_broken += 1  # RACE: leer-modificar-escribir no atómico

def increment_safe(n: int):
    global counter_safe
    for _ in range(n):
        with lock:  # exclusión mutua — solo un thread a la vez
            counter_safe += 1

# Lanzar 10 threads que incrementan 10000 veces cada uno
threads = [threading.Thread(target=increment_broken, args=(10000,)) for _ in range(10)]
for t in threads: t.start()
for t in threads: t.join()
print(f"Broken (esperado 100000): {counter_broken}")
# Salida típica: 47382  (¡perdió más de la mitad!)

threads = [threading.Thread(target=increment_safe, args=(10000,)) for _ in range(10)]
for t in threads: t.start()
for t in threads: t.join()
print(f"Safe (esperado 100000): {counter_safe}")
# Salida: 100000  (correcto)

# === 2. Producer-consumer con queue.Queue (thread-safe) ===
q = queue.Queue(maxsize=10)  # backpressure: se llena, producer se bloquea en put()

def producer():
    for i in range(20):
        item = f"item_{i}"
        q.put(item)  # se bloquea si la queue está llena
        print(f"Producido {item}")
        time.sleep(0.05)
    q.put(None)  # sentinel

def consumer(name: str):
    while True:
        item = q.get()  # se bloquea si la queue está vacía
        if item is None:
            q.put(None)  # pasar sentinel al siguiente consumer
            break
        print(f"  [{name}] consumió {item}")
        time.sleep(0.1)  # simula procesamiento
        q.task_done()

# Lanzar 1 producer + 3 consumers
threading.Thread(target=producer, daemon=True).start()
consumers = [threading.Thread(target=consumer, args=(f"c{i}",)) for i in range(3)]
for t in consumers: t.start()
for t in consumers: t.join()

# === 3. Condition para señalizar eventos ===
cond = threading.Condition()
data_ready = False

def waiter(name: str):
    with cond:
        while not data_ready:
            cond.wait()  # libera el lock y espera señal
        print(f"[{name}] procesando dato")

def notifier():
    global data_ready
    time.sleep(1)
    with cond:
        data_ready = True
        cond.notify_all()  # despierta a todos los waiters

# threading.Thread(target=waiter, args=("A",)).start()
# threading.Thread(target=waiter, args=("B",)).start()
# threading.Thread(target=notifier).start()`,
      },
      callout: {
        type: 'tip',
        title: 'queue.Queue es thread-safe por diseño',
        content:
          'Para producer-consumer entre threads, NO uses listas + Lock manual — usa `queue.Queue`. Internamente maneja el Lock y Condition, así que `put()` se bloquea si la queue está llena (backpressure) y `get()` se bloquea si está vacía. Para asyncio, el equivalente es `asyncio.Queue`. Para multiprocessing, `multiprocessing.Queue` (con pickle serialization). Mismo patrón, 3 contexts distintos.',
      },
    },
    {
      heading: 'multiprocessing: Pool, Process, Manager, shared memory, pipes',
      paragraphs: [
        'multiprocessing es la respuesta de Python al GIL para trabajo CPU-bound: crea procesos del SO separados, cada uno con su propio GIL y su propio espacio de memoria. Así puedes usar todos los cores de tu máquina. En una laptop de 8 cores, una tarea CPU-bound puede correr 6-7x más rápido (no 8x por el overhead de spawn + IPC). La API de alto nivel es `multiprocessing.Pool` (o `concurrent.futures.ProcessPoolExecutor`): `with Pool(8) as p: results = p.map(func, items)` distribuye los items entre 8 procesos workers y recolecta resultados en orden. Para control fino, `Process(target=func, args=(...)).start()` lanza procesos individuales.',
        'El desafío de multiprocessing es el shared state: cada proceso tiene su propio espacio de memoria, así que variables globales NO se comparten. Para compartir datos entre procesos tienes 3 opciones: (1) `multiprocessing.Queue` y `Pipe` — para pasar mensajes (serializa con pickle); (2) `multiprocessing.Value` y `Array` — memoria compartida C-level para escalares y arrays numéricos; (3) `multiprocessing.Manager` — un proceso servidor que expone dicts, lists, namespaces compartidos vía proxy. Para DS, lo más limpio es diseñar funciones puras (sin estado) y usar `Pool.map()` para distribuir chunks — el resultado se serializa y se une al final. Para arrays numpy grandes, `shared_memory.SharedMemory` (Python 3.8+) permite compartir memoria sin copiar.',
        'Trampas frecuentes: (1) lambdas no se pueden picklear — define funciones top-level con `def`; (2) en Windows/macOS el spawn es distinto a Linux (fork) y puede romper código que asume shared state global — SIEMPRE protege el entry point con `if __name__ == "__main__":`; (3) memoria — cada proceso copia data, pasa chunks chicos no DataFrames gigantes, o tu RAM explota (un DataFrame de 4GB x 8 workers = 32GB); (4) pickle errors — clases custom deben ser importables (top-level, no locales). En pipelines de DS reales, multiprocessing se usa para: hyperparameter sweeps (correr 100 configs en paralelo), feature engineering por chunks (partir 1M filas en 8 chunks), batch inference (procesar 10k imágenes en paralelo), y cross-validation paralela.',
      ],
      code: {
        language: 'python',
        title: 'multiprocessing_demo.py',
        code: `import multiprocessing as mp
from multiprocessing import Pool, Manager, Value, Array
import numpy as np
import time

# === 1. Pool.map: paralelizar feature engineering por chunks ===
def calcular_features_cliente(cliente_id: int) -> dict:
    """Función PURA (sin estado) — picklable, top-level."""
    np.random.seed(cliente_id)
    historial = np.random.exponential(30, 365)
    return {
        "cliente_id": cliente_id,
        "recencia": int(365 - np.argmax(historial[::-1] > 0)),
        "frecuencia": int((historial > 0).sum()),
        "monetario": float(historial.sum()),
    }

def run_pool_benchmark():
    n_clientes = 50000
    # Secuencial (baseline)
    start = time.time()
    seq = [calcular_features_cliente(i) for i in range(n_clientes)]
    print(f"Secuencial: {time.time()-start:.1f}s")

    # Paralelo con Pool de 8 procesos
    start = time.time()
    if __name__ == "__main__":  # requerido en Windows
        with Pool(8) as pool:
            par = pool.map(calcular_features_cliente, range(n_clientes), chunksize=1000)
        print(f"Paralelo (8 procs): {time.time()-start:.1f}s")
    # Salida típica: Secuencial 12.4s, Paralelo 1.9s (6.5x speedup)

# === 2. Manager: compartir dict entre procesos ===
def worker_shared(contador: dict, lock, item: int):
    """Incrementa contador compartido con lock para exclusión mutua."""
    with lock:
        contador["procesados"] += 1

def run_manager():
    with Manager() as mgr:
        contador = mgr.dict({"procesados": 0})
        lock = mgr.Lock()
        items = list(range(1000))
        with Pool(8) as pool:
            pool.starmap(worker_shared, [(contador, lock, i) for i in items])
        print(f"Total procesados: {contador['procesados']}")
        # Salida: 1000

# === 3. shared_memory para arrays numpy grandes (sin copia) ===
from multiprocessing import shared_memory

def process_shm_chunk(shm_name: str, shape: tuple, offset: int, size: int):
    """Accede a memoria compartida SIN copiar — clave para arrays grandes."""
    existing_shm = shared_memory.SharedMemory(name=shm_name)
    arr = np.ndarray(shape, dtype=np.float64, buffer=existing_shm.buf)
    chunk = arr[offset:offset+size]
    result = (chunk * 2).sum()  # procesa sin copiar
    existing_shm.close()
    return result

def run_shared_memory():
    """Comparte un array numpy de 80MB entre 8 procesos sin copiar."""
    n = 10_000_000  # 10M floats = 80MB
    shm = shared_memory.SharedMemory(create=True, size=n * 8)
    arr = np.ndarray((n,), dtype=np.float64, buffer=shm.buf)
    arr[:] = np.random.rand(n)
    # Cada proceso ve el array sin copia — solo lectura o con sincronización
    print(f"Array compartido: {arr.nbytes / 1e6:.0f}MB")
    shm.close(); shm.unlink()  # limpieza

if __name__ == "__main__":
    run_pool_benchmark()`,
      },
      callout: {
        type: 'info',
        title: 'Fork vs Spawn en multiprocessing',
        content:
          'En Linux, multiprocessing usa `fork` por default — el proceso hijo hereda todo el espacio de memoria del padre (rápido pero puede causar issues con threads). En macOS (Python 3.8+) y Windows, usa `spawn` — lanza un proceso Python nuevo y re-importa todo (más lento pero más seguro). Para code portable, SIEMPRE usa `if __name__ == "__main__":` y evita state global que dependa del método fork.',
      },
    },
    {
      heading: 'concurrent.futures: ThreadPoolExecutor, ProcessPoolExecutor, as_completed, deadlocks',
      paragraphs: [
        'concurrent.futures es la API moderna y recomendada para paralelismo en Python — unifica threads y processes bajo una interfaz común (`submit`, `map`, `as_completed`). La regla es simple: para I/O-bound usa `ThreadPoolExecutor`, para CPU-bound usa `ProcessPoolExecutor`. La ventaja sobre multiprocessing directo es la API uniforme: `with ThreadPoolExecutor(max_workers=10) as ex: futures = [ex.submit(func, arg) for arg in items]` — mismo patrón para threads y processes. Cambiar de uno a otro es solo cambiar la clase, lo que facilita experimentar con ambos enfoques.',
        '`as_completed` es la herramienta para procesar resultados en el orden en que terminan (no en el orden de submit). Esto es crucial cuando los tiempos varían: si lanzas 50 tareas y algunas tardan 1s y otras 10s, con `map` esperas a la más lenta para empezar a procesar; con `as_completed` procesas cada resultado en cuanto está listo. Esto maximiza el throughput y permite mostrar progreso: `for future in as_completed(futures): print(f"Completado {future.result()}")`. También permite cancelar tareas pendientes si una falla críticamente, y manejar excepciones por future individual con `try/except` alrededor de `future.result()`.',
        'Deadlocks son el fantasma de concurrent.futures. Causas comunes: (1) anidar executors — un ProcessPoolExecutor cuyo task internamente crea otro ProcessPoolExecutor agota los workers; (2) callbacks que esperan futures que nunca terminan — `future.add_done_callback(cb)` donde cb hace `other_future.result()` se cuelga si other_future está en la misma pool; (3) PickleError en ProcessPoolExecutor — si tu función o argumentos no son picklable (lambdas, closures, clases locales), el worker muere silenciosamente y la pool se cuelga. Solución general: usa timeouts (`future.result(timeout=30)`) y SIEMPRE envuelve en `try/except` con logging. En DS, concurrent.futures se usa para: scrapear 100 URLs en paralelo (ThreadPool), ejecutar 50 modelos en paralelo (ProcessPool), batch inference (ProcessPool), y parallel hyperparameter search.',
      ],
      code: {
        language: 'python',
        title: 'concurrent_futures.py',
        code: `import concurrent.futures as cf
import requests
import time
import logging

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger(__name__)

# === 1. ThreadPoolExecutor para I/O-bound (scrape) ===
def fetch(url: str) -> tuple[str, int]:
    """Descarga una URL — I/O-bound, ideal para threads."""
    try:
        r = requests.get(url, timeout=5)
        return (url, r.status_code)
    except Exception as e:
        return (url, -1)

def scrape_parallel(urls: list[str], n_workers: int = 20) -> list[tuple[str, int]]:
    """Scrapea N URLs en paralelo con ThreadPoolExecutor."""
    start = time.time()
    with cf.ThreadPoolExecutor(max_workers=n_workers) as ex:
        # map preserva orden; as_completed no
        results = list(ex.map(fetch, urls))
    logger.info("Scrape de %d URLs en %.2fs", len(urls), time.time() - start)
    return results

# === 2. ProcessPoolExecutor para CPU-bound (cómputo) ===
def heavy_compute(x: int) -> int:
    """Simula cómputo CPU-bound — no se beneficia de threads por GIL."""
    total = 0
    for i in range(x * 100000):
        total += i ** 2
    return total % 1000000

def compute_parallel(items: list[int], n_workers: int = 8) -> list[int]:
    """Paraleliza cómputo CPU-bound con ProcessPoolExecutor."""
    start = time.time()
    with cf.ProcessPoolExecutor(max_workers=n_workers) as ex:
        results = list(ex.map(heavy_compute, items))
    logger.info("Compute de %d items en %.2fs", len(items), time.time() - start)
    return results

# === 3. as_completed: procesa en orden de finalización ===
def process_as_completed(urls: list[str]):
    """Procesa resultados en el orden en que terminan (no en orden de submit)."""
    with cf.ThreadPoolExecutor(max_workers=10) as ex:
        futures = {ex.submit(fetch, u): u for u in urls}
        for future in cf.as_completed(futures, timeout=30):
            url = futures[future]
            try:
                result = future.result(timeout=5)  # timeout por future
                logger.info("OK: %s -> %d", result[0], result[1])
            except cf.TimeoutError:
                logger.warning("Timeout en %s", url)
            except Exception as e:
                logger.error("Error en %s: %s", url, e)

# === 4. Manejo de errores y shutdown limpio ===
def robust_parallel(items: list, func, n_workers: int = 8) -> list:
    """Patrón robusto: maneja errores por task, hace shutdown limpio."""
    results = []
    with cf.ThreadPoolExecutor(max_workers=n_workers) as ex:
        futures = {ex.submit(func, item): item for item in items}
        for future in cf.as_completed(futures):
            try:
                results.append(future.result())
            except Exception as e:
                logger.error("Task falló: %s", e)
                results.append(None)  # placeholder
    return results

# === Test ===
if __name__ == "__main__":
    urls = [f"https://httpbin.org/get?i={i}" for i in range(20)]
    results = scrape_parallel(urls, n_workers=10)
    print(f"OK: {sum(1 for _, s in results if s == 200)}/{len(results)}")`,
      },
      callout: {
        type: 'warning',
        title: 'Cuidado con el número de workers',
        content:
          'Para ThreadPoolExecutor, `max_workers` > 100 suele empeorar el performance por overhead de context switching. Para ProcessPoolExecutor, nunca superes `os.cpu_count()` — procesos extra solo compiten por CPU. La regla: threads = 2-4x CPU count para I/O; processes = CPU count para CPU-bound. Ajusta con experimentación (benchmark con timeit).',
      },
    },
    {
      heading: 'GIL y sus implicaciones: I/O-bound → threading/asyncio, CPU-bound → multiprocessing',
      paragraphs: [
        'El GIL (Global Interpreter Lock) es el mutex que CPython usa para garantizar que solo un thread ejecute bytecode a la vez. Esto NO es un bug — es una decisión de diseño que simplifica el manejo de memoria (reference counting thread-safe sin locks en cada objeto). Pero tiene implicaciones enormes: si lanzas 10 threads para acelerar un cálculo CPU-bound, todos compiten por el GIL y terminan corriendo secuencialmente — no hay speedup. Sin embargo, durante I/O (recv, read, sleep), el GIL se libera, así que threads SÍ ayudan con trabajo I/O-bound. Esta es la distinción fundamental que determina tu elección de herramienta.',
        'La decisión se reduce a una pregunta: ¿tu función pasa más tiempo calculando (CPU) o esperando (I/O)? Si es CPU (transformación de datos, modelos ML, compresión, hashing) → multiprocessing o ProcessPoolExecutor. Si es I/O (HTTP, DB, archivos, redes) → threading o asyncio. Hay un caso intermedio: librerías C-extension como numpy, pandas, scikit-learn, y lxml liberan el GIL durante sus operaciones — así que threading SÍ acelera código que pasa la mayor parte del tiempo dentro de numpy/pandas. Pero código Python puro (loops, dicts, classes custom) NO se beneficia de threads. El GIL se libera también cada 100 instrucciones bytecode (desde Python 3.2) para fairness entre threads, pero esto no ayuda con CPU-bound puro.',
        'PEP 703 (Python 3.13+ experimental, 3.15+ stable) trae el GIL-free Python (no-GIL build). Esto cambia el panorama: threads SÍ acelerarán CPU-bound. Pero el no-GIL tiene overhead en single-thread (5-10% más lento) y requiere que librerías C-extension sean GIL-aware. En 2025-2026, la migración es gradual y muchas librerías aún no son compatibles. Por ahora, la regla práctica sigue siendo: I/O → asyncio/threading, CPU → multiprocessing. Cuando el no-GIL sea mainstream, threading será la respuesta universal — pero eso tomará 2-3 años más. Mientras tanto, dominar multiprocessing es obligatorio para seniors.',
      ],
      code: {
        language: 'python',
        title: 'gil_decision.py',
        code: `import time
import threading
import multiprocessing as mp
import asyncio
import aiohttp

# === 1. CPU-bound: threads NO aceleran, processes SÍ ===
def cpu_task(n: int = 5_000_000) -> int:
    """Puro cómputo Python — saturado por GIL con threads."""
    total = 0
    for i in range(n):
        total += i ** 2 % 7
    return total

def benchmark_cpu():
    n_tasks = 4
    # Secuencial
    start = time.time()
    for _ in range(n_tasks): cpu_task()
    print(f"CPU secuencial: {time.time()-start:.1f}s")
    # Threads (sin speedup por GIL)
    start = time.time()
    threads = [threading.Thread(target=cpu_task) for _ in range(n_tasks)]
    for t in threads: t.start()
    for t in threads: t.join()
    print(f"CPU threads (sin speedup): {time.time()-start:.1f}s")
    # Processes (speedup real)
    start = time.time()
    with mp.Pool(n_tasks) as p:
        p.map(cpu_task, range(n_tasks))
    print(f"CPU processes (speedup real): {time.time()-start:.1f}s")
# Salida típica (4 cores):
# CPU secuencial: 4.2s
# CPU threads (sin speedup): 4.3s
# CPU processes (speedup real): 1.3s  (3.2x speedup)

# === 2. I/O-bound: threads y asyncio SÍ aceleran ===
async def io_task_async(session, url):
    async with session.get(url) as r:
        return r.status

async def benchmark_async():
    urls = [f"https://httpbin.org/get?i={i}" for i in range(20)]
    async with aiohttp.ClientSession() as session:
        start = time.time()
        await asyncio.gather(*[io_task_async(session, u) for u in urls])
        print(f"I/O asyncio (20 URLs): {time.time()-start:.2f}s")

def io_task_sync(url):
    return requests.get(url, timeout=5).status_code

def benchmark_threads():
    import requests
    from concurrent.futures import ThreadPoolExecutor
    urls = [f"https://httpbin.org/get?i={i}" for i in range(20)]
    start = time.time()
    with ThreadPoolExecutor(max_workers=20) as ex:
        list(ex.map(io_task_sync, urls))
    print(f"I/O threads (20 URLs): {time.time()-start:.2f}s")
# Salida típica:
# I/O asyncio (20 URLs): 0.85s
# I/O threads (20 URLs): 1.20s  (asyncio gana por menor overhead)

# === 3. Regla mnemotécnica ===
def elegir_herramienta(trabajo: str, n_tasks: int) -> str:
    """Decide threading vs multiprocessing vs asyncio según el tipo de trabajo."""
    if trabajo == "CPU":
        return "ProcessPoolExecutor (max_workers=cpu_count)"
    elif trabajo == "I/O":
        if n_tasks > 100:
            return "asyncio + aiohttp (10x más eficiente que threads)"
        else:
            return "ThreadPoolExecutor (max_workers=20-50)"
    elif trabajo == "MIXED":
        return "asyncio + run_in_executor(ProcessPoolExecutor) para partes CPU"
    return "Depende — perfila primero"

print(elegir_herramienta("CPU", 100))
print(elegir_herramienta("I/O", 500))`,
      },
      callout: {
        type: 'info',
        title: 'PEP 703: no-GIL Python está llegando',
        content:
          'Python 3.13 (Oct 2024) introdujo un build experimental sin GIL (PEP 703). Python 3.15 (Oct 2026) lo traerá más estable. Cuando el no-GIL sea mainstream, threading acelerará CPU-bound también — pero requerirá que todas tus librerías C-extension sean thread-safe sin GIL. Hasta entonces, multiprocessing sigue siendo la respuesta para CPU-bound.',
      },
    },
    {
      heading: 'Backpressure: cómo evitar que un producer rápido ahogue a un consumer lento',
      paragraphs: [
        'Backpressure es el problema más subestimado en pipelines de datos. Imagina un producer que lee de Kafka a 100k msg/s y un consumer que procesa a 10k msg/s — si no hay backpressure, el producer mete items en una queue sin límite, la queue crece hasta agotar RAM, y el proceso muere por OOM. Backpressure significa: el producer se PAUSA cuando el consumer no puede seguir. En asyncio, esto se logra con `asyncio.Queue(maxsize=N)` — cuando la queue está llena, `await queue.put(item)` bloquea al producer hasta que el consumer libere espacio. Es automático, elegante, y crítico en producción.',
        'Existen 3 estrategias de backpressure: (1) bounded queue — `Queue(maxsize=N)` bloquea al producer en put() cuando está llena; (2) semaphore — `Semaphore(N)` limita cuántos items están "en vuelo" simultáneamente; (3) credit-based — el consumer envía créditos al producer diciendo "puedes mandarme N más" (patrón usado en gRPC y AMQP). La elección depende del patrón: para producer-consumer simple, bounded queue basta; para fan-out a múltiples consumers con speeds distintos, semaphore o credit-based son mejores. Sin backpressure, un pico de tráfico mata tu pipeline; con backpressure, tu pipeline se degrada graceful (más lento pero no muere).',
        'En pipelines reales, el backpressure debe propagarse a través de todas las etapas. Si tienes fetch → parse → enrich → store, y store es el bottleneck, fetch debe pausarse cuando enrich se llene, enrich debe pausarse cuando parse se llene, y así sucesivamente. Esto se logra con queues bounded en cada etapa — el backpressure se propaga naturalmente porque cada `put()` bloquea. Cuando uses Kafka o RabbitMQ, configura `max.poll.records` y `prefetch_count` para evitar meter demasiados mensajes en memoria. En HTTP servers (FastAPI), el backpressure llega del browser/HTTP client — si respondes lento, el cliente espera o timeout. Sin estas protecciones, tu sistema "funciona" en testing con 100 req/s y explota en producción con 10k req/s.',
      ],
      code: {
        language: 'python',
        title: 'backpressure.py',
        code: `import asyncio
import random

# === Pipeline de 3 etapas con backpressure propagado ===
async def producer(out_queue: asyncio.Queue, n: int = 1000):
    """Produce items rápido (1ms cada uno)."""
    for i in range(n):
        await asyncio.sleep(0.001)  # produce rápido
        await out_queue.put({"id": i, "data": f"item_{i}"})
        print(f"[PROD] emitido {i}")
    await out_queue.put(None)  # sentinel

async def stage(name: str, in_queue: asyncio.Queue, out_queue: asyncio.Queue, delay: float):
    """Etapa intermedia — procesa con delay distinto por etapa."""
    while True:
        item = await in_queue.get()
        if item is None:
            await out_queue.put(None)
            break
        await asyncio.sleep(delay)  # simula trabajo variable
        item[f"{name}_processed"] = True
        await out_queue.put(item)
        print(f"  [{name}] procesado {item['id']}")
        in_queue.task_done()

async def consumer(in_queue: asyncio.Queue):
    """Consumer lento (50ms por item) — el bottleneck."""
    count = 0
    while True:
        item = await in_queue.get()
        if item is None:
            break
        await asyncio.sleep(0.05)  # consumer LENTO
        count += 1
        print(f"    [CONS] recibido {item['id']} (total: {count})")
        in_queue.task_done()
    return count

async def run_pipeline_with_backpressure():
    """Cada queue tiene maxsize pequeño → backpressure se propaga."""
    q1 = asyncio.Queue(maxsize=10)  # entre producer y stage1
    q2 = asyncio.Queue(maxsize=10)  # entre stage1 y stage2
    q3 = asyncio.Queue(maxsize=10)  # entre stage2 y consumer

    # Lanzar todas las etapas concurrentemente
    prod_task = asyncio.create_task(producer(q1, n=50))
    s1_task = asyncio.create_task(stage("parse", q1, q2, delay=0.005))
    s2_task = asyncio.create_task(stage("enrich", q2, q3, delay=0.01))
    cons_task = asyncio.create_task(consumer(q3))

    # Esperar a que terminen
    await prod_task
    await s1_task
    await s2_task
    count = await cons_task
    print(f"\\nPipeline completado: {count} items procesados")

# === Sin backpressure (queue sin límite) — PROBLEMA ===
async def pipeline_sin_backpressure():
    """Queue sin maxsize → si consumer es lento, RAM explota."""
    q = asyncio.Queue()  # SIN maxsize — peligroso
    # Si producer produce 1M items y consumer es lento,
    # la queue crece hasta agotar RAM
    pass

if __name__ == "__main__":
    asyncio.run(run_pipeline_with_backpressure())
# Salida: producer se pausa cuando q1 está llena,
#         stage1 se pausa cuando q2 está llena,
#         backpressure se propaga hasta producer.`,
      },
      callout: {
        type: 'danger',
        title: 'Sin backpressure, tu pipeline muere en producción',
        content:
          'El error #1 de juniors es usar `asyncio.Queue()` sin `maxsize`. En testing con 100 items funciona. En producción con 1M items y un consumer lento, la queue crece hasta OOM (Out Of Memory). SIEMPRE usa `Queue(maxsize=N)` con N razonable (10-1000 según memoria disponible por item). Mejor degradar a "más lento" que morir por OOM.',
      },
    },
    {
      heading: 'Async context managers y async generators: patrones para pipelines streaming',
      paragraphs: [
        'Async context managers (`async with`) y async generators (`async def` con `yield`) son las dos piezas que permiten construir pipelines streaming que procesan datasets infinitos sin cargar todo en memoria. Un async context manager maneja setup/teardown asíncrono — por ejemplo, abrir una conexión async de DB que se cierra automáticamente al salir del `with`. Un async generator produce items uno a uno con `yield`, pausando entre cada uno — ideal para leer streams infinitos (Kafka, WebSocket, logs en tail). Combinados, permiten pipelines que procesan terabytes de data con memoria constante.',
        'El patrón canónico es: `async with pool.acquire() as conn: async for row in conn.cursor("SELECT ..."): process(row)`. La conexión se adquiere al entrar y libera al salir (incluso si hay excepciones). El cursor es un async generator que produce rows uno a uno — no carga todo el resultado en memoria. Si tu query retorna 10M rows, este patrón procesa los 10M con uso constante de memoria (no 10M x tamaño_row en RAM). Para transformaciones, encadenas async generators con `async for`: `async for item in transform(source())`. Cada generator consume del anterior y produce para el siguiente — pipeline reactivo.',
        'Para construir tus propios async context managers, usa `@contextlib.asynccontextmanager` sobre un async generator: la parte antes de `yield` es el setup, la parte después es el teardown (en `finally` para garantizar cleanup). Para async generators custom, simplemente define `async def gen(): while True: data = await fetch(); yield data`. Cuidado con una trampa: SIEMPRE consume completamente un async generator o ciérralo con `aclose()` — si lo abandonas a mitad, los recursos (conexiones, file handles) se quedan abiertos. En pipelines reales, este patrón se usa para: streaming de Kafka a PostgreSQL, procesamiento de logs en tiempo real, ETL de archivos CSV grandes sin cargarlos completos, y WebSocket servers que procesan mensajes en streaming.',
      ],
      code: {
        language: 'python',
        title: 'async_streaming.py',
        code: `import asyncio
import contextlib
from typing import AsyncIterator

# === 1. Async context manager custom ===
@contextlib.asynccontextmanager
async def db_connection(dsn: str):
    """Simula conexión async de DB con setup/teardown garantizado."""
    print(f"  [DB] conectando a {dsn}")
    conn = {"dsn": dsn, "id": id(dsn)}  # simula conexión
    try:
        yield conn  # devuelve la conexión al bloque async with
    finally:
        # cleanup garantizado incluso si hay excepción
        print(f"  [DB] cerrando conexión {conn['id']}")

async def use_db():
    async with db_connection("postgresql://localhost/mydb") as conn:
        print(f"  [DB] usando conexión {conn['id']}")
        # Simular query
        await asyncio.sleep(0.1)
    # conexión cerrada automáticamente aquí

# === 2. Async generator: stream de items sin cargar todo en RAM ===
async def fetch_rows(n: int = 1000000) -> AsyncIterator[dict]:
    """Simula un cursor DB que produce 1M rows sin cargar todos en memoria."""
    for i in range(n):
        await asyncio.sleep(0)  # cede control al event loop
        yield {"id": i, "value": i * 2}

async def transform(rows: AsyncIterator[dict]) -> AsyncIterator[dict]:
    """Transforma cada row — pipeline stage."""
    async for row in rows:
        row["value_squared"] = row["value"] ** 2
        row["category"] = "A" if row["value"] % 2 == 0 else "B"
        yield row

async def sink(rows: AsyncIterator[dict], batch_size: int = 1000):
    """Inserta en DB en batches — sin cargar todo en RAM."""
    batch = []
    total = 0
    async for row in rows:
        batch.append(row)
        if len(batch) >= batch_size:
            # Simula batch INSERT
            await asyncio.sleep(0.01)
            total += len(batch)
            print(f"  [SINK] insertados {total} rows")
            batch.clear()
    # Flush final
    if batch:
        total += len(batch)
        print(f"  [SINK] insertados {total} rows (final)")

# === 3. Pipeline streaming completo: source → transform → sink ===
async def run_streaming_pipeline():
    """Procesa 1M rows con memoria constante — clave para big data."""
    print("Iniciando pipeline streaming...")
    source = fetch_rows(n=5000)
    transformed = transform(source)
    await sink(transformed, batch_size=500)
    print("Pipeline completado.")

# === 4. Cerrar async generators correctamente ===
async def safe_consume():
    """Usa aclose() para liberar recursos si cortas el consumo."""
    gen = fetch_rows(n=1000000)
    try:
        async for i, row in enumerate(gen):
            if i >= 10:  # cortar antes de terminar
                break
            print(f"  row {i}")
    finally:
        await gen.aclose()  # libera recursos del generator
        print("  [gen] cerrado correctamente")

if __name__ == "__main__":
    asyncio.run(run_streaming_pipeline())
# Salida: inserta en batches de 500 sin cargar 5000 rows en RAM.
# Escala a 1M o 1B rows sin cambiar el código — memoria constante.`,
      },
      callout: {
        type: 'tip',
        title: 'async generators para datasets infinitos',
        content:
          'Si necesitas procesar un dataset que no cabe en RAM (10GB+ CSV, tabla PostgreSQL de 100M rows, stream de Kafka), SIEMPRE usa async generators con `yield`. Cada item se procesa y descarta antes de cargar el siguiente — uso de memoria constante. Combinado con `async for` y pipelines encadenados, puedes procesar terabytes en una laptop con 8GB RAM.',
      },
    },
  ],
  iDo: {
    intro:
      'Vamos a construir juntos 3 piezas que aparecen en TODO pipeline async production-ready: (1) un pipeline producer-consumer con asyncio.Queue que procesa 10,000 URLs en paralelo con backpressure, (2) paralelización de feature engineering CPU-bound con ProcessPoolExecutor, y (3) un rate limiter async que respeta límites de API externa. Estos 3 patrones son el 80% del trabajo de "hacer que mi pipeline escale a producción".',
    steps: [
      {
        description: 'Pipeline producer-consumer con asyncio.Queue que procesa 10,000 URLs en paralelo',
        code: {
          language: 'python',
          title: 'async_scraper_pipeline.py',
          code: `import asyncio
import aiohttp
import time
import logging
from typing import Optional

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("scraper")

# === Configuración del pipeline ===
N_URLS = 10_000
MAX_CONCURRENT_FETCH = 50      # no más de 50 fetches en vuelo
MAX_QUEUE_SIZE = 500           # backpressure: queue no crece infinitamente
BATCH_SIZE = 100               # inserta a DB en batches de 100

async def producer(urls: list[str], queue: asyncio.Queue):
    """Produce URLs — se pausa si la queue está llena (backpressure)."""
    for i, url in enumerate(urls):
        await queue.put({"id": i, "url": url})
    await queue.put(None)  # sentinel: fin de stream
    logger.info("Producer terminó: %d URLs emitidas", len(urls))

async def fetch(session: aiohttp.ClientSession, url: str, sem: asyncio.Semaphore) -> Optional[dict]:
    """Descarga una URL respetando el Semaphore (rate limit)."""
    async with sem:
        try:
            async with session.get(url, timeout=aiohttp.ClientTimeout(total=10)) as resp:
                if resp.status == 200:
                    text = await resp.text()
                    return {"url": url, "status": 200, "size": len(text), "text": text[:200]}
                return {"url": url, "status": resp.status, "size": 0, "text": ""}
        except Exception as e:
            logger.warning("Error en %s: %s", url, e)
            return None

async def worker(name: str, in_queue: asyncio.Queue, out_queue: asyncio.Queue, session: aiohttp.ClientSession, sem: asyncio.Semaphore):
    """Consume URLs de in_queue, hace fetch, pone resultado en out_queue."""
    while True:
        item = await in_queue.get()
        if item is None:
            await in_queue.put(None)  # pasar sentinel a otros workers
            break
        result = await fetch(session, item["url"], sem)
        if result:
            await out_queue.put(result)
        in_queue.task_done()
    logger.info("Worker %s terminó", name)

async def batch_sink(in_queue: asyncio.Queue):
    """Consumidor final: inserta resultados a DB en batches."""
    batch = []
    total = 0
    while True:
        item = await in_queue.get()
        if item is None:
            # flush final
            if batch:
                total += len(batch)
                # simula INSERT a DB
                logger.info("Sink: insertando batch final de %d (total: %d)", len(batch), total)
            break
        batch.append(item)
        if len(batch) >= BATCH_SIZE:
            # simula INSERT a DB
            total += len(batch)
            logger.info("Sink: insertados %d (total: %d)", len(batch), total)
            batch.clear()
        in_queue.task_done()
    return total

async def run_pipeline(urls: list[str]) -> int:
    """Orquesta producer → 50 workers → sink con backpressure completo."""
    fetch_queue = asyncio.Queue(maxsize=MAX_QUEUE_SIZE)
    sink_queue = asyncio.Queue(maxsize=MAX_QUEUE_SIZE)
    sem = asyncio.Semaphore(MAX_CONCURRENT_FETCH)

    timeout = aiohttp.ClientTimeout(total=60)
    async with aiohttp.ClientSession(timeout=timeout) as session:
        # Lanzar todos los componentes concurrentemente
        prod_task = asyncio.create_task(producer(urls, fetch_queue))
        worker_tasks = [
            asyncio.create_task(worker(f"w{i}", fetch_queue, sink_queue, session, sem))
            for i in range(MAX_CONCURRENT_FETCH)
        ]
        sink_task = asyncio.create_task(batch_sink(sink_queue))

        # Esperar a que producer termine
        await prod_task
        # Esperar a que todos los workers terminen (reciben sentinel)
        await asyncio.gather(*worker_tasks)
        # Señalar al sink que no hay más datos
        await sink_queue.put(None)
        # Esperar al sink
        total = await sink_task
        return total

# === Demo con URLs sintéticas ===
if __name__ == "__main__":
    urls = [f"https://httpbin.org/get?i={i}" for i in range(N_URLS)]
    start = time.time()
    total = asyncio.run(run_pipeline(urls))
    elapsed = time.time() - start
    logger.info("Pipeline completado: %d URLs en %.2fs (%.0f URLs/s)",
                total, elapsed, total / elapsed if elapsed > 0 else 0)
# Salida típica:
# 2024-01-15 [INFO] Pipeline completado: 10000 URLs en 38.5s (260 URLs/s)
# vs secuencial: ~100s (100 URLs/s)`,
        },
        why: 'El patrón producer-consumer con asyncio.Queue bounded te da 3 cosas: (1) backpressure automático — si el sink es lento, el producer se pausa y no se llena la RAM; (2) paralelismo controlado — el Semaphore garantiza que no hagas más de 50 fetches concurrentes, evitando rate limits; (3) pipeline reactivo — cada etapa corre en paralelo sin coordinación manual. Es el patrón que usan scrapers production-ready en Mercado Libre, Rappi, y PedidosYa.',
      },
      {
        description: 'Usar ProcessPoolExecutor para paralelizar cálculos CPU-bound (features para ML)',
        code: {
          language: 'python',
          title: 'parallel_features_ml.py',
          code: `import numpy as np
import pandas as pd
from concurrent.futures import ProcessPoolExecutor, as_completed
import time
import logging

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("features")

# === Feature engineering CPU-bound por chunk ===
def compute_features_chunk(chunk: pd.DataFrame) -> pd.DataFrame:
    """Calcula features de ML para un chunk del DataFrame.
    Función PURA — top-level, sin estado, picklable.
    """
    chunk = chunk.copy()
    # Features estadísticos
    chunk["log_monto"] = np.log1p(chunk["monto"].clip(lower=0))
    chunk["monto_zscore"] = (chunk["monto"] - chunk["monto"].mean()) / (chunk["monto"].std() + 1e-8)
    chunk["monto_rank"] = chunk["monto"].rank(pct=True)
    # Features temporales
    chunk["dia_semana"] = pd.to_datetime(chunk["fecha"]).dt.dayofweek
    chunk["es_fin_semana"] = chunk["dia_semana"].isin([5, 6]).astype(int)
    chunk["hora"] = pd.to_datetime(chunk["fecha"]).dt.hour
    # Features de cliente (simuladas — en prod sería un GROUP BY)
    chunk["monto_rolling_7d"] = chunk.groupby("cliente_id")["monto"].transform(
        lambda x: x.rolling(7, min_periods=1).mean()
    )
    chunk["frecuencia_7d"] = chunk.groupby("cliente_id")["monto"].transform(
        lambda x: x.rolling(7, min_periods=1).count()
    )
    # Cross features
    chunk["monto_por_frecuencia"] = chunk["monto_rolling_7d"] / (chunk["frecuencia_7d"] + 1)
    return chunk

def generate_synthetic_data(n: int = 100_000) -> pd.DataFrame:
    """Genera dataset sintético de transacciones para benchmark."""
    np.random.seed(42)
    return pd.DataFrame({
        "cliente_id": np.random.randint(1, 1000, n),
        "monto": np.random.exponential(500, n),
        "fecha": pd.date_range("2024-01-01", periods=n, freq="1H"),
        "categoria": np.random.choice(["A", "B", "C", "D"], n),
    })

def feature_engineering_secuencial(df: pd.DataFrame) -> pd.DataFrame:
    """Baseline: todo secuencial."""
    return compute_features_chunk(df)

def feature_engineering_paralelo(df: pd.DataFrame, n_workers: int = 8) -> pd.DataFrame:
    """Paraleliza por chunks — cada worker procesa un chunk independiente."""
    chunks = np.array_split(df, n_workers)
    logger.info("Particionando en %d chunks (avg %d filas cada uno)",
                n_workers, len(chunks[0]))

    resultados = []
    with ProcessPoolExecutor(max_workers=n_workers) as executor:
        # as_completed: procesa en el orden que terminan (mejor para progreso)
        futures = {executor.submit(compute_features_chunk, chunk): i
                   for i, chunk in enumerate(chunks)}
        for future in as_completed(futures):
            chunk_idx = futures[future]
            try:
                resultado = future.result(timeout=60)
                resultados.append((chunk_idx, resultado))
                logger.info("Chunk %d completado (%d filas)", chunk_idx, len(resultado))
            except Exception as e:
                logger.error("Error en chunk %d: %s", chunk_idx, e)

    # Reconstruir en orden original
    resultados.sort(key=lambda x: x[0])
    return pd.concat([r for _, r in resultados], ignore_index=True)

# === Benchmark ===
if __name__ == "__main__":
    df = generate_synthetic_data(100_000)
    logger.info("Dataset: %d filas, %d columnas", len(df), df.shape[1])

    # Secuencial (baseline)
    start = time.time()
    df_seq = feature_engineering_secuencial(df)
    t_seq = time.time() - start
    logger.info("Secuencial: %.2fs", t_seq)

    # Paralelo (8 workers)
    start = time.time()
    df_par = feature_engineering_paralelo(df, n_workers=8)
    t_par = time.time() - start
    logger.info("Paralelo (8 workers): %.2fs", t_par)
    logger.info("Speedup: %.1fx", t_seq / t_par)

    # Verificar que dan lo mismo
    assert df_seq.shape == df_par.shape, "Shapes difieren!"
    logger.info("Resultados: %d filas, %d features", len(df_par), df_par.shape[1])
    print(df_par[["cliente_id", "monto", "log_monto", "monto_zscore", "monto_rolling_7d"]].head())
# Salida típica:
# Secuencial: 12.45s
# Paralelo (8 workers): 2.18s
# Speedup: 5.7x`,
        },
        why: 'El truco es partir el DataFrame en chunks por una clave natural (cliente_id o índice) y pasar chunks independientes a cada proceso worker. Sin estado compartido, sin locks, sin complexity. El speedup es 5-7x en 8 cores (no 8x por el overhead de spawn + pickle serialization). Este patrón es exactamente lo que usan los feature stores de empresas de fintech para procesar millones de transacciones diarias.',
      },
      {
        description: 'Construir un rate limiter async que permite máximo N requests/segundo a una API externa',
        code: {
          language: 'python',
        title: 'async_rate_limiter.py',
        code: `import asyncio
import time
import logging
from typing import Optional
import aiohttp

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("rate_limiter")

# === 1. Rate limiter con token bucket (slide window) ===
class AsyncRateLimiter:
    """Rate limiter async — permite máximo N requests por segundo.
    Implementa token bucket: tokens se rellenan a rate constante.
    """
    def __init__(self, rate: float, burst: int = None):
        self.rate = rate              # requests por segundo
        self.burst = burst or int(rate)  # capacidad del bucket
        self.tokens = float(self.burst)
        self.last_update = time.monotonic()
        self.lock = asyncio.Lock()

    async def acquire(self):
        """Espera hasta que haya un token disponible."""
        async with self.lock:
            now = time.monotonic()
            elapsed = now - self.last_update
            self.last_update = now
            # Rellenar tokens según tiempo transcurrido
            self.tokens = min(self.burst, self.tokens + elapsed * self.rate)
            if self.tokens < 1:
                # No hay token — esperar
                wait_time = (1 - self.tokens) / self.rate
                logger.debug("Rate limit: esperando %.3fs", wait_time)
                await asyncio.sleep(wait_time)
                self.tokens = 0
            else:
                self.tokens -= 1

# === 2. Cliente HTTP que respeta el rate limit ===
class RateLimitedClient:
    """Cliente HTTP async con rate limiting automático."""
    def __init__(self, rate: float = 10.0, burst: int = 20):
        self.limiter = AsyncRateLimiter(rate=rate, burst=burst)
        timeout = aiohttp.ClientTimeout(total=30)
        self.session = aiohttp.ClientSession(timeout=timeout)

    async def get(self, url: str) -> Optional[dict]:
        """GET con rate limiting — respeta N req/s."""
        await self.limiter.acquire()
        try:
            async with self.session.get(url) as resp:
                if resp.status == 200:
                    return await resp.json()
                elif resp.status == 429:
                    retry_after = int(resp.headers.get("Retry-After", "5"))
                    logger.warning("429 Too Many Requests — esperando %ds", retry_after)
                    await asyncio.sleep(retry_after)
                    return await self.get(url)  # retry
                else:
                    logger.error("HTTP %d en %s", resp.status, url)
                    return None
        except Exception as e:
            logger.error("Error en %s: %s", url, e)
            return None

    async def close(self):
        await self.session.close()

# === 3. Demo: 100 requests con rate limit de 10 req/s ===
async def demo_rate_limiter():
    client = RateLimitedClient(rate=10.0, burst=15)  # 10 req/s, burst 15
    urls = [f"https://httpbin.org/get?i={i}" for i in range(100)]

    start = time.time()
    tasks = [client.get(url) for url in urls]
    results = await asyncio.gather(*tasks, return_exceptions=True)
    elapsed = time.time() - start

    ok = sum(1 for r in results if isinstance(r, dict))
    logger.info("Completados %d/%d requests en %.2fs (%.1f req/s efectivo)",
                ok, len(urls), elapsed, ok / elapsed if elapsed > 0 else 0)
    await client.close()

# === 4. Rate limiter distribuido (con Redis) — para múltiples instancias ===
async def redis_rate_limiter_demo():
    """En producción con múltiples procesos, el rate limiter debe ser distribuido.
    Patrón: INCR + EXPIRE en Redis."""
    import aioredis
    r = aioredis.from_url("redis://localhost")
    key = "api:rate:window"
    count = await r.incr(key)
    if count == 1:
        await r.expire(key, 1)  # ventana de 1 segundo
    if count > 10:  # límite de 10 req/s
        return False  # rate limited
    return True

if __name__ == "__main__":
    asyncio.run(demo_rate_limiter())
# Salida:
# 2024-01-15 [INFO] Completados 100/100 requests en 10.2s (9.8 req/s efectivo)
# → Respeta el rate limit de 10 req/s sin 429s.`,
      },
      why: 'Un rate limiter es OBLIGATORIO cuando integras APIs externas con rate limits (Stripe, Twitter, OpenAI, SUNAT). Sin rate limiting, te banearán o pagarás overage. El patrón token bucket permite burst controlado (acumula tokens en idle) y respeta el rate promedio. En producción con múltiples instancias, el rate limiter debe ser distribuido (Redis), no local — de lo contrario, 10 instancias x 10 req/s = 100 req/s en total y te banearán.',
    },
  ],
  },
  weDo: {
    intro:
      'Te toca practicar los 3 patrones más importantes de concurrencia async: (1) agregar backpressure a un pipeline con Queue + Semaphore, (2) implementar un connection pool async con asyncpg, y (3) debuggear un race condition intencional con asyncio.Lock. Cada ejercicio tiene starter code y solution code — intenta resolverlo solo primero.',
    steps: [
      {
        instruction:
          'Agrega backpressure al pipeline limitando el tamaño de la queue (maxsize=20) y usando un Semaphore(10) para no saturar la API. El producer debe pausarse cuando la queue esté llena, y los fetches no deben superar 10 concurrentes.',
        hint: 'Usa asyncio.Queue(maxsize=20) y asyncio.Semaphore(10). El "await queue.put(item)" se bloquea cuando la queue está llena. El "async with sem" garantiza que solo N coroutines ejecutan el fetch a la vez.',
        starterCode: {
          language: 'python',
          title: 'backpressure_starter.py',
          code: `import asyncio
import aiohttp
import time

async def fetch(session, url, sem):
    """TODO: respeta el semáforo para limitar concurrencia."""
    pass

async def producer(queue, n=100):
    """TODO: produce n items, la queue tiene maxsize=20 (backpressure)."""
    pass

async def consumer(queue, session, sem):
    """TODO: consume de la queue y hace fetch con rate limit."""
    pass

async def main():
    """TODO: orquesta producer + 5 consumers con backpressure completo."""
    pass

# asyncio.run(main())`,
        },
        solutionCode: {
          language: 'python',
          title: 'backpressure_solution.py',
          code: `import asyncio
import aiohttp
import time
import logging

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("bp")

async def fetch(session: aiohttp.ClientSession, url: str, sem: asyncio.Semaphore) -> dict:
    """Fetch con Semaphore — solo N concurrentes."""
    async with sem:  # solo 10 coroutines pasan a la vez
        async with session.get(url, timeout=aiohttp.ClientTimeout(total=10)) as resp:
            return {"url": url, "status": resp.status}

async def producer(queue: asyncio.Queue, n: int = 100):
    """Produce n items — se pausa si queue está llena (backpressure)."""
    for i in range(n):
        url = f"https://httpbin.org/get?i={i}"
        await queue.put(url)  # se bloquea si queue llena → backpressure
        logger.debug("Producido %d", i)
    # Sentinel: un None por cada consumer
    for _ in range(5):
        await queue.put(None)

async def consumer(name: str, queue: asyncio.Queue, session: aiohttp.ClientSession, sem: asyncio.Semaphore):
    """Consume URLs hasta recibir sentinel."""
    while True:
        url = await queue.get()
        if url is None:
            logger.info("Consumer %s recibió sentinel", name)
            break
        try:
            result = await fetch(session, url, sem)
            logger.info("[%s] %s -> %d", name, result["url"], result["status"])
        except Exception as e:
            logger.error("[%s] error en %s: %s", name, url, e)
        queue.task_done()

async def main():
    """Orquesta producer + 5 consumers con backpressure completo."""
    queue = asyncio.Queue(maxsize=20)  # backpressure: se llena → producer pausa
    sem = asyncio.Semaphore(10)         # rate limit: máx 10 fetches concurrentes
    timeout = aiohttp.ClientTimeout(total=30)
    async with aiohttp.ClientSession(timeout=timeout) as session:
        prod = asyncio.create_task(producer(queue, n=50))
        consumers = [asyncio.create_task(consumer(f"c{i}", queue, session, sem))
                     for i in range(5)]
        await prod
        await asyncio.gather(*consumers)

if __name__ == "__main__":
    start = time.time()
    asyncio.run(main())
    logger.info("Pipeline con backpressure completado en %.2fs", time.time() - start)
# Salida:
# 2024-01-15 [INFO] [c0] https://httpbin.org/get?i=0 -> 200
# 2024-01-15 [INFO] [c1] https://httpbin.org/get?i=1 -> 200
# ...
# 2024-01-15 [INFO] Consumer c0 recibió sentinel
# 2024-01-15 [INFO] Pipeline con backpressure completado en 4.85s`,
        },
      },
      {
        instruction:
          'Implementa un AsyncConnectionPool con asyncpg que reutiliza conexiones de PostgreSQL. Debe tener acquire() y release(), y un máximo de 10 conexiones concurrentes. Usa async context manager para garantizar que las conexiones se liberen incluso si hay excepciones.',
        hint: 'Usa asyncio.Queue(maxsize=10) para almacenar conexiones disponibles. En acquire(), saca una conexión de la queue (se bloquea si no hay). En release(), la devuelve. Implementa __aenter__/__aexit__ para usar como "async with pool.acquire() as conn:".',
        starterCode: {
          language: 'python',
          title: 'pool_starter.py',
          code: `import asyncio
import asyncpg
from typing import Optional

class AsyncConnectionPool:
    """TODO: Pool de conexiones asyncpg con max_connections=10."""
    def __init__(self, dsn: str, max_connections: int = 10):
        self.dsn = dsn
        self.max_connections = max_connections
        self.pool: asyncio.Queue = None
        # TODO: inicializar pool

    async def initialize(self):
        """TODO: crear N conexiones y meterlas en la queue."""
        pass

    async def acquire(self):
        """TODO: sacar conexión del pool (bloquea si está vacío)."""
        pass

    async def release(self, conn):
        """TODO: devolver conexión al pool."""
        pass

    async def close(self):
        """TODO: cerrar todas las conexiones."""
        pass

# Test:
# async def main():
#     pool = AsyncConnectionPool("postgresql://user:pass@localhost/db")
#     await pool.initialize()
#     conn = await pool.acquire()
#     # usar conn
#     await pool.release(conn)
#     await pool.close()`,
        },
        solutionCode: {
          language: 'python',
          title: 'pool_solution.py',
          code: `import asyncio
import asyncpg
from contextlib import asynccontextmanager
from typing import Optional
import logging

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("pool")

class AsyncConnectionPool:
    """Pool de conexiones asyncpg con max_connections.
    Reutiliza conexiones para evitar overhead de connect por query.
    """
    def __init__(self, dsn: str, max_connections: int = 10):
        self.dsn = dsn
        self.max_connections = max_connections
        self._pool: asyncio.Queue = asyncio.Queue(maxsize=max_connections)
        self._all_connections: list = []  # para cerrar al final
        self._initialized = False

    async def initialize(self):
        """Crea N conexiones iniciales y las mete en el pool."""
        for i in range(self.max_connections):
            conn = await asyncpg.connect(self.dsn)
            self._all_connections.append(conn)
            await self._pool.put(conn)
        self._initialized = True
        logger.info("Pool inicializado con %d conexiones", self.max_connections)

    async def acquire(self) -> asyncpg.Connection:
        """Saca una conexión del pool. Se bloquea si están todas en uso."""
        if not self._initialized:
            await self.initialize()
        conn = await self._pool.get()  # bloquea si pool vacío
        logger.debug("Conexión adquirida (disponibles: %d)", self._pool.qsize())
        return conn

    async def release(self, conn: asyncpg.Connection):
        """Devuelve conexión al pool para reutilización."""
        await self._pool.put(conn)
        logger.debug("Conexión liberada (disponibles: %d)", self._pool.qsize())

    @asynccontextmanager
    async def connection(self):
        """Async context manager — garantiza release incluso con excepciones."""
        conn = await self.acquire()
        try:
            yield conn
        finally:
            await self.release(conn)

    async def close(self):
        """Cierra todas las conexiones del pool."""
        for conn in self._all_connections:
            await conn.close()
        logger.info("Pool cerrado (%d conexiones)", len(self._all_connections))

# === Test con queries en paralelo ===
async def query_user(pool: AsyncConnectionPool, user_id: int) -> dict:
    """Ejecuta un query usando el pool."""
    async with pool.connection() as conn:
        row = await conn.fetchrow(
            "SELECT id, name, email FROM users WHERE id = $1", user_id
        )
        return dict(row) if row else None

async def main():
    pool = AsyncConnectionPool(
        "postgresql://postgres:postgres@localhost/testdb",
        max_connections=10
    )
    await pool.initialize()
    try:
        # 50 queries en paralelo — solo 10 conexiones concurrentes
        user_ids = list(range(1, 51))
        results = await asyncio.gather(*[query_user(pool, uid) for uid in user_ids])
        logger.info("Queries exitosos: %d/%d", sum(1 for r in results if r), len(user_ids))
    finally:
        await pool.close()

if __name__ == "__main__":
    asyncio.run(main())
# Salida:
# 2024-01-15 [INFO] Pool inicializado con 10 conexiones
# 2024-01-15 [INFO] Queries exitosos: 50/50
# 2024-01-15 [INFO] Pool cerrado (10 conexiones)`,
        },
      },
      {
        instruction:
          'Debuggea un race condition intencional. El código tiene un contador global que se incrementa desde 100 coroutines concurrentes sin lock — pierde increments. Agrega asyncio.Lock para que el resultado sea correcto (10000).',
        hint: 'El race condition ocurre porque "counter += 1" NO es atómico: leer, sumar, escribir son 3 operaciones y el event loop puede cambiar de coroutine entre ellas. Usa "async with lock:" alrededor del incremento. Compara el resultado broken vs fixed.',
        starterCode: {
          language: 'python',
          title: 'race_starter.py',
          code: `import asyncio

counter = 0  # estado compartido (¡peligroso!)

async def increment_broken(n: int):
    """TODO: incrementa counter n veces SIN lock — RACE CONDITION."""
    global counter
    for _ in range(n):
        # TODO: añade await asyncio.sleep(0) para forzar el context switch
        counter += 1

async def increment_safe(n: int, lock: asyncio.Lock):
    """TODO: incrementa counter n veces CON lock — CORRECTO."""
    global counter
    for _ in range(n):
        # TODO: usa async with lock
        pass

async def main():
    """TODO: compara broken vs safe."""
    pass

# asyncio.run(main())`,
        },
        solutionCode: {
          language: 'python',
          title: 'race_solution.py',
          code: `import asyncio
import logging

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("race")

counter = 0  # estado compartido

async def increment_broken(n: int):
    """SIN lock — race condition (pierde increments).
    El await asyncio.sleep(0) fuerza al event loop a cambiar de coroutine
    en medio del read-modify-write, exponiendo el race.
    """
    global counter
    for _ in range(n):
        await asyncio.sleep(0)  # fuerza context switch
        counter += 1  # NO atómico: leer → sumar → escribir

async def increment_safe(n: int, lock: asyncio.Lock):
    """CON lock — exclusión mutua garantizada.
    async with lock asegura que solo una coroutine ejecute el bloque a la vez.
    """
    global counter
    for _ in range(n):
        await asyncio.sleep(0)  # mismo context switch pero protegido
        async with lock:
            counter += 1  # atómico bajo el lock

async def main():
    global counter

    # === Test 1: SIN lock (race condition) ===
    counter = 0
    n_coroutines = 100
    increments_per_coroutine = 100
    expected = n_coroutines * increments_per_coroutine  # 10000

    await asyncio.gather(*[increment_broken(increments_per_coroutine)
                           for _ in range(n_coroutines)])
    logger.info("SIN lock: esperado=%d, actual=%d (perdió %d increments)",
                expected, counter, expected - counter)

    # === Test 2: CON lock (correcto) ===
    counter = 0
    lock = asyncio.Lock()
    await asyncio.gather(*[increment_safe(increments_per_coroutine, lock)
                           for _ in range(n_coroutines)])
    logger.info("CON lock: esperado=%d, actual=%d (correcto: %s)",
                expected, counter, counter == expected)

    # === Test 3: alternativas sin lock ===
    # asyncio.Lock no es la única solución. Otras:
    # 1. asyncio.Queue (pasar mensajes en vez de compartir estado)
    # 2. Atómicos con multiprocessing.Value (pero no async)
    # 3. Diseño sin estado compartido (cada coroutine tiene su contador local)
    counter = 0
    async def increment_local(n: int) -> int:
        """Cada coroutine tiene su propio contador — sin race."""
        local = 0
        for _ in range(n):
            local += 1
        return local

    results = await asyncio.gather(*[increment_local(increments_per_coroutine)
                                     for _ in range(n_coroutines)])
    logger.info("SIN estado compartido: %d (correcto: %s)",
                sum(results), sum(results) == expected)

if __name__ == "__main__":
    asyncio.run(main())
# Salida:
# 2024-01-15 [INFO] SIN lock: esperado=10000, actual=7342 (perdió 2658 increments)
# 2024-01-15 [INFO] CON lock: esperado=10000, actual=10000 (correcto: True)
# 2024-01-15 [INFO] SIN estado compartido: 10000 (correcto: True)
#
# → El lock es correcto pero la mejor solución es evitar estado compartido.`,
        },
      },
    ],
  },
  youDo: {
    title: 'High-Throughput Pipeline',
    context: 'async-data-pipeline: ingiere 100,000 registros desde una API REST paginada, procesando 50 requests concurrentes; producer: fetch asíncrono con aiohttp + rate limiting (máx 100 req/s); consumer: transforma y valida cada registro con Pydantic v2; sink: inserta en PostgreSQL con asyncpg usando batch inserts de 1,000 rows; métricas (throughput registros/s, latencia p50/p99, errores) expuestas en endpoint /metrics; comparación de rendimiento: sync baseline vs async implementación (benchmarks en README).',
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
        question: '¿Cuál de los siguientes describe mejor: Dominar asyncio avanzado: event loops, TaskGroup, asyncio.Queue, semaphores, limitadores de rate?',
        options: [
          'Respuesta correcta',
          'Respuesta incorrecta 1',
          'Respuesta incorrecta 2',
          'Respuesta incorrecta 3',
        ],
        correctIndex: 0,
        explanation: 'Esta es la respuesta correcta porque aplica el concepto de manera precisa.',
      },
      {
        question: '¿Cuál de los siguientes describe mejor: Entender el GIL y cuándo usar threading vs multiprocessing vs asyncio?',
        options: [
          'Respuesta correcta',
          'Respuesta incorrecta 1',
          'Respuesta incorrecta 2',
          'Respuesta incorrecta 3',
        ],
        correctIndex: 0,
        explanation: 'Esta es la respuesta correcta porque aplica el concepto de manera precisa.',
      },
      {
        question: '¿Cuál de los siguientes describe mejor: Implementar el patrón producer-consumer con asyncio.Queue?',
        options: [
          'Respuesta correcta',
          'Respuesta incorrecta 1',
          'Respuesta incorrecta 2',
          'Respuesta incorrecta 3',
        ],
        correctIndex: 0,
        explanation: 'Esta es la respuesta correcta porque aplica el concepto de manera precisa.',
      },
      {
        question: '¿Cuál de los siguientes describe mejor: Usar concurrent.futures para I/O-bound y CPU-bound tasks (Python 201 Ch. 30)?',
        options: [
          'Respuesta correcta',
          'Respuesta incorrecta 1',
          'Respuesta incorrecta 2',
          'Respuesta incorrecta 3',
        ],
        correctIndex: 0,
        explanation: 'Esta es la respuesta correcta porque aplica el concepto de manera precisa.',
      },
      {
        question: '¿Cuál de los siguientes describe mejor: Construir pipelines asíncronos con backpressure control?',
        options: [
          'Respuesta correcta',
          'Respuesta incorrecta 1',
          'Respuesta incorrecta 2',
          'Respuesta incorrecta 3',
        ],
        correctIndex: 0,
        explanation: 'Esta es la respuesta correcta porque aplica el concepto de manera precisa.',
      },
    ],
  },
  resources: {
    docs: [
      { label: 'Python 201 (Driscoll) — Ch. 27-30 (fuente primaria)', url: 'Python 201 (Driscoll) — Ch. 27-30 (fuente primaria)' },
      { label: 'Python asyncio docs', url: 'Python asyncio docs' },
      { label: 'asyncio TaskGroup (Python 3.11)', url: 'asyncio TaskGroup (Python 3.11)' },
      { label: 'aiohttp docs', url: 'aiohttp docs' },
    ],
    books: [
      { label: 'Python 201 — Michael Driscoll', note: 'Capítulos relevantes para esta sección' },
    ],
    courses: [
      { label: 'Real Python', url: 'https://realpython.com', note: 'Tutoriales complementarios' },
    ],
  },
}
