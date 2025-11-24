## Proyecto portafolio y panel administrativo

Esta aplicación está construida con Vite + React y reúne dos experiencias en un mismo front-end:

- **Landing de portafolio**: una página pública con secciones de héroe, sobre mí, habilidades, proyectos destacados, experiencia y contacto. Usa componentes reutilizables (Navbar, Hero, About, Skills, Projects, Experience, Contact y Footer) para contar la propuesta de valor del desarrollador y guiar a los visitantes por el contenido.【F:src/pages/Home.jsx†L1-L24】
- **Panel administrativo**: un dashboard protegido por login que orquesta los módulos de clientes, proyectos, suscripciones, planes, roles, usuarios, staff y CRM de WhatsApp. Las rutas internas viven bajo `/dashboard` y se renderizan dentro de un layout con barra lateral, cabecera, buscador y selector de tema claro/oscuro persistente en `localStorage`.【F:src/App.jsx†L1-L52】【F:src/components/admin/layout/DashboardLayout.jsx†L1-L95】

### Autenticación y consumo de API

El acceso al panel requiere autenticación. El formulario de `Login` envía credenciales al endpoint remoto `https://codezerohub.net/api/login.php`, guarda el token JWT y los datos del usuario en `localStorage` y redirige al dashboard una vez validado.【F:src/pages/Login.jsx†L1-L62】 Todas las peticiones se canalizan mediante `ApiService`, que centraliza el manejo de errores, logs de requests/responses y operaciones CRUD para el staff del CRM.【F:src/services/ApiService.js†L1-L62】

### Funcionalidades clave del dashboard

- **Gestión de proyectos**: listado filtrable por búsqueda, creación/edición mediante modal y eliminación con confirmación. Los datos se obtienen de `ProjectService` y cada tarjeta muestra nombre, categoría, descripción y fecha de creación.【F:src/pages/Proyectos.jsx†L1-L116】
- **Roles y usuarios**: administración de permisos y perfiles (archivos en `src/pages/Roles.jsx` y `src/pages/usuarios.jsx`).
- **Módulos adicionales**: páginas dedicadas a clientes, suscripciones, planes, staff, integraciones de WhatsApp CRM y ajustes generales (ver `src/pages/*`).

### Stack y estilos

- **UI**: Tailwind CSS 4 para los estilos base y componentes de diseño responsivo. Iconografía con `lucide-react`.
- **Routing**: `react-router-dom` para definir rutas públicas y privadas, incluyendo el layout anidado del dashboard.
- **Herramientas**: ESLint 9 para linting, Vite para desarrollo y build.

### Scripts disponibles

```bash
npm run dev       # Arranca el entorno de desarrollo
npm run build     # Genera la build de producción
npm run preview   # Sirve la build generada
npm run lint      # Ejecuta ESLint
```

### Estructura rápida

- `src/pages`: páginas públicas y de dashboard.
- `src/components`: layout del portafolio y del panel, widgets y modales.
- `src/services`: servicios de API (login, staff, proyectos, etc.).
- `src/styles`: estilos globales.
- `public/`: recursos estáticos para Vite.

Con esta descripción puedes ubicar rápidamente dónde vive cada módulo y cómo se conectan las piezas principales del proyecto.
