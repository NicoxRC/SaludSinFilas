import { useState } from 'react'
import { useTurnos } from '../../context/TurnosContext'
import usuarios from '../../data/usuarios'
import medicamentos from '../../data/medicamentos'

const FARMACIAS = [
  'EPS Emssanar - Centro',
  'EPS Mallamas - Sur',
  'EPS Coosalud - Norte',
]

const MEDICAMENTOS_NOMBRES = medicamentos.map((m) => m.nombre)

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function randomHora() {
  const hora = Math.floor(Math.random() * 10) + 8 // 8 a 17
  const minutos = Math.random() < 0.5 ? '00' : '30'
  return `${String(hora).padStart(2, '0')}:${minutos}`
}

function nombrePaciente(pacienteId) {
  const u = usuarios.find((u) => u.id === pacienteId)
  return u ? u.nombre : `Paciente #${pacienteId}`
}

// -----------------------------------------------------------------------
// Tarjeta individual de turno
// -----------------------------------------------------------------------
function TurnoCard({ turno, mostrarFarmacia, onLlamar, onAtendido }) {
  const borderColor =
    turno.estado === 'pendiente'
      ? 'border-l-yellow-400'
      : turno.estado === 'en_atencion'
      ? 'border-l-blue-400'
      : 'border-l-green-400'

  return (
    <div
      className={`bg-white rounded-lg border border-gray-200 border-l-4 ${borderColor} shadow-sm hover:shadow-md transition-all duration-200 p-4 flex flex-col gap-2`}
    >
      {/* Numero de turno */}
      <div className="flex items-center justify-between">
        <span className="font-bold text-textPrimary text-sm">{turno.numeroTurno}</span>
        <span className="text-xs text-gray-400">{turno.hora}</span>
      </div>

      {/* Paciente */}
      <p className="text-sm text-gray-700 font-medium">{nombrePaciente(turno.pacienteId)}</p>

      {/* Medicamento */}
      <p className="text-xs text-gray-500">
        <span className="mr-1">💊</span>
        {turno.medicamento}
      </p>

      {/* Farmacia — solo si no hay filtro activo */}
      {mostrarFarmacia && (
        <p className="text-xs text-gray-500">
          <span className="mr-1">📍</span>
          {turno.farmacia}
        </p>
      )}

      {/* Acciones */}
      <div className="pt-1">
        {turno.estado === 'pendiente' && (
          <button
            onClick={() => onLlamar(turno.id)}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium py-1.5 px-3 rounded-md transition-colors duration-150"
          >
            Llamar siguiente
          </button>
        )}
        {turno.estado === 'en_atencion' && (
          <button
            onClick={() => onAtendido(turno.id)}
            className="w-full bg-secondary hover:bg-green-600 text-white text-xs font-medium py-1.5 px-3 rounded-md transition-colors duration-150"
          >
            Marcar atendido
          </button>
        )}
        {turno.estado === 'atendido' && (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700 bg-green-100 px-2 py-1 rounded-full">
            ✓ Atendido
          </span>
        )}
      </div>
    </div>
  )
}

// -----------------------------------------------------------------------
// Columna Kanban
// -----------------------------------------------------------------------
function KanbanColumna({ titulo, turnosFiltrados, colorClasses, mostrarFarmacia, onLlamar, onAtendido }) {
  return (
    <div className={`bg-white rounded-xl border border-t-4 ${colorClasses} min-h-96 flex flex-col`}>
      {/* Cabecera */}
      <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
        <h3 className="font-semibold text-textPrimary text-sm">{titulo}</h3>
        <span className="bg-gray-200 text-gray-700 text-xs font-bold px-2 py-0.5 rounded-full">
          {turnosFiltrados.length}
        </span>
      </div>

      {/* Lista de tarjetas */}
      <div className="p-3 flex flex-col gap-3 flex-1">
        {turnosFiltrados.length === 0 ? (
          <p className="text-center text-gray-400 text-sm mt-8">Sin turnos</p>
        ) : (
          turnosFiltrados.map((t) => (
            <TurnoCard
              key={t.id}
              turno={t}
              mostrarFarmacia={mostrarFarmacia}
              onLlamar={onLlamar}
              onAtendido={onAtendido}
            />
          ))
        )}
      </div>
    </div>
  )
}

// -----------------------------------------------------------------------
// Página principal
// -----------------------------------------------------------------------
export default function TurnosAdmin() {
  const { turnos, agregarTurno, moverAEnAtencion, marcarAtendido } = useTurnos()
  const [filtroFarmacia, setFiltroFarmacia] = useState('')

  // Turnos relevantes (excluye cancelados para el kanban)
  const turnosFiltrados = turnos.filter((t) => {
    if (t.estado === 'cancelado') return false
    if (filtroFarmacia && t.farmacia !== filtroFarmacia) return false
    return true
  })

  const pendientes = turnosFiltrados.filter((t) => t.estado === 'pendiente')
  const enAtencion = turnosFiltrados.filter((t) => t.estado === 'en_atencion')
  const atendidos = turnosFiltrados.filter((t) => t.estado === 'atendido')

  function handleActualizar() {
    const nuevoTurno = {
      id: Date.now(),
      pacienteId: 1,
      farmacia: randomItem(FARMACIAS),
      fecha: new Date().toISOString().split('T')[0],
      hora: randomHora(),
      estado: 'pendiente',
      medicamento: randomItem(MEDICAMENTOS_NOMBRES),
      numeroTurno: `T-2026-${String(Date.now()).slice(-3)}`,
    }
    agregarTurno(nuevoTurno)
  }

  const mostrarFarmacia = filtroFarmacia === ''

  return (
    <div className="min-h-screen bg-background p-6 fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <h1 className="text-2xl font-bold text-textPrimary">Gestion de Turnos</h1>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          {/* Filtro por farmacia */}
          <select
            value={filtroFarmacia}
            onChange={(e) => setFiltroFarmacia(e.target.value)}
            className="border border-gray-300 rounded-lg text-sm px-3 py-2 bg-white text-textPrimary focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Todas las farmacias</option>
            {FARMACIAS.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>

          {/* Botón actualizar */}
          <button
            onClick={handleActualizar}
            className="flex items-center gap-2 bg-primary hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors duration-150"
          >
            <span>🔄</span>
            Actualizar
          </button>
        </div>
      </div>

      {/* Tablero Kanban */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <KanbanColumna
          titulo="Pendientes"
          turnosFiltrados={pendientes}
          colorClasses="border-yellow-400 bg-yellow-50"
          mostrarFarmacia={mostrarFarmacia}
          onLlamar={moverAEnAtencion}
          onAtendido={marcarAtendido}
        />
        <KanbanColumna
          titulo="En Atencion"
          turnosFiltrados={enAtencion}
          colorClasses="border-blue-400 bg-blue-50"
          mostrarFarmacia={mostrarFarmacia}
          onLlamar={moverAEnAtencion}
          onAtendido={marcarAtendido}
        />
        <KanbanColumna
          titulo="Atendidos"
          turnosFiltrados={atendidos}
          colorClasses="border-green-400 bg-green-50"
          mostrarFarmacia={mostrarFarmacia}
          onLlamar={moverAEnAtencion}
          onAtendido={marcarAtendido}
        />
      </div>
    </div>
  )
}
