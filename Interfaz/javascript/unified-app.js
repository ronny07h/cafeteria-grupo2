
const URL_BASE_API = 'http://localhost:9090/api';

// Estado global
let productos = [];
let categorias = [];
let reservas = [];
let modoActual = 'client';
let diapositivaActual = 0;
let intervaloDiapositiva;

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    iniciarApp();
});

async function iniciarApp() {
    // Cargar datos
    await cargarDatos();
    
    // Iniciar funciones de cliente
    iniciarFuncionesCliente();
    
    // Iniciar funciones de admin
    iniciarFuncionesAdmin();
}

// Carga de datos
async function cargarDatos() {
    try {
        // Cargar productos
        const productosRes = await fetch(`${URL_BASE_API}/products`);
        if (productosRes.ok) {
            productos = await productosRes.json();
        } else {
            usarDatosFallback();
        }
        
        // Cargar categorías
        const categoriasRes = await fetch(`${URL_BASE_API}/categories`);
        if (categoriasRes.ok) {
            categorias = await categoriasRes.json();
        }
        
        // Cargar reservas
        const reservasRes = await fetch(`${URL_BASE_API}/reservations`);
        if (reservasRes.ok) {
            reservas = await reservasRes.json();
        }
        
        // Actualizar vistas
        actualizarVistas();
        
    } catch (error) {
        console.error('Error cargando datos:', error);
        usarDatosFallback();
        actualizarVistas();
    }
}

function usarDatosFallback() {
    categorias = [
        { id: 1, name: 'Cafés' },
        { id: 2, name: 'Postres' },
        { id: 3, name: 'Snacks' }
    ];
    
    productos = [
        { id: 1, name: 'Espresso', description: 'Café espresso clásico', price: 3.50, category: categorias[0] },
        { id: 2, name: 'Cappuccino', description: 'Espresso con leche espumosa', price: 4.50, category: categorias[0] },
        { id: 3, name: 'Latte', description: 'Café latte suave', price: 5.00, category: categorias[0] },
        { id: 4, name: 'Tarta de Chocolate', description: 'Deliciosa tarta casera', price: 6.50, category: categorias[1] },
        { id: 5, name: 'Cheesecake', description: 'Cremoso cheesecake', price: 6.00, category: categorias[1] },
        { id: 6, name: 'Croissant', description: 'Recién horneado', price: 3.00, category: categorias[2] }
    ];
    
    reservas = [];
}

function actualizarVistas() {
    // Vistas cliente
    actualizarVistaInicio();
    actualizarVistaMenu();
    actualizarVistaNosotros();
    
    // Vistas admin
    actualizarProductosAdmin();
    actualizarCategoriasAdmin();
    actualizarReservasAdmin();
    llenarSelectCategorias();
}

// Cambio de modo
function cambiarModo(modo) {
    modoActual = modo;
    
    document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Mostrar/ocultar vistas principales
    const vistaCliente = document.getElementById('clientView');
    const vistaAdmin = document.getElementById('adminView');
    
    if (modo === 'client') {
        vistaCliente.style.display = 'block';
        vistaAdmin.style.display = 'none';
        if (!intervaloDiapositiva) iniciarSlider();
    } else {
        vistaCliente.style.display = 'none';
        vistaAdmin.style.display = 'block';
        if (intervaloDiapositiva) clearInterval(intervaloDiapositiva);
    }
}

// Navegación Cliente
function mostrarSeccionCliente(idSeccion, evento) {
    if (evento) {
        evento.preventDefault();
        document.querySelectorAll('#clientNavMenu .nav-link').forEach(link => {
            link.classList.remove('active');
        });
        evento.target.classList.add('active');
    }
    
    document.querySelectorAll('.client-section').forEach(seccion => {
        seccion.style.display = 'none';
    });
    document.getElementById(idSeccion).style.display = 'block';
    
    window.scrollTo(0, 0);
}

// Navegación Admin
function mostrarSeccionAdmin(idSeccion, evento) {
    if (evento) {
        evento.preventDefault();
        document.querySelectorAll('#adminView .nav-link').forEach(link => {
            link.classList.remove('active');
        });
        evento.target.classList.add('active');
    }
    
    document.querySelectorAll('.admin-section').forEach(seccion => {
        seccion.style.display = 'none';
    });
    document.getElementById(idSeccion).style.display = 'block';
    
    window.scrollTo(0, 0);
}

// === FUNCIONES CLIENTE ===

function iniciarFuncionesCliente() {
    iniciarSlider();
    iniciarFormulariosCliente();
}

function iniciarSlider() {
    const slides = document.querySelectorAll('#client-home .slide');
    const indicators = document.getElementById('sliderIndicators');
    
    if (!slides.length || !indicators) return;
    
    indicators.innerHTML = '';
    slides.forEach((_, index) => {
        const indicator = document.createElement('div');
        indicator.className = 'indicator' + (index === 0 ? ' active' : '');
        indicator.addEventListener('click', () => irADiapositiva(index));
        indicators.appendChild(indicator);
    });
    
    intervaloDiapositiva = setInterval(() => cambiarDiapositiva(1), 5000);
}

function cambiarDiapositiva(direccion) {
    const slides = document.querySelectorAll('#client-home .slide');
    const indicators = document.querySelectorAll('.indicator');
    
    if (!slides.length) return;
    
    slides[diapositivaActual].classList.remove('active');
    indicators[diapositivaActual].classList.remove('active');
    
    diapositivaActual = (diapositivaActual + direccion + slides.length) % slides.length;
    
    slides[diapositivaActual].classList.add('active');
    indicators[diapositivaActual].classList.add('active');
    
    clearInterval(intervaloDiapositiva);
    intervaloDiapositiva = setInterval(() => cambiarDiapositiva(1), 5000);
}

function irADiapositiva(index) {
    const slides = document.querySelectorAll('#client-home .slide');
    const indicators = document.querySelectorAll('.indicator');
    
    slides[diapositivaActual].classList.remove('active');
    indicators[diapositivaActual].classList.remove('active');
    
    diapositivaActual = index;
    
    slides[diapositivaActual].classList.add('active');
    indicators[diapositivaActual].classList.add('active');
}

function iniciarFormulariosCliente() {
    const form = document.getElementById('clientReservationForm');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            await enviarReservaCliente();
        });
    }
}

async function enviarReservaCliente() {
    const datos = {
        name: document.getElementById('clientName').value,
        email: document.getElementById('clientEmail').value,
        phone: document.getElementById('clientPhone').value,
        date: document.getElementById('clientDate').value,
        time: document.getElementById('clientTime').value,
        persons: document.getElementById('clientPersons').value,
        message: document.getElementById('clientMessage').value
    };
    
    try {
        const response = await fetch(`${URL_BASE_API}/reservations`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datos)
        });
        
        if (response.ok) {
            alert('¡Reserva enviada exitosamente!');
            document.getElementById('clientReservationForm').reset();
            await cargarDatos();
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Reserva registrada (sin backend)');
        document.getElementById('clientReservationForm').reset();
    }
}

function actualizarVistaInicio() {
    const countEl = document.getElementById('homeProductCount');
    if (countEl) countEl.textContent = productos.length;
    
    const destacados = productos.slice(0, 6);
    const container = document.getElementById('homeFeaturedProducts');
    if (container) {
        container.innerHTML = destacados.map(p => crearTarjetaProducto(p)).join('');
    }
}

function actualizarVistaMenu() {
    const container = document.getElementById('menuProductsGrid');
    if (container) {
        container.innerHTML = productos.map(p => crearTarjetaProducto(p)).join('');
    }
}

function actualizarVistaNosotros() {
    const container = document.getElementById('aboutGalleryContainer');
    if (!container) return;
    
    let html = '';
    categorias.forEach(cat => {
        const prodCategoria = productos.filter(p => p.category && p.category.id === cat.id);
        if (prodCategoria.length === 0) return;
        
        html += `
            <div class="gallery-category">
                <h3><i class="fas fa-tag"></i> ${cat.name}</h3>
                <div class="gallery-items">
                    ${prodCategoria.map(p => `
                        <div class="gallery-item">
                            <div class="card-image">
                                <div class="image-placeholder">
                                    <i class="fas fa-coffee fa-2x"></i>
                                </div>
                            </div>
                            <div class="card-content">
                                <h4 class="card-title">${p.name}</h4>
                                <p class="card-price">$${p.price.toFixed(2)}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

function filtrarProductosMenu(categoria) {
    document.querySelectorAll('#client-menu .filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    let filtrados = productos;
    if (categoria !== 'all') {
        const mapaCategorias = { 'cafes': 'Cafés', 'postres': 'Postres', 'snacks': 'Snacks' };
        filtrados = productos.filter(p => p.category && p.category.name === mapaCategorias[categoria]);
    }
    
    const container = document.getElementById('menuProductsGrid');
    container.innerHTML = filtrados.map(p => crearTarjetaProducto(p)).join('');
}

function crearTarjetaProducto(producto) {
    const nombreCategoria = producto.category ? producto.category.name : 'Sin categoría';
    return `
        <div class="product-card">
            <div class="card-image">
                <div class="image-placeholder">
                    <i class="fas fa-coffee fa-3x"></i>
                </div>
            </div>
            <div class="card-content">
                <div class="card-category">${nombreCategoria}</div>
                <h3 class="card-title">${producto.name}</h3>
                <p class="card-description">${producto.description}</p>
                <div class="card-footer">
                    <span class="card-price">$${producto.price.toFixed(2)}</span>
                </div>
            </div>
        </div>
    `;
}

// === FUNCIONES ADMIN ===

function iniciarFuncionesAdmin() {
    iniciarFormulariosAdmin();
}

function iniciarFormulariosAdmin() {
    const productForm = document.getElementById('productForm');
    if (productForm) {
        productForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            await guardarProducto();
        });
    }
    
    const categoryForm = document.getElementById('categoryForm');
    if (categoryForm) {
        categoryForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            await guardarCategoria();
        });
    }
}

function actualizarProductosAdmin() {
    const container = document.getElementById('adminProductsGrid');
    if (!container) return;
    
    if (productos.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-box-open"></i>
                <h3>No hay productos</h3>
                <p>Agrega tu primer producto</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = productos.map(p => crearTarjetaProductoAdmin(p)).join('');
}

function crearTarjetaProductoAdmin(producto) {
    const nombreCategoria = producto.category ? producto.category.name : 'Sin categoría';
    return `
        <div class="admin-product-card">
            <div class="admin-card-actions">
                <button class="btn-icon btn-edit" onclick="editarProducto(${producto.id})" title="Editar">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-icon btn-delete" onclick="eliminarProducto(${producto.id})" title="Eliminar">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
            <div class="card-image">
                <div class="image-placeholder">
                    <i class="fas fa-coffee fa-3x"></i>
                </div>
            </div>
            <div class="card-content">
                <div class="card-category">${nombreCategoria}</div>
                <h3 class="card-title">${producto.name}</h3>
                <p class="card-description">${producto.description}</p>
                <div class="card-footer">
                    <span class="card-price">$${producto.price.toFixed(2)}</span>
                </div>
            </div>
        </div>
    `;
}

function actualizarCategoriasAdmin() {
    const container = document.getElementById('adminCategoriesList');
    if (!container) return;
    
    if (categorias.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-tags"></i>
                <h3>No hay categorías</h3>
            </div>
        `;
        return;
    }
    
    container.innerHTML = categorias.map(cat => `
        <div class="category-item">
            <div class="category-info">
                <h3>${cat.name}</h3>
                <p>${productos.filter(p => p.category && p.category.id === cat.id).length} productos</p>
            </div>
            <div class="category-actions">
                <button class="btn-icon btn-edit" onclick="editarCategoria(${cat.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-icon btn-delete" onclick="eliminarCategoria(${cat.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

function actualizarReservasAdmin() {
    const container = document.getElementById('adminReservationsTable');
    if (!container) return;
    
    if (reservas.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-calendar-times"></i>
                <h3>No hay reservas</h3>
            </div>
        `;
        return;
    }
    
    container.innerHTML = `
        <div class="table-wrapper">
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Email</th>
                        <th>Fecha</th>
                        <th>Hora</th>
                        <th>Personas</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    ${reservas.map(r => `
                        <tr>
                            <td>${r.id}</td>
                            <td>${r.name}</td>
                            <td>${r.email}</td>
                            <td>${r.date}</td>
                            <td>${r.time}</td>
                            <td>${r.persons}</td>
                            <td>
                                <button class="btn-icon btn-delete" onclick="eliminarReserva(${r.id})">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

function filtrarProductosAdmin(idCategoria) {
    document.querySelectorAll('#admin-products .filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    let filtrados = productos;
    if (idCategoria !== 'all') {
        filtrados = productos.filter(p => p.category && p.category.id == idCategoria);
    }
    
    const container = document.getElementById('adminProductsGrid');
    container.innerHTML = filtrados.map(p => crearTarjetaProductoAdmin(p)).join('');
}

function llenarSelectCategorias() {
    const select = document.getElementById('productCategory');
    if (select) {
        select.innerHTML = '<option value="">Seleccionar...</option>' +
            categorias.map(cat => `<option value="${cat.id}">${cat.name}</option>`).join('');
    }
}

// === MODALES Y CRUD ===

function abrirModalAgregarProducto() {
    document.getElementById('productModalTitle').textContent = 'Agregar Producto';
    document.getElementById('productForm').reset();
    document.getElementById('productId').value = '';
    abrirModal('productModal');
}

async function guardarProducto() {
    const id = document.getElementById('productId').value;
    const datos = {
        name: document.getElementById('productName').value,
        description: document.getElementById('productDescription').value,
        price: parseFloat(document.getElementById('productPrice').value),
        category: { id: parseInt(document.getElementById('productCategory').value) }
    };
    
    try {
        const url = id ? `${URL_BASE_API}/products/${id}` : `${URL_BASE_API}/products`;
        const method = id ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datos)
        });
        
        if (response.ok) {
            alert(id ? 'Producto actualizado' : 'Producto creado');
            cerrarModal('productModal');
            await cargarDatos();
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al guardar producto');
    }
}

async function editarProducto(id) {
    const producto = productos.find(p => p.id === id);
    if (!producto) return;
    
    document.getElementById('productId').value = producto.id;
    document.getElementById('productName').value = producto.name;
    document.getElementById('productDescription').value = producto.description;
    document.getElementById('productPrice').value = producto.price;
    document.getElementById('productCategory').value = producto.category.id;
    
    document.getElementById('productModalTitle').textContent = 'Editar Producto';
    abrirModal('productModal');
}

async function eliminarProducto(id) {
    if (!confirm('¿Eliminar este producto?')) return;
    
    try {
        const response = await fetch(`${URL_BASE_API}/products/${id}`, { method: 'DELETE' });
        if (response.ok) {
            alert('Producto eliminado');
            await cargarDatos();
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al eliminar producto');
    }
}

function abrirModalAgregarCategoria() {
    document.getElementById('categoryModalTitle').textContent = 'Agregar Categoría';
    document.getElementById('categoryForm').reset();
    document.getElementById('categoryId').value = '';
    abrirModal('categoryModal');
}

async function guardarCategoria() {
    const id = document.getElementById('categoryId').value;
    const datos = { name: document.getElementById('categoryName').value };
    
    try {
        const url = id ? `${URL_BASE_API}/categories/${id}` : `${URL_BASE_API}/categories`;
        const method = id ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datos)
        });
        
        if (response.ok) {
            alert(id ? 'Categoría actualizada' : 'Categoría creada');
            cerrarModal('categoryModal');
            await cargarDatos();
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al guardar categoría');
    }
}

async function editarCategoria(id) {
    const categoria = categorias.find(c => c.id === id);
    if (!categoria) return;
    
    document.getElementById('categoryId').value = categoria.id;
    document.getElementById('categoryName').value = categoria.name;
    
    document.getElementById('categoryModalTitle').textContent = 'Editar Categoría';
    abrirModal('categoryModal');
}

async function eliminarCategoria(id) {
    if (!confirm('¿Eliminar esta categoría?')) return;
    
    try {
        const response = await fetch(`${URL_BASE_API}/categories/${id}`, { method: 'DELETE' });
        if (response.ok) {
            alert('Categoría eliminada');
            await cargarDatos();
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al eliminar categoría');
    }
}

async function eliminarReserva(id) {
    if (!confirm('¿Eliminar esta reserva?')) return;
    
    try {
        const response = await fetch(`${URL_BASE_API}/reservations/${id}`, { method: 'DELETE' });
        if (response.ok) {
            alert('Reserva eliminada');
            await cargarDatos();
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al eliminar reserva');
    }
}

// Utilidades Modal
function abrirModal(idModal) {
    document.getElementById(idModal).classList.add('active');
    document.body.style.overflow = 'hidden';
}

function cerrarModal(idModal) {
    document.getElementById(idModal).classList.remove('active');
    document.body.style.overflow = '';
}

// Cerrar modales al hacer click fuera
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        cerrarModal(e.target.id);
    }
});
