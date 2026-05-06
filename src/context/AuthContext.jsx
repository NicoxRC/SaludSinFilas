import { createContext, useContext, useState } from 'react'
import usuarios from '../data/usuarios'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(() => {
    const stored = sessionStorage.getItem('usuario')
    return stored ? JSON.parse(stored) : null
  })

  function login(email, password) {
    const encontrado = usuarios.find(
      (u) => u.email === email && u.password === password
    )

    if (!encontrado) {
      return { success: false, mensaje: 'Credenciales incorrectas. Verifica tu email y contraseña.' }
    }

    const datosUsuario = {
      id: encontrado.id,
      nombre: encontrado.nombre,
      email: encontrado.email,
      rol: encontrado.rol,
      afiliacion: encontrado.afiliacion || null,
    }

    sessionStorage.setItem('usuario', JSON.stringify(datosUsuario))
    setUsuario(datosUsuario)

    return { success: true, rol: encontrado.rol }
  }

  function logout() {
    sessionStorage.removeItem('usuario')
    setUsuario(null)
  }

  return (
    <AuthContext.Provider value={{ usuario, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)

export default AuthContext
