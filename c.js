let database = {
    cars: [],
    rentals: [],
};

// Fetch initial car data
fetch('http://localhost:3000/posts')
    .then((res) => {
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            throw new TypeError("Oops, we haven't got JSON!");
        }
        return res.json();
    })
    .then((data) => {
        database.cars = data; // Assuming the fetched data is an array of cars
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

    const newCar = {
        make,
        model,
        year,
        color,
        dailyRate,
        status: "Available"
    };

    // POST request to add a new car
    fetch('http://localhost:3000/posts', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newCar)
    })
    .then(res => {
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
    })
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
                <button onclick="viewCarDetails('${car.id}')">View Details</button>
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
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ returnDate: newReturnDate })
    })
    .then(res => {
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
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
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        alert('Booking deleted successfully!');
    })
    .catch(error => console.error('Error deleting booking:', error));
}