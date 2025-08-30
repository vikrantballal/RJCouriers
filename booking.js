document.addEventListener('DOMContentLoaded', function() {
    const bookingForm = document.getElementById('bookingForm');
    const pickupDate = document.getElementById('pickupDate');
    
    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];
    pickupDate.min = today;
    
    bookingForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const senderName = document.getElementById('senderName').value;
        const senderPhone = document.getElementById('senderPhone').value;
        const senderAddress = document.getElementById('senderAddress').value;
        const recipientName = document.getElementById('recipientName').value;
        const recipientPhone = document.getElementById('recipientPhone').value;
        const recipientAddress = document.getElementById('recipientAddress').value;
        const packageDescription = document.getElementById('packageDescription').value;
        const packageWeight = parseFloat(document.getElementById('packageWeight').value);
        const packageLength = parseFloat(document.getElementById('packageLength').value);
        const packageWidth = parseFloat(document.getElementById('packageWidth').value);
        const packageHeight = parseFloat(document.getElementById('packageHeight').value);
        const packageValue = parseFloat(document.getElementById('packageValue').value);
        const deliveryType = document.getElementById('deliveryType').value;
        const pickupDateValue = document.getElementById('pickupDate').value;
        const specialInstructions = document.getElementById('specialInstructions').value;
        
        // Calculate cost based on weight, dimensions, and delivery type
        const baseCost = 5.00;
        const weightCost = packageWeight * 2.00;
        const dimensionCost = (packageLength * packageWidth * packageHeight) / 1000 * 0.5;
        let deliveryCost = 0;
        
        switch(deliveryType) {
            case 'standard':
                deliveryCost = 5.00;
                break;
            case 'express':
                deliveryCost = 15.00;
                break;
            case 'same-day':
                deliveryCost = 25.00;
                break;
        }
        
        const totalCost = baseCost + weightCost + dimensionCost + deliveryCost;
        
        // Generate tracking number
        const trackingNumber = 'RJ' + Date.now().toString().slice(-8);
        
        // Create package object
        const newPackage = {
            id: Date.now().toString(),
            trackingNumber,
            sender: { name: senderName, phone: senderPhone, address: senderAddress },
            recipient: { name: recipientName, phone: recipientPhone, address: recipientAddress },
            package: {
                description: packageDescription,
                weight: packageWeight,
                dimensions: { length: packageLength, width: packageWidth, height: packageHeight },
                value: packageValue
            },
            delivery: {
                type: deliveryType,
                cost: totalCost.toFixed(2),
                pickupDate: pickupDateValue,
                specialInstructions
            },
            status: 'pending',
            createdAt: new Date().toISOString()
        };
        
        // Get current user
        const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
        if (currentUser) {
            newPackage.userId = currentUser.id;
        }
        
        // Get existing packages
        const packages = JSON.parse(localStorage.getItem('rjCouriersPackages')) || [];
        
        // Add to packages array
        packages.push(newPackage);
        
        // Save to localStorage
        localStorage.setItem('rjCouriersPackages', JSON.stringify(packages));
        
        // Create tracking record
        const trackingRecords = JSON.parse(localStorage.getItem('rjCouriersTracking')) || [];
        trackingRecords.push({
            trackingNumber,
            status: 'pending',
            location: 'Processing Center',
            timestamp: new Date().toISOString(),
            description: 'Package registered in system'
        });
        localStorage.setItem('rjCouriersTracking', JSON.stringify(trackingRecords));
        
        // Show success message with tracking number
        alert(`Booking successful! Your tracking number is: ${trackingNumber}. Total cost: $${totalCost.toFixed(2)}. You will be redirected to payment.`);
        
        // Store package in session for payment page
        sessionStorage.setItem('currentPackage', JSON.stringify(newPackage));
        
        // Redirect to payment page
        window.location.href = 'payment.html';
    });
});