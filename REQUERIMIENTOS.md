# Salud Sin Filas — Requerimientos del Prototipo React

Prototipo de alta fidelidad para la plataforma **Salud Sin Filas**, una solución digital que permite a usuarios de EPS en Pasto consultar disponibilidad de medicamentos y agendar turnos virtuales.

**Stack:** React + TailwindCSS + React Router  
**Datos:** Mock (sin backend real)  
**Objetivo:** Prototipo navegable y funcional para presentación académica (Fase 4 - Proyecto de Ingeniería II, UNAD)

---

## Estructura general de la app

La app tiene dos tipos de usuario:
- **Paciente** (usuario de EPS)
- **Administrador** (farmacia/EPS)

El enrutamiento debe separar ambas vistas. Los datos se manejan con estado local o context.

---

## TAREA 1 — Configuración inicial del proyecto

**Descripción:** Crear la base del proyecto React con todas las dependencias y estructura de carpetas necesaria.

**Incluye:**
- Inicializar proyecto con Vite + React
- Instalar y configurar TailwindCSS
- Instalar React Router DOM
- Crear estructura de carpetas:
  ```
  src/
  ├── components/       # Componentes reutilizables (botones, inputs, cards, navbar)
  ├── pages/            # Páginas principales
  │   ├── auth/         # Login y registro
  │   ├── patient/      # Vistas del paciente
  │   └── admin/        # Vistas del administrador
  ├── data/             # Datos mock (medicamentos, turnos, farmacias)
  ├── context/          # Estado global (usuario autenticado)
  └── router/           # Configuración de rutas
  ```
- Definir paleta de colores en tailwind.config.js:
  - Primary: azul institucional `#1E6FBF`
  - Secondary: verde salud `#28A745`
  - Background: `#F5F7FA`
  - Text principal: `#1A1A2E`
- Crear layout base con Navbar y Footer

---

## TAREA 2 — Datos mock

**Descripción:** Crear los archivos de datos simulados que alimentarán todas las vistas de la app.

**Archivos a crear en `src/data/`:**

### `medicamentos.js`
Lista de al menos 15 medicamentos con:
- `id`, `nombre`, `categoria`, `farmacia`, `disponible` (boolean), `cantidad`, `ultimaActualizacion`

Farmacias disponibles: `"EPS Emssanar - Centro"`, `"EPS Mallamas - Sur"`, `"EPS Coosalud - Norte"`

### `turnos.js`
Lista de turnos simulados con:
- `id`, `pacienteId`, `farmacia`, `fecha`, `hora`, `estado` (`pendiente` | `atendido` | `cancelado`), `medicamento`

### `usuarios.js`
Dos usuarios de prueba:
- Paciente: `{ id: 1, nombre: "Nicolás Rojas", afiliacion: "EPS-001", email: "nicolas@eps.com", rol: "paciente" }`
- Admin: `{ id: 2, nombre: "Admin Farmacia", email: "admin@emssanar.com", rol: "admin" }`

---

## TAREA 3 — Autenticación (US-01 y US-02)

**Descripción:** Pantallas de registro e inicio de sesión. No requiere backend, solo validación de formularios y estado local.

**Páginas:**

### `/login`
- Formulario: email + contraseña
- Validación: campos no vacíos, formato de email
- Simular bloqueo tras 3 intentos fallidos (mostrar mensaje de error)
- Botón "¿No tienes cuenta? Regístrate"
- Al ingresar credenciales del mock, redirigir según rol:
  - Paciente → `/patient/dashboard`
  - Admin → `/admin/dashboard`

### `/register`
- Formulario: nombre completo, número de afiliación, EPS (select), email, contraseña, confirmar contraseña
- Validación: número de afiliación único (verificar contra mock), contraseñas coincidan
- Al registrar exitosamente, mostrar mensaje de confirmación y redirigir a `/login`

**Componentes reutilizables:** `InputField`, `Button`, `FormCard`

---

## TAREA 4 — Módulo del Paciente: Consulta de Medicamentos (US-03)

**Descripción:** Vista principal del paciente para buscar medicamentos y ver disponibilidad en tiempo real (simulada).

**Página:** `/patient/medicamentos`

**Funcionalidades:**
- Buscador por nombre de medicamento (filtro en tiempo real sobre el mock)
- Filtro por farmacia (dropdown con las 3 farmacias del mock)
- Filtro por disponibilidad (todos / disponibles / no disponibles)
- Tarjeta por cada medicamento con:
  - Nombre y categoría
  - Badge de disponibilidad: verde (`Disponible`) o rojo (`No disponible`)
  - Cantidad en stock
  - Nombre de la farmacia
  - Última actualización (hora simulada)
- Si no hay resultados, mostrar estado vacío con mensaje amigable
- Botón "Agendar turno" en cada medicamento disponible (redirige a `/patient/turnos`)

---

## TAREA 5 — Módulo del Paciente: Agendamiento de Turnos (US-04)

**Descripción:** Flujo de 3 pasos para que el paciente agende un turno virtual.

**Página:** `/patient/turnos`

**Flujo en pasos (stepper visual):**

**Paso 1 — Seleccionar farmacia**
- Cards con las 3 farmacias disponibles
- Mostrar dirección y horario simulado
- Al seleccionar, avanzar al paso 2

**Paso 2 — Seleccionar fecha y hora**
- Selector de fecha (mínimo: hoy, máximo: 30 días)
- Franjas horarias disponibles como botones (ej: 8:00, 8:30, 9:00... hasta 17:00)
- Simular algunas franjas como "ocupadas" (deshabilitadas)
- Al seleccionar, avanzar al paso 3

**Paso 3 — Confirmar turno**
- Resumen: farmacia, fecha, hora, nombre del paciente
- Botón "Confirmar turno"
- Al confirmar: agregar turno al estado global y mostrar modal de éxito con número de turno generado (ej: T-2024-087)
- Botón "Ver mis turnos" en el modal

**Página:** `/patient/mis-turnos`
- Listado de turnos del paciente (del mock + los agendados en sesión)
- Badge de estado: pendiente (amarillo), atendido (verde), cancelado (gris)
- Opción de cancelar un turno pendiente (cambia estado a cancelado)

---

## TAREA 6 — Módulo del Paciente: Dashboard y Navegación (US-05)

**Descripción:** Vista de inicio del paciente y barra de navegación lateral.

**Página:** `/patient/dashboard`

**Incluye:**
- Saludo personalizado con nombre del usuario
- Tarjeta resumen: número de turnos pendientes
- Tarjeta resumen: medicamentos favoritos (mock)
- Acceso rápido a: Buscar medicamentos / Agendar turno / Mis turnos
- Notificación simulada: banner informativo "Tienes un turno mañana a las 9:00 AM en EPS Emssanar - Centro"

**Navbar lateral (sidebar) del paciente:**
- Logo "Salud Sin Filas"
- Links: Dashboard / Medicamentos / Agendar Turno / Mis Turnos
- Botón de cerrar sesión (regresa a `/login`)

---

## TAREA 7 — Módulo Administrador: Panel de Inventarios (US-06)

**Descripción:** Vista del administrador para gestionar el inventario de medicamentos.

**Página:** `/admin/inventario`

**Funcionalidades:**
- Tabla de medicamentos con columnas: Nombre, Categoría, Cantidad, Estado, Última actualización, Acciones
- Botón "Editar" por fila: abre modal para cambiar cantidad y disponibilidad
- Botón "Agregar medicamento": abre modal con formulario (nombre, categoría, cantidad)
- Buscador por nombre
- Filtro por estado (disponible / no disponible)
- Indicador visual cuando el stock es bajo (< 10 unidades): badge naranja "Stock bajo"
- Al guardar cambios, actualizar el estado local inmediatamente

---

## TAREA 8 — Módulo Administrador: Flujo de Turnos en Tiempo Real (US-07)

**Descripción:** Panel para que el administrador vea y gestione los turnos del día.

**Página:** `/admin/turnos`

**Funcionalidades:**
- Tres columnas tipo Kanban: **Pendientes** / **En atención** / **Atendidos**
- Cada tarjeta de turno muestra: número de turno, nombre del paciente, hora, medicamento solicitado
- Botones de acción:
  - "Llamar siguiente" (mueve de Pendiente a En Atención)
  - "Marcar atendido" (mueve de En Atención a Atendido)
- Contador en la cabecera de cada columna
- Filtro por farmacia
- Simulación de actualización: botón "Actualizar" que reordena/agrega un turno mock

---

## TAREA 9 — Módulo Administrador: Reportes (US-08)

**Descripción:** Vista de reportes con métricas básicas del sistema.

**Página:** `/admin/reportes`

**Incluye:**
- Tarjetas de métricas: Total turnos del mes / Tiempo promedio de atención / Medicamentos más solicitados / Turnos cancelados
- Gráfico de barras: turnos por día de la semana (datos mock, usar librería `recharts`)
- Gráfico de torta: distribución por farmacia
- Tabla: top 5 medicamentos más solicitados
- Botón "Exportar reporte" (simular con `alert` o descarga de texto plano)

---

## TAREA 10 — Módulo Administrador: Dashboard (US-07)

**Descripción:** Vista de inicio del administrador con resumen del sistema.

**Página:** `/admin/dashboard`

**Incluye:**
- KPIs del día: turnos pendientes, turnos atendidos, medicamentos con stock bajo
- Tabla de últimos 5 turnos registrados
- Alertas de stock bajo (medicamentos con menos de 10 unidades)
- Sidebar del administrador:
  - Links: Dashboard / Inventario / Turnos / Reportes
  - Botón de cerrar sesión

---

## TAREA 11 — Rutas protegidas y navegación global

**Descripción:** Implementar protección de rutas según el rol del usuario.

**Incluye:**
- `ProtectedRoute` component: si no hay usuario autenticado, redirigir a `/login`
- `RoleRoute` component: si el rol no coincide, redirigir al dashboard correspondiente
- Ruta raíz `/` redirige a `/login`
- Página 404 personalizada con botón de regreso
- Persistencia de sesión en `sessionStorage` (para que no se pierda al refrescar)

---

## TAREA 12 — Pulido visual y responsive

**Descripción:** Revisión final de estilos, responsive design y detalles de UX.

**Incluye:**
- Verificar que todas las vistas sean responsive (mobile-first con TailwindCSS)
- Agregar transiciones y animaciones suaves (hover en botones, fade en modales)
- Loading spinner simulado al "buscar" medicamentos (setTimeout de 800ms)
- Mensajes de error y éxito consistentes en todos los formularios
- Favicon y título de la app: "Salud Sin Filas"
- Verificar contraste de colores y legibilidad general

---

## Notas para Claude Code

- Usar **datos mock** en todo momento, sin llamadas a APIs reales
- El contexto de autenticación debe estar disponible globalmente (`AuthContext`)
- Preferir componentes funcionales con hooks
- Nombrar archivos en PascalCase para componentes y camelCase para utilidades
- Cada tarea es independiente y puede desarrollarse por separado
- Al terminar cada tarea, el prototipo debe funcionar de forma parcial pero navegable
