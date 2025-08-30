document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        // Get users from localStorage
        const users = JSON.parse(localStorage.getItem('rjCouriersUsers')) || [];
        
        // Check if user exists
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
            // Store current user in session
            sessionStorage.setItem('currentUser', JSON.stringify(user));
            alert('Login successful!');
            
            // Redirect based on user type
            if (user.userType === 'admin') {
                window.location.href = 'admin.html';
            } else {
                window.location.href = 'booking.html';
            }
        } else {
            alert('Invalid email or password. Please try again.');
        }
    });
});