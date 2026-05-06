import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <header className="bg-primary text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight">
              Salud Sin Filas
            </span>
          </Link>

          <nav className="flex items-center gap-6 text-sm font-medium">
            {/* Navegación principal — se completará en tareas posteriores */}
            <Link
              to="/"
              className="hover:text-secondary transition-colors duration-200"
            >
              Inicio
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Navbar
