# 🏪 Sistema Completo - Café Aroma

Proyecto full-stack con sitio web para clientes y panel de administración.

## 🎯 Estructura del Proyecto

```
cafeteria-grupo/
├── Backend/                    # Spring Boot API
│   ├── src/
│   ├── pom.xml
│   └── README.md
│
└── Interfaz/                   # Frontend
    ├── cliente/                # 🌐 Sitio Web para Clientes
    │   ├── index.html          # Página 1: Inicio con slider y API
    │   ├── menu.html           # Página 2: Menú completo desde API
    │   ├── nosotros.html       # Página 3: Galería dinámica
    │   ├── contacto.html       # Página 4: Formulario de reservas
    │   ├── css/
    │   │   └── client.css
    │   ├── js/
    │   │   ├── client.js
    │   │   ├── menu.js
    │   │   ├── nosotros.js
    │   │   └── contacto.js
    │   └── README.md
    │
    ├── admin.html              # 🔧 Panel de Administración
    ├── index.html              # Página de bienvenida
    ├── CSS/
    │   ├── styles.css
    │   ├── components.css
    │   └── admin.css
    └── javascript/
        ├── script.js (legacy)
        └── admin.js
```

## 📋 Dos Sistemas en Uno

### 🌐 1. Sitio Web para CLIENTES (`cliente/`)

**4 páginas que consumen la API:**

#### ✅ **Página 1: index.html** (Inicio)

- Slider hero con 3 slides
- Presentación del negocio
- Texto de bienvenida
- **Datos desde API**: productos destacados, categorías, estadísticas

#### ✅ **Página 2: menu.html** (Menú)

- Contenido relacionado al negocio
- **Datos desde API**: todos los productos, categorías, filtros dinámicos

#### ✅ **Página 3: nosotros.html** (Nosotros)

- Listado/galería dinámica
- **Datos desde API**: productos agrupados por categoría

#### ✅ **Página 4: contacto.html** (Contacto)

- Formulario de reservas
- Validación completa
- Envío a API (opcional, funciona sin backend)

### 🔧 2. Panel de ADMINISTRACIÓN (`admin.html`)

**Sistema CRUD completo:**

- ✅ Gestión de Productos (Crear, Ver, Actualizar, Eliminar)
- ✅ Gestión de Categorías (CRUD completo)
- ✅ Gestión de Reservas (Ver, Eliminar)
- ✅ Filtros por categoría
- ✅ Modales para formularios
- ✅ Alertas y notificaciones

## 🚀 Inicio Rápido

### 1. Backend (API REST)

```bash
cd Backend
mvn spring-boot:run
```

✅ API corriendo en: **http://localhost:9090/api**

### 2. Frontend - Sitio de Clientes

```bash
cd Interfaz/cliente
python -m http.server 3000
```

✅ Sitio web en: **http://localhost:3000**

### 3. Frontend - Panel Admin (opcional)

Abre directamente: **http://localhost:3000/../admin.html**

O navega desde el index principal.

## 📡 Endpoints de la API

```
GET    /api/products               # Todos los productos
GET    /api/products/{id}          # Un producto
GET    /api/products/category/{id} # Por categoría
POST   /api/products               # Crear producto
PUT    /api/products/{id}          # Actualizar producto
DELETE /api/products/{id}          # Eliminar producto

GET    /api/categories             # Todas las categorías
POST   /api/categories             # Crear categoría
PUT    /api/categories/{id}        # Actualizar categoría
DELETE /api/categories/{id}        # Eliminar categoría

GET    /api/reservations           # Todas las reservas
POST   /api/reservations           # Crear reserva
DELETE /api/reservations/{id}      # Eliminar reserva
```

## 🎯 Flujo de Uso Completo

### Como ADMINISTRADOR:

1. Abre `admin.html`
2. Crea categorías (Cafés, Postres, Snacks)
3. Agrega productos a cada categoría
4. Los datos se guardan en PostgreSQL
5. Visualiza reservas de clientes

### Como CLIENTE:

1. Abre `cliente/index.html`
2. Navega por las 4 páginas
3. Ve productos cargados desde la API
4. Filtra por categorías
5. Envía una reserva desde el formulario

---

## 📊 Datos que Fluyen

```
┌─────────────────┐
│   PostgreSQL    │
│  (cafeteriagr)  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Spring Boot    │
│  API REST       │
│  :9090          │
└────────┬────────┘
         │
         ├──────────┬────────────────┐
         ▼          ▼                ▼
    ┌─────────┐ ┌──────────┐  ┌──────────┐
    │ Admin   │ │ Cliente  │  │ Cliente  │
    │ Panel   │ │ Página 1 │  │ Página 2 │
    └─────────┘ └──────────┘  └──────────┘
         │
         └── CRUD ──┘ (crea/edita datos)
                │
                └── Los clientes ven los datos
```

## ✅ Requisitos Cumplidos

### Página 1 (Index Cliente):

- ✅ Presentación del negocio
- ✅ Imagen principal/slider (3 slides)
- ✅ Texto de bienvenida
- ✅ Información desde API (productos, categorías, stats)

### Página 2 (Menú Cliente):

- ✅ Contenido relacionado al negocio
- ✅ Datos desde API (todos los productos, filtros)

### Página 3 (Nosotros Cliente):

- ✅ Galería/listado dinámico
- ✅ Información desde API (productos por categoría)

### Página 4 (Contacto Cliente):

- ✅ Formulario simple
- ✅ No requiere backend (pero se integra si está disponible)

## 🔧 Tecnologías Utilizadas

### Backend:

- Java 17
- Spring Boot 3.2.0
- Spring Data JPA
- PostgreSQL
- Maven

### Frontend:

- HTML5
- CSS3 (Variables, Grid, Flexbox)
- JavaScript ES6+ (Fetch API, Async/Await)
- Font Awesome
- Google Fonts

## 📁 Archivos Clave

### Cliente:

- `cliente/index.html` - Inicio con slider y API
- `cliente/menu.html` - Menú completo
- `cliente/nosotros.html` - Galería por categorías
- `cliente/contacto.html` - Formulario de reservas
- `cliente/js/client.js` - Lógica principal
- `cliente/js/menu.js` - Filtrado de productos
- `cliente/js/nosotros.js` - Galería dinámica
- `cliente/js/contacto.js` - Validación de formulario

### Admin:

- `admin.html` - Panel de administración
- `javascript/admin.js` - CRUD completo

### Backend:

- `CafeteriaApplication.java` - Aplicación principal
- `ProductController.java` - API de productos
- `CategoryController.java` - API de categorías
- `ReservationController.java` - API de reservas
- `application.properties` - Configuración

## 🎨 Características del Diseño

- **Moderno**: Gradientes, glassmorphism, sombras suaves
- **Responsive**: Móvil, tablet, desktop
- **Profesional**: Paleta café/chocolate/dorado
- **Animaciones**: Transiciones suaves
- **Accesible**: Navegación clara

## 🐛 Troubleshooting

### Backend no inicia

```bash
# Verifica Java
java -version

# Limpia y compila
cd Backend
mvn clean install
```

### Las páginas no cargan datos

1. Verifica que el backend esté en puerto 9090
2. Abre la consola del navegador (F12)
3. Revisa errores de CORS
4. Comprueba que PostgreSQL esté corriendo

### Error CORS

En `application.properties`:

```properties
spring.web.cors.allowed-origins=http://localhost:3000
```

## 🚀 Despliegue en Render

### Archivos de Configuración

El proyecto incluye archivos para despliegue automático en Render:

- **`render.yaml`** - Configuración de servicio y base de datos
- **`build.sh`** - Script de compilación Maven
- **`Backend/src/main/resources/application-prod.properties`** - Configuración de producción

### Pasos para Desplegar

1. **Sube tu código a GitHub**:

```bash
git add .
git commit -m "Add Render deployment configuration"
git push
```

2. **Crea una cuenta en Render**: [render.com](https://render.com)

3. **Conecta tu repositorio**:
   - Click en "New" → "Blueprint"
   - Selecciona tu repositorio de GitHub
   - Render detectará automáticamente el `render.yaml`

4. **Deploy**:
   - Click en "Apply"
   - Render creará automáticamente:
     - Web Service (Backend Spring Boot)
     - PostgreSQL Database
     - Variables de entorno

5. **Obtén tu URL**:
   - Una vez desplegado, Render te dará una URL como: `https://cafeteria-backend-xxxxx.onrender.com`

### Variables de Entorno (Automáticas)

Render configura automáticamente:

- `DATABASE_URL` - Conexión a PostgreSQL
- `SPRING_PROFILES_ACTIVE=prod` - Activa configuración de producción
- `PORT` - Puerto del servidor

### Actualizar CORS

Después del despliegue, actualiza el URL del frontend en `application-prod.properties`:

```properties
spring.web.cors.allowed-origins=https://tu-frontend.com,https://*.onrender.com
```

### Verificación

Prueba los endpoints:

```bash
curl https://tu-app.onrender.com/api/products
curl https://tu-app.onrender.com/api/categories
```

## 📝 Próximos Pasos

- [ ] Autenticación de usuarios
- [ ] Carga de imágenes reales
- [ ] Sistema de pedidos online
- [ ] Notificaciones por email
- [ ] Dashboard con estadísticas
- [ ] Modo oscuro

## 📞 Estructura de URLs

### Sitio de Clientes:

- `http://localhost:3000/index.html` - Inicio
- `http://localhost:3000/menu.html` - Menú
- `http://localhost:3000/nosotros.html` - Nosotros
- `http://localhost:3000/contacto.html` - Contacto

### Panel Admin:

- `http://localhost:3000/../admin.html` - Administración

### API:

- `http://localhost:9090/api/products` - Productos
- `http://localhost:9090/api/categories` - Categorías
- `http://localhost:9090/api/reservations` - Reservas

---

## 🎯 Resumen

Este proyecto incluye:

1. ✅ **4 páginas para clientes** que consumen la API
2. ✅ **Panel de administración** con CRUD completo
3. ✅ **API REST** con Spring Boot
4. ✅ **Base de datos PostgreSQL**
5. ✅ **Diseño moderno y responsive**
6. ✅ **Integración completa** frontend-backend

**¡Sistema completo y funcional! 🎉☕**
