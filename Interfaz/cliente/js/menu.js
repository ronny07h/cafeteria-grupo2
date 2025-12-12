// Página del Menú - Productos desde API
const API_BASE_URL = 'http://localhost:9090/api';

let allProducts = [];
let allCategories = [];
let currentFilter = 'all';

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    loadMenuData();
    setupFilters();
});

// Cargar datos de la API
async function loadMenuData() {
    try {
        // Cargar productos
        const productsRes = await fetch(`${API_BASE_URL}/products`);
        if (productsRes.ok) {
            allProducts = await productsRes.json();
            console.log('Menu products loaded:', allProducts);
        }
        
        // Cargar categorías
        const categoriesRes = await fetch(`${API_BASE_URL}/categories`);
        if (categoriesRes.ok) {
            allCategories = await categoriesRes.json();
        }
        
        // Actualizar estadísticas
        document.getElementById('statsTotal').textContent = allProducts.length;
        document.getElementById('statsCategories').textContent = allCategories.length;
        
        // Mostrar todos los productos
        displayMenuProducts(allProducts);
        
    } catch (error) {
        console.error('Error loading menu:', error);
        showFallbackMenu();
    }
}

// Mostrar Productos
function displayMenuProducts(productsToShow) {
    const container = document.getElementById('menuProducts');
    
    if (productsToShow.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-box-open fa-3x"></i>
                <p>No hay productos en esta categoría</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = productsToShow.map(product => {
        const categoryName = product.category ? product.category.name : 'Sin categoría';
        return `
            <div class="product-card" onclick="openProductModal(${product.id})">
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
                        <button class="btn btn-sm btn-secondary">Ver más</button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Filtros
function setupFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Actualizar estado activo
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Filtrar productos
            const category = btn.dataset.category;
            filterProducts(category);
        });
    });
}

function filterProducts(category) {
    currentFilter = category;
    
    if (category === 'all') {
        displayMenuProducts(allProducts);
    } else {
        // Mapa de categorías
        const categoryMap = {
            'cafes': 'Cafés',
            'postres': 'Postres',
            'snacks': 'Snacks'
        };
        
        const categoryName = categoryMap[category];
        const filtered = allProducts.filter(p => 
            p.category && p.category.name === categoryName
        );
        
        displayMenuProducts(filtered);
    }
}

// Modal
function openProductModal(productId) {
    const product = allProducts.find(p => p.id === productId);
    if (!product) return;
    
    document.getElementById('modalCategory').textContent = product.category ? product.category.name : 'Sin categoría';
    document.getElementById('modalTitle').textContent = product.name;
    document.getElementById('modalPrice').textContent = `$${product.price.toFixed(2)}`;
    document.getElementById('modalDescription').textContent = product.description;
    
    const modal = document.getElementById('productModal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeProductModal() {
    const modal = document.getElementById('productModal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

// Datos de Respaldo
function showFallbackMenu() {
    allProducts = [
        { id: 1, name: 'Espresso Clásico', description: 'Café espresso tradicional', price: 3.50, category: { name: 'Cafés' } },
        { id: 2, name: 'Cappuccino', description: 'Espresso con leche espumosa', price: 4.50, category: { name: 'Cafés' } },
        { id: 3, name: 'Latte Vainilla', description: 'Café latte con vainilla', price: 5.00, category: { name: 'Cafés' } },
        { id: 4, name: 'Americano', description: 'Café americano suave', price: 3.00, category: { name: 'Cafés' } },
        { id: 5, name: 'Tarta de Chocolate', description: 'Deliciosa tarta casera', price: 6.50, category: { name: 'Postres' } },
        { id: 6, name: 'Cheesecake', description: 'Cheesecake cremoso', price: 6.00, category: { name: 'Postres' } },
        { id: 7, name: 'Brownie', description: 'Brownie de chocolate', price: 4.50, category: { name: 'Postres' } },
        { id: 8, name: 'Croissant', description: 'Croissant recién horneado', price: 3.00, category: { name: 'Snacks' } }
    ];
    
    document.getElementById('statsTotal').textContent = allProducts.length;
    document.getElementById('statsCategories').textContent = 3;
    
    displayMenuProducts(allProducts);
}
