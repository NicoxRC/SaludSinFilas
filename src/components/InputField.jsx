function InputField({ label, type = 'text', placeholder, value, onChange, error, name, id, disabled }) {
  const inputId = id || name || label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-textPrimary">
          {label}
        </label>
      )}
      <input
        id={inputId}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`w-full px-3 py-2 border rounded-lg text-sm text-textPrimary bg-white
          placeholder-gray-400 outline-none transition-colors
          focus:ring-2 focus:ring-primary/30 focus:border-primary
          disabled:bg-gray-100 disabled:cursor-not-allowed
          ${error ? 'border-red-500' : 'border-gray-300'}`}
      />
      {error && (
        <p className="text-xs text-red-500 mt-0.5">{error}</p>
      )}
    </div>
  )
}

export default InputField
