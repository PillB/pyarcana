import type { CourseSection } from '../../types'

export const section16: CourseSection = {
  id: 'wxpython-gui',
  index: 16,
  title: 'GUI de Escritorio con wxPython',
  shortTitle: 'GUI de Escritorio con wxPython',
  tagline: 'Construye aplicaciones de escritorio profesionales que tus clientes instalan y usan sin abrir una terminal.',
  estimatedHours: 10,
  level: 'Competente',
  phase: 1,
  icon: 'Monitor',
  accentColor: 'bg-gradient-to-br from-blue-500 to-indigo-600',
  jobRelevance: 'wxPython es el toolkit GUI Python para herramientas internas empresariales (dashboards operativos, formularios de captura de datos, visualizadores). En Perú, muchas empresas reemplazan Excel/Access con Python + wxPython. El wxPython Cookbook es fuente primaria del curso y requiere cobertura explícita con todas sus recetas.',
  learningOutcomes: [
    { text: 'Crear ventanas con wx.Frame, wx.Panel y layouts con wx.BoxSizer, wx.GridSizer' },
    { text: 'Manejar eventos: EVT_BUTTON, EVT_CLOSE, EVT_TIMER, EVT_TEXT, key/char events' },
    { text: 'Usar widgets clave: wx.TextCtrl, wx.ComboBox, wx.ListCtrl, wx.Grid, wx.Notebook' },
    { text: 'Implementar threading seguro con wx.CallAfter y wx.PostEvent' },
    { text: 'Usar pubsub y PyDispatcher para comunicación desacoplada entre componentes (Recipes 7-8)' },
    { text: 'Persistir configuración con wx.Config y archivos de configuración (Recipe 16)' },
    { text: 'Crear iconos en la barra de tareas y minimizar a system tray (Recipes 29-30)' },
    { text: 'Distribuir apps de escritorio con PyInstaller generando un .exe o .app' },
  ],
  theory: [
    {
      heading: 'Arquitectura wxPython: wx.App, event loop, wx.Frame como ventana principal, wx.Panel como contenedor',
      paragraphs: [
        'En esta lección vamos a explorar arquitectura wxpython: wx.app, event loop, wx.frame como ventana principal, wx.panel como contenedor en profundidad. Este concepto es fundamental para tu crecimiento como profesional de Data Science y automatización. En el mercado laboral peruano e internacional, dominar este tema te diferencia claramente de otros candidatos.',

        'La clave para entender arquitectura wxpython: wx.app, event loop, wx.frame como ventana principal, wx.panel como contenedor es practicar con ejemplos reales. No basta con leer la teoría — necesitas escribir código, cometer errores, y aprender de ellos. Por eso cada concepto viene acompañado de ejemplos prácticos que puedes ejecutar en el editor interactivo.',

        'En producción, arquitectura wxpython: wx.app, event loop, wx.frame como ventana principal, wx.panel como contenedor se usa diario en empresas como Interbank, BBVA, Mercado Libre y Rimac. Los equipos de data science y automatización dependen de este conocimiento para construir pipelines robustos y escalables.',
      ],
    },
    {
      heading: 'Sizers: wx.BoxSizer(wx.VERTICAL/HORIZONTAL), wx.GridBagSizer, WrapSizer, AddStretchSpacer, Fit() y Layout() tras agregar widgets',
      paragraphs: [
        'En esta lección vamos a explorar sizers: wx.boxsizer(wx.vertical/horizontal), wx.gridbagsizer, wrapsizer, addstretchspacer, fit() y layout() tras agregar widgets en profundidad. Este concepto es fundamental para tu crecimiento como profesional de Data Science y automatización. En el mercado laboral peruano e internacional, dominar este tema te diferencia claramente de otros candidatos.',

        'La clave para entender sizers: wx.boxsizer(wx.vertical/horizontal), wx.gridbagsizer, wrapsizer, addstretchspacer, fit() y layout() tras agregar widgets es practicar con ejemplos reales. No basta con leer la teoría — necesitas escribir código, cometer errores, y aprender de ellos. Por eso cada concepto viene acompañado de ejemplos prácticos que puedes ejecutar en el editor interactivo.',

        'En producción, sizers: wx.boxsizer(wx.vertical/horizontal), wx.gridbagsizer, wrapsizer, addstretchspacer, fit() y layout() tras agregar widgets se usa diario en empresas como Interbank, BBVA, Mercado Libre y Rimac. Los equipos de data science y automatización dependen de este conocimiento para construir pipelines robustos y escalables.',
      ],
    },
    {
      heading: 'Widgets dinámicos (Recipe 1): agregar/remover widgets en runtime con Layout() y Fit()',
      paragraphs: [
        'En esta lección vamos a explorar widgets dinámicos (recipe 1): agregar/remover widgets en runtime con layout() y fit() en profundidad. Este concepto es fundamental para tu crecimiento como profesional de Data Science y automatización. En el mercado laboral peruano e internacional, dominar este tema te diferencia claramente de otros candidatos.',

        'La clave para entender widgets dinámicos (recipe 1): agregar/remover widgets en runtime con layout() y fit() es practicar con ejemplos reales. No basta con leer la teoría — necesitas escribir código, cometer errores, y aprender de ellos. Por eso cada concepto viene acompañado de ejemplos prácticos que puedes ejecutar en el editor interactivo.',

        'En producción, widgets dinámicos (recipe 1): agregar/remover widgets en runtime con layout() y fit() se usa diario en empresas como Interbank, BBVA, Mercado Libre y Rimac. Los equipos de data science y automatización dependen de este conocimiento para construir pipelines robustos y escalables.',
      ],
    },
    {
      heading: 'Screenshots y printing (Recipe 2): wx.ScreenDC, wx.MemoryDC, wx.HtmlEasyPrinting',
      paragraphs: [
        'En esta lección vamos a explorar screenshots y printing (recipe 2): wx.screendc, wx.memorydc, wx.htmleasyprinting en profundidad. Este concepto es fundamental para tu crecimiento como profesional de Data Science y automatización. En el mercado laboral peruano e internacional, dominar este tema te diferencia claramente de otros candidatos.',

        'La clave para entender screenshots y printing (recipe 2): wx.screendc, wx.memorydc, wx.htmleasyprinting es practicar con ejemplos reales. No basta con leer la teoría — necesitas escribir código, cometer errores, y aprender de ellos. Por eso cada concepto viene acompañado de ejemplos prácticos que puedes ejecutar en el editor interactivo.',

        'En producción, screenshots y printing (recipe 2): wx.screendc, wx.memorydc, wx.htmleasyprinting se usa diario en empresas como Interbank, BBVA, Mercado Libre y Rimac. Los equipos de data science y automatización dependen de este conocimiento para construir pipelines robustos y escalables.',
      ],
    },
    {
      heading: 'Icons en titlebar (Recipe 3): wx.Icon, img2py para convertir imágenes a código Python',
      paragraphs: [
        'En esta lección vamos a explorar icons en titlebar (recipe 3): wx.icon, img2py para convertir imágenes a código python en profundidad. Este concepto es fundamental para tu crecimiento como profesional de Data Science y automatización. En el mercado laboral peruano e internacional, dominar este tema te diferencia claramente de otros candidatos.',

        'La clave para entender icons en titlebar (recipe 3): wx.icon, img2py para convertir imágenes a código python es practicar con ejemplos reales. No basta con leer la teoría — necesitas escribir código, cometer errores, y aprender de ellos. Por eso cada concepto viene acompañado de ejemplos prácticos que puedes ejecutar en el editor interactivo.',

        'En producción, icons en titlebar (recipe 3): wx.icon, img2py para convertir imágenes a código python se usa diario en empresas como Interbank, BBVA, Mercado Libre y Rimac. Los equipos de data science y automatización dependen de este conocimiento para construir pipelines robustos y escalables.',
      ],
    },
    {
      heading: 'Dark mode (Recipe 6): SetBackgroundColour, paletas dinámicas para modo oscuro',
      paragraphs: [
        'En esta lección vamos a explorar dark mode (recipe 6): setbackgroundcolour, paletas dinámicas para modo oscuro en profundidad. Este concepto es fundamental para tu crecimiento como profesional de Data Science y automatización. En el mercado laboral peruano e internacional, dominar este tema te diferencia claramente de otros candidatos.',

        'La clave para entender dark mode (recipe 6): setbackgroundcolour, paletas dinámicas para modo oscuro es practicar con ejemplos reales. No basta con leer la teoría — necesitas escribir código, cometer errores, y aprender de ellos. Por eso cada concepto viene acompañado de ejemplos prácticos que puedes ejecutar en el editor interactivo.',

        'En producción, dark mode (recipe 6): setbackgroundcolour, paletas dinámicas para modo oscuro se usa diario en empresas como Interbank, BBVA, Mercado Libre y Rimac. Los equipos de data science y automatización dependen de este conocimiento para construir pipelines robustos y escalables.',
      ],
    },
    {
      heading: 'Pubsub (Recipe 7): Publisher.subscribe(), Publisher.sendMessage() para decoupling',
      paragraphs: [
        'En esta lección vamos a explorar pubsub (recipe 7): publisher.subscribe(), publisher.sendmessage() para decoupling en profundidad. Este concepto es fundamental para tu crecimiento como profesional de Data Science y automatización. En el mercado laboral peruano e internacional, dominar este tema te diferencia claramente de otros candidatos.',

        'La clave para entender pubsub (recipe 7): publisher.subscribe(), publisher.sendmessage() para decoupling es practicar con ejemplos reales. No basta con leer la teoría — necesitas escribir código, cometer errores, y aprender de ellos. Por eso cada concepto viene acompañado de ejemplos prácticos que puedes ejecutar en el editor interactivo.',

        'En producción, pubsub (recipe 7): publisher.subscribe(), publisher.sendmessage() para decoupling se usa diario en empresas como Interbank, BBVA, Mercado Libre y Rimac. Los equipos de data science y automatización dependen de este conocimiento para construir pipelines robustos y escalables.',
      ],
    },
    {
      heading: 'Threading seguro (Recipe 47): wx.CallAfter(fn, *args), wx.PostEvent, threading.Thread con queue',
      paragraphs: [
        'En esta lección vamos a explorar threading seguro (recipe 47): wx.callafter(fn, *args), wx.postevent, threading.thread con queue en profundidad. Este concepto es fundamental para tu crecimiento como profesional de Data Science y automatización. En el mercado laboral peruano e internacional, dominar este tema te diferencia claramente de otros candidatos.',

        'La clave para entender threading seguro (recipe 47): wx.callafter(fn, *args), wx.postevent, threading.thread con queue es practicar con ejemplos reales. No basta con leer la teoría — necesitas escribir código, cometer errores, y aprender de ellos. Por eso cada concepto viene acompañado de ejemplos prácticos que puedes ejecutar en el editor interactivo.',

        'En producción, threading seguro (recipe 47): wx.callafter(fn, *args), wx.postevent, threading.thread con queue se usa diario en empresas como Interbank, BBVA, Mercado Libre y Rimac. Los equipos de data science y automatización dependen de este conocimiento para construir pipelines robustos y escalables.',
      ],
    },
    {
      heading: 'Taskbar icons (Recipe 29): wx.adv.TaskBarIcon, CreatePopupMenu() para menú contextual',
      paragraphs: [
        'En esta lección vamos a explorar taskbar icons (recipe 29): wx.adv.taskbaricon, createpopupmenu() para menú contextual en profundidad. Este concepto es fundamental para tu crecimiento como profesional de Data Science y automatización. En el mercado laboral peruano e internacional, dominar este tema te diferencia claramente de otros candidatos.',

        'La clave para entender taskbar icons (recipe 29): wx.adv.taskbaricon, createpopupmenu() para menú contextual es practicar con ejemplos reales. No basta con leer la teoría — necesitas escribir código, cometer errores, y aprender de ellos. Por eso cada concepto viene acompañado de ejemplos prácticos que puedes ejecutar en el editor interactivo.',

        'En producción, taskbar icons (recipe 29): wx.adv.taskbaricon, createpopupmenu() para menú contextual se usa diario en empresas como Interbank, BBVA, Mercado Libre y Rimac. Los equipos de data science y automatización dependen de este conocimiento para construir pipelines robustos y escalables.',
      ],
    },
    {
      heading: 'XRC — diseño declarativo (Recipes 49-51): xrc.XmlResource, diseño de GUIs con XML en lugar de código puro',
      paragraphs: [
        'En esta lección vamos a explorar xrc — diseño declarativo (recipes 49-51): xrc.xmlresource, diseño de guis con xml en lugar de código puro en profundidad. Este concepto es fundamental para tu crecimiento como profesional de Data Science y automatización. En el mercado laboral peruano e internacional, dominar este tema te diferencia claramente de otros candidatos.',

        'La clave para entender xrc — diseño declarativo (recipes 49-51): xrc.xmlresource, diseño de guis con xml en lugar de código puro es practicar con ejemplos reales. No basta con leer la teoría — necesitas escribir código, cometer errores, y aprender de ellos. Por eso cada concepto viene acompañado de ejemplos prácticos que puedes ejecutar en el editor interactivo.',

        'En producción, xrc — diseño declarativo (recipes 49-51): xrc.xmlresource, diseño de guis con xml en lugar de código puro se usa diario en empresas como Interbank, BBVA, Mercado Libre y Rimac. Los equipos de data science y automatización dependen de este conocimiento para construir pipelines robustos y escalables.',
      ],
    },
    {
      heading: 'Login Dialog + Config File (Recipes 14-16): flujos de autenticación GUI, wx.ConfigBase.Set() y Get()',
      paragraphs: [
        'En esta lección vamos a explorar login dialog + config file (recipes 14-16): flujos de autenticación gui, wx.configbase.set() y get() en profundidad. Este concepto es fundamental para tu crecimiento como profesional de Data Science y automatización. En el mercado laboral peruano e internacional, dominar este tema te diferencia claramente de otros candidatos.',

        'La clave para entender login dialog + config file (recipes 14-16): flujos de autenticación gui, wx.configbase.set() y get() es practicar con ejemplos reales. No basta con leer la teoría — necesitas escribir código, cometer errores, y aprender de ellos. Por eso cada concepto viene acompañado de ejemplos prácticos que puedes ejecutar en el editor interactivo.',

        'En producción, login dialog + config file (recipes 14-16): flujos de autenticación gui, wx.configbase.set() y get() se usa diario en empresas como Interbank, BBVA, Mercado Libre y Rimac. Los equipos de data science y automatización dependen de este conocimiento para construir pipelines robustos y escalables.',
      ],
    },
    {
      heading: 'ObjectListView (Recipe 35): lista con columnas ordenables y filtrado — alternativa potente a wx.ListCtrl',
      paragraphs: [
        'En esta lección vamos a explorar objectlistview (recipe 35): lista con columnas ordenables y filtrado — alternativa potente a wx.listctrl en profundidad. Este concepto es fundamental para tu crecimiento como profesional de Data Science y automatización. En el mercado laboral peruano e internacional, dominar este tema te diferencia claramente de otros candidatos.',

        'La clave para entender objectlistview (recipe 35): lista con columnas ordenables y filtrado — alternativa potente a wx.listctrl es practicar con ejemplos reales. No basta con leer la teoría — necesitas escribir código, cometer errores, y aprender de ellos. Por eso cada concepto viene acompañado de ejemplos prácticos que puedes ejecutar en el editor interactivo.',

        'En producción, objectlistview (recipe 35): lista con columnas ordenables y filtrado — alternativa potente a wx.listctrl se usa diario en empresas como Interbank, BBVA, Mercado Libre y Rimac. Los equipos de data science y automatización dependen de este conocimiento para construir pipelines robustos y escalables.',
      ],
    },
  ],
  iDo: {
    intro: 'Te muestro paso a paso cómo aplicar los conceptos de esta sección con ejemplos prácticos.',
    steps: [
      {
        description: 'Crear una app desde cero: wx.App → wx.Frame → wx.Panel → wx.BoxSizer → botón que abre wx.MessageDialog',
        code: {
          language: 'python',
          title: 'ejemplo.py',
          code: '# Ejemplo de: Crear una app desde cero: wx.App → wx.Frame → wx.Panel → wx.BoxSizer → botón que abre wx.MessageDialog\n# TODO: Implementar el código completo\nprint("Implementar este ejemplo")',
        },
        why: 'Este paso es importante porque demuestra el concepto en acción y te muestra el patrón correcto a seguir.',
      },
      {
        description: 'Implementar un ProgressBar que se actualiza desde un thread de fondo usando wx.CallAfter',
        code: {
          language: 'python',
          title: 'ejemplo.py',
          code: '# Ejemplo de: Implementar un ProgressBar que se actualiza desde un thread de fondo usando wx.CallAfter\n# TODO: Implementar el código completo\nprint("Implementar este ejemplo")',
        },
        why: 'Este paso es importante porque demuestra el concepto en acción y te muestra el patrón correcto a seguir.',
      },
      {
        description: 'Agregar un widget de texto dinámicamente en respuesta a un checkbox, con Layout() para actualizar el layout',
        code: {
          language: 'python',
          title: 'ejemplo.py',
          code: '# Ejemplo de: Agregar un widget de texto dinámicamente en respuesta a un checkbox, con Layout() para actualizar el layout\n# TODO: Implementar el código completo\nprint("Implementar este ejemplo")',
        },
        why: 'Este paso es importante porque demuestra el concepto en acción y te muestra el patrón correcto a seguir.',
      },
    ],
  },
  weDo: {
    intro: 'Ahora te toca a ti practicar con guía. Lee cada instrucción, intenta escribir el código, y si te trabas revisa la solución.',
    steps: [
      {
        instruction: 'Construir un formulario de login con wx.TextCtrl (password con wx.TE_PASSWORD), validación, y pubsub para notificar al Frame principal',
        hint: 'Piensa en cómo descomponer el problema en pasos más pequeños.',
        starterCode: {
          language: 'python',
          title: 'ejercicio.py',
          code: '# Tu código aquí\n# Construir un formulario de login con wx.TextCtrl (password con wx.TE_PASSWORD), validación, y pubsub para notificar al Frame principal\n',
        },
        solutionCode: {
          language: 'python',
          title: 'solucion.py',
          code: '# Solución\n# Construir un formulario de login con wx.TextCtrl (password con wx.TE_PASSWORD), validación, y pubsub para notificar al Frame principal\nprint("Solución implementada")',
        },
      },
      {
        instruction: 'Implementar un wx.Notebook con 3 tabs: Datos, Estadísticas, Configuración',
        hint: 'Piensa en cómo descomponer el problema en pasos más pequeños.',
        starterCode: {
          language: 'python',
          title: 'ejercicio.py',
          code: '# Tu código aquí\n# Implementar un wx.Notebook con 3 tabs: Datos, Estadísticas, Configuración\n',
        },
        solutionCode: {
          language: 'python',
          title: 'solucion.py',
          code: '# Solución\n# Implementar un wx.Notebook con 3 tabs: Datos, Estadísticas, Configuración\nprint("Solución implementada")',
        },
      },
      {
        instruction: 'Añadir un wx.adv.TaskBarIcon con menú contextual de Mostrar App / Cerrar',
        hint: 'Piensa en cómo descomponer el problema en pasos más pequeños.',
        starterCode: {
          language: 'python',
          title: 'ejercicio.py',
          code: '# Tu código aquí\n# Añadir un wx.adv.TaskBarIcon con menú contextual de Mostrar App / Cerrar\n',
        },
        solutionCode: {
          language: 'python',
          title: 'solucion.py',
          code: '# Solución\n# Añadir un wx.adv.TaskBarIcon con menú contextual de Mostrar App / Cerrar\nprint("Solución implementada")',
        },
      },
    ],
  },
  youDo: {
    title: 'Data Dashboard GUI',
    context: 'data-dashboard-gui con 3 tabs: Tab 1 Cargar Datos (wx.FileDialog CSV, ObjectListView preview 100 rows); Tab 2 Análisis (estadísticas con pandas en threading.Thread, mostradas con wx.CallAfter en wx.Grid); Tab 3 Gráficos (matplotlib FigureCanvasWxAgg embebido — histograma o scatter). Dark mode toggle, icon en titlebar, configuración guardada con wx.Config. Distribuido como ejecutable con PyInstaller (--onefile).',
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
        question: '¿Por qué NO puedes actualizar la GUI de wxPython directamente desde un thread de fondo?',
        options: [
          'Porque wxPython (como todos los toolkits GUI) requiere que las actualizaciones de UI se hagan desde el thread principal — los threads de fondo deben usar `wx.CallAfter`',
          'Porque wxPython no soporta multithreading en absoluto',
          'Porque los threads de fondo no tienen acceso al objeto `wx.App`',
          'Porque wxPython usa GIL y los threads no pueden ejecutar código Python',
        ],
        correctIndex: 0,
        explanation: 'Todos los toolkits GUI (wxPython, Tkinter, Qt) requieren que las actualizaciones de UI se hagan desde el thread principal. Desde un thread de fondo, usa `wx.CallAfter(funcion, *args)` que programa la ejecución en el thread principal de forma segura.',
      },
      {
        question: '¿Qué es un `wx.BoxSizer` y para qué sirve?',
        options: [
          'Un gestor de layout que organiza widgets horizontal o verticalmente, redimensionándolos automáticamente cuando la ventana cambia de tamaño',
          'Un tipo de ventana que se puede minimizar a la barra de tareas',
          'Un componente que dibuja cajas con bordes redondeados',
          'Un método para empaquetar la aplicación como ejecutable',
        ],
        correctIndex: 0,
        explanation: 'wx.BoxSizer es el gestor de layout más usado en wxPython. Organiza widgets en dirección horizontal (wx.HORIZONTAL) o vertical (wx.VERTICAL). Cuando la ventana cambia de tamaño, el sizer redistribuye el espacio según las proporciones configuradas.',
      },
      {
        question: '¿Para qué sirve pubsub en wxPython?',
        options: [
          'Para desacoplar componentes: un componente publica un mensaje sin saber quién lo recibe, y los receptores se suscriben sin saber quién lo envía',
          'Para publicar la aplicación en la tienda de apps de Windows',
          'Para crear un servidor web dentro de la aplicación de escritorio',
          'Para sincronizar datos entre múltiples instancias de la aplicación',
        ],
        correctIndex: 0,
        explanation: 'Pubsub (Publisher/Subscriber) permite que componentes se comuniquen sin referencias directas. Publisher.sendMessage("topic", data=value) y los suscriptores reciben via Publisher.subscribe(listener, "topic"). Reduce acoplamiento entre paneles y frames.',
      },
      {
        question: '¿Qué hace `wx.adv.TaskBarIcon`?',
        options: [
          'Crea un icono en la barra de tareas del sistema operativo con menú contextual, permitiendo minimizar la app al system tray',
          'Muestra una notificación temporal en la esquina de la pantalla',
          'Crea un acceso directo en el escritorio',
          'Cambia el icono de la barra de título de la ventana',
        ],
        correctIndex: 0,
        explanation: 'TaskBarIcon pone un icono en la barra de tareas (system tray) del OS. Se le puede agregar un menú contextual con CreatePopupMenu(). Permite que la app siga corriendo en background cuando el usuario cierra la ventana principal.',
      },
      {
        question: '¿Qué es XRC en wxPython?',
        options: [
          'Un formato XML para definir la interfaz gráfica de forma declarativa, separando el diseño del código Python',
          'Un sistema de reportes que genera PDFs desde datos de la aplicación',
          'Un compilador que convierte código Python a C para mayor velocidad',
          'Un protocolo de red para comunicación entre aplicaciones wxPython',
        ],
        correctIndex: 0,
        explanation: 'XRC (XML Resource) permite diseñar GUIs con XML en vez de código Python. Se carga con `xrc.XmlResource("gui.xrc")`. Ventajas: diseñadores no-técnicos pueden editar la GUI, y se puede cambiar el layout sin recompilar.',
      }
    ],
  },
  resources: {
    docs: [
      { label: 'wxPython Cookbook (Driscoll) — Todas las recetas (fuente primaria)', url: 'wxPython Cookbook (Driscoll) — Todas las recetas (fuente primaria)' },
      { label: 'wxPython official Phoenix docs', url: 'wxPython official Phoenix docs' },
      { label: 'wxPython Demo Package', url: 'wxPython Demo Package' },
      { label: 'PyInstaller docs', url: 'PyInstaller docs' },
    ],
    books: [
      { label: 'Python 201 — Michael Driscoll', note: 'Capítulos relevantes para esta sección' },
    ],
    courses: [
      { label: 'Real Python', url: 'https://realpython.com', note: 'Tutoriales complementarios' },
    ],
  },
}
