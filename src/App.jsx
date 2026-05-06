import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { TurnosProvider } from './context/TurnosContext'
import AppRouter from './router'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <TurnosProvider>
          <AppRouter />
        </TurnosProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
