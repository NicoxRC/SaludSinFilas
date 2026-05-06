function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-textPrimary text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-sm">
          <p className="font-semibold tracking-wide">Salud Sin Filas</p>
          <p className="text-gray-400">&copy; {currentYear} Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
