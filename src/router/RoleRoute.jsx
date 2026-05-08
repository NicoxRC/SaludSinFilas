import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function RoleRoute({ rolRequerido }) {
  const { usuario } = useAuth()

  if (!usuario) {
    return <Navigate to="/login" replace />
  }

  if (usuario.rol !== rolRequerido) {
    if (usuario.rol === 'paciente') {
      return <Navigate to="/patient/dashboard" replace />
    }
    return <Navigate to="/admin/dashboard" replace />
  }

  return <Outlet />
}

export default RoleRoute
