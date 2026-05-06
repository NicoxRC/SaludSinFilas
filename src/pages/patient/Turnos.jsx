import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Layout from '../../components/Layout'
import Button from '../../components/Button'
import { useAuth } from '../../context/AuthContext'
import { useTurnos } from '../../context/TurnosContext'

const FARMACIAS = [
  {
    id: 'emssanar',
    nombre: 'EPS Emssanar - Centro',
    direccion: 'Calle 18 #22-35, Centro',
    horario: 'Lun-Vie 7:00 AM - 5:00 PM',
  },
  {
    id: 'mallamas',
    nombre: 'EPS Mallamas - Sur',
    direccion: 'Carrera 7 #45-12, Barrio Sur',
    horario: 'Lun-Sáb 8:00 AM - 4:00 PM',
  },
  {
    id: 'coosalud',
    nombre: 'EPS Coosalud - Norte',
    direccion: 'Av. Norte #8-90, Sector Norte',
    horario: 'Lun-Vie 7:30 AM - 5:30 PM',
  },
]

function generarFranjas() {
  const franjas = []
  for (let h = 8; h <= 17; h++) {
    franjas.push(`${String(h).padStart(2, '0')}:00`)
    if (h < 17) franjas.push(`${String(h).padStart(2, '0')}:30`)
  }
  return franjas
}

const FRANJAS = generarFranjas()
const OCUPADAS = new Set(['09:00', '10:30', '14:00', '15:30'])

function calcularFechaMax() {
  const d = new Date()
  d.setDate(d.getDate() + 30)
  return d.toISOString().split('T')[0]
}

function calcularFechaMin() {
  return new Date().toISOString().split('T')[0]
}

// Icono de hospital SVG
function HospitalIcon({ className }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21"
      />
    </svg>
  )
}

// Icono check para el modal
function CheckIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-16 w-16 text-secondary"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}

// Stepper
function Stepper({ pasoActual }) {
  const pasos = ['Farmacia', 'Fecha y hora', 'Confirmar']

  return (
    <div className="flex items-center justify-center mb-8">
      {pasos.map((nombre, idx) => {
        const num = idx + 1
        const completado = num < pasoActual
        const activo = num === pasoActual

        return (
          <div key={num} className="flex items-center">
            <div className="flex flex-col items-center gap-1">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-colors
                  ${completado ? 'bg-secondary text-white' : activo ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'}`}
              >
                {completado ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  num
                )}
              </div>
              <span className={`text-xs font-medium hidden sm:block ${activo ? 'text-primary' : 'text-gray-400'}`}>
                {nombre}
              </span>
            </div>
            {idx < pasos.length - 1 && (
              <div
                className={`h-0.5 w-12 sm:w-20 mx-2 transition-colors ${completado ? 'bg-secondary' : 'bg-gray-200'}`}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

// Modal de exito
function ModalExito({ turnoCreado, onVerTurnos, onVolver }) {
  if (!turnoCreado) return null

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-8 flex flex-col items-center gap-4 animate-fade-in">
        <CheckIcon />
        <h2 className="text-xl font-bold text-textPrimary text-center">
          ¡Turno agendado exitosamente!
        </h2>
        <p className="text-3xl font-extrabold text-primary tracking-wide">
          {turnoCreado.numeroTurno}
        </p>
        <div className="w-full bg-gray-50 rounded-lg p-4 flex flex-col gap-2 text-sm text-gray-600">
          <div className="flex items-start gap-2">
            <span className="font-medium text-textPrimary min-w-[70px]">Farmacia:</span>
            <span>{turnoCreado.farmacia}</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="font-medium text-textPrimary min-w-[70px]">Fecha:</span>
            <span>{turnoCreado.fecha}</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="font-medium text-textPrimary min-w-[70px]">Hora:</span>
            <span>{turnoCreado.hora}</span>
          </div>
        </div>
        <div className="w-full flex flex-col gap-2 pt-2">
          <Button variant="primary" fullWidth onClick={onVerTurnos}>
            Ver mis turnos
          </Button>
          <Button variant="outline" fullWidth onClick={onVolver}>
            Volver al inicio
          </Button>
        </div>
      </div>
    </div>
  )
}

function Turnos() {
  const navigate = useNavigate()
  const location = useLocation()
  const { usuario } = useAuth()
  const { agregarTurno } = useTurnos()

  const medicamentoPreseleccionado = location.state?.medicamento || null

  const [paso, setPaso] = useState(1)
  const [farmaciaSeleccionada, setFarmaciaSeleccionada] = useState(null)
  const [fecha, setFecha] = useState('')
  const [hora, setHora] = useState('')
  const [turnoCreado, setTurnoCreado] = useState(null)

  function seleccionarFarmacia(farmacia) {
    setFarmaciaSeleccionada(farmacia)
    setPaso(2)
  }

  function continuarAPaso3() {
    if (fecha && hora) setPaso(3)
  }

  function confirmarTurno() {
    const sufijo = String(Date.now()).slice(-3)
    const numeroTurno = `T-2026-${sufijo}`

    const nuevoTurno = {
      id: Date.now(),
      pacienteId: usuario.id,
      farmacia: farmaciaSeleccionada.nombre,
      fecha,
      hora,
      estado: 'pendiente',
      medicamento: medicamentoPreseleccionado?.nombre || 'No especificado',
      numeroTurno,
    }

    agregarTurno(nuevoTurno)
    setTurnoCreado(nuevoTurno)
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-textPrimary">Agendar Turno</h1>
          <p className="text-sm text-gray-500 mt-1">Reserva tu cita en la farmacia de tu preferencia</p>
        </div>

        {/* Banner medicamento preseleccionado */}
        {medicamentoPreseleccionado && (
          <div className="mb-5 bg-primary/10 border border-primary/30 rounded-lg px-4 py-3 flex items-center gap-3">
            <svg className="w-5 h-5 text-primary flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-3-3v6M5.25 7.5A2.25 2.25 0 017.5 5.25h9a2.25 2.25 0 012.25 2.25v9a2.25 2.25 0 01-2.25 2.25h-9A2.25 2.25 0 015.25 16.5v-9z" />
            </svg>
            <p className="text-sm text-primary font-medium">
              Agendando turno para: <span className="font-bold">{medicamentoPreseleccionado.nombre}</span>
            </p>
          </div>
        )}

        <Stepper pasoActual={paso} />

        {/* Paso 1: Seleccionar farmacia */}
        {paso === 1 && (
          <div className="flex flex-col gap-4">
            <h2 className="text-base font-semibold text-textPrimary">Selecciona una farmacia</h2>
            {FARMACIAS.map((farmacia) => (
              <button
                key={farmacia.id}
                onClick={() => seleccionarFarmacia(farmacia)}
                className={`w-full text-left bg-white rounded-xl shadow-sm border-2 p-4 flex items-start gap-4 transition-all hover:shadow-md
                  ${farmaciaSeleccionada?.id === farmacia.id ? 'border-primary' : 'border-gray-100 hover:border-primary/40'}`}
              >
                <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <HospitalIcon className="w-7 h-7 text-primary" />
                </div>
                <div className="flex flex-col gap-1 min-w-0">
                  <span className="font-semibold text-textPrimary text-sm sm:text-base">{farmacia.nombre}</span>
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                    {farmacia.direccion}
                  </span>
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {farmacia.horario}
                  </span>
                </div>
                <div className={`ml-auto flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center
                  ${farmaciaSeleccionada?.id === farmacia.id ? 'border-primary bg-primary' : 'border-gray-300'}`}>
                  {farmaciaSeleccionada?.id === farmacia.id && (
                    <div className="w-2 h-2 rounded-full bg-white" />
                  )}
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Paso 2: Seleccionar fecha y hora */}
        {paso === 2 && (
          <div className="flex flex-col gap-6">
            <h2 className="text-base font-semibold text-textPrimary">Selecciona fecha y hora</h2>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col gap-5">
              {/* Fecha */}
              <div className="flex flex-col gap-1">
                <label htmlFor="fecha-turno" className="text-sm font-medium text-textPrimary">
                  Fecha de la cita
                </label>
                <input
                  id="fecha-turno"
                  type="date"
                  min={calcularFechaMin()}
                  max={calcularFechaMax()}
                  value={fecha}
                  onChange={(e) => setFecha(e.target.value)}
                  className="w-full sm:w-56 px-3 py-2 border border-gray-300 rounded-lg text-sm text-textPrimary bg-white
                    outline-none transition-colors focus:ring-2 focus:ring-primary/30 focus:border-primary"
                />
              </div>

              {/* Franjas horarias */}
              <div className="flex flex-col gap-2">
                <p className="text-sm font-medium text-textPrimary">Hora disponible</p>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {FRANJAS.map((franja) => {
                    const ocupada = OCUPADAS.has(franja)
                    const seleccionada = hora === franja

                    return (
                      <button
                        key={franja}
                        disabled={ocupada}
                        onClick={() => setHora(franja)}
                        className={`py-2 rounded-lg text-xs font-medium transition-all border
                          ${ocupada
                            ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed line-through'
                            : seleccionada
                            ? 'bg-primary text-white border-primary shadow-sm'
                            : 'bg-white text-gray-700 border-gray-300 hover:border-primary hover:text-primary'
                          }`}
                      >
                        {franja}
                      </button>
                    )
                  })}
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  <span className="inline-block w-3 h-3 bg-gray-100 border border-gray-200 rounded mr-1 align-middle" />
                  Franjas tachadas = ocupadas
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setPaso(1)}>
                Atras
              </Button>
              <Button
                variant="primary"
                disabled={!fecha || !hora}
                onClick={continuarAPaso3}
              >
                Continuar
              </Button>
            </div>
          </div>
        )}

        {/* Paso 3: Confirmar */}
        {paso === 3 && (
          <div className="flex flex-col gap-6">
            <h2 className="text-base font-semibold text-textPrimary">Confirma tu turno</h2>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col gap-4">
              <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <HospitalIcon className="w-7 h-7 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-textPrimary">{farmaciaSeleccionada.nombre}</p>
                  <p className="text-xs text-gray-500">{farmaciaSeleccionada.direccion}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500 mb-0.5">Paciente</p>
                  <p className="font-semibold text-textPrimary">{usuario?.nombre}</p>
                </div>
                <div>
                  <p className="text-gray-500 mb-0.5">Fecha</p>
                  <p className="font-semibold text-textPrimary">{fecha}</p>
                </div>
                <div>
                  <p className="text-gray-500 mb-0.5">Hora</p>
                  <p className="font-semibold text-textPrimary">{hora}</p>
                </div>
                {medicamentoPreseleccionado && (
                  <div>
                    <p className="text-gray-500 mb-0.5">Medicamento</p>
                    <p className="font-semibold text-textPrimary text-xs leading-tight">{medicamentoPreseleccionado.nombre}</p>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-gray-100 flex flex-col gap-2">
                <Button variant="primary" fullWidth onClick={confirmarTurno}>
                  Confirmar turno
                </Button>
                <Button variant="outline" fullWidth onClick={() => setPaso(2)}>
                  Atras
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      <ModalExito
        turnoCreado={turnoCreado}
        onVerTurnos={() => navigate('/patient/mis-turnos')}
        onVolver={() => navigate('/patient/dashboard')}
      />
    </Layout>
  )
}

export default Turnos
