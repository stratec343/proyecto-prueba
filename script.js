// ===== FUNCIONALIDADES PRINCIPALES DE LA PÁGINA =====

// Inicialización cuando el DOM está cargado
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar todas las funcionalidades
    initNavigation();
    initScrollAnimations();
    initContactForm();
    updateCurrentYear();
    initEditableElements();
    
    console.log('Página cargada correctamente');
});

// ===== NAVEGACIÓN =====
function initNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navList = document.querySelector('.nav-list');
    
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            this.classList.toggle('active');
            navList.classList.toggle('active');
        });
    }
    
    // Cerrar menú al hacer clic en un enlace
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (navList.classList.contains('active')) {
                hamburger.classList.remove('active');
                navList.classList.remove('active');
            }
        });
    });
    
    // Cambiar estilo del header al hacer scroll
    window.addEventListener('scroll', function() {
        const header = document.querySelector('.header');
        if (window.scrollY > 100) {
            header.style.padding = '10px 0';
            header.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.padding = '15px 0';
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        }
    });
}

// ===== ANIMACIONES AL SCROLL =====
function initScrollAnimations() {
    // Configurar observador de intersección para animaciones
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, observerOptions);
    
    // Observar elementos para animar
    const elementsToAnimate = document.querySelectorAll('.learning-card, .book-cover, .author-photo');
    elementsToAnimate.forEach(element => {
        observer.observe(element);
    });
}

// ===== FORMULARIO DE CONTACTO =====
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Obtener datos del formulario
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                interest: document.getElementById('interest').value,
                message: document.getElementById('message').value
            };
            
            // Validación básica
            if (!formData.name || !formData.email) {
                showAlert('Por favor, completa los campos requeridos', 'error');
                return;
            }
            
            // Simular envío (en un caso real, aquí se enviaría a un servidor)
            console.log('Datos del formulario:', formData);
            
            // Mostrar mensaje de éxito
            showAlert('¡Gracias por tu interés! Te contactaremos pronto con más recursos.', 'success');
            
            // Resetear formulario
            contactForm.reset();
        });
    }
}

// Función para mostrar alertas
function showAlert(message, type) {
    // Crear elemento de alerta
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.textContent = message;
    
    // Estilos para la alerta
    alertDiv.style.position = 'fixed';
    alertDiv.style.top = '20px';
    alertDiv.style.right = '20px';
    alertDiv.style.padding = '15px 20px';
    alertDiv.style.borderRadius = '8px';
    alertDiv.style.color = 'white';
    alertDiv.style.fontWeight = '500';
    alertDiv.style.zIndex = '9999';
    alertDiv.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.2)';
    alertDiv.style.animation = 'fadeIn 0.3s ease';
    
    if (type === 'success') {
        alertDiv.style.backgroundColor = '#27ae60';
    } else {
        alertDiv.style.backgroundColor = '#e74c3c';
    }
    
    // Agregar al documento
    document.body.appendChild(alertDiv);
    
    // Remover después de 5 segundos
    setTimeout(() => {
        alertDiv.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(alertDiv);
        }, 300);
    }, 5000);
}

// Añadir estilos para las animaciones de alerta
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(-20px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes fadeOut {
        from { opacity: 1; transform: translateY(0); }
        to { opacity: 0; transform: translateY(-20px); }
    }
`;
document.head.appendChild(style);

// ===== AÑO ACTUAL EN EL FOOTER =====
function updateCurrentYear() {
    const yearElement = document.getElementById('currentYear');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

// ===== ELEMENTOS EDITABLES (para el panel admin) =====
function initEditableElements() {
    // Cargar contenido guardado del localStorage
    loadSavedContent();
    
    // Solo hacer elementos editables si estamos en modo admin
    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    
    if (isAdmin) {
        makeElementsEditable();
        showAdminIndicator();
    }
}

function makeElementsEditable() {
    const editableElements = document.querySelectorAll('.editable');
    
    editableElements.forEach(element => {
        element.setAttribute('contenteditable', 'true');
        
        // Guardar cambios cuando el usuario termina de editar
        element.addEventListener('blur', function() {
            const key = this.getAttribute('data-key');
            const content = this.innerHTML;
            
            // Guardar en localStorage
            saveContent(key, content);
            
            // Mostrar confirmación
            showAlert('Cambio guardado localmente', 'success');
        });
        
        // Permitir guardar con Ctrl+Enter
        element.addEventListener('keydown', function(e) {
            if (e.ctrlKey && e.key === 'Enter') {
                this.blur();
            }
        });
    });
}

function saveContent(key, content) {
    const savedContent = JSON.parse(localStorage.getItem('bookContent') || '{}');
    savedContent[key] = content;
    localStorage.setItem('bookContent', JSON.stringify(savedContent));
}

function loadSavedContent() {
    const savedContent = JSON.parse(localStorage.getItem('bookContent') || '{}');
    
    Object.keys(savedContent).forEach(key => {
        const element = document.querySelector(`[data-key="${key}"]`);
        if (element) {
            element.innerHTML = savedContent[key];
        }
    });
}

function showAdminIndicator() {
    const indicator = document.createElement('div');
    indicator.id = 'admin-indicator';
    indicator.innerHTML = '<i class="fas fa-user-cog"></i> Modo Edición Activo';
    indicator.style.position = 'fixed';
    indicator.style.bottom = '20px';
    indicator.style.left = '20px';
    indicator.style.backgroundColor = '#27ae60';
    indicator.style.color = 'white';
    indicator.style.padding = '10px 15px';
    indicator.style.borderRadius = '8px';
    indicator.style.fontSize = '0.9rem';
    indicator.style.fontWeight = '500';
    indicator.style.zIndex = '9998';
    indicator.style.boxShadow = '0 3px 10px rgba(0, 0, 0, 0.2)';
    indicator.style.display = 'flex';
    indicator.style.alignItems = 'center';
    indicator.style.gap = '8px';
    
    document.body.appendChild(indicator);
}

// ===== FUNCIONES DE RESET (para el panel admin) =====
function resetAllContent() {
    if (confirm('¿Estás seguro de que quieres restablecer todo el contenido a los valores originales?')) {
        localStorage.removeItem('bookContent');
        location.reload();
    }
}

function logoutAdmin() {
    localStorage.setItem('isAdmin', 'false');
    window.location.href = 'index.html';
}