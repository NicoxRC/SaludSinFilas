import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function NotFound() {
  const navigate = useNavigate()
  const { usuario } = useAuth()

  function handleVolver() {
    if (!usuario) {
      navigate('/login', { replace: true })
    } else if (usuario.rol === 'admin') {
      navigate('/admin/dashboard', { replace: true })
    } else {
      navigate('/patient/dashboard', { replace: true })
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4 px-4">
      <p className="text-8xl font-bold text-primary leading-none">404</p>
      <h1 className="text-2xl font-bold text-textPrimary">Página no encontrada</h1>
      <p className="text-gray-500 text-center">
        Lo sentimos, la página que buscas no existe.
      </p>
      <button
        onClick={handleVolver}
        className="mt-2 px-6 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
      >
        Volver al inicio
      </button>
    </div>
  )
}

export default NotFound
