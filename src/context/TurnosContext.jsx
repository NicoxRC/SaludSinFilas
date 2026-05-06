import { createContext, useContext, useState } from 'react'
import turnosData from '../data/turnos'

const TurnosContext = createContext(null)

export function TurnosProvider({ children }) {
  const [turnos, setTurnos] = useState(() => [...turnosData])

  function agregarTurno(turno) {
    setTurnos((prev) => [...prev, turno])
  }

  function cancelarTurno(id) {
    setTurnos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, estado: 'cancelado' } : t))
    )
  }

  function turnosPaciente(pacienteId) {
    return turnos.filter((t) => t.pacienteId === pacienteId)
  }

  return (
    <TurnosContext.Provider value={{ turnos, agregarTurno, cancelarTurno, turnosPaciente }}>
      {children}
    </TurnosContext.Provider>
  )
}

export const useTurnos = () => useContext(TurnosContext)

export default TurnosContext
