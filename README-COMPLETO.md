# Carnet Comunitario Manager

Sistema completo de gestión de carnets comunitarios con frontend React y backend Node.js/Express.

## 🏗️ Arquitectura del Sistema

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend     │    │   Backend       │    │   Database      │
│   React + Vite │◄──►│ Node.js +      │◄──►│   MySQL        │
│   TypeScript   │    │ Express + TS   │    │   + Migrations  │
│   Tailwind     │    │   JWT Auth      │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         ▲                       ▲
         │                       │
         ▼                       ▼
┌─────────────────┐    ┌─────────────────┐
│   Google Forms  │    │   File Upload  │
│   Webhook       │    │   QR Codes     │
└─────────────────┘    └─────────────────┘
```

## 🚀 Iniciar el Sistema Completo

### 1. Base de Datos
```sql
-- Ejecutar el script SQL proporcionado para crear tablas
-- CREATE DATABASE carnet_comunitario;
-- USE carnet_comunitario;
-- -- (script completo en backend/README.md)
```

### 2. Backend
```bash
cd backend
cp .env.example .env
# Configurar credenciales MySQL
npm install
npm run dev    # Desarrollo (http://localhost:3001)
npm run build  # Producción
npm start       # Producción
```

### 3. Frontend
```bash
# En la raíz del proyecto
cp .env.example .env
# Configurar VITE_API_URL=http://localhost:3001
npm install
npm run dev    # Desarrollo (http://localhost:5173)
npm run build  # Producción
```

## 🔐 Acceso al Sistema

**Usuario por defecto:**
- Email: `admin@carnet.com`
- Contraseña: `admin123`

## 📋 Características Implementadas

### ✅ Backend Completo
- **API RESTful** con Express + TypeScript
- **Autenticación JWT** con refresh tokens
- **MySQL** con connection pooling y transacciones
- **Endpoints CRUD** para solicitudes
- **Endpoints específicos** por tipo (emprendedor, mascota, global)
- **Webhook** para Google Forms
- **Manejo de archivos** (QR codes, imágenes)
- **Validaciones** y error handling
- **Logs de envío** y tracking

### ✅ Frontend Completo
- **React 18 + Vite** con TypeScript
- **Autenticación** con rutas protegidas
- **Dashboard** con estadísticas en tiempo real
- **Gestión de solicitudes** por categorías
- **Formularios** de registro y edición
- **Tablas** con paginación y filtros
- **UI moderna** con shadcn/ui + Tailwind
- **Responsive design**
- **Integración API** con React Query

### ✅ Tipos de Carnets
1. **🐾 Mascotas** - Carnet para mascotas comunitarias
2. **💼 Emprendedores** - Carnet para negocios locales
3. **👤 Personas** - Carnet de identificación general

### ✅ Flujo Completo
1. **Google Form → Webhook → API** (automático)
2. **Dashboard → Validación → Aprobación/Rechazo**
3. **Email de confirmación → QR Code generado**
4. **Estado tracking** con logs

## 📊 API Endpoints

### Autenticación
```http
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/profile
POST /api/auth/refresh
```

### Solicitudes (CRUD)
```http
GET    /api/solicitudes
GET    /api/solicitudes/:id
POST   /api/solicitudes
PUT    /api/solicitudes/:id
DELETE /api/solicitudes/:id
```

### Específicos
```http
GET /api/emprendedores      + /stats
GET /api/mascotas          + /stats  
GET /api/global            + /stats
```

### Webhook Google Forms
```http
POST /api/webhook/solicitud  # Recibe datos del formulario
GET  /api/webhook/test       # Test webhook
GET  /api/webhook/status     # Estado del webhook
```

## 🔧 Configuración Google Forms + Apps Script

### 1. Script en Google Apps Script
```javascript
function doPost(e) {
  const data = JSON.parse(e.postData.contents);
  const url = 'https://tu-api.com/api/webhook/solicitud';
  
  UrlFetchApp.fetch(url, {
    method: 'POST',
    contentType: 'application/json',
    payload: JSON.stringify(data)
  });
}
```

### 2. Publicar como Web App
- **Execute as:** Me
- **Who has access:** Anyone
- **Copiar URL del webhook**

### 3. Configurar Google Form
- Configurar disparador "On form submit"
- Enviar datos al Apps Script

## 🗄️ Estructura de Base de Datos

```sql
-- Tabla principal
solicitudes (id_solicitud, tipo_solicitud, estado, origen, email_contacto, codigo_qr_hash, fechas)

-- Tablas específicas
detalles_emprendedores (documento_titular, razon_social, tipo_persona, direccion_fisica, etc.)
detalles_mascotas (nombre_mascota, especie, raza, nombre_tutor)
detalles_global (nombre_completo, documento, domicilio)

-- Tracking
logs_envio (id_solicitud, email_enviado, resultado, mensaje_error)
```

## 🌐 Variables de Entorno

### Backend (.env)
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_contraseña
DB_NAME=carnet_comunitario
JWT_SECRET=tu_secreto_jwt
PORT=3001
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:3001
VITE_APP_NAME=Carnet Comunitario Manager
VITE_API_TIMEOUT=30000
```

## 🚀 Despliegue

### Backend (Producción)
```bash
npm run build
pm2 start dist/app.js --name "carnet-backend"
# Configurar Nginx proxy reverso
# Configurar SSL certificado
```

### Frontend (Producción)
```bash
npm run build
# Servir archivos estáticos con Nginx/Apache
# O desplegar en Vercel/Netlify
```

## 🧪 Testing

```bash
# Backend
cd backend
npm test

# Frontend  
npm run test

# API Testing
curl -X GET http://localhost:3001/health
curl -X POST http://localhost:3001/api/webhook/test
```

## 🔧 Desarrollo Local

1. **Iniciar MySQL**
2. **Iniciar Backend:** `cd backend && npm run dev`
3. **Iniciar Frontend:** `npm run dev`
4. **Acceder:** http://localhost:5173
5. **Login:** admin@carnet.com / admin123

## 📝 Notas Importantes

- **QR Codes:** Se generan automáticamente al crear solicitud
- **Emails:** Configurar SMTP para notificaciones automáticas
- **Archivos:** Se guardan en `/uploads` (configurable)
- **Logs:** Todos los eventos se registran en `logs_envio`
- **Backup:** Implementar backups automáticos de MySQL

## 🤝 Contribuir

1. Fork del proyecto
2. Crear feature branch
3. Commits descriptivos
4. Pull request con descripción clara

## 📄 Licencia

MIT License