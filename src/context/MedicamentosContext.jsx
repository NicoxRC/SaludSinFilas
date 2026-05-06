import { createContext, useContext, useState } from 'react'
import medicamentosIniciales from '../data/medicamentos'

const MedicamentosContext = createContext(null)

export function MedicamentosProvider({ children }) {
  const [medicamentos, setMedicamentos] = useState(medicamentosIniciales)

  function actualizarMedicamento(id, cambios) {
    setMedicamentos((prev) =>
      prev.map((med) => (med.id === id ? { ...med, ...cambios } : med))
    )
  }

  function agregarMedicamento(medicamento) {
    setMedicamentos((prev) => {
      const maxId = prev.reduce((max, med) => Math.max(max, med.id), 0)
      return [
        ...prev,
        {
          ...medicamento,
          id: maxId + 1,
          ultimaActualizacion: new Date().toLocaleString('es-CO'),
        },
      ]
    })
  }

  return (
    <MedicamentosContext.Provider value={{ medicamentos, actualizarMedicamento, agregarMedicamento }}>
      {children}
    </MedicamentosContext.Provider>
  )
}

export const useMedicamentos = () => useContext(MedicamentosContext)
