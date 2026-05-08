import { useState, useMemo } from 'react'
import { useMedicamentos } from '../../context/MedicamentosContext'
import Button from '../../components/Button'
import InputField from '../../components/InputField'

const FARMACIAS = [
  'EPS Emssanar - Centro',
  'EPS Mallamas - Sur',
  'EPS Coosalud - Norte',
]

/* ── Modal de Edición ─────────────────────────────────────── */
function ModalEdicion({ medicamento, onClose, onGuardar }) {
  const [cantidad, setCantidad] = useState(String(medicamento.cantidad))
  const [disponible, setDisponible] = useState(medicamento.disponible)
  const [error, setError] = useState('')

  function handleGuardar() {
    const cant = parseInt(cantidad, 10)
    if (cantidad === '' || isNaN(cant) || cant < 0) {
      setError('Ingresa una cantidad válida (mínimo 0)')
      return
    }
    onGuardar(medicamento.id, {
      cantidad: cant,
      disponible,
      ultimaActualizacion: new Date().toLocaleString('es-CO'),
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md modal-enter">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-textPrimary">Editar medicamento</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Cerrar"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-5">
          {/* Nombre (solo lectura) */}
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Medicamento</p>
            <p className="text-sm font-semibold text-textPrimary">{medicamento.nombre}</p>
          </div>

          {/* Cantidad */}
          <InputField
            label="Cantidad en stock"
            type="number"
            id="edit-cantidad"
            value={cantidad}
            onChange={(e) => {
              setCantidad(e.target.value)
              setError('')
            }}
            error={error}
          />

          {/* Disponible */}
          <div>
            <label htmlFor="edit-disponible" className="text-sm font-medium text-textPrimary block mb-1">
              Estado
            </label>
            <select
              id="edit-disponible"
              value={disponible ? 'true' : 'false'}
              onChange={(e) => setDisponible(e.target.value === 'true')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-textPrimary bg-white
                outline-none transition-colors focus:ring-2 focus:ring-primary/30 focus:border-primary"
            >
              <option value="true">Disponible</option>
              <option value="false">No disponible</option>
            </select>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100">
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button variant="primary" onClick={handleGuardar}>Guardar cambios</Button>
        </div>
      </div>
    </div>
  )
}

/* ── Modal de Creación ────────────────────────────────────── */
function ModalCreacion({ onClose, onAgregar }) {
  const [form, setForm] = useState({
    nombre: '',
    categoria: '',
    farmacia: FARMACIAS[0],
    cantidad: '',
  })
  const [errores, setErrores] = useState({})

  function handleChange(field) {
    return (e) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }))
      setErrores((prev) => ({ ...prev, [field]: '' }))
    }
  }

  function validar() {
    const errs = {}
    if (!form.nombre.trim()) errs.nombre = 'El nombre es requerido'
    if (!form.categoria.trim()) errs.categoria = 'La categoría es requerida'
    const cant = parseInt(form.cantidad, 10)
    if (form.cantidad === '' || isNaN(cant) || cant < 0) errs.cantidad = 'Ingresa una cantidad válida (mínimo 0)'
    return errs
  }

  function handleAgregar() {
    const errs = validar()
    if (Object.keys(errs).length > 0) {
      setErrores(errs)
      return
    }
    const cant = parseInt(form.cantidad, 10)
    onAgregar({
      nombre: form.nombre.trim(),
      categoria: form.categoria.trim(),
      farmacia: form.farmacia,
      cantidad: cant,
      disponible: cant > 0,
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md modal-enter">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-textPrimary">Agregar medicamento</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Cerrar"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          <InputField
            label="Nombre"
            id="crear-nombre"
            placeholder="Ej: Paracetamol 500mg"
            value={form.nombre}
            onChange={handleChange('nombre')}
            error={errores.nombre}
          />
          <InputField
            label="Categoría"
            id="crear-categoria"
            placeholder="Ej: Analgésico"
            value={form.categoria}
            onChange={handleChange('categoria')}
            error={errores.categoria}
          />

          <div>
            <label htmlFor="crear-farmacia" className="text-sm font-medium text-textPrimary block mb-1">
              Farmacia
            </label>
            <select
              id="crear-farmacia"
              value={form.farmacia}
              onChange={handleChange('farmacia')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-textPrimary bg-white
                outline-none transition-colors focus:ring-2 focus:ring-primary/30 focus:border-primary"
            >
              {FARMACIAS.map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>

          <InputField
            label="Cantidad"
            id="crear-cantidad"
            type="number"
            placeholder="0"
            value={form.cantidad}
            onChange={handleChange('cantidad')}
            error={errores.cantidad}
          />
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100">
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button variant="secondary" onClick={handleAgregar}>Agregar</Button>
        </div>
      </div>
    </div>
  )
}

/* ── Página principal ─────────────────────────────────────── */
function Inventario() {
  const { medicamentos, actualizarMedicamento, agregarMedicamento } = useMedicamentos()
  const [busqueda, setBusqueda] = useState('')
  const [estadoFiltro, setEstadoFiltro] = useState('todos')
  const [modalEdicion, setModalEdicion] = useState(null)   // medicamento seleccionado
  const [modalCreacion, setModalCreacion] = useState(false)

  const medicamentosFiltrados = useMemo(() => {
    return medicamentos.filter((med) => {
      const coincideNombre = med.nombre.toLowerCase().includes(busqueda.toLowerCase())
      const coincideEstado =
        estadoFiltro === 'todos' ||
        (estadoFiltro === 'disponible' && med.disponible) ||
        (estadoFiltro === 'no_disponible' && !med.disponible)
      return coincideNombre && coincideEstado
    })
  }, [medicamentos, busqueda, estadoFiltro])

  function handleGuardarEdicion(id, cambios) {
    actualizarMedicamento(id, cambios)
    setModalEdicion(null)
  }

  function handleAgregarMedicamento(medicamento) {
    agregarMedicamento(medicamento)
    setModalCreacion(false)
  }

  return (
    <div className="p-6 md:p-8 fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-textPrimary">Gestión de Inventario</h1>
          <p className="text-sm text-gray-500 mt-1">Administra el stock de medicamentos</p>
        </div>
        <Button variant="primary" onClick={() => setModalCreacion(true)}>
          + Agregar medicamento
        </Button>
      </div>

      {/* Barra de filtros */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-end">
        <div className="flex-1 w-full">
          <InputField
            placeholder="Buscar por nombre..."
            id="busqueda-inventario"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
        <div className="w-full sm:w-48">
          <label htmlFor="filtro-estado" className="text-sm font-medium text-textPrimary block mb-1">
            Estado
          </label>
          <select
            id="filtro-estado"
            value={estadoFiltro}
            onChange={(e) => setEstadoFiltro(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-textPrimary bg-white
              outline-none transition-colors focus:ring-2 focus:ring-primary/30 focus:border-primary"
          >
            <option value="todos">Todos</option>
            <option value="disponible">Disponibles</option>
            <option value="no_disponible">No disponibles</option>
          </select>
        </div>
        <p className="text-sm text-gray-500 whitespace-nowrap self-end pb-2">
          <span className="font-medium text-textPrimary">{medicamentosFiltrados.length}</span> medicamentos encontrados
        </p>
      </div>

      {/* Tabla */}
      <div className="shadow-sm rounded-lg overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-4 py-3 font-semibold text-textPrimary">Nombre</th>
                <th className="px-4 py-3 font-semibold text-textPrimary">Categoría</th>
                <th className="px-4 py-3 font-semibold text-textPrimary">Cantidad</th>
                <th className="px-4 py-3 font-semibold text-textPrimary">Estado</th>
                <th className="px-4 py-3 font-semibold text-textPrimary hidden lg:table-cell">Última actualización</th>
                <th className="px-4 py-3 font-semibold text-textPrimary">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {medicamentosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-gray-400">
                    No se encontraron medicamentos con los filtros seleccionados.
                  </td>
                </tr>
              ) : (
                medicamentosFiltrados.map((med, idx) => (
                  <tr
                    key={med.id}
                    className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                  >
                    <td className="px-4 py-3 font-medium text-textPrimary whitespace-nowrap">
                      {med.nombre}
                    </td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                      {med.categoria}
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-medium text-textPrimary">{med.cantidad}</span>
                      {med.cantidad < 10 && (
                        <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-700">
                          Stock bajo
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {med.disponible ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                          Disponible
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
                          No disponible
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs hidden lg:table-cell whitespace-nowrap">
                      {med.ultimaActualizacion}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setModalEdicion(med)}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium border border-primary text-primary
                          bg-transparent hover:bg-primary/5 transition-colors focus:outline-none focus:ring-2
                          focus:ring-primary/30"
                      >
                        Editar
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal edición */}
      {modalEdicion && (
        <ModalEdicion
          medicamento={modalEdicion}
          onClose={() => setModalEdicion(null)}
          onGuardar={handleGuardarEdicion}
        />
      )}

      {/* Modal creación */}
      {modalCreacion && (
        <ModalCreacion
          onClose={() => setModalCreacion(false)}
          onAgregar={handleAgregarMedicamento}
        />
      )}
    </div>
  )
}

export default Inventario
