import { useState, useEffect, useMemo } from 'react'
import InputField from '../../components/InputField'
import Spinner from '../../components/Spinner'
import MedicamentoCard from '../../components/MedicamentoCard'
import medicamentosData from '../../data/medicamentos'

const FARMACIAS = [
  'EPS Emssanar - Centro',
  'EPS Mallamas - Sur',
  'EPS Coosalud - Norte',
]

const DISPONIBILIDAD = [
  { label: 'Todos', value: 'todos' },
  { label: 'Disponibles', value: 'disponible' },
  { label: 'No disponibles', value: 'no_disponible' },
]

function Medicamentos() {
  const [loading, setLoading] = useState(true)
  const [busqueda, setBusqueda] = useState('')
  const [farmaciaFiltro, setFarmaciaFiltro] = useState('')
  const [disponibilidadFiltro, setDisponibilidadFiltro] = useState('todos')

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800)
    return () => clearTimeout(timer)
  }, [])

  const medicamentosFiltrados = useMemo(() => {
    return medicamentosData.filter((med) => {
      const coincideNombre = med.nombre.toLowerCase().includes(busqueda.toLowerCase())
      const coincideFarmacia = farmaciaFiltro === '' || med.farmacia === farmaciaFiltro
      const coincideDisponibilidad =
        disponibilidadFiltro === 'todos' ||
        (disponibilidadFiltro === 'disponible' && med.disponible) ||
        (disponibilidadFiltro === 'no_disponible' && !med.disponible)
      return coincideNombre && coincideFarmacia && coincideDisponibilidad
    })
  }, [busqueda, farmaciaFiltro, disponibilidadFiltro])

  return (
    <div className="p-6 md:p-8">
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-textPrimary">Consulta de Medicamentos</h1>
        <p className="text-sm text-gray-500 mt-1">Busca disponibilidad en tiempo real</p>
      </div>

      {/* Filter bar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 mb-6 flex flex-col gap-4">
        {/* Buscador */}
        <InputField
          placeholder="Buscar medicamento por nombre..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          id="busqueda-medicamento"
        />

        <div className="flex flex-col sm:flex-row gap-4">
          {/* Filtro farmacia */}
          <div className="flex-1">
            <label htmlFor="filtro-farmacia" className="text-sm font-medium text-textPrimary block mb-1">
              Farmacia
            </label>
            <select
              id="filtro-farmacia"
              value={farmaciaFiltro}
              onChange={(e) => setFarmaciaFiltro(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-textPrimary bg-white
                outline-none transition-colors focus:ring-2 focus:ring-primary/30 focus:border-primary"
            >
              <option value="">Todas las farmacias</option>
              {FARMACIAS.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div>

          {/* Filtro disponibilidad */}
          <div>
            <p className="text-sm font-medium text-textPrimary mb-1">Disponibilidad</p>
            <div className="flex gap-2">
              {DISPONIBILIDAD.map(({ label, value }) => (
                <button
                  key={value}
                  onClick={() => setDisponibilidadFiltro(value)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors border
                    ${
                      disponibilidadFiltro === value
                        ? 'bg-primary text-white border-primary'
                        : 'bg-white text-gray-600 border-gray-300 hover:border-primary hover:text-primary'
                    }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <Spinner size="lg" />
          <p className="text-sm text-gray-500">Cargando medicamentos...</p>
        </div>
      ) : (
        <>
          {/* Contador de resultados */}
          <p className="text-sm text-gray-500 mb-4">
            Mostrando{' '}
            <span className="font-medium text-textPrimary">{medicamentosFiltrados.length}</span> de{' '}
            <span className="font-medium text-textPrimary">{medicamentosData.length}</span> medicamentos
          </p>

          {/* Grid o estado vacío */}
          {medicamentosFiltrados.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-3 text-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-14 w-14 text-gray-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                />
              </svg>
              <p className="text-gray-500 font-medium">No se encontraron medicamentos con los filtros seleccionados</p>
              <p className="text-sm text-gray-400">Intenta ajustar los filtros o el término de búsqueda</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
              {medicamentosFiltrados.map((med) => (
                <MedicamentoCard key={med.id} medicamento={med} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default Medicamentos
