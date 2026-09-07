Carnet Comunitario — Manager (Frontend)
Panel de administración web del Carnet Comunitario, el sistema de gestión de identificaciones comunitarias de la Alcaldía de San Diego (Carabobo, Venezuela). Permite administrar solicitudes de carnets de emprendedores, mascotas y registros ciudadanos (global), desde su recepción vía Google Forms hasta su aprobación y entrega.

🌐 Demo en producción: carnet-comunitario-manager.vercel.app

🔧 Backend (API REST): github.com/Jos22ro/Proyecto-carnet-backend

📄 Documentación del webhook de Google Forms: ver GOOGLE_FORMS_SETUP.md en el repositorio del backend

✨ Características
Autenticación JWT con contexto global (AuthContext) y rutas protegidas (ProtectedRoute)
Dashboard con métricas de solicitudes y navegación por tipo: emprendedores, mascotas y global
Gestión CRUD completa de solicitudes con filtros por estado (pendiente / aprobado / rechazado), origen y búsqueda por email
Exportación de reportes a Excel por tipo de solicitud (ReporteExcelFilter)
Formularios validados con react-hook-form + zod (resolvers tipados)
Gestión de estado de servidor con TanStack React Query (caché, invalidación y mutaciones)
UI componetizada con shadcn/ui (Radix UI), Tailwind CSS y lucide-react
Gestión de usuarios con roles de administrador (RegisterUserPage)
🛠 Stack técnico
Capa
Tecnologías
Framework	React 18, TypeScript, Vite 5
UI	Tailwind CSS, shadcn/ui (Radix UI), lucide-react
Datos	Axios, TanStack React Query, react-hook-form, Zod
Routing	React Router v6
Calidad	ESLint, TypeScript ESLint, Vitest, Testing Library

🏗 Arquitectura
text

src/
├── components/
│   ├── layout/          # MainLayout, navegación
│   ├── dialogs/         # Diálogos de gestión
│   ├── ui/              # Componentes shadcn/ui
│   ├── LoginForm.tsx    # Autenticación
│   └── ReporteExcelFilter.tsx   # Exportación a Excel
├── contexts/
│   └── AuthContext.tsx  # Estado global de autenticación JWT
├── hooks/
│   ├── useSolicitudes.ts  # React Query: solicitudes
│   └── useEntities.ts     # React Query: entidades
├── pages/
│   ├── Dashboard.tsx        # Panel principal
│   ├── MascotasPage.tsx     # Solicitudes de mascotas
│   ├── EmprendedoresPage.tsx # Solicitudes de emprendedores
│   └── RegisterUserPage.tsx # Registro de usuarios
├── services/
│   └── api.ts           # Cliente Axios (JWT interceptado)
├── types/               # Tipos TypeScript compartidos
└── test/                # Configuración Vitest
Flujo de datos del sistema:

text

Google Forms ──► Apps Script ──► Webhook API (Render) ──► MySQL (Aiven)
                                                        │
                 PDF + QR (PDFKit) ◄────────────────────┘
                            │
                 Email con carnet (Nodemailer)
                            │
        Personal municipal ◄──► Este panel (Vercel) ──► API REST
🚀 Puesta en marcha
Requisitos: Node.js 18+ y npm

bash

# 1. Clonar
git clone https://github.com/Jos22ro/Proyecto-carnet-frontend.git
cd Proyecto-carnet-frontend

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env
# Editar VITE_API_URL con la URL de tu backend

# 4. Desarrollo
npm run dev        # http://localhost:5173

# 5. Producción
npm run build      # genera dist/
npm run preview    # previsualizar el build
⚙️ Variables de entorno
Variable
Descripción
Ejemplo
VITE_API_URL	URL base de la API REST	http://localhost:3001
VITE_APP_NAME	Nombre de la aplicación	Carnet Comunitario Manager
VITE_API_TIMEOUT	Timeout de peticiones en ms	30000

Las variables VITE_* se exponen en el bundle del cliente por diseño; nunca coloques secretos aquí.

☁️ Despliegue
Componente
Servicio
Nota
Frontend	Vercel	Build npm run build, output dist/
Backend API	Render	Ver repo del backend
Base de datos	MySQL en Aiven	Conexión con SSL/TLS obligatorio

El CORS del backend está restringido al dominio de producción en Vercel (credentials: true).

🔒 Seguridad
Sesiones mediante JWT emitido por la API; el token viaja en el header Authorization
Rutas de administración protegidas en el cliente (ProtectedRoute) y en la API (middleware de autenticación)
Sin secretos en el código del cliente: toda credencial vive en variables de entorno del backend
📸 Capturas
Pendiente: agregar capturas del dashboard, gestión de emprendedores/mascotas y exportación de reportes.

Desarrollado por Jos22ro · ¿Consultas o sugerencias? Abre un issue
