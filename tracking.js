document.addEventListener('DOMContentLoaded', function() {
    const trackingForm = document.getElementById('trackingForm');
    const trackingResult = document.getElementById('trackingResult');
    const noResult = document.getElementById('noResult');
    
    trackingForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const trackingNumber = document.getElementById('trackingNumber').value.trim();
        
        // Get packages from localStorage
        const packages = JSON.parse(localStorage.getItem('rjCouriersPackages')) || [];
        
        // Find package with matching tracking number
        const package = packages.find(p => p.trackingNumber === trackingNumber);
        
        if (package) {
            // Display package information
            document.getElementById('packageStatus').textContent = package.status.charAt(0).toUpperCase() + package.status.slice(1);
            document.getElementById('senderInfo').innerHTML = `
                <strong>Name:</strong> ${package.sender.name}<br>
                <strong>Phone:</strong> ${package.sender.phone}<br>
                <strong>Address:</strong> ${package.sender.address}
            `;
            document.getElementById('recipientInfo').innerHTML = `
                <strong>Name:</strong> ${package.recipient.name}<br>
                <strong>Phone:</strong> ${package.recipient.phone}<br>
                <strong>Address:</strong> ${package.recipient.address}
            `;
            document.getElementById('packageDetails').innerHTML = `
                <strong>Description:</strong> ${package.package.description}<br>
                <strong>Weight:</strong> ${package.package.weight} kg<br>
                <strong>Dimensions:</strong> ${package.package.dimensions.length} x ${package.package.dimensions.width} x ${package.package.dimensions.height} cm<br>
                <strong>Value:</strong> $${package.package.value}
            `;
            
            // Display tracking history
            const trackingRecords = JSON.parse(localStorage.getItem('rjCouriersTracking')) || [];
            const packageTracking = trackingRecords.filter(t => t.trackingNumber === trackingNumber);
            
            const trackingHistory = document.getElementById('trackingHistory');
            trackingHistory.innerHTML = '';
            
            if (packageTracking.length > 0) {
                packageTracking.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).forEach(event => {
                    const eventElement = document.createElement('div');
                    eventElement.classList.add('tracking-event');
                    
                    const eventDate = new Date(event.timestamp);
                    eventElement.innerHTML = `
                        <div class="event-time">${eventDate.toLocaleDateString()} ${eventDate.toLocaleTimeString()}</div>
                        <div class="event-location"><strong>Location:</strong> ${event.location}</div>
                        <div class="event-description">${event.description}</div>
                    `;
                    
                    trackingHistory.appendChild(eventElement);
                });
            } else {
                trackingHistory.innerHTML = '<p>No tracking history available.</p>';
            }
            
            // Show results
            trackingResult.classList.remove('hidden');
            noResult.classList.add('hidden');
        } else {
            // No package found
            trackingResult.classList.add('hidden');
            noResult.classList.remove('hidden');
        }
    });
});