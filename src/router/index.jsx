import { Routes, Route } from 'react-router-dom'
import Layout from '../components/Layout'

function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center gap-4">
      <h1 className="text-4xl font-bold text-primary">Salud Sin Filas</h1>
      <p className="text-xl text-gray-500">En construcción</p>
      <p className="text-sm text-gray-400 max-w-md">
        Plataforma de consulta de medicamentos y agendamiento de turnos para EPS en Colombia.
      </p>
    </div>
  )
}

function AppRouter() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </Layout>
  )
}

export default AppRouter
