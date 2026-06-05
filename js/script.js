/* ==================== SMART ROOM JAVASCRIPT ==================== */

// ==================== DOM ELEMENTS ==================== 
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-menu a');
const brightnessSlider = document.querySelector('.brightness-slider');
const volumeSlider = document.querySelector('.volume-slider');
const deviceControls = document.querySelectorAll('.device-controls');
const tempBtns = document.querySelectorAll('.temp-btn');
const toggleBtns = document.querySelectorAll('.btn-toggle');
const formSubmitBtns = document.querySelectorAll('form button[type="submit"]');
const sliderValues = document.querySelectorAll('.slider-value');

// ==================== HAMBURGER MENU ==================== 
if (hamburger) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        
        // Animate hamburger
        const spans = hamburger.querySelectorAll('span');
        spans.forEach(span => span.style.transition = '0.3s ease');
        
        if (navMenu.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translateY(10px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translateY(-10px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });

    // Close menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            const spans = hamburger.querySelectorAll('span');
            spans.forEach(span => span.style.transform = 'none');
            spans[1].style.opacity = '1';
        });
    });
}

// ==================== BRIGHTNESS SLIDER ==================== 
if (brightnessSlider) {
    brightnessSlider.addEventListener('input', (e) => {
        const value = e.target.value;
        const sliderValue = brightnessSlider.parentElement.querySelector('.slider-value');
        if (sliderValue) {
            sliderValue.textContent = value + '%';
        }
        updateSliderBackground(brightnessSlider);
    });
}

// ==================== VOLUME SLIDER ==================== 
if (volumeSlider) {
    volumeSlider.addEventListener('input', (e) => {
        const value = e.target.value;
        const sliderValue = volumeSlider.parentElement.querySelector('.slider-value');
        if (sliderValue) {
            sliderValue.textContent = value + '%';
        }
        updateSliderBackground(volumeSlider);
    });
}

// ==================== UPDATE SLIDER BACKGROUND ==================== 
function updateSliderBackground(slider) {
    const value = (slider.value - slider.min) / (slider.max - slider.min) * 100;
    slider.style.background = `linear-gradient(to right, #2563eb 0%, #2563eb ${value}%, #f3f4f6 ${value}%, #f3f4f6 100%)`;
}

// Initialize sliders
if (brightnessSlider) {
    updateSliderBackground(brightnessSlider);
}
if (volumeSlider) {
    updateSliderBackground(volumeSlider);
}

// ==================== DEVICE CONTROLS ==================== 
deviceControls.forEach(control => {
    const buttons = control.querySelectorAll('.btn-control');
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons in this control
            buttons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');
            // Show notification
            showNotification(`${button.textContent} button clicked`);
        });
    });
});

// ==================== TEMPERATURE CONTROLS ==================== 
tempBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const tempDisplay = btn.parentElement.querySelector('.temp-display');
        if (tempDisplay) {
            let currentTemp = parseInt(tempDisplay.textContent);
            
            if (btn.textContent === '-') {
                currentTemp = Math.max(16, currentTemp - 1); // Minimum 16°C
                showNotification(`Temperature decreased to ${currentTemp}°C`);
            } else if (btn.textContent === '+') {
                currentTemp = Math.min(30, currentTemp + 1); // Maximum 30°C
                showNotification(`Temperature increased to ${currentTemp}°C`);
            }
            
            tempDisplay.textContent = currentTemp + '°C';
        }
    });
});

// ==================== TOGGLE BUTTONS (AUTOMATION) ==================== 
toggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        btn.classList.toggle('active');
        const automationName = btn.parentElement.parentElement.querySelector('h4').textContent;
        const status = btn.classList.contains('active') ? 'Enabled' : 'Disabled';
        btn.textContent = status;
        showNotification(`${automationName} ${status}`);
    });
});

// ==================== FORM SUBMISSIONS ==================== 
formSubmitBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        const form = btn.closest('form');
        const formTitle = btn.closest('.settings-card').querySelector('h3').textContent;
        
        // Collect form data
        const formData = new FormData(form);
        
        // Show success notification
        showNotification(`${formTitle} saved successfully!`, 'success');
        
        // Optional: Log form data to console
        console.log(`${formTitle} submitted:`, Object.fromEntries(formData));
    });
});

// ==================== NOTIFICATION SYSTEM ==================== 
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add styles inline
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '1rem 1.5rem',
        borderRadius: '0.5rem',
        color: 'white',
        zIndex: '2000',
        animation: 'slideIn 0.3s ease',
        fontSize: '0.95rem',
        fontWeight: '500',
        boxShadow: '0 10px 15px rgba(0, 0, 0, 0.1)',
        maxWidth: '300px'
    });
    
    // Set background color based on type
    const colors = {
        'info': '#2563eb',
        'success': '#10b981',
        'warning': '#f59e0b',
        'error': '#ef4444'
    };
    
    notification.style.backgroundColor = colors[type] || colors['info'];
    
    document.body.appendChild(notification);
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ==================== ADD ANIMATIONS ==================== 
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ==================== SMOOTH SCROLL OFFSET FOR NAVBAR ==================== 
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const offsetTop = target.offsetTop - 80; // Account for navbar height
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        }
    });
});

// ==================== STATUS UPDATES SIMULATION ==================== 
function updateDeviceStatus() {
    // Simulate real-time updates of dashboard values
    const statusValues = document.querySelectorAll('.status-value');
    
    const updates = [
        { value: 22, range: [18, 26] }, // Temperature
        { value: 45, range: [30, 60] }, // Humidity
        { value: 75, range: [60, 100] }, // Lighting
        { value: 2.4, range: [1.5, 4.0] } // Energy usage
    ];
    
    statusValues.forEach((element, index) => {
        setInterval(() => {
            if (updates[index]) {
                const { value, range } = updates[index];
                const newValue = (Math.random() * (range[1] - range[0]) + range[0]).toFixed(1);
                element.textContent = index === 3 ? newValue + ' kW' : (index === 0 ? newValue + '°C' : newValue + '%');
            }
        }, 5000); // Update every 5 seconds
    });
}

// Initialize device status updates
updateDeviceStatus();

// ==================== PAGE LOAD ANIMATION ==================== 
window.addEventListener('load', () => {
    const cards = document.querySelectorAll('.device-card, .status-card, .settings-card');
    cards.forEach((card, index) => {
        card.style.animation = `fadeInUp 0.5s ease ${index * 0.1}s both`;
    });
});

// ==================== RESPONSIVE NAV MENU CLOSE ON RESIZE ==================== 
window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && navMenu) {
        navMenu.classList.remove('active');
    }
});

// ==================== CONSOLE WELCOME MESSAGE ==================== 
console.log('%c Welcome to SmartRoom! ', 'background: #2563eb; color: white; font-size: 16px; padding: 10px;');
console.log('%c This is an intelligent home control system. ', 'color: #2563eb; font-size: 12px;');
