import { Routes, Route, Navigate } from 'react-router-dom'
import Login from '../pages/auth/Login'
import Register from '../pages/auth/Register'
import PatientLayout from '../components/PatientLayout'
import AdminLayout from '../components/AdminLayout'
import PatientDashboard from '../pages/patient/Dashboard'
import AdminDashboard from '../pages/admin/Dashboard'
import Inventario from '../pages/admin/Inventario'
import Medicamentos from '../pages/patient/Medicamentos'
import Turnos from '../pages/patient/Turnos'
import MisTurnos from '../pages/patient/MisTurnos'
import TurnosAdmin from '../pages/admin/TurnosAdmin'
import Reportes from '../pages/admin/Reportes'
import NotFound from '../pages/NotFound'
import ProtectedRoute from './ProtectedRoute'
import RoleRoute from './RoleRoute'

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Rutas protegidas */}
      <Route element={<ProtectedRoute />}>
        {/* Rutas de paciente */}
        <Route element={<RoleRoute rolRequerido="paciente" />}>
          <Route element={<PatientLayout />}>
            <Route path="/patient/dashboard" element={<PatientDashboard />} />
            <Route path="/patient/medicamentos" element={<Medicamentos />} />
            <Route path="/patient/turnos" element={<Turnos />} />
            <Route path="/patient/mis-turnos" element={<MisTurnos />} />
          </Route>
        </Route>

        {/* Rutas de admin */}
        <Route element={<RoleRoute rolRequerido="admin" />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/inventario" element={<Inventario />} />
            <Route path="/admin/turnos" element={<TurnosAdmin />} />
            <Route path="/admin/reportes" element={<Reportes />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default AppRouter
