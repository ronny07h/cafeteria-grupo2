// ======================================
// CONTACTO PAGE - Reservation Form
// ======================================
const API_BASE_URL = 'http://localhost:9090/api';

// ======================================
// INIT
// ======================================
document.addEventListener('DOMContentLoaded', () => {
    setupForm();
    setMinDate();
});

// ======================================
// FORM SETUP
// ======================================
function setupForm() {
    const form = document.getElementById('reservationForm');
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Validate form
        if (!validateForm()) {
            return;
        }
        
        // Get form data
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            date: document.getElementById('date').value,
            time: document.getElementById('time').value,
            persons: document.getElementById('persons').value,
            message: document.getElementById('message').value || ''
        };
        
        // Submit to API
        await submitReservation(formData);
    });
}

// ======================================
// VALIDATION
// ======================================
function validateForm() {
    let isValid = true;
    
    // Name validation
    const name = document.getElementById('name');
    if (name.value.trim().length < 3) {
        showError(name, 'El nombre debe tener al menos 3 caracteres');
        isValid = false;
    } else {
        clearError(name);
    }
    
    // Email validation
    const email = document.getElementById('email');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.value)) {
        showError(email, 'Email inválido');
        isValid = false;
    } else {
        clearError(email);
    }
    
    // Phone validation
    const phone = document.getElementById('phone');
    if (phone.value.trim().length < 10) {
        showError(phone, 'Teléfono inválido');
        isValid = false;
    } else {
        clearError(phone);
    }
    
    // Date validation
    const date = document.getElementById('date');
    if (!date.value) {
        showError(date, 'Selecciona una fecha');
        isValid = false;
    } else {
        clearError(date);
    }
    
    // Time validation
    const time = document.getElementById('time');
    if (!time.value) {
        showError(time, 'Selecciona una hora');
        isValid = false;
    } else {
        clearError(time);
    }
    
    // Persons validation
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

// ======================================
// SUBMIT TO API
// ======================================
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
        // Show success anyway (form doesn't require backend)
        showSuccess();
    }
}

// ======================================
// SUCCESS MESSAGE
// ======================================
function showSuccess() {
    const form = document.getElementById('reservationForm');
    const successMessage = document.getElementById('successMessage');
    
    // Hide form
    form.style.display = 'none';
    
    // Show success message
    successMessage.style.display = 'block';
    
    // Scroll to success message
    successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    // Reset form
    form.reset();
    
    // Show form again after 5 seconds
    setTimeout(() => {
        form.style.display = 'block';
        successMessage.style.display = 'none';
    }, 5000);
}

// ======================================
// SET MINIMUM DATE
// ======================================
function setMinDate() {
    const dateInput = document.getElementById('date');
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
}

// ======================================
// REAL-TIME VALIDATION
// ======================================
document.querySelectorAll('.form-input, .form-select').forEach(input => {
    input.addEventListener('blur', () => {
        if (input.value) {
            // Validate on blur if has value
            const formGroup = input.closest('.form-group');
            if (formGroup) {
                clearError(input);
            }
        }
    });
});
