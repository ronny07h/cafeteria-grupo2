// Página Nosotros - Galería desde API
const API_BASE_URL = 'http://localhost:9090/api';

let products = [];
let categories = [];

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    loadGalleryData();
});

// Cargar datos de la API
async function loadGalleryData() {
    try {
        // Cargar productos
        const productsRes = await fetch(`${API_BASE_URL}/products`);
        if (productsRes.ok) {
            products = await productsRes.json();
        }
        
        // Cargar categorías
        const categoriesRes = await fetch(`${API_BASE_URL}/categories`);
        if (categoriesRes.ok) {
            categories = await categoriesRes.json();
        }
        
        // Actualizar estadísticas
        document.getElementById('totalProductsCount').textContent = products.length;
        document.getElementById('totalCategoriesCount').textContent = categories.length;
        
        // Mostrar galería por categoría
        displayGalleryByCategory();
        
    } catch (error) {
        console.error('Error loading gallery:', error);
        showFallbackGallery();
    }
}

// Mostrar Galería
function displayGalleryByCategory() {
    const container = document.getElementById('galleryContainer');
    
    if (categories.length === 0 || products.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-box-open fa-3x"></i>
                <p>No hay productos disponibles</p>
            </div>
        `;
        return;
    }
    
    // Agrupar productos por categoría
    let html = '';
    
    categories.forEach(category => {
        const categoryProducts = products.filter(p => 
            p.category && p.category.id === category.id
        );
        
        if (categoryProducts.length === 0) return;
        
        html += `
            <div class="gallery-category">
                <h3><i class="fas fa-tag"></i> ${category.name}</h3>
                <div class="gallery-items">
                    ${categoryProducts.map(product => `
                        <div class="gallery-item">
                            <div class="card-image">
                                <div class="image-placeholder">
                                    <i class="fas fa-coffee fa-2x"></i>
                                </div>
                            </div>
                            <div class="card-content">
                                <h4 class="card-title">${product.name}</h4>
                                <p class="card-price">$${product.price.toFixed(2)}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

// Datos de Respaldo
function showFallbackGallery() {
    categories = [
        { id: 1, name: 'Cafés' },
        { id: 2, name: 'Postres' },
        { id: 3, name: 'Snacks' }
    ];
    
    products = [
        { id: 1, name: 'Espresso', price: 3.50, category: { id: 1, name: 'Cafés' } },
        { id: 2, name: 'Cappuccino', price: 4.50, category: { id: 1, name: 'Cafés' } },
        { id: 3, name: 'Latte', price: 5.00, category: { id: 1, name: 'Cafés' } },
        { id: 4, name: 'Tarta de Chocolate', price: 6.50, category: { id: 2, name: 'Postres' } },
        { id: 5, name: 'Cheesecake', price: 6.00, category: { id: 2, name: 'Postres' } },
        { id: 6, name: 'Croissant', price: 3.00, category: { id: 3, name: 'Snacks' } }
    ];
    
    document.getElementById('totalProductsCount').textContent = products.length;
    document.getElementById('totalCategoriesCount').textContent = categories.length;
    
    displayGalleryByCategory();
}
