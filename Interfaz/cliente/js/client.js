// ======================================
// CONFIGURATION
// ======================================
const API_BASE_URL = 'http://localhost:9090/api';

// ======================================
// STATE
// ======================================
let products = [];
let categories = [];
let currentSlide = 0;
let slideInterval;

// ======================================
// INITIALIZATION
// ======================================
document.addEventListener('DOMContentLoaded', () => {
    initNav();
    initSlider();
    loadDataFromAPI();
});

// ======================================
// NAVIGATION
// ======================================
function initNav() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }
    
    // Scroll effect
    window.addEventListener('scroll', () => {
        const navbar = document.getElementById('navbar');
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// ======================================
// SLIDER
// ======================================
function initSlider() {
    const slides = document.querySelectorAll('.slide');
    const indicators = document.getElementById('sliderIndicators');
    
    if (!slides.length || !indicators) return;
    
    // Create indicators
    slides.forEach((_, index) => {
        const indicator = document.createElement('div');
        indicator.className = 'indicator' + (index === 0 ? ' active' : '');
        indicator.addEventListener('click', () => goToSlide(index));
        indicators.appendChild(indicator);
    });
    
    // Auto-play
    startSlider();
}

function startSlider() {
    slideInterval = setInterval(() => {
        changeSlide(1);
    }, 5000);
}

function changeSlide(direction) {
    const slides = document.querySelectorAll('.slide');
    const indicators = document.querySelectorAll('.indicator');
    
    if (!slides.length) return;
    
    slides[currentSlide].classList.remove('active');
    indicators[currentSlide].classList.remove('active');
    
    currentSlide = (currentSlide + direction + slides.length) % slides.length;
    
    slides[currentSlide].classList.add('active');
    indicators[currentSlide].classList.add('active');
    
    // Reset interval
    clearInterval(slideInterval);
    startSlider();
}

function goToSlide(index) {
    const slides = document.querySelectorAll('.slide');
    const indicators = document.querySelectorAll('.indicator');
    
    slides[currentSlide].classList.remove('active');
    indicators[currentSlide].classList.remove('active');
    
    currentSlide = index;
    
    slides[currentSlide].classList.add('active');
    indicators[currentSlide].classList.add('active');
    
    clearInterval(slideInterval);
    startSlider();
}

// ======================================
// API CALLS
// ======================================
async function loadDataFromAPI() {
    await Promise.all([
        loadProducts(),
        loadCategories()
    ]);
}

async function loadProducts() {
    try {
        const response = await fetch(`${API_BASE_URL}/products`);
        if (!response.ok) throw new Error('Failed to load products');
        
        products = await response.json();
        console.log('Products loaded:', products);
        
        // Update total products count
        const totalProductsEl = document.getElementById('totalProducts');
        if (totalProductsEl) {
            totalProductsEl.textContent = products.length;
        }
        
        // Display featured products (first 6)
        displayFeaturedProducts();
        
    } catch (error) {
        console.error('Error loading products:', error);
        showFallbackProducts();
    }
}

async function loadCategories() {
    try {
        const response = await fetch(`${API_BASE_URL}/categories`);
        if (!response.ok) throw new Error('Failed to load categories');
        
        categories = await response.json();
        console.log('Categories loaded:', categories);
        
        displayCategories();
        
    } catch (error) {
        console.error('Error loading categories:', error);
        showFallbackCategories();
    }
}

// ======================================
// DISPLAY FUNCTIONS
// ======================================
function displayFeaturedProducts() {
    const container = document.getElementById('featuredProducts');
    if (!container) return;
    
    const featured = products.slice(0, 6);
    
    if (featured.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-box-open fa-3x"></i>
                <p>No hay productos disponibles</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = featured.map(product => createProductCard(product)).join('');
}

function createProductCard(product) {
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
}

function displayCategories() {
    const container = document.getElementById('categoriesGrid');
    if (!container) return;
    
    const icons = {
        'Cafés': 'fa-mug-hot',
        'Postres': 'fa-cake-candles',
        'Snacks': 'fa-cookie-bite'
    };
    
    container.innerHTML = categories.map(cat => `
        <div class="category-box" onclick="window.location.href='menu.html'">
            <i class="fas ${icons[cat.name] || 'fa-coffee'}"></i>
            <h3>${cat.name}</h3>
            <p>${cat.products ? cat.products.length : 0} productos</p>
        </div>
    `).join('');
}

// ======================================
// PRODUCT MODAL
// ======================================
function openProductModal(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const modal = document.getElementById('productModal');
    if (!modal) return;
    
    document.getElementById('modalCategory').textContent = product.category ? product.category.name : 'Sin categoría';
    document.getElementById('modalTitle').textContent = product.name;
    document.getElementById('modalPrice').textContent = `$${product.price.toFixed(2)}`;
    document.getElementById('modalDescription').textContent = product.description;
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeProductModal() {
    const modal = document.getElementById('productModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Close modal on outside click
document.addEventListener('click', (e) => {
    const modal = document.getElementById('productModal');
    if (modal && e.target === modal) {
        closeProductModal();
    }
});

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeProductModal();
    }
});

// ======================================
// FALLBACK DATA (if API fails)
// ======================================
function showFallbackProducts() {
    products = [
        { id: 1, name: 'Espresso', description: 'Café fuerte y aromático', price: 3.50, category: { name: 'Cafés' } },
        { id: 2, name: 'Cappuccino', description: 'Espresso con leche espumosa', price: 4.50, category: { name: 'Cafés' } },
        { id: 3, name: 'Latte', description: 'Café suave con leche', price: 5.00, category: { name: 'Cafés' } },
        { id: 4, name: 'Tarta de Chocolate', description: 'Deliciosa tarta casera', price: 6.50, category: { name: 'Postres' } },
        { id: 5, name: 'Cheesecake', description: 'Cremoso y suave', price: 6.00, category: { name: 'Postres' } },
        { id: 6, name: 'Croissant', description: 'Recién horneado', price: 3.00, category: { name: 'Snacks' } }
    ];
    
    displayFeaturedProducts();
    
    const totalProductsEl = document.getElementById('totalProducts');
    if (totalProductsEl) {
        totalProductsEl.textContent = products.length;
    }
}

function showFallbackCategories() {
    categories = [
        { id: 1, name: 'Cafés', products: [] },
        { id: 2, name: 'Postres', products: [] },
        { id: 3, name: 'Snacks', products: [] }
    ];
    
    displayCategories();
}

// ======================================
// SMOOTH SCROLL
// ======================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});
