const sizeClasses = {
  sm: 'h-4 w-4 border-2',
  md: 'h-8 w-8 border-2',
  lg: 'h-12 w-12 border-4',
}

function Spinner({ size = 'md' }) {
  return (
    <div
      className={`
        inline-block rounded-full border-primary border-t-transparent animate-spin
        ${sizeClasses[size] || sizeClasses.md}
      `}
      role="status"
      aria-label="Cargando"
    />
  )
}

export default Spinner
