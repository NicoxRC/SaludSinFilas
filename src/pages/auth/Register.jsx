import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import usuarios from '../../data/usuarios'
import FormCard from '../../components/FormCard'
import InputField from '../../components/InputField'
import Button from '../../components/Button'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const EPS_OPTIONS = [
  'EPS Emssanar - Centro',
  'EPS Mallamas - Sur',
  'EPS Coosalud - Norte',
]

const AFILIACIONES_TOMADAS = usuarios
  .filter((u) => u.afiliacion)
  .map((u) => u.afiliacion)

function Register() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    nombre: '',
    afiliacion: '',
    eps: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [errores, setErrores] = useState({})
  const [exito, setExito] = useState(false)

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  function validar() {
    const err = {}

    if (!form.nombre.trim()) err.nombre = 'El nombre completo es requerido.'

    if (!form.afiliacion.trim()) {
      err.afiliacion = 'El número de afiliación es requerido.'
    } else if (AFILIACIONES_TOMADAS.includes(form.afiliacion.trim())) {
      err.afiliacion = 'Este número de afiliación ya está registrado.'
    }

    if (!form.eps) err.eps = 'Debes seleccionar una EPS.'

    if (!form.email.trim()) {
      err.email = 'El email es requerido.'
    } else if (!EMAIL_REGEX.test(form.email)) {
      err.email = 'Ingresa un email con formato válido.'
    }

    if (!form.password) {
      err.password = 'La contraseña es requerida.'
    } else if (form.password.length < 6) {
      err.password = 'La contraseña debe tener al menos 6 caracteres.'
    }

    if (!form.confirmPassword) {
      err.confirmPassword = 'Debes confirmar tu contraseña.'
    } else if (form.password !== form.confirmPassword) {
      err.confirmPassword = 'Las contraseñas no coinciden.'
    }

    return err
  }

  function handleSubmit(e) {
    e.preventDefault()

    const erroresValidacion = validar()
    if (Object.keys(erroresValidacion).length > 0) {
      setErrores(erroresValidacion)
      return
    }

    setErrores({})
    setExito(true)

    setTimeout(() => {
      navigate('/login')
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-8">
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold text-primary">Salud Sin Filas</h1>
        <p className="text-sm text-gray-500 mt-1">Crea tu cuenta para comenzar</p>
      </div>

      <FormCard title="Crear cuenta">
        {exito ? (
          <div className="bg-secondary/10 border border-secondary text-secondary rounded-lg px-4 py-3 text-sm text-center font-medium">
            ¡Registro exitoso! Redirigiendo al login...
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
            <InputField
              label="Nombre completo"
              type="text"
              placeholder="Ej: Ana García"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              error={errores.nombre}
            />

            <InputField
              label="Número de afiliación"
              type="text"
              placeholder="Ej: EPS-002"
              name="afiliacion"
              value={form.afiliacion}
              onChange={handleChange}
              error={errores.afiliacion}
            />

            <div className="flex flex-col gap-1">
              <label htmlFor="eps" className="text-sm font-medium text-textPrimary">
                EPS
              </label>
              <select
                id="eps"
                name="eps"
                value={form.eps}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg text-sm text-textPrimary bg-white
                  outline-none transition-colors
                  focus:ring-2 focus:ring-primary/30 focus:border-primary
                  ${errores.eps ? 'border-red-500' : 'border-gray-300'}`}
              >
                <option value="">Selecciona tu EPS</option>
                {EPS_OPTIONS.map((eps) => (
                  <option key={eps} value={eps}>{eps}</option>
                ))}
              </select>
              {errores.eps && (
                <p className="text-xs text-red-500 mt-0.5">{errores.eps}</p>
              )}
            </div>

            <InputField
              label="Correo electrónico"
              type="email"
              placeholder="tu@email.com"
              name="email"
              value={form.email}
              onChange={handleChange}
              error={errores.email}
            />

            <InputField
              label="Contraseña"
              type="password"
              placeholder="Mínimo 6 caracteres"
              name="password"
              value={form.password}
              onChange={handleChange}
              error={errores.password}
            />

            <InputField
              label="Confirmar contraseña"
              type="password"
              placeholder="Repite tu contraseña"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              error={errores.confirmPassword}
            />

            <Button type="submit" variant="primary" fullWidth>
              Crear cuenta
            </Button>
          </form>
        )}

        <p className="text-sm text-center text-gray-500 mt-5">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="text-primary font-medium hover:underline">
            Inicia sesión
          </Link>
        </p>
      </FormCard>
    </div>
  )
}

export default Register
