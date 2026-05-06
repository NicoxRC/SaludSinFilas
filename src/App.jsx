import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { TurnosProvider } from './context/TurnosContext'
import { MedicamentosProvider } from './context/MedicamentosContext'
import AppRouter from './router'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <MedicamentosProvider>
          <TurnosProvider>
            <AppRouter />
          </TurnosProvider>
        </MedicamentosProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
