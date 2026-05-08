const variantClasses = {
  primary: 'bg-primary text-white hover:bg-primary-600 disabled:bg-primary/50',
  secondary: 'bg-secondary text-white hover:bg-secondary-600 disabled:bg-secondary/50',
  outline: 'border border-primary text-primary bg-transparent hover:bg-primary/5 disabled:opacity-50',
}

function Button({ children, onClick, type = 'button', variant = 'primary', disabled = false, fullWidth = false }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        px-4 py-2 rounded-lg text-sm font-medium
        transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary/40
        hover:opacity-90
        active:scale-95
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variantClasses[variant] || variantClasses.primary}
        ${fullWidth ? 'w-full' : ''}
      `}
    >
      {children}
    </button>
  )
}

export default Button
