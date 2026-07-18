<div align="center">

# 🐾 Veterinaria API

### API REST para la gestión integral de una veterinaria

Construida con **NestJS**, **TypeORM** y **MySQL** — incluye autenticación JWT, control de acceso por roles (RBAC) y manejo de archivos multimedia.

![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)

</div>

---

## 📋 Tabla de contenidos

- [Acerca del proyecto](#-acerca-del-proyecto)
- [Características principales](#-características-principales)
- [Tecnologías utilizadas](#-tecnologías-utilizadas)
- [Estructura del proyecto](#-estructura-del-proyecto)
- [Requisitos previos](#-requisitos-previos)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Puesta en marcha](#-puesta-en-marcha)
- [Uso de la API](#-uso-de-la-api)
- [Matriz de permisos (RBAC)](#-matriz-de-permisos-rbac)
- [Endpoints disponibles](#-endpoints-disponibles)
- [Manejo de archivos](#-manejo-de-archivos)
- [Solución de problemas](#-solución-de-problemas)

---

## 📖 Acerca del proyecto

**Veterinaria API** es un backend robusto pensado para digitalizar la gestión de una clínica veterinaria: registro de clientes, sus mascotas, historias clínicas, y un sistema de usuarios con distintos niveles de acceso (cliente, veterinario, administrador).

El proyecto está construido siguiendo las mejores prácticas de arquitectura de **NestJS**: separación en módulos, inyección de dependencias, DTOs con validación estricta, y seguridad en capas mediante *Guards* personalizados.

## ✨ Características principales

- 🔐 **Autenticación segura** con contraseñas hasheadas (Bcrypt) y tokens JWT.
- 🛡️ **Control de acceso por roles (RBAC)** — cada endpoint define exactamente quién puede usarlo.
- 📸 **Subida y almacenamiento de fotos** de clientes y mascotas.
- ✅ **Validación estricta de datos** con `class-validator` en cada petición entrante.
- 🗄️ **ORM completo** con TypeORM sobre MySQL, incluyendo relaciones entre tablas.
- 🌐 **CORS habilitado** para conectar libremente con cualquier frontend (React, Vue, Angular, etc.).
- 📂 Arquitectura modular, clara y fácil de extender.

## 🛠 Tecnologías utilizadas

| Tecnología | Uso |
|---|---|
| [NestJS](https://nestjs.com/) | Framework principal del backend |
| [TypeScript](https://www.typescriptlang.org/) | Lenguaje de desarrollo |
| [TypeORM](https://typeorm.io/) | ORM para la comunicación con MySQL |
| [MySQL](https://www.mysql.com/) | Motor de base de datos |
| [JWT](https://jwt.io/) | Autenticación basada en tokens |
| [Bcrypt](https://www.npmjs.com/package/bcrypt) | Encriptación de contraseñas |
| [Multer](https://github.com/expressjs/multer) | Subida de archivos (fotos) |
| [class-validator](https://github.com/typestack/class-validator) | Validación de DTOs |

## 📁 Estructura del proyecto

```
src/
├── main.ts                  # Punto de entrada: CORS, validaciones, archivos estáticos
├── app.module.ts            # Módulo raíz y conexión a la base de datos
│
├── clientes/                # Gestión de dueños/clientes de la veterinaria
├── mascotas/                # Gestión de mascotas e historias clínicas
├── usuarios/                # Gestión de cuentas del sistema
└── auth/                    # Login, JWT, Guards y control de roles
    ├── guards/
    │   ├── auth.guard.ts       # Verifica que el token sea válido
    │   └── roles.guard.ts      # Verifica que el rol tenga permiso
    └── decorators/
        └── roles.decorator.ts  # @Roles('admin', 'veterinario')
```

## ✅ Requisitos previos

Antes de instalar, asegurate de tener lo siguiente en tu computadora:

- [Node.js](https://nodejs.org/) v18 o superior
- [MySQL](https://www.mysql.com/) (o alguna herramienta como XAMPP, Laragon o WAMP que lo incluya)
- Un cliente de MySQL para importar la base de datos: [phpMyAdmin](https://www.phpmyadmin.net/), [MySQL Workbench](https://www.mysql.com/products/workbench/), o consola
- Un cliente para probar la API: [Postman](https://www.postman.com/) o [Thunder Client](https://www.thunderclient.com/) (extensión de VS Code)

## 🚀 Instalación

**1. Cloná el repositorio**

```bash
git clone https://github.com/tu-usuario/veterinaria-backend.git
cd veterinaria-backend
```

**2. Instalá las dependencias**

```bash
npm install
```

**3. Creá la base de datos**

Abrí tu gestor de MySQL (por ejemplo phpMyAdmin) y:
1. Creá una base de datos llamada `veterinaria`.
2. Importá el archivo `veterinaria.sql` incluido en el repositorio (pestaña **Importar**).

## ⚙️ Configuración

Este proyecto usa variables de entorno para no exponer credenciales sensibles. Copiá el archivo de ejemplo:

```bash
cp .env.example .env
```

Abrí el `.env` recién creado y ajustá los valores según tu entorno local:

```env
# --- Base de datos MySQL ---
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=
DB_DATABASE=veterinaria

# --- JWT ---
JWT_SECRET=PALABRA_SUPER_SECRETA_VETERINARIA_2026
JWT_EXPIRES_IN=1d

# --- Servidor ---
PORT=3000
```

> 💡 **Tip:** si usás XAMPP/Laragon con la configuración por defecto, generalmente `DB_USERNAME=root` y `DB_PASSWORD` vacío ya funciona sin cambios.

## ▶️ Puesta en marcha

Con la base de datos importada y el `.env` configurado, levantá el servidor:

```bash
npm run start:dev
```

Si todo salió bien, vas a ver en la consola:

```
[Nest] LOG [NestApplication] Nest application successfully started
🐾 API Veterinaria corriendo en http://localhost:3000
```

> ⚠️ Esta es una **API REST**, no un sitio web con interfaz visual. Si abrís `http://localhost:3000` en el navegador vas a ver `Cannot GET /` — es el comportamiento esperado, ya que no hay ninguna ruta configurada en la raíz. Para interactuar con la API, usá Postman o Thunder Client (ver siguiente sección).

## 📡 Uso de la API

### 1. Registrar un usuario

```http
POST /usuarios
Content-Type: application/json

{
  "email": "admin@veterinaria.com",
  "password": "admin123456",
  "rol": "admin"
}
```

### 2. Iniciar sesión

```http
POST /auth/login
Content-Type: application/json

{
  "email": "admin@veterinaria.com",
  "passwordPlain": "admin123456"
}
```

**Respuesta:**
```json
{
  "user": { "id": 1, "email": "admin@veterinaria.com", "rol": "admin" },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 3. Consumir rutas protegidas

Con el `token` obtenido, agregalo en cada petición como header:

```http
GET /clientes
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 🔒 Matriz de permisos (RBAC)

| Recurso | Ver (GET) | Crear (POST) | Editar (PATCH) | Eliminar (DELETE) |
|---|:---:|:---:|:---:|:---:|
| **Mascotas** | Cualquier usuario logueado | Cualquier usuario logueado | `admin` · `veterinario` | `admin` · `veterinario` |
| **Clientes** | Cualquier usuario logueado | `admin` · `veterinario` | `admin` · `veterinario` | `admin` |
| **Usuarios** | `admin` | Público (registro) | `admin` | `admin` |

## 🔗 Endpoints disponibles

<details>
<summary><strong>👤 Usuarios</strong></summary>

| Método | Ruta | Descripción | Acceso |
|---|---|---|---|
| `POST` | `/usuarios` | Registrar una cuenta nueva | Público |
| `GET` | `/usuarios` | Listar usuarios | `admin` |
| `GET` | `/usuarios/:id` | Ver un usuario | `admin` |
| `PATCH` | `/usuarios/:id` | Editar un usuario | `admin` |
| `DELETE` | `/usuarios/:id` | Eliminar un usuario | `admin` |

</details>

<details>
<summary><strong>🔑 Autenticación</strong></summary>

| Método | Ruta | Descripción | Acceso |
|---|---|---|---|
| `POST` | `/auth/login` | Iniciar sesión y obtener el token JWT | Público |

</details>

<details>
<summary><strong>🧑‍🤝‍🧑 Clientes</strong></summary>

| Método | Ruta | Descripción | Acceso |
|---|---|---|---|
| `GET` | `/clientes` | Listar todos los clientes | Logueado |
| `GET` | `/clientes/:id` | Ver un cliente y sus mascotas | Logueado |
| `POST` | `/clientes` | Crear un cliente nuevo (`form-data`, admite foto) | `admin` · `veterinario` |
| `PATCH` | `/clientes/:id` | Editar un cliente | `admin` · `veterinario` |
| `DELETE` | `/clientes/:id` | Eliminar un cliente | `admin` |

</details>

<details>
<summary><strong>🐶 Mascotas</strong></summary>

| Método | Ruta | Descripción | Acceso |
|---|---|---|---|
| `GET` | `/mascotas` | Listar mascotas con su dueño | Logueado |
| `GET` | `/mascotas/:id` | Ver una mascota | Logueado |
| `GET` | `/mascotas/cliente/:clientesId` | Ver mascotas de un cliente | Logueado |
| `POST` | `/mascotas` | Registrar mascota (`form-data`, admite foto) | Logueado |
| `PATCH` | `/mascotas/:id` | Editar una mascota | `admin` · `veterinario` |
| `DELETE` | `/mascotas/:id` | Eliminar una mascota | `admin` · `veterinario` |

</details>

## 🖼️ Manejo de archivos

Las rutas de creación/edición de **clientes** y **mascotas** aceptan una foto mediante `multipart/form-data` en el campo `foto`. Los archivos se guardan en `./uploads/` y quedan disponibles públicamente en:

```
http://localhost:3000/uploads/mascotas/<nombre-de-archivo>
http://localhost:3000/uploads/clientes/<nombre-de-archivo>
```

## 🩺 Solución de problemas

<details>
<summary><strong>Error: <code>ECONNREFUSED 127.0.0.1:3306</code></strong></summary>

MySQL no está corriendo. Iniciá el servicio desde XAMPP/Laragon/WAMP o desde los servicios de tu sistema operativo, y verificá que el puerto en `.env` coincida con el de tu instalación.
</details>

<details>
<summary><strong>Error: <code>Unknown database 'veterinaria'</code></strong></summary>

No importaste el archivo `veterinaria.sql`. Creá la base `veterinaria` en tu gestor de MySQL e importá el `.sql` incluido en el repositorio.
</details>

<details>
<summary><strong>Error: <code>Access denied for user 'root'</code></strong></summary>

El `DB_USERNAME` o `DB_PASSWORD` de tu `.env` no coinciden con tu configuración real de MySQL. Verificalos.
</details>

<details>
<summary><strong>401 Unauthorized en rutas protegidas</strong></summary>

Te falta enviar el header <code>Authorization: Bearer &lt;token&gt;</code>, o el token expiró. Volvé a hacer login en <code>/auth/login</code> para obtener uno nuevo.
</details>

<details>
<summary><strong>403 Forbidden en rutas protegidas</strong></summary>

Tu token es válido, pero tu rol (<code>cliente</code>) no tiene permiso para esa acción. Revisá la <a href="#-matriz-de-permisos-rbac">matriz de permisos</a>.
</details>

---

<div align="center">

Hecho con 🐾 y NestJS

</div>

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
