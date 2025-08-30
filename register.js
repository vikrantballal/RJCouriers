document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('registerForm');
    
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const fullName = document.getElementById('fullName').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const phone = document.getElementById('phone').value;
        const address = document.getElementById('address').value;
        
        // Validate passwords match
        if (password !== confirmPassword) {
            alert('Passwords do not match. Please try again.');
            return;
        }
        
        // Get existing users
        const users = JSON.parse(localStorage.getItem('rjCouriersUsers')) || [];
        
        // Check if email already exists
        if (users.some(user => user.email === email)) {
            alert('Email already registered. Please login or use a different email.');
            return;
        }
        
        // Create new user object
        const newUser = {
            id: Date.now().toString(),
            fullName,
            email,
            password,
            phone,
            address,
            userType: 'customer' // Default user type
        };
        
        // Add to users array
        users.push(newUser);
        
        // Save to localStorage
        localStorage.setItem('rjCouriersUsers', JSON.stringify(users));
        
        alert('Registration successful! Please login with your credentials.');
        window.location.href = 'login.html';
    });
});