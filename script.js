// Toggle mobile menu
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.createElement('button');
    menuToggle.innerHTML = '☰';
    menuToggle.classList.add('menu-toggle');
    document.querySelector('.nav-container').appendChild(menuToggle);
    
    menuToggle.addEventListener('click', function() {
        document.querySelector('.nav-menu').classList.toggle('active');
    });
    
    // Form validation and functionality will be added in specific page scripts
});

// Simple data storage simulation (in a real app, this would be server-side)
if (!localStorage.getItem('rjCouriersUsers')) {
    localStorage.setItem('rjCouriersUsers', JSON.stringify([]));
}

if (!localStorage.getItem('rjCouriersPackages')) {
    localStorage.setItem('rjCouriersPackages', JSON.stringify([]));
}

if (!localStorage.getItem('rjCouriersTracking')) {
    localStorage.setItem('rjCouriersTracking', JSON.stringify([]));
}