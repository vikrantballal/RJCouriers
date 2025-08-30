document.addEventListener('DOMContentLoaded', function() {
    // Check if user is admin
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    if (!currentUser || currentUser.userType !== 'admin') {
        alert('Access denied. Admin privileges required.');
        window.location.href = 'login.html';
        return;
    }
    
    const statusUpdateForm = document.getElementById('statusUpdateForm');
    const searchButton = document.getElementById('searchButton');
    const packageSearch = document.getElementById('packageSearch');
    
    // Load statistics
    updateStatistics();
    
    // Load packages table
    loadPackagesTable();
    
    // Load users table
    loadUsersTable();
    
    searchButton.addEventListener('click', function() {
        const searchTerm = packageSearch.value.trim();
        if (searchTerm) {
            filterPackagesTable(searchTerm);
        } else {
            loadPackagesTable();
        }
    });
    
    statusUpdateForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const trackingNumber = document.getElementById('statusTrackingNumber').value;
        const newStatus = document.getElementById('newStatus').value;
        const location = document.getElementById('statusLocation').value;
        const description = document.getElementById('statusDescription').value;
        
        // Update package status
        const packages = JSON.parse(localStorage.getItem('rjCouriersPackages')) || [];
        const packageIndex = packages.findIndex(p => p.trackingNumber === trackingNumber);
        
        if (packageIndex === -1) {
            alert('Package not found with that tracking number.');
            return;
        }
        
        // Update package status
        packages[packageIndex].status = newStatus;
        localStorage.setItem('rjCouriersPackages', JSON.stringify(packages));
        
        // Add tracking record
        const trackingRecords = JSON.parse(localStorage.getItem('rjCouriersTracking')) || [];
        trackingRecords.push({
            trackingNumber,
            status: newStatus,
            location,
            timestamp: new Date().toISOString(),
            description
        });
        localStorage.setItem('rjCouriersTracking', JSON.stringify(trackingRecords));
        
        alert('Package status updated successfully.');
        statusUpdateForm.reset();
        
        // Refresh tables and statistics
        updateStatistics();
        loadPackagesTable();
    });
    
    function updateStatistics() {
        const packages = JSON.parse(localStorage.getItem('rjCouriersPackages')) || [];
        
        document.getElementById('totalPackages').textContent = packages.length;
        document.getElementById('pendingPackages').textContent = packages.filter(p => p.status === 'pending').length;
        document.getElementById('transitPackages').textContent = packages.filter(p => p.status === 'in transit').length;
        document.getElementById('deliveredPackages').textContent = packages.filter(p => p.status === 'delivered').length;
    }
    
    function loadPackagesTable() {
        const packages = JSON.parse(localStorage.getItem('rjCouriersPackages')) || [];
        const tableBody = document.querySelector('#packagesTable tbody');
        
        tableBody.innerHTML = '';
        
        packages.forEach(pkg => {
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>${pkg.trackingNumber}</td>
                <td>${pkg.sender.name}</td>
                <td>${pkg.recipient.name}</td>
                <td><span class="status-badge">${pkg.status}</span></td>
                <td>
                    <button class="action-button view-button" data-tracking="${pkg.trackingNumber}">View</button>
                    <button class="action-button edit-button" data-tracking="${pkg.trackingNumber}">Edit</button>
                    <button class="action-button delete-button" data-id="${pkg.id}">Delete</button>
                </td>
            `;
            
            tableBody.appendChild(row);
        });
        
        // Add event listeners to buttons
        document.querySelectorAll('.view-button').forEach(button => {
            button.addEventListener('click', function() {
                const trackingNumber = this.getAttribute('data-tracking');
                window.open(`tracking.html?tracking=${trackingNumber}`, '_blank');
            });
        });
        
        document.querySelectorAll('.edit-button').forEach(button => {
            button.addEventListener('click', function() {
                const trackingNumber = this.getAttribute('data-tracking');
                document.getElementById('statusTrackingNumber').value = trackingNumber;
            });
        });
        
        document.querySelectorAll('.delete-button').forEach(button => {
            button.addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                if (confirm('Are you sure you want to delete this package?')) {
                    deletePackage(id);
                }
            });
        });
    }
    
    function filterPackagesTable(searchTerm) {
        const packages = JSON.parse(localStorage.getItem('rjCouriersPackages')) || [];
        const filteredPackages = packages.filter(p => 
            p.trackingNumber.includes(searchTerm) || 
            p.sender.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.recipient.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        
        const tableBody = document.querySelector('#packagesTable tbody');
        tableBody.innerHTML = '';
        
        filteredPackages.forEach(pkg => {
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>${pkg.trackingNumber}</td>
                <td>${pkg.sender.name}</td>
                <td>${pkg.recipient.name}</td>
                <td><span class="status-badge">${pkg.status}</span></td>
                <td>
                    <button class="action-button view-button" data-tracking="${pkg.trackingNumber}">View</button>
                    <button class="action-button edit-button" data-tracking="${pkg.trackingNumber}">Edit</button>
                    <button class="action-button delete-button" data-id="${pkg.id}">Delete</button>
                </td>
            `;
            
            tableBody.appendChild(row);
        });
    }
    
    function loadUsersTable() {
        const users = JSON.parse(localStorage.getItem('rjCouriersUsers')) || [];
        const tableBody = document.querySelector('#usersTable tbody');
        
        tableBody.innerHTML = '';
        
        users.forEach(user => {
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>${user.fullName}</td>
                <td>${user.email}</td>
                <td>${user.phone}</td>
                <td>${user.userType}</td>
                <td>
                    <button class="action-button edit-button" data-id="${user.id}">Edit</button>
                    <button class="action-button delete-button" data-id="${user.id}">Delete</button>
                </td>
            `;
            
            tableBody.appendChild(row);
        });
    }
    
    function deletePackage(id) {
        let packages = JSON.parse(localStorage.getItem('rjCouriersPackages')) || [];
        packages = packages.filter(p => p.id !== id);
        localStorage.setItem('rjCouriersPackages', JSON.stringify(packages));
        
        // Refresh table and statistics
        updateStatistics();
        loadPackagesTable();
    }
});