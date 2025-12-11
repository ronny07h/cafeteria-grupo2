# 🌐 Sitio Web de Clientes - Café Aroma

Sitio web completo para clientes con 4 páginas que consumen datos de la API REST.

## 📄 Estructura del Sitio

```
cliente/
├── index.html          # Página 1: Inicio
├── menu.html           # Página 2: Menú completo
├── nosotros.html       # Página 3: Sobre nosotros + Galería
├── contacto.html       # Página 4: Formulario de contacto
├── css/
│   └── client.css      # Estilos específicos del cliente
└── js/
    ├── client.js       # JavaScript principal
    ├── menu.js         # Funcionalidad del menú
    ├── nosotros.js     # Galería dinámica
    └── contacto.js     # Validación de formulario
```

## ✅ Cumplimiento de Requisitos

### 📄 Página 1: index.html (Inicio)

**Requisitos:**

- ✅ Presentación del negocio
- ✅ Imagen principal o slider (3 slides con auto-play)
- ✅ Algún texto de bienvenida
- ✅ Información básica cargada desde API

**Datos desde API:**

- Total de productos (contador dinámico)
- Productos destacados (primeros 6 productos)
- Categorías con contador de productos

**Características:**

- Hero slider con 3 slides
- Sección de bienvenida con estadísticas
- Productos destacados desde la API
- Categorías dinámicas desde la API
- Call-to-action

---

### 📄 Página 2: menu.html (Menú)

**Requisitos:**

- ✅ Contenido relacionado al negocio
- ✅ Datos obtenidos desde el API

**Datos desde API:**

- **Todos los productos** con nombre, descripción, precio, categoría
- **Todas las categorías** para los filtros
- Estadísticas (total de productos, total de categorías)

**Características:**

- Grid de productos dinámico
- Filtros por categoría (Todos, Cafés, Postres, Snacks)
- Tarjetas de estadísticas
- Modal con detalles del producto
- Diseño responsive

---

### 📄 Página 3: nosotros.html (Nosotros + Galería)

**Requisitos:**

- ✅ Listado, galería, cards o información dinámica

**Datos desde API:**

- **Galería de productos agrupados por categoría**
- Total de productos
- Total de categorías

**Características:**

- Historia de la cafetería
- Valores de la empresa (cards)
- **Galería dinámica** de productos organizados por categoría
- Sección de equipo
- Estadísticas cargadas desde la API

---

### 📄 Página 4: contacto.html (Contacto)

**Requisitos:**

- ✅ Formulario simple o detalle de información
- ✅ No necesita backend (funciona con o sin API)

**Características:**

- **Formulario de reserva** con validación completa
- Campos: nombre, email, teléfono, fecha, hora, personas, mensaje
- Validación en tiempo real
- Envío a API (opcional, funciona sin backend también)
- Mensaje de éxito
- Tarjetas de información de contacto
- Sección de preguntas frecuentes (FAQ)
- Placeholder para mapa

**Validaciones:**

- Nombre mínimo 3 caracteres
- Email con formato válido
- Teléfono mínimo 10 caracteres
- Fecha y hora requeridas
- Número de personas requerido

---

## 🔌 Integración con API

### Endpoints Utilizados:

```javascript
GET / api / products; // Lista todos los productos
GET / api / categories; // Lista todas las categorías
POST / api / reservations; // Crea una reserva (opcional)
```

### Configuración:

En cada archivo JS, la URL de la API está configurada:

```javascript
const API_BASE_URL = "http://localhost:9090/api";
```

### Datos Fallback:

Cada página incluye datos de respaldo por si la API no está disponible, garantizando que el sitio siempre funcione.

---

## 🎨 Características del Diseño

- **Responsive**: Funciona en móvil, tablet y desktop
- **Moderno**: Gradientes, sombras, animaciones suaves
- **Profesional**: Paleta de colores café/chocolate
- **Accesible**: Navegación clara y estructura semántica
- **Rápido**: Optimizado para carga rápida

---

## 🚀 Cómo Usar

### 1. Asegúrate de que el backend esté corriendo

```bash
cd Backend
mvn spring-boot:run
```

Backend en: `http://localhost:9090`

### 2. Sirve las páginas de cliente

**Opción A - Python:**

```bash
cd Interfaz/cliente
python -m http.server 3000
```

**Opción B - Node.js:**

```bash
cd Interfaz/cliente
npx http-server -p 3000
```

**Opción C - Live Server (VSCode)**

- Instala la extensión "Live Server"
- Click derecho en `cliente/index.html`
- "Open with Live Server"

### 3. Abre en el navegador

Visita: `http://localhost:3000/index.html`

---

## 📱 Navegación del Sitio

```
┌─────────────────────────────────────┐
│         NAVBAR (todas las páginas)   │
│  Inicio | Menú | Nosotros | Contacto│
└─────────────────────────────────────┘

Inicio (index.html)
  ├── Hero Slider (3 slides)
  ├── Sobre Café Aroma (con stats API)
  ├── Productos Destacados (API)
  ├── Categorías (API)
  └── Call-to-Action

Menú (menu.html)
  ├── Estadísticas (API)
  ├── Filtros por Categoría
  ├── Grid de Productos (API)
  └── Modal de Detalles

Nosotros (nosotros.html)
  ├── Historia
  ├── Valores
  ├── Galería por Categoría (API)
  ├── Equipo
  └── Estadísticas (API)

Contacto (contacto.html)
  ├── Formulario de Reserva
  ├── Validación
  ├── Información de Contacto
  └── FAQ
```

---

## 🔄 Flujo de Datos

```
┌──────────────┐
│   Cliente    │
│  (Browser)   │
└──────┬───────┘
       │
       │ HTTP GET/POST
       ▼
┌──────────────┐
│  JavaScript  │
│ (client.js)  │
└──────┬───────┘
       │
       │ fetch()
       ▼
┌──────────────┐         ┌──────────────┐
│   API REST   │◄────────┤  Spring Boot │
│ localhost:   │         │    Backend   │
│    9090      │         └──────────────┘
└──────┬───────┘
       │
       │ JSON Response
       ▼
┌──────────────┐
│   Display    │
│    en HTML   │
└──────────────┘
```

---

## 📊 Datos que se Cargan desde la API

### Página 1 (Index):

- ✅ Total de productos (contador)
- ✅ 6 productos destacados
- ✅ Categorías con contadores

### Página 2 (Menú):

- ✅ Todos los productos
- ✅ Información de categorías
- ✅ Estadísticas totales

### Página 3 (Nosotros):

- ✅ Productos agrupados por categoría
- ✅ Total de productos
- ✅ Total de categorías

### Página 4 (Contacto):

- ✅ Envío de formulario a API (opcional)
- ⚠️ Funciona sin API también

---

## 🎯 Funcionalidades Destacadas

### Slider Automático

- Auto-play cada 5 segundos
- Navegación manual con flechas
- Indicadores clickeables
- Responsive

### Filtrado de Productos

- Por categoría
- Actualización dinámica
- Sin recargar la página

### Modal de Productos

- Muestra detalles completos
- Cierra con X, click fuera, o Escape
- Animaciones suaves

### Validación de Formulario

- En tiempo real
- Mensajes de error claros
- Previene envío si hay errores
- Mensaje de éxito

---

## ⚙️ Personalización

### Cambiar URL de la API

En cada archivo JS (`client.js`, `menu.js`, `nosotros.js`, `contacto.js`):

```javascript
const API_BASE_URL = "http://tu-servidor:puerto/api";
```

### Cambiar Colores

En `../CSS/styles.css`:

```css
:root {
  --color-primary: #8b4513;
  --color-secondary: #d2691e;
  --color-accent: #ffd700;
}
```

---

## 🐛 Solución de Problemas

### Los productos no se cargan

1. Verifica que el backend esté corriendo
2. Abre la consola del navegador (F12)
3. Verifica errores de CORS
4. Comprueba que la URL de la API sea correcta

### El formulario no envía datos

- El formulario funciona con o sin API
- Verifica validaciones en la consola
- Asegúrate de llenar todos los campos requeridos

### CORS Error

Verifica en `application.properties`:

```properties
spring.web.cors.allowed-origins=http://localhost:3000
```

---

## 📝 Checklist de Cumplimiento

- [x] **Página 1**: Presentación + Slider + Bienvenida + API ✅
- [x] **Página 2**: Contenido del negocio + Datos API ✅
- [x] **Página 3**: Galería/Listado dinámico ✅
- [x] **Página 4**: Formulario de contacto ✅
- [x] Todas las páginas consumen la API ✅
- [x] Diseño responsive ✅
- [x] Navegación funcional ✅
- [x] Datos de fallback si API falla ✅

---

**¡Sitio web completo para clientes con integración total a la API! 🎉☕**
