import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../../components/Button'
import { useAuth } from '../../context/AuthContext'
import { useTurnos } from '../../context/TurnosContext'

const BADGE_ESTADO = {
  pendiente: 'bg-yellow-100 text-yellow-800',
  atendido: 'bg-green-100 text-green-800',
  cancelado: 'bg-gray-100 text-gray-600',
}

const LABEL_ESTADO = {
  pendiente: 'Pendiente',
  atendido: 'Atendido',
  cancelado: 'Cancelado',
}

function TurnoCard({ turno, onCancelar }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex flex-col gap-3 hover:shadow-md transition-shadow">
      {/* Header tarjeta */}
      <div className="flex items-start justify-between gap-2">
        <span className="text-base font-bold text-textPrimary">{turno.numeroTurno}</span>
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0 ${BADGE_ESTADO[turno.estado] || 'bg-gray-100 text-gray-600'}`}>
          {LABEL_ESTADO[turno.estado] || turno.estado}
        </span>
      </div>

      {/* Detalles */}
      <div className="flex flex-col gap-1.5 text-sm text-gray-600">
        <div className="flex items-start gap-2">
          <span className="text-base leading-none mt-0.5">📍</span>
          <span>{turno.farmacia}</span>
        </div>
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 flex-shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
          </svg>
          <span>{turno.fecha} a las {turno.hora}</span>
        </div>
        <div className="flex items-start gap-2">
          <svg className="w-4 h-4 flex-shrink-0 text-gray-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-3-3v6M5.25 7.5A2.25 2.25 0 017.5 5.25h9a2.25 2.25 0 012.25 2.25v9a2.25 2.25 0 01-2.25 2.25h-9A2.25 2.25 0 015.25 16.5v-9z" />
          </svg>
          <span className="leading-tight">{turno.medicamento}</span>
        </div>
      </div>

      {/* Accion cancelar */}
      {turno.estado === 'pendiente' && (
        <div className="pt-2 border-t border-gray-100">
          <button
            onClick={() => onCancelar(turno)}
            className="text-xs text-red-500 font-medium hover:text-red-700 transition-colors flex items-center gap-1"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
            Cancelar turno
          </button>
        </div>
      )}
    </div>
  )
}

function MisTurnos() {
  const navigate = useNavigate()
  const { usuario } = useAuth()
  const { turnosPaciente, cancelarTurno } = useTurnos()

  const turnos = useMemo(() => {
    const lista = turnosPaciente(usuario?.id)
    return [...lista].sort((a, b) => {
      const fechaA = new Date(`${a.fecha}T${a.hora}`)
      const fechaB = new Date(`${b.fecha}T${b.hora}`)
      return fechaB - fechaA
    })
  }, [usuario?.id, turnosPaciente])

  function handleCancelar(turno) {
    const confirmado = window.confirm(
      `¿Deseas cancelar el turno ${turno.numeroTurno} en ${turno.farmacia} para el ${turno.fecha} a las ${turno.hora}?`
    )
    if (confirmado) {
      cancelarTurno(turno.id)
    }
  }

  return (
    <div className="p-6 md:p-8 fade-in">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-textPrimary">Mis Turnos</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              <span className="font-semibold text-textPrimary">({turnos.length} turno{turnos.length !== 1 ? 's' : ''})</span>
            </p>
          </div>
          <Button variant="primary" onClick={() => navigate('/patient/turnos')}>
            Agendar turno
          </Button>
        </div>

        {/* Estado vacio */}
        {turnos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-14 w-14 text-gray-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z" />
            </svg>
            <div>
              <p className="text-gray-600 font-medium text-lg">No tienes turnos registrados</p>
              <p className="text-sm text-gray-400 mt-1">Agenda tu primera cita en la farmacia de tu preferencia</p>
            </div>
            <Button variant="primary" onClick={() => navigate('/patient/turnos')}>
              Agendar mi primer turno
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {turnos.map((turno) => (
              <TurnoCard key={turno.id} turno={turno} onCancelar={handleCancelar} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default MisTurnos
