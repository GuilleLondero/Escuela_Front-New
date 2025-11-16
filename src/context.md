// src/context.md
Contexto General del Frontend – Proyecto Escuela
===============================================

1. Visión general
-----------------
- `src/main.tsx` monta `App` dentro de `#root` y carga Bootstrap + Bootstrap Icons globalmente.
- `src/App.tsx` declara el router: rutas públicas (`/`, `/login`) envueltas por `PublicRoutes`; rutas protegidas usan `ProtectedRoutes` y `MainLayout` para compartir `Navbar` y `<Outlet>`.
- Las vistas principales están bajo `src/views`. Todo el estado global se resuelve con `localStorage` y los nuevos hooks personalizados; no hay Redux ni contextos adicionales.

2. Estructura relevante
-----------------------
src/
├── App.tsx
├── main.tsx
├── assets/
├── components/
│ ├── Login.tsx
│ ├── layouts/
│ │ ├── MainLayout.tsx
│ │ └── Navbar.tsx
│ └── router/
│ ├── ProtectedRoutes.tsx
│ └── PublicRoutes.tsx
├── hooks/
│ ├── useAdminAlumnos.ts
│ ├── useAdminCarreras.ts
│ ├── useAdminNotifications.ts
│ ├── useAdminPagos.ts
│ ├── useAuthUser.ts
│ ├── useLoginForm.ts
│ ├── useNotificationsList.ts
│ ├── useProfileForm.ts
│ ├── useProtectedRoute.ts
│ └── usePublicRoute.ts
└── views/
├── AdminAlumnos.tsx
├── AdminCarreras.tsx
├── AdminHome.tsx
├── AdminPagos.tsx
├── Dashboard.tsx
├── DashboardAdmin.tsx
├── NotificacionesAdmin.tsx
├── NotificacionesAlumno.tsx
├── Notifications.tsx
├── Profile.tsx
├── ProfileAdmin.tsx
└── myPayments.tsx



3. Descripción por área
-----------------------
### Components
- `Login.tsx` es ahora puramente presentacional; consume `useLoginForm` para manejar estado y POST `/users/login`.
- `layouts/MainLayout.tsx` renderiza `Navbar` + `<Suspense>`; `layouts/Navbar.tsx` controla las opciones mediante `localStorage` (`user.userdetail.type` o `user.type`).
- Router guards se apoyan en `useAuthUser`, `useProtectedRoute` y `usePublicRoute` para centralizar la lógica de token/tipo de usuario.

### Views
- `Dashboard`, `Profile`, `myPayments`, etc. mantienen la UI original. Los puntos con formularios pesados (AdminPagos, AdminAlumnos, AdminCarreras, perfiles, notificaciones) dependen ahora de hooks dedicados para la lógica.
- `DashboardAdmin` sigue enroutando a las secciones internas (`/admin/*`).

### Hooks
- **Auth / Routing:** `useAuthUser` lee `localStorage`; `useProtectedRoute` valida rutas permitidas para alumno/admin; `usePublicRoute` decide redirecciones cuando ya hay token.
- **Formularios compartidos:** `useLoginForm`, `useProfileForm` encapsulan fetch y sincronización de `localStorage`.
- **Módulos Admin:** `useAdminPagos`, `useAdminAlumnos`, `useAdminCarreras`, `useAdminNotifications` concentran fetchers, validaciones y mensajes. Todos exponen colecciones ya transformadas (ej. opciones para react-select).
- **Listas comunes:** `useNotificationsList` reutiliza el endpoint público de notificaciones para el alumno.

4. Llamadas API y patrones
--------------------------
- Todas las llamadas usan `fetch` con `http://localhost:8000` como base (ver `contextBack.md`).
- Los hooks admin almacenan el token de `localStorage` y lo incluyen en `Authorization: Bearer <token>` cuando el endpoint lo requiere.
- Varias respuestas exitosas siguen siendo strings simples (p.ej. `/users/add`, `/user/addcareer`); los hooks manejan esos casos y normalizan mensajes (`OK:` vs `ERROR:`).
- No existe cliente HTTP centralizado; cada hook define su `BASE_URL` local.

5. Estado actual de modularización
----------------------------------
- Autenticación y guards reutilizan `useAuthUser` + `useProtectedRoute`/`usePublicRoute`.
- Formularios complejos migrados a hooks: AdminPagos, AdminAlumnos, AdminCarreras, perfiles, notificaciones.
- Selects de alta/gestión administrativa usan `react-select` con opciones `[{value,label}]`. `myPayments` y otros formularios sencillos continúan con `Form.Select`.
- `NotificacionesAlumno` comparte datos gracias a `useNotificationsList`.
- Hooks devuelven mensajes normalizados (`OK:` / `ERROR:`) para simplificar la UI de alertas.

6. Riesgos y pendientes
-----------------------
- Aún no existe cliente HTTP global ni manejo estándar de errores/toasts; cada hook maneja errores localmente.
- `Dashboard.tsx`, `AdminHome.tsx`, `myPayments.tsx` conservan lógica y estilos inline largos; se pueden modularizar en futuras iteraciones.
- Las rutas permitidas en `useProtectedRoute` siguen alineadas con la navegación actual, pero cualquier cambio en los paths debe actualizar esos arrays manualmente.
- `localStorage` continúa siendo la única fuente de “estado global”; no hay expiración automática del token más allá de la validación en backend.

7. Backend relevante (resumen)
------------------------------
- FastAPI (`uvicorn app:api_escu --reload`) en `http://localhost:8000`, CORS abierto.
- Base PostgreSQL local `postgresql://postgres:1323@localhost:5432/escuela`.
- Endpoints clave: `POST /users/login`, `PUT /users/update`, `GET /notifications`, `POST /payment/add`, `GET /payment/user/{username}`, etc. (ver `contextBack.md` para el detalle completo).

