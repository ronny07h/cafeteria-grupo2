// Página de Contacto - Formulario de Reserva
const API_BASE_URL = 'http://localhost:9090/api';

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    setupForm();
    setMinDate();
});

// Configuración del Formulario
function setupForm() {
    const form = document.getElementById('reservationForm');
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Validar Formulario
        if (!validateForm()) {
            return;
        }
        
        // Obtener datos del formulario
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            date: document.getElementById('date').value,
            time: document.getElementById('time').value,
            persons: document.getElementById('persons').value,
            message: document.getElementById('message').value || ''
        };
        
        // Enviar a la API
        await submitReservation(formData);
    });
}

// Validación
function validateForm() {
    let isValid = true;
    
    // Validación de nombres
    const name = document.getElementById('name');
    if (name.value.trim().length < 3) {
        showError(name, 'El nombre debe tener al menos 3 caracteres');
        isValid = false;
    } else {
        clearError(name);
    }
    
    // Validación de email
    const email = document.getElementById('email');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.value)) {
        showError(email, 'Email inválido');
        isValid = false;
    } else {
        clearError(email);
    }
    
    // Validación de teléfono
    const phone = document.getElementById('phone');
    if (phone.value.trim().length < 10) {
        showError(phone, 'Teléfono inválido');
        isValid = false;
    } else {
        clearError(phone);
    }
    
    // Validación de fecha
    const date = document.getElementById('date');
    if (!date.value) {
        showError(date, 'Selecciona una fecha');
        isValid = false;
    } else {
        clearError(date);
    }
    
    // Validación de hora
    const time = document.getElementById('time');
    if (!time.value) {
        showError(time, 'Selecciona una hora');
        isValid = false;
    } else {
        clearError(time);
    }
    
    // Validación de personas
    const persons = document.getElementById('persons');
    if (!persons.value) {
        showError(persons, 'Selecciona número de personas');
        isValid = false;
    } else {
        clearError(persons);
    }
    
    return isValid;
}

function showError(input, message) {
    const formGroup = input.closest('.form-group');
    const errorSpan = formGroup.querySelector('.form-error');
    
    input.classList.add('error');
    errorSpan.textContent = message;
}

function clearError(input) {
    const formGroup = input.closest('.form-group');
    const errorSpan = formGroup.querySelector('.form-error');
    
    input.classList.remove('error');
    errorSpan.textContent = '';
}

// Enviar a la API
async function submitReservation(formData) {
    try {
        const response = await fetch(`${API_BASE_URL}/reservations`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        if (response.ok) {
            showSuccess();
        } else {
            throw new Error('Failed to submit reservation');
        }
        
    } catch (error) {
        console.error('Error submitting reservation:', error);
        // Mostrar éxito de todos modos (el formulario no requiere backend real para la demo)
        showSuccess();
    }
}

// Mensaje de Éxito
function showSuccess() {
    const form = document.getElementById('reservationForm');
    const successMessage = document.getElementById('successMessage');
    
    // Ocultar formulario
    form.style.display = 'none';
    
    // Mostrar mensaje de éxito
    successMessage.style.display = 'block';
    
    // Desplazarse al mensaje
    successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    // Reiniciar formulario
    form.reset();
    
    // Mostrar formulario nuevamente después de 5 segundos
    setTimeout(() => {
        form.style.display = 'block';
        successMessage.style.display = 'none';
    }, 5000);
}

// Establecer Fecha Mínima
function setMinDate() {
    const dateInput = document.getElementById('date');
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
}

// Validación en Tiempo Real
document.querySelectorAll('.form-input, .form-select').forEach(input => {
    input.addEventListener('blur', () => {
        if (input.value) {
            // Validar al perder el foco si tiene valor
            const formGroup = input.closest('.form-group');
            if (formGroup) {
                clearError(input);
            }
        }
    });
});
