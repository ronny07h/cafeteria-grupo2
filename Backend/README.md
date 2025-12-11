# Cafeteria Backend - Spring Boot REST API

Sistema backend para la aplicación de cafetería, desarrollado con Spring Boot, JPA e H2 Database.

## 🛠️ Tecnologías

- **Java 17**
- **Spring Boot 3.2.0**
- **Spring Data JPA**
- **PostgreSQL** (Base de datos)
- **Lombok** (Para código más limpio)
- **Maven** (Gestión de dependencias)

## 📁 Estructura del Proyecto

```
Backend/
├── src/
│   └── main/
│       ├── java/com/cafeteria/
│       │   ├── CafeteriaApplication.java       # Clase principal
│       │   ├── config/
│       │   │   └── DataInitializer.java        # Inicialización de datos
│       │   ├── controller/
│       │   │   ├── CategoryController.java     # REST API - Categorías
│       │   │   ├── ProductController.java      # REST API - Productos
│       │   │   └── ReservationController.java  # REST API - Reservas
│       │   ├── model/
│       │   │   ├── Category.java               # Entidad Categoría
│       │   │   ├── Product.java                # Entidad Producto
│       │   │   └── Reservation.java            # Entidad Reserva
│       │   ├── repository/
│       │   │   ├── CategoryRepository.java     # Repositorio JPA
│       │   │   ├── ProductRepository.java
│       │   │   └── ReservationRepository.java
│       │   └── service/
│       │       ├── CategoryService.java        # Lógica de negocio
│       │       ├── ProductService.java
│       │       └── ReservationService.java
│       └── resources/
│           └── application.properties          # Configuración
└── pom.xml                                     # Dependencias Maven
```

## 🚀 Cómo Ejecutar

### Requisitos Previos

- Java 17 o superior
- Maven 3.6 o superior

### Paso 1: Navegar al directorio Backend

```bash
cd Backend
```

### Paso 2: Compilar el proyecto

```bash
mvn clean install
```

### Paso 3: Ejecutar la aplicación

```bash
mvn spring-boot:run
```

La aplicación estará disponible en:

- **API REST**: http://localhost:8080/api
- **H2 Console**: http://localhost:8080/h2-console

### Configuración H2 Console

- **JDBC URL**: `jdbc:h2:mem:cafeteriadb`
- **Usuario**: `sa`
- **Contraseña**: (dejar en blanco)

## 📡 Endpoints de la API

### Categorías

- `GET /api/categories` - Obtener todas las categorías
- `GET /api/categories/{id}` - Obtener categoría por ID
- `POST /api/categories` - Crear nueva categoría
- `PUT /api/categories/{id}` - Actualizar categoría
- `DELETE /api/categories/{id}` - Eliminar categoría

### Productos

- `GET /api/products` - Obtener todos los productos
- `GET /api/products/{id}` - Obtener producto por ID
- `GET /api/products/category/{categoryId}` - Filtrar por categoría
- `GET /api/products/search?keyword={keyword}` - Buscar productos
- `POST /api/products` - Crear nuevo producto
- `PUT /api/products/{id}` - Actualizar producto
- `DELETE /api/products/{id}` - Eliminar producto

### Reservas

- `GET /api/reservations` - Obtener todas las reservas
- `GET /api/reservations/{id}` - Obtener reserva por ID
- `GET /api/reservations/date/{date}` - Filtrar por fecha
- `GET /api/reservations/email/{email}` - Filtrar por email
- `POST /api/reservations` - Crear nueva reserva
- `PUT /api/reservations/{id}` - Actualizar reserva
- `DELETE /api/reservations/{id}` - Eliminar reserva

## 📊 Datos de Ejemplo

La aplicación se inicializa con datos de ejemplo:

**Categorías:**

1. Cafés
2. Postres
3. Snacks

**Productos:** 11 productos distribuidos en las 3 categorías

## 🔧 Configuración

### Cambiar a MySQL/PostgreSQL

Para usar una base de datos persistente, modifica `application.properties`:

```properties
# MySQL Example
spring.datasource.url=jdbc:mysql://localhost:3306/cafeteriadb
spring.datasource.username=root
spring.datasource.password=tu_password
spring.jpa.hibernate.ddl-auto=update
```

Y agrega la dependencia en `pom.xml`:

```xml
<dependency>
    <groupId>com.mysql</groupId>
    <artifactId>mysql-connector-j</artifactId>
    <scope>runtime</scope>
</dependency>
```

## 🌐 CORS

La aplicación está configurada para aceptar peticiones desde:

- http://localhost:3000
- http://localhost:5500
- file:// (para desarrollo local con archivos HTML)

## 📝 Notas

- La base de datos H2 es **en memoria**, los datos se pierden al reiniciar
- Para producción, usa una base de datos persistente (MySQL, PostgreSQL)
- Los endpoints están documentados y usan estándares REST
- Validación automática en las entidades con Bean Validation

## 🐛 Troubleshooting

### Puerto 8080 en uso

```bash
# Windows
netstat -ano | findstr :8080
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:8080 | xargs kill -9
```

### Error de compilación

```bash
mvn clean
mvn install
```

## 📞 API de Prueba

Ejemplo de petición POST para crear una reserva:

```json
POST http://localhost:8080/api/reservations
Content-Type: application/json

{
  "name": "Juan Pérez",
  "email": "juan@email.com",
  "phone": "+1 555 123 4567",
  "date": "2024-12-15",
  "time": "19:00",
  "persons": "4",
  "message": "Mesa cerca de la ventana, por favor"
}
```
