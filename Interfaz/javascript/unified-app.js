const API_URL = 'http://localhost:9090/api';
const state = { products: [], categories: [], reservations: [], mode: 'client', slideIdx: 0, interval: 0 };
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
    const [p, c, r] = await Promise.all([api('/products'), api('/categories'), api('/reservations')]);
    state.products = p || getFallbackProducts();
    state.categories = c || [{id:1, name:'Cafés'}, {id:2, name:'Postres'}, {id:3, name:'Snacks'}];
    state.reservations = r || [];
    render();
};

// --- Templates ---
const tpl = {
    card: (p, adm) => `
        <div class="${adm ? 'admin-product-card' : 'product-card'}">
            ${adm ? `<div class="admin-card-actions">
                <button class="btn-icon" onclick="edit('product',${p.id})"><i class="fas fa-edit"></i></button>
                <button class="btn-icon" onclick="del('products',${p.id})"><i class="fas fa-trash"></i></button>
            </div>` : ''}
            <div class="card-image"><div class="image-placeholder"><i class="fas fa-coffee fa-3x"></i></div></div>
            <div class="card-content">
                <div class="card-category">${p.category?.name || 'Sin categoría'}</div>
                <h3 class="card-title">${p.name}</h3>
                <p class="card-description">${p.description}</p>
                <div class="card-footer"><span class="card-price">$${p.price.toFixed(2)}</span></div>
            </div>
        </div>`,
    row: (r) => `<tr><td>${r.id}</td><td>${r.name}</td><td>${r.date}</td><td>${r.persons}</td><td><button class="btn-icon" onclick="del('reservations',${r.id})"><i class="fas fa-trash"></i></button></td></tr>`,
    cat: (c) => `<div class="category-item">
        <div class="category-info"><h3>${c.name}</h3><p>${state.products.filter(p => p.category?.id == c.id).length} productos</p></div>
        <div class="category-actions"><button class="btn-icon" onclick="edit('category',${c.id})"><i class="fas fa-edit"></i></button><button class="btn-icon" onclick="del('categories',${c.id})"><i class="fas fa-trash"></i></button></div>
    </div>`
};

// --- Rendering ---
function render() {
    const list = (id, data, fn) => { const e = el(id); if(e) e.innerHTML = data.length ? data.map(fn).join('') : '<div class="empty-state"><p>No hay datos</p></div>'; };
    
    // Client Views
    list('homeFeaturedProducts', state.products.slice(0, 6), p => tpl.card(p, false));
    list('menuProductsGrid', state.products, p => tpl.card(p, false));
    if(el('homeProductCount')) el('homeProductCount').textContent = state.products.length;
    
    // Admin Views
    list('adminProductsGrid', state.products, p => tpl.card(p, true));
    list('adminCategoriesList', state.categories, tpl.cat);
    
    const rt = el('adminReservationsTable');
    if(rt) rt.innerHTML = state.reservations.length ? 
        `<div class="table-wrapper"><table><thead><tr><th>ID</th><th>Nombre</th><th>Fecha</th><th>Pers.</th><th>Acciones</th></tr></thead><tbody>${state.reservations.map(tpl.row).join('')}</tbody></table></div>` : 
        '<div class="empty-state"><p>No hay reservas</p></div>';

    const sel = el('productCategory');
    if(sel) sel.innerHTML = '<option value="">Seleccionar...</option>' + state.categories.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
}

// --- Global Actions ---
window.init = async () => { await load(); bindEvents(); switchMode('client'); };
window.cambiarModo = (m) => switchMode(m);

window.mostrarSeccionCliente = window.mostrarSeccionAdmin = (id, e) => {
    if(e) { 
        e.preventDefault(); 
        const parentId = state.mode === 'client' ? 'clientNavbar' : 'navbar';
        document.querySelectorAll(`#${parentId} .nav-link, .nav-menu .nav-link`).forEach(l => l.classList.remove('active'));
        if(e.target) e.target.classList.add('active');
    }
    document.querySelectorAll('.client-section, .admin-section').forEach(s => s.style.display = 'none');
    const target = el(id);
    if(target) target.style.display = 'block';
};

window.edit = (type, id) => {
    // Usamos '==' para permitir coincidencia entre string '1' y numero 1
    const item = type === 'product' ? state.products.find(p=>p.id==id) : state.categories.find(c=>c.id==id);
    if(!item) return;
    if(type === 'product') { fill('product', item); modal('productModal'); }
    else { fill('category', item); modal('categoryModal'); }
    el(`${type}ModalTitle`).textContent = type === 'product' ? 'Editar Producto' : 'Editar Categoría';
};

window.del = async (ep, id) => { if(confirm('¿Confirmar eliminación?')) { await api(`/${ep}/${id}`, 'DELETE'); await load(); } };

window.abrirModalAgregarProducto = () => { el('productForm').reset(); el('productId').value=''; el('productModalTitle').textContent='Agregar Producto'; modal('productModal'); };
window.abrirModalAgregarCategoria = () => { el('categoryForm').reset(); el('categoryId').value=''; el('categoryModalTitle').textContent='Agregar Categoría'; modal('categoryModal'); };

// --- Helpers ---
function switchMode(m) {
    state.mode = m;
    el('clientView').style.display = m === 'client' ? 'block' : 'none';
    el('adminView').style.display = m === 'admin' ? 'block' : 'none';
    document.querySelectorAll('.mode-btn').forEach(b => {
        // Mejor logica para detectar el boton activo basado en el atributo onclick
        const onclickAttr = b.getAttribute('onclick');
        b.classList.toggle('active', onclickAttr && onclickAttr.includes(`'${m}'`));
    });
    if(m === 'client') slider(); else clearInterval(state.interval);
}

function bindEvents() {
    // Filters
    document.querySelectorAll('.filter-btn').forEach(b => b.addEventListener('click', e => {
        const container = e.target.closest('.category-filters');
        if(container) container.querySelectorAll('.filter-btn').forEach(x => x.classList.remove('active'));
        e.target.classList.add('active');
        
        const cat = e.target.dataset.category, map = {'cafes':'Cafés','postres':'Postres','snacks':'Snacks'};
        const filtered = cat === 'all' ? state.products : state.products.filter(p => p.category?.id == cat || p.category?.name === map[cat]);
        const grid = state.mode === 'client' ? 'menuProductsGrid' : 'adminProductsGrid';
        
        const listEl = el(grid);
        if(listEl) listEl.innerHTML = filtered.length ? filtered.map(p => tpl.card(p, state.mode==='admin')).join('') : '<div class="empty-state"><p>No hay resultados</p></div>';
    }));
    
    // Forms
    document.querySelectorAll('form').forEach(f => f.addEventListener('submit', async e => {
        e.preventDefault();
        const data = {}; 
        Array.from(f.elements).forEach(i => { if(i.id && i.type!='submit') data[i.id.replace(/product|category|client/i,'').toLowerCase()] = i.value; });
        
        if(f.id.includes('Reservation')) { 
            await api('/reservations', 'POST', data); alert('Reserva Enviada'); f.reset(); 
        } else { 
            if(data.price) data.price = parseFloat(data.price); 
            if(data.category) data.category = {id: parseInt(data.category)};
            
            const id = el(f.id.replace('Form','Id')).value;
            const endpoint = f.id.includes('product') ? '/products' : '/categories';
            const method = id ? 'PUT' : 'POST';
            const url = id ? `${endpoint}/${id}` : endpoint;
            
            if(await api(url, method, data)) { 
                alert('Guardado exitosamente'); 
                modal(f.id.replace('Form','Modal'), false); 
                await load(); 
            }
        }
    }));
    
    document.querySelectorAll('.modal-close, .btn-secondary').forEach(b => b.onclick = (e) => modal(e.target.closest('.modal').id, false));
}

const modal = (id, open=true) => { const m = el(id); if(m) { m.classList.toggle('active', open); document.body.style.overflow = open ? 'hidden' : ''; } };
const fill = (p, d) => Object.keys(d).forEach(k => { 
    const i = el(`${p}${k.charAt(0).toUpperCase()+k.slice(1)}`); 
    if(i) i.value = (typeof d[k]==='object') ? d[k]?.id : d[k]; 
});

const slider = () => {
    clearInterval(state.interval);
    const slides = document.querySelectorAll('.slide'); if(!slides.length) return;
    const go = n => { slides.forEach(s=>s.classList.remove('active')); state.slideIdx = (n+slides.length)%slides.length; slides[state.slideIdx].classList.add('active'); };
    state.interval = setInterval(() => go(state.slideIdx+1), 5000);
    window.cambiarDiapositiva = n => go(state.slideIdx+n);
};

function getFallbackProducts() {
    return [
        { id: 1, name: 'Espresso', description: 'Café solo intenso', price: 2.50, category: {id:1, name:'Cafés'} },
        { id: 2, name: 'Cappuccino', description: 'Espresso con espuma', price: 3.50, category: {id:1, name:'Cafés'} },
        { id: 3, name: 'Tarta de Queso', description: 'Con frutos rojos', price: 4.50, category: {id:2, name:'Postres'} }
    ];
}

document.addEventListener('DOMContentLoaded', window.init);
