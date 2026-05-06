---
name: SaludSinFilas stack y estructura
description: Stack tecnológico, estructura de carpetas y convenciones del proyecto SaludSinFilas
type: project
---

Stack: Vite + React 18 + TailwindCSS 3 + React Router DOM 6. Sin backend, solo datos mock.

Estructura src/:
- components/ — componentes reutilizables (Layout, Navbar, Footer, etc.)
- pages/auth/ — Login y registro
- pages/patient/ — vistas del paciente
- pages/admin/ — vistas del administrador
- data/ — datos mock (JSON/JS)
- context/ — estado global (AuthContext pendiente)
- router/ — configuración de rutas (index.jsx)

Paleta Tailwind personalizada:
- primary: #1E6FBF (azul institucional)
- secondary: #28A745 (verde salud)
- background: #F5F7FA
- textPrimary: #1A1A2E

**Why:** Prototipo para plataforma de consulta de medicamentos y agendamiento de turnos EPS Colombia.

**How to apply:** Al agregar páginas, respetar la estructura de carpetas. Usar colores semánticos (primary, secondary, background, textPrimary) en lugar de colores Tailwind genéricos.
