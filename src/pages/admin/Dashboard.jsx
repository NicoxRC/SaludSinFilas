import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useTurnos } from '../../context/TurnosContext'
import { useMedicamentos } from '../../context/MedicamentosContext'

function getSaludo() {
  const hora = new Date().getHours()
  if (hora >= 0 && hora < 12) return 'Buenos días'
  if (hora >= 12 && hora < 18) return 'Buenas tardes'
  return 'Buenas noches'
}

function getFechaFormateada() {
  return new Date().toLocaleDateString('es-CO', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

const BADGE_ESTADO = {
  pendiente: 'bg-yellow-100 text-yellow-700 border border-yellow-300',
  en_atencion: 'bg-blue-100 text-blue-700 border border-blue-300',
  atendido: 'bg-green-100 text-green-700 border border-green-300',
  cancelado: 'bg-gray-100 text-gray-600 border border-gray-300',
}

const LABEL_ESTADO = {
  pendiente: 'Pendiente',
  en_atencion: 'En atención',
  atendido: 'Atendido',
  cancelado: 'Cancelado',
}

function BadgeEstado({ estado }) {
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${BADGE_ESTADO[estado] ?? 'bg-gray-100 text-gray-600'}`}>
      {LABEL_ESTADO[estado] ?? estado}
    </span>
  )
}

function KpiCard({ icono, titulo, valor, colorFondo, colorBorde, colorTexto }) {
  return (
    <div className={`${colorFondo} border-l-4 ${colorBorde} rounded-lg shadow-sm p-5 flex items-center gap-4`}>
      <span className="text-3xl">{icono}</span>
      <div>
        <p className="text-sm text-gray-500 font-medium">{titulo}</p>
        <p className={`text-4xl font-bold ${colorTexto}`}>{valor}</p>
      </div>
    </div>
  )
}

function AccesoRapido({ icono, titulo, descripcion, ruta, navigate }) {
  return (
    <button
      onClick={() => navigate(ruta)}
      className="bg-white rounded-lg shadow-sm p-6 text-left w-full transition-all duration-200 hover:scale-105 hover:shadow-md border border-gray-100 cursor-pointer"
    >
      <span className="text-3xl">{icono}</span>
      <p className="mt-2 font-semibold text-textPrimary text-base">{titulo}</p>
      <p className="text-sm text-gray-500 mt-1">{descripcion}</p>
    </button>
  )
}

function AdminDashboard() {
  const navigate = useNavigate()
  const { usuario } = useAuth()
  const { turnos } = useTurnos()
  const { medicamentos } = useMedicamentos()

  // KPIs
  const pendientes = turnos.filter((t) => t.estado === 'pendiente').length
  const atendidos = turnos.filter((t) => t.estado === 'atendido').length
  const stockBajoList = medicamentos.filter((m) => m.cantidad < 10)
  const stockBajoCount = stockBajoList.length

  // Últimos 5 turnos (más recientes primero)
  const ultimosTurnos = turnos.slice(-5).reverse()

  return (
    <div className="min-h-screen bg-background p-6 md:p-8 fade-in">
      <div className="space-y-8">

        {/* Header */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-textPrimary">
            {getSaludo()}, {usuario?.nombre ?? 'Administrador'}
          </h1>
          <p className="text-gray-500 mt-1">Panel de Administración — Salud Sin Filas</p>
          <p className="text-sm text-gray-400 mt-0.5 capitalize">{getFechaFormateada()}</p>
        </div>

        {/* Sección 1: KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <KpiCard
            icono="📋"
            titulo="Turnos Pendientes"
            valor={pendientes}
            colorFondo="bg-yellow-50"
            colorBorde="border-yellow-400"
            colorTexto="text-yellow-600"
          />
          <KpiCard
            icono="✅"
            titulo="Turnos Atendidos"
            valor={atendidos}
            colorFondo="bg-green-50"
            colorBorde="border-green-400"
            colorTexto="text-green-600"
          />
          <KpiCard
            icono="⚠️"
            titulo="Stock Bajo"
            valor={stockBajoCount}
            colorFondo="bg-orange-50"
            colorBorde="border-orange-400"
            colorTexto="text-orange-600"
          />
        </div>

        {/* Sección 2: Últimos turnos */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-textPrimary">
              Últimos turnos registrados
            </h2>
            <span className="bg-gray-100 text-gray-600 text-xs font-medium px-2.5 py-1 rounded-full">
              {turnos.length} total
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-2 pr-4 font-medium text-gray-500 whitespace-nowrap">N° Turno</th>
                  <th className="text-left py-2 pr-4 font-medium text-gray-500 whitespace-nowrap">Farmacia</th>
                  <th className="text-left py-2 pr-4 font-medium text-gray-500 whitespace-nowrap">Hora</th>
                  <th className="text-left py-2 pr-4 font-medium text-gray-500 whitespace-nowrap">Medicamento</th>
                  <th className="text-left py-2 font-medium text-gray-500 whitespace-nowrap">Estado</th>
                </tr>
              </thead>
              <tbody>
                {ultimosTurnos.map((turno) => (
                  <tr key={turno.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="py-3 pr-4 font-mono text-xs text-gray-700 whitespace-nowrap">{turno.numeroTurno}</td>
                    <td className="py-3 pr-4 text-gray-700 whitespace-nowrap">{turno.farmacia}</td>
                    <td className="py-3 pr-4 text-gray-700 whitespace-nowrap">{turno.hora}</td>
                    <td className="py-3 pr-4 text-gray-700">{turno.medicamento}</td>
                    <td className="py-3">
                      <BadgeEstado estado={turno.estado} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-100">
            <button
              onClick={() => navigate('/admin/turnos')}
              className="text-primary text-sm font-medium hover:underline"
            >
              Ver todos los turnos →
            </button>
          </div>
        </div>

        {/* Sección 3: Alertas de stock bajo */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-textPrimary flex items-center gap-2">
              <span>Alertas de inventario</span>
            </h2>
            {stockBajoCount > 0 && (
              <span className="bg-orange-100 text-orange-700 text-xs font-medium px-2.5 py-1 rounded-full border border-orange-200">
                {stockBajoCount} alerta{stockBajoCount !== 1 ? 's' : ''}
              </span>
            )}
          </div>

          {stockBajoCount === 0 ? (
            <div className="flex items-center gap-2 text-green-600 bg-green-50 rounded-lg p-4">
              <span className="text-lg">✓</span>
              <p className="text-sm font-medium">Todo el inventario está en niveles óptimos</p>
            </div>
          ) : (
            <div className="space-y-3">
              {stockBajoList.map((med) => (
                <div
                  key={med.id}
                  className="flex items-center justify-between bg-gray-50 rounded-lg p-4 border border-gray-100"
                >
                  <div>
                    <p className="font-medium text-textPrimary text-sm">{med.nombre}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{med.farmacia}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-600 font-medium">
                      {med.cantidad} ud.
                    </span>
                    {med.cantidad === 0 ? (
                      <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 border border-red-200 whitespace-nowrap">
                        Sin stock
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700 border border-orange-200 whitespace-nowrap">
                        Stock bajo
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-4 pt-4 border-t border-gray-100">
            <button
              onClick={() => navigate('/admin/inventario')}
              className="text-primary text-sm font-medium hover:underline"
            >
              Gestionar inventario →
            </button>
          </div>
        </div>

        {/* Sección 4: Accesos rápidos */}
        <div>
          <h2 className="text-lg font-semibold text-textPrimary mb-4">Accesos rápidos</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <AccesoRapido
              icono="📦"
              titulo="Inventario"
              descripcion="Gestiona medicamentos y stock"
              ruta="/admin/inventario"
              navigate={navigate}
            />
            <AccesoRapido
              icono="📋"
              titulo="Turnos"
              descripcion="Administra los turnos del día"
              ruta="/admin/turnos"
              navigate={navigate}
            />
            <AccesoRapido
              icono="📊"
              titulo="Reportes"
              descripcion="Consulta métricas y estadísticas"
              ruta="/admin/reportes"
              navigate={navigate}
            />
          </div>
        </div>

      </div>
    </div>
  )
}

export default AdminDashboard
