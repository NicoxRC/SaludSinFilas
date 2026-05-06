import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useTurnos } from '../../context/TurnosContext'
import medicamentos from '../../data/medicamentos'

function getSaludo() {
  const hora = new Date().getHours()
  if (hora >= 5 && hora < 12) return 'Buenos días'
  if (hora >= 12 && hora < 19) return 'Buenas tardes'
  return 'Buenas noches'
}

const FAVORITOS_IDS = [1, 3, 5]

function ResumenCard({ titulo, valor, icono, colorAccento }) {
  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-5 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white text-xl flex-shrink-0 ${colorAccento}`}>
        {icono}
      </div>
      <div>
        <p className="text-3xl font-bold text-textPrimary">{valor}</p>
        <p className="text-sm text-gray-500 mt-0.5">{titulo}</p>
      </div>
    </div>
  )
}

function AccesoCard({ titulo, descripcion, icono, to }) {
  return (
    <Link
      to={to}
      className="bg-white rounded-xl shadow-sm hover:shadow-md hover:scale-105 transition-all duration-200 p-6 flex flex-col gap-3 border border-gray-100"
    >
      <span className="text-3xl">{icono}</span>
      <h3 className="text-base font-semibold text-textPrimary">{titulo}</h3>
      <p className="text-sm text-gray-500 leading-relaxed">{descripcion}</p>
    </Link>
  )
}

function Dashboard() {
  const { usuario } = useAuth()
  const { turnosPaciente } = useTurnos()

  const misTurnos = useMemo(
    () => (usuario ? turnosPaciente(usuario.id) : []),
    [usuario, turnosPaciente]
  )

  const pendientes = misTurnos.filter((t) => t.estado === 'pendiente').length
  const atendidos = misTurnos.filter((t) => t.estado === 'atendido').length
  const disponibles = medicamentos.filter((m) => m.disponible).length

  const tieneTurnoPendiente = pendientes > 0

  const favoritosMeds = medicamentos.filter((m) => FAVORITOS_IDS.includes(m.id))

  return (
    <div className="p-6 md:p-8 space-y-8">
      {/* Saludo */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-textPrimary">
          {getSaludo()}, {usuario?.nombre} 👋
        </h1>
        <p className="text-gray-500 mt-1">Bienvenido a Salud Sin Filas</p>
      </div>

      {/* Banner notificación */}
      {tieneTurnoPendiente && (
        <div className="bg-blue-50 border-l-4 border-primary rounded-lg p-4 flex items-center gap-4">
          <span className="text-2xl flex-shrink-0">🔔</span>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-primary font-medium">
              Tienes un turno mañana a las 9:00 AM en EPS Emssanar - Centro
            </p>
          </div>
          <Link
            to="/patient/mis-turnos"
            className="flex-shrink-0 text-xs font-semibold bg-primary text-white px-3 py-1.5 rounded-lg hover:bg-primary-600 transition-colors"
          >
            Ver turnos
          </Link>
        </div>
      )}

      {/* Tarjetas resumen */}
      <section>
        <h2 className="text-lg font-semibold text-textPrimary mb-4">Resumen</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <ResumenCard
            titulo="Turnos Pendientes"
            valor={pendientes}
            icono="📅"
            colorAccento="bg-primary"
          />
          <ResumenCard
            titulo="Turnos Atendidos"
            valor={atendidos}
            icono="✅"
            colorAccento="bg-secondary"
          />
          <ResumenCard
            titulo="Medicamentos Disponibles"
            valor={disponibles}
            icono="💊"
            colorAccento="bg-purple-500"
          />
        </div>
      </section>

      {/* Acceso rápido */}
      <section>
        <h2 className="text-lg font-semibold text-textPrimary mb-4">Acceso rápido</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <AccesoCard
            titulo="Buscar Medicamentos"
            descripcion="Consulta disponibilidad de medicamentos en las farmacias de tu EPS."
            icono="💊"
            to="/patient/medicamentos"
          />
          <AccesoCard
            titulo="Agendar Turno"
            descripcion="Reserva tu turno en la farmacia y evita filas innecesarias."
            icono="📅"
            to="/patient/turnos"
          />
          <AccesoCard
            titulo="Mis Turnos"
            descripcion="Revisa el estado de tus turnos activos, atendidos y cancelados."
            icono="📋"
            to="/patient/mis-turnos"
          />
        </div>
      </section>

      {/* Medicamentos frecuentes */}
      <section>
        <h2 className="text-lg font-semibold text-textPrimary mb-4">Medicamentos frecuentes</h2>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 divide-y divide-gray-100">
          {favoritosMeds.map((med) => (
            <div key={med.id} className="flex items-center justify-between px-5 py-4 gap-4">
              <div className="min-w-0">
                <p className="font-medium text-textPrimary text-sm truncate">{med.nombre}</p>
                <p className="text-xs text-gray-400 mt-0.5">{med.farmacia}</p>
              </div>
              <span
                className={[
                  'flex-shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full',
                  med.disponible
                    ? 'bg-secondary/10 text-secondary'
                    : 'bg-red-100 text-red-600',
                ].join(' ')}
              >
                {med.disponible ? 'Disponible' : 'No disponible'}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default Dashboard
