import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import Login from '../pages/auth/Login'
import Register from '../pages/auth/Register'
import PatientDashboard from '../pages/patient/Dashboard'
import AdminDashboard from '../pages/admin/Dashboard'

function NotFound() {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
      <h1 className="text-4xl font-bold text-textPrimary">404</h1>
      <p className="text-gray-500">Página no encontrada.</p>
      <button
        onClick={() => navigate('/')}
        className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-600 transition-colors"
      >
        Volver al inicio
      </button>
    </div>
  )
}

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/patient/dashboard" element={<PatientDashboard />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default AppRouter
