
const API_BASE_URL = 'http://localhost:9090/api';


let products = [];
let categories = [];
let currentCategory = 'all';
let currentSlide = 0;
let carouselInterval;

document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

async function initializeApp() {
   
    initNavbar();
    initCarousel();
    initModal();
    

    await loadCategories();
    await loadProducts();
    
 
    setupCategoryFilters();
}


function initNavbar() {
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    

    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }
    
 
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    });
}


function initCarousel() {
    const slides = document.querySelectorAll('.carousel-slide');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const indicatorsContainer = document.getElementById('carouselIndicators');
    
    if (!slides.length) return;
    

    slides.forEach((_, index) => {
        const indicator = document.createElement('div');
        indicator.classList.add('indicator');
        if (index === 0) indicator.classList.add('active');
        indicator.addEventListener('click', () => goToSlide(index));
        indicatorsContainer.appendChild(indicator);
    });
    

    if (prevBtn) prevBtn.addEventListener('click', () => changeSlide(-1));
    if (nextBtn) nextBtn.addEventListener('click', () => changeSlide(1));
    

    startCarousel();
    
 
    const carousel = document.querySelector('.hero-carousel');
    if (carousel) {
        carousel.addEventListener('mouseenter', stopCarousel);
        carousel.addEventListener('mouseleave', startCarousel);
    }
}

function changeSlide(direction) {
    const slides = document.querySelectorAll('.carousel-slide');
    const indicators = document.querySelectorAll('.indicator');
    
    slides[currentSlide].classList.remove('active');
    indicators[currentSlide].classList.remove('active');
    
    currentSlide = (currentSlide + direction + slides.length) % slides.length;
    
    slides[currentSlide].classList.add('active');
    indicators[currentSlide].classList.add('active');
}

function goToSlide(index) {
    const slides = document.querySelectorAll('.carousel-slide');
    const indicators = document.querySelectorAll('.indicator');
    
    slides[currentSlide].classList.remove('active');
    indicators[currentSlide].classList.remove('active');
    
    currentSlide = index;
    
    slides[currentSlide].classList.add('active');
    indicators[currentSlide].classList.add('active');
}

function startCarousel() {
    stopCarousel();
    carouselInterval = setInterval(() => changeSlide(1), 5000);
}

function stopCarousel() {
    if (carouselInterval) {
        clearInterval(carouselInterval);
    }
}


async function loadCategories() {
    try {
        const response = await fetch(`${API_BASE_URL}/categories`);
        if (!response.ok) throw new Error('Failed to load categories');
        categories = await response.json();
    } catch (error) {
        console.error('Error loading categories:', error);
      
        categories = [
            { id: 1, name: 'Cafés' },
            { id: 2, name: 'Postres' },
            { id: 3, name: 'Snacks' }
        ];
    }
}

async function loadProducts() {
    try {
        const response = await fetch(`${API_BASE_URL}/products`);
        if (!response.ok) throw new Error('Failed to load products');
        products = await response.json();
        displayProducts(products);
    } catch (error) {
        console.error('Error loading products:', error);
  
        products = getFallbackProducts();
        displayProducts(products);
    }
}

function getFallbackProducts() {
    return [
        { id: 1, name: 'Espresso Clásico', description: 'Café espresso italiano intenso y aromático', price: 3.50, categoryId: 1, category: { name: 'Cafés' } },
        { id: 2, name: 'Cappuccino', description: 'Espresso con leche vaporizada y espuma cremosa', price: 4.50, categoryId: 1, category: { name: 'Cafés' } },
        { id: 3, name: 'Latte Vainilla', description: 'Café latte con un toque de vainilla natural', price: 5.00, categoryId: 1, category: { name: 'Cafés' } },
        { id: 4, name: 'Tarta de Chocolate', description: 'Deliciosa tarta de chocolate belga con crema', price: 6.50, categoryId: 2, category: { name: 'Postres' } },
        { id: 5, name: 'Cheesecake', description: 'Cheesecake de Nueva York con frutos rojos', price: 6.00, categoryId: 2, category: { name: 'Postres' } },
        { id: 6, name: 'Brownie', description: 'Brownie de chocolate con nueces', price: 4.50, categoryId: 2, category: { name: 'Postres' } },
        { id: 7, name: 'Croissant', description: 'Croissant francés de mantequilla recién horneado', price: 3.00, categoryId: 3, category: { name: 'Snacks' } },
        { id: 8, name: 'Sandwich Club', description: 'Sandwich con pollo, bacon, lechuga y tomate', price: 7.50, categoryId: 3, category: { name: 'Snacks' } }
    ];
}


function displayProducts(productsToDisplay) {
    const grid = document.getElementById('productsGrid');
    if (!grid) return;
    
    if (productsToDisplay.length === 0) {
        grid.innerHTML = '<p class="loading">No se encontraron productos</p>';
        return;
    }
    
    grid.innerHTML = productsToDisplay.map(product => createProductCard(product)).join('');
    

    const cards = grid.querySelectorAll('.product-card');
    cards.forEach((card, index) => {
        card.addEventListener('click', () => openProductModal(productsToDisplay[index]));
    });
}

function createProductCard(product) {
    const categoryName = product.category ? product.category.name : 'Categoría';
    return `
        <div class="product-card" data-category="${product.categoryId}">
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
                    <button class="card-btn">Ver más</button>
                </div>
            </div>
        </div>
    `;
}


function setupCategoryFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active state
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Filter products
            const category = btn.dataset.category;
            currentCategory = category;
            
            if (category === 'all') {
                displayProducts(products);
            } else {
                const filtered = products.filter(p => p.categoryId == category);
                displayProducts(filtered);
            }
        });
    });
}


function initModal() {
    const modal = document.getElementById('productModal');
    const closeBtn = document.getElementById('modalClose');
    
    if (closeBtn) {
        closeBtn.addEventListener('click', closeProductModal);
    }
    
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeProductModal();
        });
    }
    

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeProductModal();
    });
}

function openProductModal(product) {
    const modal = document.getElementById('productModal');
    const categoryName = product.category ? product.category.name : 'Categoría';
    

    document.getElementById('modalTitle').textContent = product.name;
    document.getElementById('modalCategory').textContent = categoryName;
    document.getElementById('modalPrice').textContent = `$${product.price.toFixed(2)}`;
    document.getElementById('modalDescription').textContent = product.description;
    

    const modalImage = document.getElementById('modalImage');
    modalImage.innerHTML = '<i class="fas fa-coffee fa-5x"></i>';
    

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeProductModal() {
    const modal = document.getElementById('productModal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

function validateForm(formId) {
    const form = document.getElementById(formId);
    if (!form) return false;
    
    let isValid = true;
    const inputs = form.querySelectorAll('.form-input, .form-textarea, .form-select');
    
    inputs.forEach(input => {
        const formGroup = input.closest('.form-group');
        const errorElement = formGroup.querySelector('.form-error');
        
  
        formGroup.classList.remove('error');
        
  
        if (input.hasAttribute('required') && !input.value.trim()) {
            formGroup.classList.add('error');
            if (errorElement) errorElement.textContent = 'Este campo es requerido';
            isValid = false;
        }
        
      
        if (input.type === 'email' && input.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(input.value)) {
                formGroup.classList.add('error');
                if (errorElement) errorElement.textContent = 'Email inválido';
                isValid = false;
            }
        }
        

        if (input.type === 'tel' && input.value) {
            const phoneRegex = /^\+?[\d\s-()]+$/;
            if (!phoneRegex.test(input.value)) {
                formGroup.classList.add('error');
                if (errorElement) errorElement.textContent = 'Teléfono inválido';
                isValid = false;
            }
        }
    });
    
    return isValid;
}

async function submitReservation(formData) {
    try {
        const response = await fetch(`${API_BASE_URL}/reservations`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        if (!response.ok) throw new Error('Failed to submit reservation');
        
        return await response.json();
    } catch (error) {
        console.error('Error submitting reservation:', error);
        throw error;
    }
}


function formatDate(date) {
    return new Date(date).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}


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
