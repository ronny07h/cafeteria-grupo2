const API_URL = 'http://localhost:9090/api';
const state = { products: [], categories: [], reservations: [], config: {name: 'Café Aroma'}, mode: 'client' }; // Removed slideIdx/interval
const el = (id) => document.getElementById(id);

// --- API ---
const api = async (ep, method = 'GET', body = null) => {
    try {
        const res = await fetch(API_URL + ep, { method, headers: { 'Content-Type': 'application/json' }, body: body ? JSON.stringify(body) : null });
        if (method === 'DELETE') return res.ok;
        return res.ok ? await res.json() : null;
    } catch (e) { console.error(e); return null; }
};

const load = async () => {
    const [p, c, r, cfg] = await Promise.all([api('/products'), api('/categories'), api('/reservations'), api('/config')]);
    state.products = p || getFallbackProducts();
    // Default categories if API fails
    state.categories = c && c.length ? c : [{id:1, name:'Cafés'}, {id:2, name:'Postres'}, {id:3, name:'Snacks'}];
    state.reservations = r || [];
    if(cfg) state.config = cfg;
    render();
};


// --- Templates ---
const tpl = {
    card: (p, adm) => `
        <div class="col-sm-6 col-lg-4 col-xl-3">
            <div class="card h-100 shadow-sm border-0 product-card-hover">
                <div class="card-img-top bg-secondary-subtle text-center py-5">
                    <i class="fas fa-coffee fa-3x text-secondary"></i>
                </div>
                ${adm ? `<div class="position-absolute top-0 end-0 p-2">
                    <button class="btn btn-sm btn-warning me-1" onclick="edit('product',${p.id})"><i class="fas fa-edit"></i></button>
                    <button class="btn btn-sm btn-danger" onclick="del('products',${p.id})"><i class="fas fa-trash"></i></button>
                </div>` : ''}
                <div class="card-body d-flex flex-column">
                    <div class="badge bg-primary-subtle text-primary-emphasis mb-2 align-self-start">${p.category?.name || 'Sin categoría'}</div>
                    <h5 class="card-title fw-bold text-truncate" title="${p.name}">${p.name}</h5>
                    <p class="card-text small text-body-secondary flex-grow-1">${p.description}</p>
                    <div class="mt-auto d-flex justify-content-between align-items-center">
                        <span class="h5 mb-0 text-primary">$${p.price.toFixed(2)}</span>
                    </div>
                </div>
            </div>
        </div>`,
    row: (r) => `<tr>
        <td>${r.id}</td>
        <td>${r.name}</td>
        <td>${r.date}</td>
        <td><span class="badge bg-info">${r.persons}</span></td>
        <td><button class="btn btn-sm btn-outline-danger" onclick="del('reservations',${r.id})"><i class="fas fa-trash"></i></button></td>
    </tr>`,
    cat: (c) => `<div class="col-sm-6 col-md-4">
        <div class="card h-100">
            <div class="card-body d-flex justify-content-between align-items-center">
                <div>
                    <h5 class="card-title mb-0">${c.name}</h5>
                    <small class="text-muted">${state.products.filter(p => p.category?.id == c.id).length} productos</small>
                </div>
                <div>
                     <button class="btn btn-sm btn-outline-warning" onclick="edit('category',${c.id})"><i class="fas fa-edit"></i></button>
                     <button class="btn btn-sm btn-outline-danger" onclick="del('categories',${c.id})"><i class="fas fa-trash"></i></button>
                </div>
            </div>
        </div>
    </div>`
};

// --- Rendering ---
function render() {
    const list = (id, data, fn) => { const e = el(id); if(e) e.innerHTML = data.length ? data.map(fn).join('') : '<div class="col-12 text-center text-muted p-5">No hay datos disponibles</div>'; };
    
    // Client Views
    list('homeFeaturedProducts', state.products.slice(0, 3), p => tpl.card(p, false));
    list('menuProductsGrid', state.products, p => tpl.card(p, false));
    
    // Admin Views
    list('adminProductsGrid', state.products, p => tpl.card(p, true));
    list('adminCategoriesList', state.categories, tpl.cat);
    
    const rt = el('adminReservationsTable');
    if(rt) rt.innerHTML = state.reservations.length ? 
        `<table class="table table-striped table-hover">
            <thead class="table-dark"><tr><th>ID</th><th>Nombre</th><th>Fecha</th><th>Pers.</th><th>Acciones</th></tr></thead>
            <tbody>${state.reservations.map(tpl.row).join('')}</tbody>
        </table>` : 
        '<div class="alert alert-info">No hay reservas registradas.</div>';

    const sel = el('productCategory');
    if(sel) sel.innerHTML = '<option value="">Seleccionar...</option>' + state.categories.map(c => `<option value="${c.id}">${c.name}</option>`).join('');

    // Update Company Name
    if(state.config && state.config.name) {
        document.querySelectorAll('.company-name-text').forEach(e => e.textContent = state.config.name);
    }
}

// --- Global Actions ---
window.init = async () => { 
    await load(); 
    bindEvents(); 
    applyTheme();
    switchMode('client'); 
};
window.cambiarModo = (m) => switchMode(m);

window.mostrarSeccionCliente = window.mostrarSeccionAdmin = (id, e) => {
    if(e) { 
        e.preventDefault(); 
        // Sync Navbar links
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        if(e.target) e.target.classList.add('active');
        
        // Collapse navbar on mobile after click
        const navbarCollapse = document.querySelector('.navbar-collapse.show');
        if(navbarCollapse) { new bootstrap.Collapse(navbarCollapse).hide(); }
    }
    document.querySelectorAll('.client-section, .admin-section').forEach(s => {
        s.style.display = 'none';
        s.classList.remove('active');
    });
    const target = el(id);
    if(target) {
        target.style.display = 'block';
        target.classList.add('active'); // For animations if needed
    }
};

// Helper to populate forms
const fill = (type, data) => {
    Object.keys(data).forEach(k => {
        const input = el(`${type}${k.charAt(0).toUpperCase() + k.slice(1)}`);
        if (input) input.value = (typeof data[k] === 'object' && data[k]?.id) ? data[k].id : data[k];
    });
};

window.edit = (type, id) => {
    const item = type === 'product' ? state.products.find(p=>p.id==id) : state.categories.find(c=>c.id==id);
    if(!item) return;
    fill(type, item); // Now fill is defined
    el(`${type}ModalTitle`).textContent = type === 'product' ? 'Editar Producto' : 'Editar Categoría';
    showModal(`${type}Modal`);
};

// Toast Helper
function showToast(message, type = 'success') {
    const toastEl = el('liveToast');
    const toastMsg = el('toastMessage');
    const toastIcon = el('toastIcon');
    const toastTitle = el('toastTitle');
    
    if(!toastEl || !toastMsg) return;
    
    toastMsg.textContent = message;
    
    // Customize based on type
    if(type === 'success') {
        toastIcon.className = 'fas fa-check-circle me-2 text-success';
        toastTitle.textContent = 'Éxito';
    } else if (type === 'error') {
        toastIcon.className = 'fas fa-exclamation-circle me-2 text-danger';
        toastTitle.textContent = 'Error';
    } else {
        toastIcon.className = 'fas fa-info-circle me-2 text-primary';
        toastTitle.textContent = 'Información';
    }
    
    const toast = new bootstrap.Toast(toastEl);
    toast.show();
}

window.del = async (ep, id) => { 
    if(confirm('¿Confirmar eliminación?')) { 
        const success = await api(`/${ep}/${id}`, 'DELETE');
        if (success) {
            showToast('Elemento eliminado correctamente', 'success');
            await load(); 
        } else {
            showToast('Error al eliminar elemento', 'error');
        }
    } 
};

window.abrirModalAgregarProducto = () => { el('productForm').reset(); el('productId').value=''; el('productModalTitle').textContent='Agregar Producto'; showModal('productModal'); };
window.abrirModalAgregarCategoria = () => { el('categoryForm').reset(); el('categoryId').value=''; el('categoryModalTitle').textContent='Agregar Categoría'; showModal('categoryModal'); };
window.abrirModalConfig = () => { 
    if(state.config) el('configCompanyName').value = state.config.name;
    showModal('configModal'); 
};

// --- Helpers ---
function switchMode(m) {
    state.mode = m;
    // Use !important to override Bootstrap d-flex class
    el('clientView').style.setProperty('display', m === 'client' ? 'flex' : 'none', 'important');
    el('adminView').style.setProperty('display', m === 'admin' ? 'block' : 'none', 'important');
    
    // Toggle Button Styles - Keep size consistent
    el('btn-mode-client').className = m === 'client' ? 'btn btn-primary' : 'btn btn-outline-secondary';
    el('btn-mode-admin').className = m === 'admin' ? 'btn btn-primary' : 'btn btn-outline-secondary';
    
    // Reset filters
    document.querySelectorAll('.filter-btn').forEach(b => {
        b.classList.remove('active', 'btn-primary');
        b.classList.add('btn-outline-primary');
        if(b.dataset.category === 'all') {
             b.classList.add('active', 'btn-primary');
             b.classList.remove('btn-outline-primary');
        }
    });

    // Reset view to default for the selected mode
    if (m === 'client') {
        mostrarSeccionCliente('client-home');
    } else {
        mostrarSeccionAdmin('admin-products');
    }

    render(); // Re-render to update grids
}

// Bootstrap Modal Helper
function showModal(id) {
    const myModal = new bootstrap.Modal(el(id));
    myModal.show();
}
// We don't need a custom hideModal because Bootstrap handles it, but for our form submissions we might need to hide it programmatically.
// Since we create a NEW instance every time in showModal (which isn't ideal but works for simple usage), closing it requires getting the existing instance.
// Better approach:
let modalInstances = {};
function getModal(id) {
    if(!modalInstances[id]) modalInstances[id] = new bootstrap.Modal(el(id));
    return modalInstances[id];
}
// Override showModal to use cached instance
window.showModal = (id) => getModal(id).show();
window.hideModal = (id) => getModal(id).hide();

function bindEvents() {
    // Filters
    document.querySelectorAll('.filter-btn').forEach(b => b.addEventListener('click', e => {
        const btn = e.currentTarget;
        
        document.querySelectorAll('.filter-btn').forEach(x => {
            x.classList.remove('active', 'btn-primary');
            x.classList.add('btn-outline-primary');
        });
        
        btn.classList.remove('btn-outline-primary');
        btn.classList.add('active', 'btn-primary');
        
        const cat = btn.dataset.category;
        const map = {'cafes':'Cafés','postres':'Postres','snacks':'Snacks'};
        const filtered = cat === 'all' ? state.products : state.products.filter(p => p.category?.id == cat || p.category?.name === map[cat]);
        
        // Update both grids if they exist
        ['menuProductsGrid', 'adminProductsGrid'].forEach(gridId => {
            const listEl = el(gridId);
            if(listEl) listEl.innerHTML = filtered.length ? filtered.map(p => tpl.card(p, gridId.includes('admin'))).join('') : '<div class="col-12 text-center p-5">No hay resultados</div>';
        });
    }));
    
    // Forms
    document.querySelectorAll('form').forEach(f => f.addEventListener('submit', async e => {
        e.preventDefault();
        if(!f.checkValidity()) { e.stopPropagation(); f.classList.add('was-validated'); return; }
        
        const data = {}; 
        Array.from(f.elements).forEach(i => { if(i.id && i.type!='submit') data[i.id.replace(/product|category|client|config/i,'').toLowerCase()] = i.value; }); // added config to regex
        
        
        if(f.id.includes('Reservation')) {
            await api('/reservations', 'POST', data); 
            showToast('Reserva enviada con éxito', 'success'); 
            f.reset();
            f.classList.remove('was-validated');
        } else if (f.id === 'configForm') {
            const name = el('configCompanyName').value;
            const res = await api('/config', 'PUT', {name});
            if(res) {
                state.config = res;
                showToast('Configuración actualizada', 'success');
                render();
                window.hideModal('configModal');
            } else {
                showToast('Error al actualizar', 'error');
            }
        } else { 
            if(data.price) data.price = parseFloat(data.price); 
            if(data.category) data.category = {id: parseInt(data.category)};
            
            const id = el(f.id.replace('Form','Id')).value;
            const endpoint = f.id.includes('product') ? '/products' : '/categories';
            const method = id ? 'PUT' : 'POST';
            const url = id ? `${endpoint}/${id}` : endpoint;
            
            if(await api(url, method, data)) { 
                showToast(id ? 'Elemento actualizado correctamente' : 'Elemento creado correctamente', 'success');
                window.hideModal(f.id.replace('Form','Modal')); 
                await load(); 
            } else {
                showToast('Error al guardar elemento', 'error');
            }
        }
    }));
}

// Dark Mode
window.toggleTheme = () => {
    const html = document.documentElement;
    const current = html.getAttribute('data-bs-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-bs-theme', next);
    localStorage.setItem('theme', next);
    updateThemeIcon(next);
};

function applyTheme() {
    const saved = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-bs-theme', saved);
    updateThemeIcon(saved);
}

function updateThemeIcon(theme) {
    const icon = el('theme-icon');
    if(icon) icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

// --- TTS ---
state.ttsEnabled = false;

window.toggleTTS = () => {
    state.ttsEnabled = !state.ttsEnabled;
    const btn = el('btn-tts');
    if (state.ttsEnabled) {
        btn.classList.remove('btn-secondary');
        btn.classList.add('btn-warning');
        showToast('Modo Lectura Activado. Toca cualquier texto para escuchar.', 'info');
        speechSynthesis.speak(new SpeechSynthesisUtterance('Modo lectura activado'));
    } else {
        btn.classList.remove('btn-warning');
        btn.classList.add('btn-secondary');
        speechSynthesis.cancel();
        showToast('Modo Lectura Desactivado', 'info');
    }
};

document.addEventListener('click', (e) => {
    if (!state.ttsEnabled) return;
    
    // Ignore clicks on the toggle button itself to avoid double speech/loops
    if (e.target.closest('#btn-tts')) return;

    let text = '';
    // Try to get meaningful text
    const target = e.target;
    
    if (target.tagName === 'IMG' && target.alt) {
        text = "Imagen de " + target.alt;
    } else if (target.innerText && target.innerText.trim().length > 0) {
        // Limit text length to avoid reading huge blocks accidentally
        text = target.innerText.trim().substring(0, 200); 
    }

    if (text) {
        speechSynthesis.cancel(); // Stop current speech
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'es-ES';
        speechSynthesis.speak(utterance);
        
        // Visual feedback
        const original = target.style.outline;
        target.style.outline = '2px solid #ffc107';
        setTimeout(() => target.style.outline = original, 1000);
    }
});

function getFallbackProducts() {
    return [
        { id: 1, name: 'Espresso', description: 'Café solo intenso', price: 2.50, category: {id:1, name:'Cafés'} },
        { id: 2, name: 'Cappuccino', description: 'Espresso con espuma', price: 3.50, category: {id:1, name:'Cafés'} },
        { id: 3, name: 'Tarta de Queso', description: 'Con frutos rojos', price: 4.50, category: {id:2, name:'Postres'} }
    ];
}

document.addEventListener('DOMContentLoaded', window.init);
