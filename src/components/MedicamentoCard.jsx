import { useNavigate } from 'react-router-dom'
import Button from './Button'

function MedicamentoCard({ medicamento }) {
  const navigate = useNavigate()
  const { nombre, categoria, farmacia, disponible, cantidad, ultimaActualizacion } = medicamento

  const stockBajo = disponible && cantidad < 10

  function handleAgendar() {
    navigate('/patient/turnos', { state: { medicamento } })
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 flex flex-col gap-3 hover:shadow-md transition-shadow">
      {/* Header: nombre + badges */}
      <div className="flex flex-col gap-1">
        <h3 className="font-bold text-textPrimary text-base leading-snug">{nombre}</h3>
        <p className="text-xs text-gray-500">{categoria}</p>
        <div className="flex flex-wrap gap-2 mt-1">
          {disponible ? (
            <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
              Disponible
            </span>
          ) : (
            <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
              No disponible
            </span>
          )}
          {stockBajo && (
            <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-700">
              Stock bajo
            </span>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-col gap-1 text-sm text-gray-600">
        <p>
          <span className="font-medium text-textPrimary">Stock:</span> {cantidad} unidades
        </p>
        <p className="flex items-center gap-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-primary shrink-0"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-2.079 3.678-5.092 3.678-9.07C20 5.61 16.386 2 12 2S4 5.61 4 10.278c0 3.978 1.734 6.991 3.678 9.07a19.58 19.58 0 002.683 2.282 16.975 16.975 0 001.144.742zM12 13a3 3 0 100-6 3 3 0 000 6z"
              clipRule="evenodd"
            />
          </svg>
          <span>{farmacia}</span>
        </p>
        <p className="text-xs text-gray-400">Actualizado: {ultimaActualizacion}</p>
      </div>

      {/* Acción */}
      <div className="mt-auto pt-1">
        {disponible ? (
          <Button variant="secondary" onClick={handleAgendar} fullWidth>
            Agendar turno
          </Button>
        ) : (
          <p className="text-sm text-gray-400 text-center py-1">No disponible para agendar</p>
        )}
      </div>
    </div>
  )
}

export default MedicamentoCard
