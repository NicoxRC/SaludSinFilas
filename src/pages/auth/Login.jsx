import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import FormCard from '../../components/FormCard'
import InputField from '../../components/InputField'
import Button from '../../components/Button'

const MAX_INTENTOS = 3
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function Login() {
  const { login, usuario } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (usuario) {
      if (usuario.rol === 'admin') {
        navigate('/admin/dashboard', { replace: true })
      } else {
        navigate('/patient/dashboard', { replace: true })
      }
    }
  }, [usuario, navigate])

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errores, setErrores] = useState({})
  const [errorGeneral, setErrorGeneral] = useState('')
  const [intentosFallidos, setIntentosFallidos] = useState(0)
  const [bloqueado, setBloqueado] = useState(false)

  function validar() {
    const nuevosErrores = {}

    if (!email.trim()) {
      nuevosErrores.email = 'El email es requerido.'
    } else if (!EMAIL_REGEX.test(email)) {
      nuevosErrores.email = 'Ingresa un email con formato válido.'
    }

    if (!password.trim()) {
      nuevosErrores.password = 'La contraseña es requerida.'
    }

    return nuevosErrores
  }

  function handleSubmit(e) {
    e.preventDefault()

    if (bloqueado) return

    const erroresValidacion = validar()
    if (Object.keys(erroresValidacion).length > 0) {
      setErrores(erroresValidacion)
      return
    }

    setErrores({})
    setErrorGeneral('')

    const resultado = login(email, password)

    if (!resultado.success) {
      const nuevosIntentos = intentosFallidos + 1
      setIntentosFallidos(nuevosIntentos)

      if (nuevosIntentos >= MAX_INTENTOS) {
        setBloqueado(true)
        setErrorGeneral('Cuenta bloqueada temporalmente. Intenta en 5 minutos.')
      } else {
        setErrorGeneral(resultado.mensaje)
      }
      return
    }

    if (resultado.rol === 'admin') {
      navigate('/admin/dashboard')
    } else {
      navigate('/patient/dashboard')
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold text-primary">Salud Sin Filas</h1>
        <p className="text-sm text-gray-500 mt-1">Gestiona tus turnos y medicamentos</p>
      </div>

      <FormCard title="Iniciar sesión">
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
          <InputField
            label="Correo electrónico"
            type="email"
            placeholder="tu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errores.email}
            name="email"
            disabled={bloqueado}
          />

          <InputField
            label="Contraseña"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errores.password}
            name="password"
            disabled={bloqueado}
          />

          {intentosFallidos > 0 && !errorGeneral && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm text-center">
              Intentos fallidos: {intentosFallidos}/{MAX_INTENTOS}
            </div>
          )}

          {errorGeneral && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm text-center font-medium">
              {errorGeneral}
            </div>
          )}

          <Button type="submit" variant="primary" fullWidth disabled={bloqueado}>
            Ingresar
          </Button>
        </form>

        <p className="text-sm text-center text-gray-500 mt-5">
          ¿No tienes cuenta?{' '}
          <Link to="/register" className="text-primary font-medium hover:underline">
            Regístrate
          </Link>
        </p>
      </FormCard>
    </div>
  )
}

export default Login
