# Salud Sin Filas

Prototipo de alta fidelidad para la plataforma **Salud Sin Filas**, una solución digital que permite a usuarios de EPS en Pasto (Colombia) consultar disponibilidad de medicamentos y agendar turnos virtuales en farmacias. Desarrollado como Proyecto de Ingeniería II (Fase 4) en la UNAD.

## Stack tecnológico

- **React 18** con Vite — estructura de componentes funcionales con hooks
- **TailwindCSS** — utilidades de estilo con paleta personalizada
- **React Router DOM** — enrutamiento SPA con rutas protegidas por rol
- **Recharts** — gráficos de barras y torta en el módulo de reportes
- **Sin backend** — todos los datos son mock (archivos en `src/data/`)

## Credenciales de prueba

| Rol           | Email                    | Contraseña   |
|---------------|--------------------------|--------------|
| Paciente      | nicolas@eps.com          | paciente123  |
| Administrador | admin@emssanar.com       | admin123     |

## Instalación y uso

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Compilar para producción
npm run build
```

La aplicación queda disponible en `http://localhost:5173`.

## Estructura del proyecto

```
src/
├── components/           # Componentes reutilizables
│   ├── AdminLayout.jsx   # Layout con sidebar para el administrador
│   ├── Button.jsx        # Botón con variantes primary, secondary, outline
│   ├── FormCard.jsx      # Tarjeta contenedora de formularios
│   ├── InputField.jsx    # Campo de texto con manejo de errores
│   ├── MedicamentoCard.jsx  # Tarjeta de medicamento para el paciente
│   ├── PatientLayout.jsx # Layout con sidebar para el paciente
│   └── Spinner.jsx       # Indicador de carga
├── context/              # Estado global
│   ├── AuthContext.jsx         # Usuario autenticado (fuente de verdad)
│   ├── MedicamentosContext.jsx # Inventario de medicamentos
│   └── TurnosContext.jsx       # Turnos y sus estados
├── data/                 # Datos mock (sin backend)
│   ├── medicamentos.js   # 15+ medicamentos con stock, farmacia y disponibilidad
│   ├── turnos.js         # Turnos de muestra con diferentes estados
│   └── usuarios.js       # Usuarios paciente y administrador
├── pages/
│   ├── auth/
│   │   ├── Login.jsx     # Inicio de sesión con bloqueo por intentos
│   │   └── Register.jsx  # Registro de nuevo paciente
│   ├── patient/
│   │   ├── Dashboard.jsx      # Vista de inicio del paciente
│   │   ├── Medicamentos.jsx   # Consulta de disponibilidad con filtros
│   │   ├── MisTurnos.jsx      # Listado y cancelación de turnos
│   │   └── Turnos.jsx         # Flujo de agendamiento en 3 pasos
│   ├── admin/
│   │   ├── Dashboard.jsx      # KPIs, últimos turnos y alertas de stock
│   │   ├── Inventario.jsx     # Tabla CRUD de medicamentos
│   │   ├── Reportes.jsx       # Métricas, gráficos y exportación
│   │   └── TurnosAdmin.jsx    # Panel Kanban de gestión de turnos
│   └── NotFound.jsx           # Página 404 personalizada
├── router/
│   ├── index.jsx         # Definición completa de rutas
│   ├── ProtectedRoute.jsx # Redirige a /login si no hay sesión
│   └── RoleRoute.jsx     # Redirige según rol si no coincide
├── App.jsx
├── main.jsx
└── index.css             # Animaciones globales (fade-in, modal-enter)
```

## Funcionalidades implementadas

### Autenticacion
- Inicio de sesion con validacion de formato y bloqueo tras 3 intentos fallidos
- Registro de nuevo paciente con validacion de afiliacion unica y confirmacion de contrasena
- Redireccion automatica segun rol al autenticarse
- Persistencia de sesion con `sessionStorage` (no se pierde al refrescar)
- Cierre de sesion desde cualquier pantalla

### Modulo Paciente
- **Dashboard**: saludo personalizado, contadores de turnos y medicamentos disponibles, accesos rapidos y banner de notificacion
- **Consulta de medicamentos**: busqueda por nombre en tiempo real, filtro por farmacia y disponibilidad, spinner de carga de 800ms, estado vacio con mensaje amigable
- **Agendamiento de turnos**: stepper de 3 pasos (farmacia, fecha/hora, confirmacion), franjas horarias con algunas ocupadas, modal de exito con numero de turno generado
- **Mis turnos**: listado ordenado por fecha, badges de estado, opcion de cancelar turnos pendientes

### Modulo Administrador
- **Dashboard**: KPIs del dia (pendientes, atendidos, stock bajo), tabla de ultimos 5 turnos, alertas de inventario critico, accesos rapidos
- **Inventario**: tabla con busqueda y filtro, edicion de cantidad y disponibilidad por modal, creacion de nuevos medicamentos, indicador de stock bajo (< 10 unidades)
- **Turnos (Kanban)**: tres columnas (Pendientes / En Atencion / Atendidos), botones para mover turnos entre estados, filtro por farmacia, boton para agregar turno mock
- **Reportes**: tarjetas de metricas, grafico de barras por dia de la semana, grafico de torta por farmacia, tabla top 5 medicamentos, exportacion a archivo .txt

## Tareas completadas

- [x] Tarea 1 — Configuracion inicial (Vite + React + TailwindCSS + React Router DOM)
- [x] Tarea 2 — Datos mock (medicamentos, turnos, usuarios)
- [x] Tarea 3 — Autenticacion: Login y Registro (US-01, US-02)
- [x] Tarea 4 — Consulta de medicamentos para el paciente (US-03)
- [x] Tarea 5 — Agendamiento de turnos y Mis Turnos (US-04)
- [x] Tarea 6 — Dashboard del paciente y sidebar PatientLayout (US-05)
- [x] Tarea 7 — Panel de inventario del administrador (US-06)
- [x] Tarea 8 — Panel Kanban de turnos del administrador (US-07)
- [x] Tarea 9 — Modulo de reportes con Recharts (US-08)
- [x] Tarea 10 — Dashboard del administrador con KPIs (US-07)
- [x] Tarea 11 — Rutas protegidas por rol, pagina 404, persistencia de sesion
- [x] Tarea 12 — Pulido visual: favicon, animaciones, responsive, mensajes consistentes
