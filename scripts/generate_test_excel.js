/**
 * Genera un archivo Excel sintético con datos de clientes peruanos
 * para probar el Familiarity Dashboard.
 *
 * Ejecutar: node scripts/generate_test_excel.js
 * Output: public/demo_clientes.xlsx
 */

const XLSX = require('xlsx')
const path = require('path')

// Datos realistas peruanos
const nombres = ['Ana', 'Luis', 'Carlos', 'Maria', 'Jose', 'Carmen', 'Pedro', 'Rosa', 'Miguel', 'Elena',
  'Juan', 'Sofia', 'Diego', 'Lucia', 'Fernando', 'Patricia', 'Javier', 'Andrea', 'Ricardo', 'Marta',
  'Roberto', 'Cristina', 'Manuel', 'Isabel', 'Francisco', 'Teresa', 'Antonio', 'Lourdes', 'Eduardo', 'Silvia']

const apellidos = ['Garcia', 'Rodriguez', 'Flores', 'Quispe', 'Sanchez', 'Vargas', 'Castillo', 'Ramos',
  'Mendoza', 'Cruz', 'Espinoza', 'Torres', 'Perez', 'Aguilar', 'Rios', 'Herrera', 'Salazar', 'Romero',
  'Diaz', 'Vega', 'Chavez', 'Acosta', 'Fernandez', 'Gonzales', 'Huaman', 'Rojas', 'Soto', 'Lopez',
  'Mamani', 'Cisneros']

const distritos = [
  { nombre: 'Miraflores', lat: -12.1219, lon: -77.0299 },
  { nombre: 'Surco', lat: -12.1407, lon: -76.9917 },
  { nombre: 'San Isidro', lat: -12.0994, lon: -77.0365 },
  { nombre: 'La Victoria', lat: -12.0722, lon: -77.0205 },
  { nombre: 'Barranco', lat: -12.1454, lon: -77.0213 },
  { nombre: 'Jesus Maria', lat: -12.0781, lon: -77.0415 },
  { nombre: 'Magdalena', lat: -12.0935, lon: -77.0723 },
  { nombre: 'Pueblo Libre', lat: -12.0763, lon: -77.0587 },
  { nombre: 'Comas', lat: -11.9408, lon: -77.0614 },
  { nombre: 'San Juan de Lurigancho', lat: -11.9808, lon: -76.9887 },
]

const calles = ['Av. Larco', 'Av. Benavides', 'Av. Primavera', 'Jr. de la Union', 'Av. Arequipa',
  'Av. Brasil', 'Jr. Miraflores', 'Av. Ejercito', 'Calle Las Begonias', 'Av. Salaverry',
  'Av. Javier Prado', 'Av. Angamos', 'Jr. Camana', 'Av. Tingo Maria', 'Av. Universitaria']

function generarCliente(id, anomalia = 'normal') {
  const nombre = nombres[Math.floor(Math.random() * nombres.length)]
  const apPat = apellidos[Math.floor(Math.random() * apellidos.length)]
  const apMat = apellidos[Math.floor(Math.random() * apellidos.length)]
  const distrito = distritos[Math.floor(Math.random() * distritos.length)]
  const calle = calles[Math.floor(Math.random() * calles.length)]
  const numero = Math.floor(Math.random() * 999) + 100
  const dni = String(Math.floor(Math.random() * 90000000) + 10000000)
  const telefono = `999${String(Math.floor(Math.random() * 900000) + 100000)}`
  const email = `${nombre.toLowerCase()}.${apPat.toLowerCase()}${id}@email.pe`
  const lat = distrito.lat + (Math.random() - 0.5) * 0.005
  const lon = distrito.lon + (Math.random() - 0.5) * 0.005

  return { nombre, apellido_paterno: apPat, apellido_materno: apMat, dni, telefono, email,
    direccion: `${calle} ${numero}`, distrito: distrito.nombre,
    lat: lat.toFixed(6), lon: lon.toFixed(6), tipo: anomalia }
}

function generarDataset(n = 50) {
  const clientes = []
  for (let i = 0; i < n; i++) clientes.push(generarCliente(i + 1, 'normal'))

  // Duplicados exactos (5%)
  const dupCount = Math.floor(n * 0.05)
  for (let i = 0; i < dupCount; i++) {
    const original = { ...clientes[Math.floor(Math.random() * n)] }
    original.tipo = 'duplicado_exacto'
    clientes.push(original)
  }

  // Typos (3%)
  const typoCount = Math.floor(n * 0.03)
  for (let i = 0; i < typoCount; i++) {
    const original = { ...clientes[Math.floor(Math.random() * n)] }
    original.nombre = original.nombre.slice(0, -1) + 'a'
    original.tipo = 'typo'
    clientes.push(original)
  }

  // Familias (5%)
  const famCount = Math.floor(n * 0.05)
  for (let i = 0; i < famCount; i++) {
    const original = { ...clientes[Math.floor(Math.random() * n)] }
    const nuevoNombre = nombres[Math.floor(Math.random() * nombres.length)]
    original.nombre = nuevoNombre
    original.telefono = `999${String(Math.floor(Math.random() * 900000) + 100000)}`
    original.email = `${nuevoNombre.toLowerCase()}.${original.apellido_paterno.toLowerCase()}@email.pe`
    original.tipo = 'familia'
    clientes.push(original)
  }

  // Vecinos (4%)
  const neighCount = Math.floor(n * 0.04)
  for (let i = 0; i < neighCount; i++) {
    const original = { ...clientes[Math.floor(Math.random() * n)] }
    const nuevoNombre = nombres[Math.floor(Math.random() * nombres.length)]
    const nuevoApPat = apellidos[Math.floor(Math.random() * apellidos.length)]
    original.nombre = nuevoNombre
    original.apellido_paterno = nuevoApPat
    original.apellido_materno = apellidos[Math.floor(Math.random() * apellidos.length)]
    original.telefono = `999${String(Math.floor(Math.random() * 900000) + 100000)}`
    original.email = `${nuevoNombre.toLowerCase()}.${nuevoApPat.toLowerCase()}@email.pe`
    original.direccion = original.direccion.split(' ').slice(0, -1).join(' ') + ' ' + (Math.floor(Math.random() * 50) + 1)
    const lat = parseFloat(original.lat) + (Math.random() - 0.5) * 0.001
    const lon = parseFloat(original.lon) + (Math.random() - 0.5) * 0.001
    original.lat = lat.toFixed(6)
    original.lon = lon.toFixed(6)
    original.tipo = 'vecino'
    clientes.push(original)
  }

  return clientes
}

const dataset = generarDataset(50)
const ws = XLSX.utils.json_to_sheet(dataset)
const wb = XLSX.utils.book_new()
XLSX.utils.book_append_sheet(wb, ws, 'Clientes')

const leyenda = [
  { tipo: 'normal', descripcion: 'Cliente único sin anomalías', score_esperado: '<40' },
  { tipo: 'duplicado_exacto', descripcion: 'Duplicado exacto (mismo teléfono/email)', score_esperado: '100' },
  { tipo: 'typo', descripcion: 'Variación con typo en nombre', score_esperado: '95-99' },
  { tipo: 'familia', descripcion: 'Familiar (mismo apellido + dirección)', score_esperado: '85-94' },
  { tipo: 'vecino', descripcion: 'Vecino (mismo distrito, cercano geográficamente)', score_esperado: '60-74' },
]
const wsLeyenda = XLSX.utils.json_to_sheet(leyenda)
XLSX.utils.book_append_sheet(wb, wsLeyenda, 'Leyenda')

const outputPath = path.join(__dirname, '..', 'public', 'demo_clientes.xlsx')
XLSX.writeFile(wb, outputPath)
console.log(`✓ Excel generado: ${outputPath}`)
console.log(`  ${dataset.length} registros`)
console.log(`  Duplicados: ${dataset.filter(d => d.tipo === 'duplicado_exacto').length}`)
console.log(`  Typos: ${dataset.filter(d => d.tipo === 'typo').length}`)
console.log(`  Familias: ${dataset.filter(d => d.tipo === 'familia').length}`)
console.log(`  Vecinos: ${dataset.filter(d => d.tipo === 'vecino').length}`)
