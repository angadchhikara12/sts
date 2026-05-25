// SUPABASE_URL and SUPABASE_ANON_KEY loaded from config.js

async function fetchCars() {
    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/cars?select=*`, {
            method: 'GET',
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    } catch (err) {
        console.error('Error fetching cars:', err);
        return [];
    }
}

function renderVehicleCard(car) {
    const encodedVehicle = encodeURIComponent(car.name);
    return `
        <div class="vehicle-card fade-in" data-category="${car.category.toLowerCase()}">
            <div class="vehicle-image">
                <img src="${car.image}" alt="${car.name}">
                <span class="vehicle-badge">${car.category}</span>
            </div>
            <div class="vehicle-content">
                <h3 class="vehicle-name">${car.name}</h3>
                <div class="vehicle-specs">
                    <span class="vehicle-spec"><i class="fas fa-user"></i> ${car.passenger_cap} Passengers</span>
                    <span class="vehicle-spec"><i class="fas fa-suitcase"></i> ${car.luggage_cap} Luggage</span>
                </div>
                <p class="vehicle-desc">${car.description}</p>
                <div class="vehicle-footer">
                    <button class="vehicle-btn" onclick="window.location.href='booking.html?vehicle=${encodedVehicle}'">Book Now</button>
                </div>
            </div>
        </div>
    `;
}

async function initFleetGrid() {
    const fleetGrid = document.getElementById('fleetGrid');
    if (!fleetGrid) return;
    
    fleetGrid.innerHTML = '<div class="loading-message">Loading vehicles...</div>';
    
    const cars = await fetchCars();
    
    if (cars.length === 0) {
        fleetGrid.innerHTML = '<div class="no-vehicles-message">No vehicles available at the moment.</div>';
        return;
    }
    
    fleetGrid.innerHTML = cars.map(car => renderVehicleCard(car)).join('');
    
    initFleetFilters();
}

function initFleetFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const vehicleCards = document.querySelectorAll('.vehicle-card');
    
    if (filterButtons.length === 0 || vehicleCards.length === 0) return;
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            vehicleCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                if (filter === 'all' || category === filter) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

document.addEventListener('DOMContentLoaded', initFleetGrid);
