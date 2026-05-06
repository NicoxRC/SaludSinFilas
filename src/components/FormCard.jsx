function FormCard({ children, title }) {
  return (
    <div className="bg-white rounded-2xl shadow-md px-8 py-8 w-full max-w-md">
      {title && (
        <h2 className="text-xl font-semibold text-textPrimary mb-6 text-center">{title}</h2>
      )}
      {children}
    </div>
  )
}

export default FormCard
