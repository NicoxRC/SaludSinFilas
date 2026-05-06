import { useMemo } from 'react'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts'
import { useTurnos } from '../../context/TurnosContext'

// Datos mock fijos para el gráfico de barras
const turnosPorDia = [
  { dia: 'Lun', turnos: 12 },
  { dia: 'Mar', turnos: 19 },
  { dia: 'Mié', turnos: 8 },
  { dia: 'Jue', turnos: 15 },
  { dia: 'Vie', turnos: 22 },
  { dia: 'Sáb', turnos: 6 },
]

const PIE_COLORS = ['#1E6FBF', '#28A745', '#8B5CF6']

const FARMACIAS = [
  'EPS Emssanar - Centro',
  'EPS Mallamas - Sur',
  'EPS Coosalud - Norte',
]

// Nombres cortos para el PieChart
const FARMACIAS_LABEL = {
  'EPS Emssanar - Centro': 'Emssanar - Centro',
  'EPS Mallamas - Sur': 'Mallamas - Sur',
  'EPS Coosalud - Norte': 'Coosalud - Norte',
}

function MetricCard({ icono, titulo, valor, colorClass }) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-5 flex items-center gap-4">
      <div className={`text-3xl w-12 h-12 flex items-center justify-center rounded-full ${colorClass}`}>
        {icono}
      </div>
      <div>
        <p className="text-sm text-gray-500 font-medium">{titulo}</p>
        <p className="text-2xl font-bold text-textPrimary">{valor}</p>
      </div>
    </div>
  )
}

export default function Reportes() {
  const { turnos } = useTurnos()

  const mesActual = new Date().toLocaleString('es-CO', { month: 'long', year: 'numeric' })
  const mesCapitalizado = mesActual.charAt(0).toUpperCase() + mesActual.slice(1)

  // Métricas calculadas
  const totalTurnos = turnos.length
  const cancelados = turnos.filter((t) => t.estado === 'cancelado').length
  const atendidos = turnos.filter((t) => t.estado === 'atendido').length

  // Distribución por farmacia (solo las que tienen >0 turnos)
  const porFarmacia = useMemo(() => {
    return FARMACIAS.map((f) => ({
      name: FARMACIAS_LABEL[f],
      value: turnos.filter((t) => t.farmacia === f).length,
    })).filter((f) => f.value > 0)
  }, [turnos])

  // Top 5 medicamentos más solicitados
  const topMedicamentos = useMemo(() => {
    const conteo = {}
    turnos.forEach((t) => {
      if (t.medicamento) {
        conteo[t.medicamento] = (conteo[t.medicamento] || 0) + 1
      }
    })
    return Object.entries(conteo)
      .map(([nombre, cantidad]) => ({ nombre, cantidad }))
      .sort((a, b) => b.cantidad - a.cantidad)
      .slice(0, 5)
  }, [turnos])

  const maxMedicamento = topMedicamentos[0]?.cantidad || 1

  // Exportar reporte en texto plano
  function exportarReporte() {
    const lineas = [
      '='.repeat(50),
      'REPORTE DE MÉTRICAS - SALUD SIN FILAS',
      `Periodo: ${mesCapitalizado}`,
      `Generado: ${new Date().toLocaleString('es-CO')}`,
      '='.repeat(50),
      '',
      'MÉTRICAS GENERALES',
      '-'.repeat(30),
      `Total de turnos:          ${totalTurnos}`,
      `Turnos atendidos:         ${atendidos}`,
      `Turnos cancelados:        ${cancelados}`,
      `Tiempo promedio atención: 12 min`,
      '',
      'DISTRIBUCIÓN POR FARMACIA',
      '-'.repeat(30),
      ...porFarmacia.map((f) => `${f.name.padEnd(25)} ${f.value} turno(s)`),
      '',
      'TOP 5 MEDICAMENTOS MÁS SOLICITADOS',
      '-'.repeat(30),
      ...topMedicamentos.map(
        (m, i) =>
          `${(i + 1).toString().padEnd(3)} ${m.nombre.padEnd(35)} ${m.cantidad} turno(s)  (${Math.round((m.cantidad / totalTurnos) * 100)}%)`
      ),
      '',
      'TURNOS POR DÍA DE LA SEMANA (promedio semanal)',
      '-'.repeat(30),
      ...turnosPorDia.map((d) => `${d.dia.padEnd(6)} ${d.turnos} turno(s)`),
      '',
      '='.repeat(50),
      'Fin del reporte',
    ]

    const contenido = lineas.join('\n')
    const blob = new Blob([contenido], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `reporte-salud-sin-filas-${new Date().toISOString().slice(0, 10)}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-background p-6 space-y-8">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-textPrimary">Reportes y Métricas</h1>
          <p className="text-gray-500 mt-1">{mesCapitalizado}</p>
        </div>
        <button
          onClick={exportarReporte}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm w-fit"
        >
          <span>📥</span>
          Exportar reporte
        </button>
      </div>

      {/* Sección 1 — Tarjetas de métricas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          icono="📋"
          titulo="Total turnos del mes"
          valor={totalTurnos}
          colorClass="bg-blue-100 text-blue-600"
        />
        <MetricCard
          icono="⏱️"
          titulo="Tiempo promedio de atención"
          valor="12 min"
          colorClass="bg-purple-100 text-purple-600"
        />
        <MetricCard
          icono="❌"
          titulo="Turnos cancelados"
          valor={cancelados}
          colorClass="bg-red-100 text-red-600"
        />
        <MetricCard
          icono="✅"
          titulo="Turnos atendidos"
          valor={atendidos}
          colorClass="bg-green-100 text-green-600"
        />
      </div>

      {/* Sección 2 y 3 — Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Gráfico de barras — turnos por día */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-base font-semibold text-textPrimary mb-4">
            Turnos por día de la semana
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={turnosPorDia} margin={{ top: 4, right: 16, left: 0, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="dia" tick={{ fontSize: 13, fill: '#6b7280' }} />
              <YAxis tick={{ fontSize: 13, fill: '#6b7280' }} />
              <Tooltip
                contentStyle={{ borderRadius: '8px', fontSize: '13px' }}
                formatter={(value) => [value, 'Turnos']}
              />
              <Bar dataKey="turnos" fill="#1E6FBF" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfico de torta — distribución por farmacia */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-base font-semibold text-textPrimary mb-4">
            Distribución por farmacia
          </h2>
          {porFarmacia.length === 0 ? (
            <div className="h-[300px] flex items-center justify-center text-gray-400 text-sm">
              Sin datos disponibles
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={porFarmacia}
                  cx="50%"
                  cy="45%"
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${Math.round(percent * 100)}%`
                  }
                  labelLine={false}
                >
                  {porFarmacia.map((_, index) => (
                    <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ borderRadius: '8px', fontSize: '13px' }}
                  formatter={(value, name) => [value, name]}
                />
                <Legend
                  iconType="circle"
                  iconSize={10}
                  wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Sección 4 — Tabla top 5 medicamentos */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-base font-semibold text-textPrimary mb-4">
          Top 5 medicamentos más solicitados
        </h2>

        {topMedicamentos.length === 0 ? (
          <p className="text-gray-400 text-sm">Sin datos disponibles.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-3 px-3 text-gray-500 font-medium w-10">#</th>
                  <th className="text-left py-3 px-3 text-gray-500 font-medium">Medicamento</th>
                  <th className="text-left py-3 px-3 text-gray-500 font-medium">Turnos solicitados</th>
                  <th className="text-left py-3 px-3 text-gray-500 font-medium">% del total</th>
                </tr>
              </thead>
              <tbody>
                {topMedicamentos.map((med, i) => (
                  <tr
                    key={med.nombre}
                    className={`border-b border-gray-50 ${i === 0 ? 'bg-blue-50' : 'hover:bg-gray-50'} transition-colors`}
                  >
                    <td className="py-3 px-3 font-bold text-textPrimary">{i + 1}</td>
                    <td className="py-3 px-3 text-textPrimary font-medium">{med.nombre}</td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-textPrimary w-6 text-right">
                          {med.cantidad}
                        </span>
                        <div className="flex-1 bg-gray-100 rounded-full h-2 min-w-[60px]">
                          <div
                            className="bg-primary h-2 rounded-full transition-all"
                            style={{ width: `${Math.round((med.cantidad / maxMedicamento) * 100)}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-gray-600">
                      {totalTurnos > 0
                        ? `${Math.round((med.cantidad / totalTurnos) * 100)}%`
                        : '0%'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
