let menu = document.querySelector('#menu-icon');
let navbar = document.querySelector('.navbar');

menu.onclick = () => {
    menu.classList.toggle('bx-x');
    navbar.classList.toggle('active');
}

window.onscroll = () => {
    menu.classList.remove('bx-x');
    navbar.classList.remove('active');
}

const sr = ScrollReveal({
    distance: '60px',
    duration: 2500,
    delay: 400,
    reset: true
});

// Scroll reveal effects
sr.reveal('.text', { delay: 200, origin: 'top' });
sr.reveal('.form-container form', { delay: 800, origin: 'left' });
sr.reveal('.heading', { delay: 800, origin: 'top' });
sr.reveal('.ride-container .box', { delay: 600, origin: 'top' });
sr.reveal('.services-container .box', { delay: 600, origin: 'top' });
sr.reveal('.about-container .box', { delay: 600, origin: 'top' });
sr.reveal('.reviews-container', { delay: 600, origin: 'top' });
sr.reveal('.newsletter .box', { delay: 400, origin: 'bottom' });

let database = {
    cars: [],
    rentals: [],
};

// Fetch initial car data
fetch('http://localhost:3000/cars')
    .then((res) => {
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
    })
    .then((data) => {
        database.cars = data;
        displayAvailableCars();
    })
    .catch((error) => {
        console.error('Error fetching data:', error);
        alert('Failed to fetch car data. Please check the server.');
    });

function addCar() {
    const make = document.getElementById('make').value;
    const model = document.getElementById('model').value;
    const year = document.getElementById('year').value;
    const color = document.getElementById('color').value;
    const dailyRate = document.getElementById('dailyRate').value;

    const newCar = { make, model, year, color, dailyRate, status: "Available" };

    fetch('http://localhost:3000/cars', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCar)
    })
    .then(res => res.json())
    .then(data => {
        database.cars.push(data);
        alert('Car added successfully!');
        displayAvailableCars();
    })
    .catch(error => console.error('Error adding car:', error));
}

function displayAvailableCars() {
    const availableCarsDiv = document.getElementById('availableCars');
    availableCarsDiv.innerHTML = '';

    const availableCars = database.cars.filter(car => car.status === "Available");
    availableCars.forEach(car => {
        availableCarsDiv.innerHTML += `
            <div class="car">
                ${car.make} ${car.model} (${car.year}) - ${car.color} - $${car.dailyRate}/day
                <button onclick="viewCarDetails(${car.id})">View Details</button>
            </div>
        `;
    });
}

function viewCarDetails(carId) {
    const car = database.cars.find(car => car.id === carId);
    const carDetailsDiv = document.getElementById('carDetails');
    carDetailsDiv.innerHTML = '';

    if (car) {
        carDetailsDiv.innerHTML = `
            <div class="car">
                Make: ${car.make}<br>
                Model: ${car.model}<br>
                Year: ${car.year}<br>
                Color: ${car.color}<br>
                Daily Rate: $${car.dailyRate}<br>
                Status: ${car.status}
            </div>
        `;
    } else {
        carDetailsDiv.innerHTML = 'Car not found.';
    }
}

function updateBooking() {
    const rentalId = document.getElementById('rentalId').value;
    const newReturnDate = document.getElementById('newReturnDate').value;

    fetch(`http://localhost:3000/rentals/${rentalId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ returnDate: newReturnDate })
    })
    .then(res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        alert('Booking updated successfully!');
    })
    .catch(error => console.error('Error updating booking:', error));
}

function deleteBooking() {
    const rentalId = document.getElementById('deleteRentalId').value;

    fetch(`http://localhost:3000/rentals/${rentalId}`, {
        method: 'DELETE'
    })
    .then(res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        alert('Booking deleted successfully!');
    })
    .catch(error => console.error('Error deleting booking:', error));
}
