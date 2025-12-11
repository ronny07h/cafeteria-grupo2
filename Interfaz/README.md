# 🎯 Sistema de Administración - Café Aroma

Sistema completo de administración para cafetería con funciones CRUD para productos, categorías y reservas.

## ✨ Funcionalidades Principales

### 📦 Gestión de Productos

- ✅ **Crear** nuevos productos con nombre, descripción, precio, categoría e imagen
- ✅ **Ver** todos los productos en tarjetas organizadas
- ✅ **Actualizar** información de productos existentes
- ✅ **Eliminar** productos
- ✅ **Filtrar** productos por categoría (Todos, Cafés, Postres, Snacks)

### 🏷️ Gestión de Categorías

- ✅ **Crear** nuevas categorías
- ✅ **Ver** todas las categorías con contador de productos
- ✅ **Actualizar** nombres de categorías
- ✅ **Eliminar** categorías

### 📅 Gestión de Reservas

- ✅ **Ver** todas las reservas en tabla
- ✅ **Eliminar** reservas
- ✅ Información completa: nombre, email, teléfono, fecha, hora, personas, mensaje

## 📁 Estructura del Proyecto

```
Interfaz/
├── CSS/
│   ├── styles.css          # Estilos base
│   ├── components.css      # Componentes reutilizables
│   └── admin.css          # Estilos específicos de admin ✨
├── javascript/
│   ├── script.js          # Funciones generales (legacy)
│   └── admin.js           # Sistema CRUD completo ✨
├── index.html             # Página de bienvenida ✨
└── admin.html             # Panel de administración ✨
```

## 🚀 Cómo Usar

### 1. Iniciar el Backend

```bash
cd Backend
mvn spring-boot:run
```

El backend estará en: **http://localhost:9090/api**

### 2. Iniciar el Frontend

```bash
cd Interfaz
python -m http.server 3000
```

El frontend estará en: **http://localhost:3000**

### 3. Acceder al Panel de Administración

1. Abre **http://localhost:3000** en tu navegador
2. Haz clic en "Ir al Panel de Administración"
3. O accede directamente a **http://localhost:3000/admin.html**

## 📋 Uso del Panel de Administración

### Productos

**Agregar Producto:**

1. Click en "Agregar Producto"
2. Completa el formulario:
   - Nombre del producto
   - Descripción
   - Precio
   - Categoría
   - URL de imagen (opcional)
3. Click en "Guardar"

**Editar Producto:**

1. Haz click en el ícono de editar (lápiz) en cualquier producto
2. Modifica los campos necesarios
3. Click en "Guardar"

**Eliminar Producto:**

1. Haz click en el ícono de eliminar (basura)
2. Confirma la eliminación

**Filtrar Productos:**

- Usa los botones de categoría para filtrar la vista

### Categorías

**Agregar Categoría:**

1. Ve a la pestaña "Categorías"
2. Click en "Agregar Categoría"
3. Ingresa el nombre
4. Click en "Guardar"

**Editar/Eliminar:**

- Similar al proceso de productos

### Reservas

**Ver Reservas:**

1. Ve a la pestaña "Reservas"
2. Visualiza todas las reservas en formato tabla
3. Puedes eliminar reservas completadas o canceladas

## 🎨 Características del Diseño

- **Diseño Moderno**: Interfaz limpia y profesional
- **Responsive**: Funciona en móvil, tablet y desktop
- **Botones de Acción**: Iconos intuitivos para editar/eliminar
- **Modales**: Formularios en ventanas modales elegantes
- **Alertas**: Notificaciones de éxito o error
- **Filtros**: Sistema de filtrado por categorías
- **Empty States**: Mensajes cuando no hay datos

## 🔌 Endpoints API Utilizados

### Productos

```
GET    /api/products           # Listar todos
GET    /api/products/{id}      # Obtener uno
POST   /api/products           # Crear nuevo
PUT    /api/products/{id}      # Actualizar
DELETE /api/products/{id}      # Eliminar
```

### Categorías

```
GET    /api/categories         # Listar todas
GET    /api/categories/{id}    # Obtener una
POST   /api/categories         # Crear nueva
PUT    /api/categories/{id}    # Actualizar
DELETE /api/categories/{id}    # Eliminar
```

### Reservas

```
GET    /api/reservations       # Listar todas
DELETE /api/reservations/{id}  # Eliminar
```

## 🛠️ Estructura del Código

### admin.js - Funciones Principales

```javascript
// CRUD Productos
loadProducts(); // Cargar todos los productos
saveProduct(); // Crear o actualizar
editProduct(id); // Cargar producto para editar
deleteProduct(id); // Eliminar producto

// CRUD Categorías
loadCategories(); // Cargar todas las categorías
saveCategory(); // Crear o actualizar
editCategory(id); // Cargar categoría para editar
deleteCategory(id); // Eliminar categoría

// Reservas
loadReservations(); // Cargar todas las reservas
deleteReservation(id); // Eliminar reserva

// Utilidades
showAlert(msg, type); // Mostrar notificaciones
openModal(id); // Abrir modal
closeModal(id); // Cerrar modal
```

## 📱 Navegación del Panel

El panel tiene 3 secciones principales:

1. **Productos** - Gestión completa de productos
2. **Categorías** - Gestión de categorías
3. **Reservas** - Visualización de reservas

Usa la barra de navegación superior para cambiar entre secciones.

## ⚙️ Configuración

### Cambiar Puerto del API

Edita en `javascript/admin.js`:

```javascript
const API_BASE_URL = "http://localhost:9090/api";
```

### Personalizar Colores

Edita las variables en `CSS/styles.css`:

```css
:root {
  --color-primary: #8b4513;
  --color-secondary: #d2691e;
  --color-accent: #ffd700;
}
```

## 🔒 Notas de Seguridad

**⚠️ IMPORTANTE**: Este es un prototipo de administración sin autenticación.

Para producción, implementa:

- Sistema de login/autenticación
- Control de acceso basado en roles
- Validación de sesiones
- HTTPS
- Protección CSRF

## 🐛 Troubleshooting

### Productos no se cargan

- Verifica que el backend esté corriendo en puerto 9090
- Abre la consola del navegador (F12) para ver errores
- Verifica que la base de datos PostgreSQL esté activa

### No puedo agregar productos

- Asegúrate de que existan categorías primero
- Verifica que todos los campos requeridos estén llenos

### Error al eliminar

- Algunos registros pueden tener relaciones en la base de datos
- Verifica las restricciones de foreign key

## 📝 Flujo de Trabajo Recomendado

1. **Configurar Categorías** primero (Cafés, Postres, Snacks)
2. **Agregar Productos** asignándolos a categorías
3. **Ver Reservas** según las solicitudes de clientes
4. **Editar/Eliminar** según sea necesario

## 🎯 Próximas Mejoras

- [ ] Sistema de login y autenticación
- [ ] Carga de imágenes directamente (sin URL)
- [ ] Estadísticas y gráficas
- [ ] Exportar datos a CSV/Excel
- [ ] Búsqueda de productos
- [ ] Ordenamiento de tablas
- [ ] Paginación para grandes cantidades de datos
- [ ] Confirmar reservas (cambiar estado)

---

**¡Sistema de administración completo y funcional! 🎉☕**
