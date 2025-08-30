document.addEventListener('DOMContentLoaded', function() {
    const paymentForm = document.getElementById('paymentForm');
    const paymentMethods = document.querySelectorAll('input[name="paymentMethod"]');
    const creditCardForm = document.getElementById('creditCardForm');
    const paypalForm = document.getElementById('paypalForm');
    const bankTransferForm = document.getElementById('bankTransferForm');
    const bankReference = document.getElementById('bankReference');
    const orderDetails = document.getElementById('orderDetails');
    
    // Get current package from session
    const currentPackage = JSON.parse(sessionStorage.getItem('currentPackage'));
    
    if (!currentPackage) {
        alert('No package found. Please book a delivery first.');
        window.location.href = 'booking.html';
        return;
    }
    
    // Display order details
    orderDetails.innerHTML = `
        <div class="order-item">
            <span>Delivery Cost (${currentPackage.delivery.type}):</span>
            <span>$${currentPackage.delivery.cost}</span>
        </div>
        <div class="order-total">
            <span>Total:</span>
            <span>$${currentPackage.delivery.cost}</span>
        </div>
        <p><strong>Tracking Number:</strong> ${currentPackage.trackingNumber}</p>
    `;
    
    // Set bank reference
    bankReference.textContent = currentPackage.trackingNumber;
    
    // Handle payment method changes
    paymentMethods.forEach(method => {
        method.addEventListener('change', function() {
            creditCardForm.classList.add('hidden');
            paypalForm.classList.add('hidden');
            bankTransferForm.classList.add('hidden');
            
            if (this.value === 'creditCard') {
                creditCardForm.classList.remove('hidden');
            } else if (this.value === 'paypal') {
                paypalForm.classList.remove('hidden');
            } else if (this.value === 'bankTransfer') {
                bankTransferForm.classList.remove('hidden');
            }
        });
    });
    
    paymentForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
        
        // Validate credit card if selected
        if (paymentMethod === 'creditCard') {
            const cardNumber = document.getElementById('cardNumber').value;
            const expiryDate = document.getElementById('expiryDate').value;
            const cvv = document.getElementById('cvv').value;
            const cardholderName = document.getElementById('cardholderName').value;
            
            // Simple validation
            if (!isValidCardNumber(cardNumber)) {
                alert('Please enter a valid card number.');
                return;
            }
            
            if (!isValidExpiryDate(expiryDate)) {
                alert('Please enter a valid expiry date (MM/YY).');
                return;
            }
            
            if (!isValidCVV(cvv)) {
                alert('Please enter a valid CVV.');
                return;
            }
            
            if (cardholderName.trim().length < 3) {
                alert('Please enter the cardholder name.');
                return;
            }
        }
        
        // Update package status to paid
        const packages = JSON.parse(localStorage.getItem('rjCouriersPackages')) || [];
        const packageIndex = packages.findIndex(p => p.id === currentPackage.id);
        
        if (packageIndex !== -1) {
            packages[packageIndex].status = 'paid';
            packages[packageIndex].payment = {
                method: paymentMethod,
                amount: currentPackage.delivery.cost,
                date: new Date().toISOString()
            };
            
            localStorage.setItem('rjCouriersPackages', JSON.stringify(packages));
            
            // Update tracking
            const trackingRecords = JSON.parse(localStorage.getItem('rjCouriersTracking')) || [];
            trackingRecords.push({
                trackingNumber: currentPackage.trackingNumber,
                status: 'processing',
                location: 'Processing Center',
                timestamp: new Date().toISOString(),
                description: 'Payment received. Package awaiting pickup.'
            });
            localStorage.setItem('rjCouriersTracking', JSON.stringify(trackingRecords));
        }
        
        alert('Payment successful! Your package is now being processed.');
        sessionStorage.removeItem('currentPackage');
        window.location.href = 'tracking.html?tracking=' + currentPackage.trackingNumber;
    });
    
    // Helper functions for validation
    function isValidCardNumber(number) {
        return /^\d{16}$/.test(number.replace(/\s/g, ''));
    }
    
    function isValidExpiryDate(date) {
        return /^\d{2}\/\d{2}$/.test(date);
    }
    
    function isValidCVV(cvv) {
        return /^\d{3,4}$/.test(cvv);
    }
});