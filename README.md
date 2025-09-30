# Todo List REST API con WebSockets

API REST para gestión de tareas (Todo List) con notificaciones en tiempo real mediante WebSockets. Desarrollada con Node.js, Express, TypeScript, PostgreSQL, Prisma ORM y Socket.io.

## 📋 Tabla de Contenidos

- [Características](#características)
- [Tecnologías Utilizadas](#tecnologías-utilizadas)
- [Requisitos Previos](#requisitos-previos)
- [Configuración del Entorno](#configuración-del-entorno)
- [Instalación de Dependencias](#instalación-de-dependencias)
- [Configuración de Base de Datos](#configuración-de-base-de-datos)
- [Ejecución de la Aplicación](#ejecución-de-la-aplicación)
- [API REST - Endpoints](#api-rest---endpoints)
- [WebSockets - Eventos](#websockets---eventos)
- [Cómo Probar la Funcionalidad WebSocket](#cómo-probar-la-funcionalidad-websocket)
- [Decisiones de Diseño](#decisiones-de-diseño)
- [Estructura del Proyecto](#estructura-del-proyecto)

## ✨ Características

- ✅ CRUD completo de tareas (Crear, Leer, Actualizar estado, Eliminar)
- 🔄 Notificaciones en tiempo real vía WebSockets
- 🗃️ Base de datos PostgreSQL con Prisma ORM
- 🛡️ Validación de datos con Zod
- 🔐 Seguridad con Helmet y CORS
- 📝 Logging estructurado
- 🎯 TypeScript para type-safety
- 🏗️ Arquitectura modular y escalable

## 🚀 Tecnologías Utilizadas

- **Node.js** - Runtime de JavaScript
- **Express.js** - Framework web
- **TypeScript** - Superset tipado de JavaScript
- **Socket.io** - Librería de WebSockets
- **Prisma ORM** - ORM para PostgreSQL
- **PostgreSQL** - Base de datos relacional
- **Zod** - Validación de esquemas
- **Helmet** - Seguridad HTTP headers
- **Biome** - Linter y formateador
- **pnpm** - Gestor de paquetes

## 📦 Requisitos Previos

Asegúrate de tener instalado:

- **Node.js** (v18 o superior)
- **pnpm** (v10.16.1 o superior)
- **Docker** y **Docker Compose** (para la base de datos PostgreSQL)
- **Git**

## ⚙️ Configuración del Entorno

### 1. Clonar el repositorio (si aplica)

```bash
git clone https://github.com/IraiDevPersonal/todo-list-api.git
cd todo-list-api
```

### 2. Crear archivo de variables de entorno

Copia el archivo `.env.example` y renómbralo a `.env`:

```bash
cp .env.example .env
```

### 3. Configurar variables de entorno

Edita el archivo `.env` con los valores correspondientes (por ejemplo):

```env
PORT=3000
POSTGRES_USER=postgres
POSTGRES_DB=todo_db
POSTGRES_PASSWORD=postgres_password
DATABASE_URL=postgresql://postgres:postgres_password@localhost:5432/todo_db?schema=public
NODE_ENV=development
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
LOG_LEVEL=info
```

**Nota:** Ajusta los valores según tus necesidades. El `DATABASE_URL` debe coincidir con los valores de PostgreSQL.

## 📥 Instalación de Dependencias

Instala todas las dependencias del proyecto usando pnpm:

```bash
pnpm install
```

## 🗄️ Configuración de Base de Datos

### 1. Levantar PostgreSQL con Docker

El proyecto incluye un archivo `docker-compose.yml` para facilitar el despliegue de PostgreSQL:

```bash
docker-compose up -d
```

Esto iniciará un contenedor de PostgreSQL en el puerto `5432`.

### 2. Ejecutar las migraciones de Prisma

Genera el cliente de Prisma y ejecuta las migraciones:

```bash
# Generar el cliente de Prisma
pnpm dlx prisma generate

# Ejecutar migraciones
pnpm dlx prisma migrate dev --name init
```

## 🏃 Ejecución de la Aplicación

### Modo Desarrollo

Ejecuta la aplicación en modo desarrollo con recarga automática:

```bash
pnpm dev
```

La aplicación estará disponible en: `http://localhost:3000`

### Modo Producción

Para compilar y ejecutar en modo producción:

```bash
# Compilar TypeScript
pnpm build

# Ejecutar aplicación compilada
pnpm start
```

### Verificar el estado de la API

Accede al endpoint de salud para verificar que la API está funcionando:

```bash
curl http://localhost:3000/health
```

Respuesta esperada:
```json
{
  "status": "healthy",
  "service": "Todo List API",
  "version": "1.0.0",
  "timestamp": "2025-09-30T22:03:23.000Z"
}
```

## 🔌 API REST - Endpoints

Base URL: `http://localhost:3000/api/v1`

### 1. **Obtener todas las tareas**

```http
GET /api/v1/tasks
```

**Respuesta exitosa (200):**
```json
{
  "data": [
    {
      "id": "uuid-here",
      "title": "Comprar leche",
      "description": "Ir al supermercado",
      "status": "pending",
      "createdAt": "2025-09-30T22:00:00.000Z",
      "updatedAt": "2025-09-30T22:00:00.000Z"
    }
  ]
}
```

### 2. **Crear una tarea**

```http
POST /api/v1/tasks
Content-Type: application/json

{
  "title": "Nueva tarea",
  "description": "Descripción opcional"
}
```

**Respuesta exitosa (200):**
```json
{
  "data": {
    "id": "uuid-here",
    "title": "Nueva tarea",
    "description": "Descripción opcional",
    "status": "pending",
    "createdAt": "2025-09-30T22:00:00.000Z",
    "updatedAt": "2025-09-30T22:00:00.000Z"
  }
}
```

**Evento WebSocket emitido:** `task:created`

### 3. **Actualizar estado de una tarea**

```http
PUT /api/v1/tasks/:id
Content-Type: application/json

{
  "status": "complete"
}
```

**Respuesta exitosa (200):**
```json
{
  "data": {
    "id": "uuid-here",
    "title": "Nueva tarea",
    "description": "Descripción opcional",
    "status": "complete",
    "createdAt": "2025-09-30T22:00:00.000Z",
    "updatedAt": "2025-09-30T22:05:00.000Z"
  }
}
```

**Evento WebSocket emitido:** `task:toggle_status`

### 4. **Eliminar una tarea**

```http
DELETE /api/v1/tasks/:id
```

**Respuesta exitosa (204 No Content)**

**Evento WebSocket emitido:** `task:deleted` con el `id` de la tarea eliminada

### Códigos de Estado HTTP

- `200 OK` - Operación exitosa con datos
- `204 No Content` - Operación exitosa sin contenido (DELETE)
- `400 Bad Request` - Error de validación
- `404 Not Found` - Recurso no encontrado
- `500 Internal Server Error` - Error del servidor

## 🔌 WebSockets - Eventos

El servidor emite eventos en tiempo real cuando ocurren cambios en las tareas.

### Eventos del Servidor

| Evento | Payload | Descripción |
|--------|---------|-------------|
| `task:created` | `Task` | Se emite al crear una tarea |
| `task:toggle_status` | `Task` | Se emite al cambiar el estado de una tarea |
| `task:deleted` | `string` (taskId) | Se emite al eliminar una tarea |

### Eventos de Conexión

- `connection` - Cliente conectado
- `disconnect` - Cliente desconectado

## 🧪 Cómo Probar la Funcionalidad WebSocket

### Opción 1: Cliente HTML Simple (Recomendado e incluido en el proyecto)

1. **Acceder al cliente HTML:**
   - Abre tu navegador
   - Ve a `http://localhost:3000`
   - Utiliza la intefaz para crear, actualizar y eliminar tareas
   - Observa los eventos en tiempo real

## 🏗️ Decisiones de Diseño

### Arquitectura

- **Arquitectura Modular por Características**: El código está organizado por módulos funcionales (`modules/tasks`) en lugar de por capas técnicas. Esto facilita la escalabilidad y el mantenimiento.

- **Patrón Repository**: Se implementó el patrón Repository para abstraer la lógica de acceso a datos, facilitando cambios futuros en la capa de persistencia.

- **Inyección de Dependencias**: Los controladores reciben sus dependencias (repositorios) mediante el constructor, mejorando la testabilidad.

- **Separación de Responsabilidades**:
  - Controllers: Manejan las peticiones HTTP
  - Repositories: Acceso a datos
  - Mappers: Transformación de datos entre capas
  - Schemas: Validación de entrada

### Base de Datos

- **PostgreSQL con Prisma ORM**: Prisma proporciona type-safety, migraciones automáticas y un excelente experiencia de desarrollo.

- **Índices Estratégicos**: Se crearon índices en `status`, `createdAt` y la combinación de ambos para optimizar consultas frecuentes.

- **UUID como Primary Key**: Más seguro y evita exposición de información secuencial.

### WebSockets

- **Integración con Express**: Socket.io se integra con el servidor HTTP de Express, permitiendo compartir el mismo puerto.

- **Inyección de Socket.io en Request**: El objeto `io` se inyecta en las peticiones mediante middleware, permitiendo emitir eventos desde cualquier controlador.

- **Eventos Semánticos**: Los nombres de eventos siguen un patrón claro: `entidad:acción` (ej: `task:created`).

### Validación y Seguridad

- **Zod para Validación**: Schemas de Zod validan tanto el body como los params de las peticiones.

- **Helmet**: Configura headers de seguridad HTTP automáticamente.

- **CORS Configurable**: Permite orígenes específicos en producción y todos en desarrollo.

- **Tipado Fuerte**: TypeScript previene errores en tiempo de desarrollo.

### Manejo de Errores

- **Clase Exception Centralizada**: Procesa errores de Prisma y otras fuentes, generando mensajes y códigos HTTP apropiados.

- **Logging Estructurado**: Todos los errores se registran con contexto (fuente, mensaje, error completo).

- **Respuestas Consistentes**: Se utiliza `ResponseController` para mantener un formato uniforme en todas las respuestas.

## 📁 Estructura del Proyecto

```
todo-list-rest-api/
├── prisma/
│   └── schema.prisma           # Esquema de base de datos
├── src/
│   ├── lib/
│   │   ├── controllers/        # Controladores base
│   │   ├── exceptions/         # Manejo de errores
│   │   ├── middlewares/        # Middlewares globales
│   │   ├── schemas/            # Schemas de validación compartidos
│   │   ├── config.ts           # Configuración de variables de entorno
│   │   ├── db-client.ts        # Cliente de Prisma
│   │   ├── logger.ts           # Sistema de logging
│   │   └── web-socket-server.ts # Configuración WebSocket
│   ├── modules/
│   │   └── tasks/              # Módulo de tareas
│   │       ├── models/         # Modelos y tipos
│   │       ├── schemas/        # Schemas de validación
│   │       ├── controller.ts   # Controlador de tareas
│   │       ├── repository.ts   # Interfaz del repositorio
│   │       ├── repository.impl.ts # Implementación del repositorio
│   │       ├── mapper.ts       # Mapeo de datos
│   │       └── routes.ts       # Rutas de tareas
│   ├── types/
│   │   ├── express.d.ts        # Tipos extendidos de Express
│   │   └── shared.ts           # Tipos compartidos
│   ├── app-router.ts           # Router principal
│   ├── server.ts               # Clase Server
│   └── main.ts                 # Punto de entrada
├── .env                        # Variables de entorno (no versionado)
├── .env.example                # Plantilla de variables
├── docker-compose.yml          # Configuración de Docker
├── package.json                # Dependencias
├── tsconfig.json               # Configuración TypeScript
└── README.md                   # Este archivo
```

## 📝 Scripts Disponibles

```bash
# Desarrollo con recarga automática
pnpm dev

# Compilar TypeScript
pnpm build

# Ejecutar en producción
pnpm start

# Linting
pnpm lint
pnpm lint:fix

# Formateo de código
pnpm format
pnpm format:write

# Check completo (lint + format)
pnpm check
pnpm check:fix

# Verificación de tipos
pnpm type-check
```

## 🐛 Solución de Problemas

### Error de conexión a la base de datos

```bash
# Verificar que PostgreSQL esté corriendo
docker ps

# Reiniciar contenedor
docker-compose restart

# Ver logs del contenedor
docker-compose logs postgres
```

### Error de migraciones

```bash
# Resetear la base de datos (¡CUIDADO: Elimina todos los datos!)
pnpm dlx prisma migrate reset

# Regenerar cliente de Prisma
pnpm dlx prisma generate
```

### WebSocket no conecta

- Verifica que el puerto 3000 esté disponible
- Revisa la configuración de ALLOWED_ORIGINS en `.env`

## 📄 Licencia

ISC

---

**Desarrollado con ❤️ usando Node.js, TypeScript y Socket.io**
