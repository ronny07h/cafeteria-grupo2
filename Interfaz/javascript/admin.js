
const API_BASE_URL = 'http://localhost:9090/api';


let products = [];
let categories = [];
let reservations = [];
let currentProduct = null;
let currentCategory = null;
let currentFilter = 'all';

document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

async function initializeApp() {
   
    initNavigation();
    initModals();
    
 
    await loadCategories();
    await loadProducts();
    await loadReservations();
    
 
    setupProductEvents();
    setupCategoryEvents();
    setupFilters();
}

function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.admin-section');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            
       
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
           
            sections.forEach(section => {
                section.style.display = section.id === targetId ? 'block' : 'none';
            });
        });
    });
}


async function loadProducts() {
    try {
        const response = await fetch(`${API_BASE_URL}/products`);
        if (!response.ok) throw new Error('Failed to load products');
        products = await response.json();
        displayProducts(products);
    } catch (error) {
        console.error('Error loading products:', error);
        showAlert('Error al cargar productos', 'danger');
    }
}

function displayProducts(productsToDisplay) {
    const grid = document.getElementById('productsGrid');
    
    if (productsToDisplay.length === 0) {
        grid.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-box-open"></i>
                <h3>No hay productos</h3>
                <p>Agrega tu primer producto haciendo clic en "Agregar Producto"</p>
            </div>
        `;
        return;
    }
    
    grid.innerHTML = productsToDisplay.map(product => createProductCard(product)).join('');
}

function createProductCard(product) {
    const categoryName = product.category ? product.category.name : 'Sin categoría';
    return `
        <div class="admin-product-card">
            <div class="admin-card-actions">
                <button class="btn-icon btn-edit" onclick="editProduct(${product.id})" title="Editar">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-icon btn-delete" onclick="deleteProduct(${product.id})" title="Eliminar">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
            <div class="card-image">
                <div class="image-placeholder">
                    <i class="fas fa-coffee fa-3x"></i>
                </div>
            </div>
            <div class="card-content">
                <div class="card-category">${categoryName}</div>
                <h3 class="card-title">${product.name}</h3>
                <p class="card-description">${product.description}</p>
                <div class="card-footer">
                    <span class="card-price">$${product.price.toFixed(2)}</span>
                </div>
            </div>
        </div>
    `;
}

function setupProductEvents() {

    document.getElementById('btnAddProduct').addEventListener('click', () => {
        currentProduct = null;
        document.getElementById('productModalTitle').textContent = 'Agregar Producto';
        document.getElementById('productForm').reset();
        document.getElementById('productId').value = '';
        openModal('productModal');
    });
    

    document.getElementById('productForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        await saveProduct();
    });
  
    document.getElementById('btnCancelProduct').addEventListener('click', () => {
        closeModal('productModal');
    });
}

async function saveProduct() {
    const id = document.getElementById('productId').value;
    const productData = {
        name: document.getElementById('productName').value,
        description: document.getElementById('productDescription').value,
        price: parseFloat(document.getElementById('productPrice').value),
        imageUrl: document.getElementById('productImage').value || null,
        category: {
            id: parseInt(document.getElementById('productCategory').value)
        }
    };
    
    try {
        let response;
        if (id) {
           
            response = await fetch(`${API_BASE_URL}/products/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productData)
            });
        } else {
          
            response = await fetch(`${API_BASE_URL}/products`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productData)
            });
        }
        
        if (!response.ok) throw new Error('Failed to save product');
        
        showAlert(id ? 'Producto actualizado exitosamente' : 'Producto creado exitosamente', 'success');
        closeModal('productModal');
        await loadProducts();
    } catch (error) {
        console.error('Error saving product:', error);
        showAlert('Error al guardar producto', 'danger');
    }
}

async function editProduct(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/products/${id}`);
        if (!response.ok) throw new Error('Failed to load product');
        
        const product = await response.json();
        currentProduct = product;
        
       
        document.getElementById('productId').value = product.id;
        document.getElementById('productName').value = product.name;
        document.getElementById('productDescription').value = product.description;
        document.getElementById('productPrice').value = product.price;
        document.getElementById('productImage').value = product.imageUrl || '';
        document.getElementById('productCategory').value = product.category.id;
        
        document.getElementById('productModalTitle').textContent = 'Editar Producto';
        openModal('productModal');
    } catch (error) {
        console.error('Error loading product:', error);
        showAlert('Error al cargar producto', 'danger');
    }
}

async function deleteProduct(id) {
    if (!confirm('¿Estás seguro de eliminar este producto?')) return;
    
    try {
        const response = await fetch(`${API_BASE_URL}/products/${id}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) throw new Error('Failed to delete product');
        
        showAlert('Producto eliminado exitosamente', 'success');
        await loadProducts();
    } catch (error) {
        console.error('Error deleting product:', error);
        showAlert('Error al eliminar producto', 'danger');
    }
}


async function loadCategories() {
    try {
        const response = await fetch(`${API_BASE_URL}/categories`);
        if (!response.ok) throw new Error('Failed to load categories');
        categories = await response.json();
        displayCategories();
        populateCategorySelect();
    } catch (error) {
        console.error('Error loading categories:', error);
        showAlert('Error al cargar categorías', 'danger');
    }
}

function displayCategories() {
    const list = document.getElementById('categoriesList');
    
    if (categories.length === 0) {
        list.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-tags"></i>
                <h3>No hay categorías</h3>
                <p>Agrega tu primera categoría</p>
            </div>
        `;
        return;
    }
    
    list.innerHTML = categories.map(cat => `
        <div class="category-item">
            <div class="category-info">
                <h3>${cat.name}</h3>
                <p>${cat.products ? cat.products.length : 0} productos</p>
            </div>
            <div class="category-actions">
                <button class="btn-icon btn-edit" onclick="editCategory(${cat.id})" title="Editar">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-icon btn-delete" onclick="deleteCategory(${cat.id})" title="Eliminar">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

function populateCategorySelect() {
    const select = document.getElementById('productCategory');
    select.innerHTML = '<option value="">Seleccionar...</option>' +
        categories.map(cat => `<option value="${cat.id}">${cat.name}</option>`).join('');
}

function setupCategoryEvents() {

    document.getElementById('btnAddCategory').addEventListener('click', () => {
        currentCategory = null;
        document.getElementById('categoryModalTitle').textContent = 'Agregar Categoría';
        document.getElementById('categoryForm').reset();
        document.getElementById('categoryId').value = '';
        openModal('categoryModal');
    });
    
 
    document.getElementById('categoryForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        await saveCategory();
    });
    

    document.getElementById('btnCancelCategory').addEventListener('click', () => {
        closeModal('categoryModal');
    });
}

async function saveCategory() {
    const id = document.getElementById('categoryId').value;
    const categoryData = {
        name: document.getElementById('categoryName').value
    };
    
    try {
        let response;
        if (id) {
            response = await fetch(`${API_BASE_URL}/categories/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(categoryData)
            });
        } else {
            response = await fetch(`${API_BASE_URL}/categories`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(categoryData)
            });
        }
        
        if (!response.ok) throw new Error('Failed to save category');
        
        showAlert(id ? 'Categoría actualizada exitosamente' : 'Categoría creada exitosamente', 'success');
        closeModal('categoryModal');
        await loadCategories();
    } catch (error) {
        console.error('Error saving category:', error);
        showAlert('Error al guardar categoría', 'danger');
    }
}

async function editCategory(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/categories/${id}`);
        if (!response.ok) throw new Error('Failed to load category');
        
        const category = await response.json();
        currentCategory = category;
        
        document.getElementById('categoryId').value = category.id;
        document.getElementById('categoryName').value = category.name;
        
        document.getElementById('categoryModalTitle').textContent = 'Editar Categoría';
        openModal('categoryModal');
    } catch (error) {
        console.error('Error loading category:', error);
        showAlert('Error al cargar categoría', 'danger');
    }
}

async function deleteCategory(id) {
    if (!confirm('¿Estás seguro de eliminar esta categoría?')) return;
    
    try {
        const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) throw new Error('Failed to delete category');
        
        showAlert('Categoría eliminada exitosamente', 'success');
        await loadCategories();
    } catch (error) {
        console.error('Error deleting category:', error);
        showAlert('Error al eliminar categoría', 'danger');
    }
}

async function loadReservations() {
    try {
        const response = await fetch(`${API_BASE_URL}/reservations`);
        if (!response.ok) throw new Error('Failed to load reservations');
        reservations = await response.json();
        displayReservations();
    } catch (error) {
        console.error('Error loading reservations:', error);
        showAlert('Error al cargar reservas', 'danger');
    }
}

function displayReservations() {
    const table = document.getElementById('reservationsTable');
    
    if (reservations.length === 0) {
        table.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-calendar-times"></i>
                <h3>No hay reservas</h3>
                <p>Las reservas aparecerán aquí cuando los clientes las realicen</p>
            </div>
        `;
        return;
    }
    
    table.innerHTML = `
        <div class="table-wrapper">
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Email</th>
                        <th>Teléfono</th>
                        <th>Fecha</th>
                        <th>Hora</th>
                        <th>Personas</th>
                        <th>Mensaje</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    ${reservations.map(res => `
                        <tr>
                            <td>${res.id}</td>
                            <td>${res.name}</td>
                            <td>${res.email}</td>
                            <td>${res.phone}</td>
                            <td>${res.date}</td>
                            <td>${res.time}</td>
                            <td>${res.persons}</td>
                            <td>${res.message || '-'}</td>
                            <td>
                                <button class="btn-icon btn-delete" onclick="deleteReservation(${res.id})" title="Eliminar">
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

async function deleteReservation(id) {
    if (!confirm('¿Estás seguro de eliminar esta reserva?')) return;
    
    try {
        const response = await fetch(`${API_BASE_URL}/reservations/${id}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) throw new Error('Failed to delete reservation');
        
        showAlert('Reserva eliminada exitosamente', 'success');
        await loadReservations();
    } catch (error) {
        console.error('Error deleting reservation:', error);
        showAlert('Error al eliminar reserva', 'danger');
    }
}


function setupFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const category = btn.dataset.category;
            currentFilter = category;
            
            if (category === 'all') {
                displayProducts(products);
            } else {
                const filtered = products.filter(p => p.category && p.category.id == category);
                displayProducts(filtered);
            }
        });
    });
}


function initModals() {
  
    document.getElementById('productModalClose').addEventListener('click', () => closeModal('productModal'));
    

    document.getElementById('categoryModalClose').addEventListener('click', () => closeModal('categoryModal'));
    
    
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal(modal.id);
        });
    });
    
 
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            modals.forEach(modal => closeModal(modal.id));
        }
    });
}

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.remove('active');
    document.body.style.overflow = '';
}


function showAlert(message, type = 'info') {
 
    const existingAlerts = document.querySelectorAll('.alert');
    existingAlerts.forEach(alert => alert.remove());
    
  
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'danger' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
  
    const firstSection = document.querySelector('.admin-section');
    firstSection.insertBefore(alert, firstSection.firstChild);
    

    setTimeout(() => alert.remove(), 5000);
}
