const searchForm = document.querySelector('#searchForm');
const originInput = document.querySelector('#origin');
const destinationInput = document.querySelector('#destination');
const departDateInput = document.querySelector('#departDate');
const returnDateInput = document.querySelector('#returnDate');
const passengersSelect = document.querySelector('#passengers');
const swapBtn = document.querySelector('#swapBtn');
const loading = document.querySelector('#loading');
const errorMessage = document.querySelector('#errorMessage');
const resultsSection = document.querySelector('#resultsSection');
const flightsList = document.querySelector('#flightsList');
const resultsCount = document.querySelector('#resultsCount');

// Set minimum date to today
const setMinDates = () => {
  const today = new Date().toISOString().split('T')[0];
  if (departDateInput) departDateInput.setAttribute('min', today);
  if (returnDateInput) returnDateInput.setAttribute('min', today);
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setMinDates);
} else {
  setMinDates();
}

// API Configuration
const API_CONFIG = {
  apiKey: 'YOUR_API_KEY_HERE',
  baseUrl: 'https://api.aviationstack.com/v1',
  useMockData: true,
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const formatTime = (timeString) => {
  if (!timeString) return 'N/A';
  const [hours, minutes] = timeString.split(':');
  const date = new Date();
  date.setHours(parseInt(hours), parseInt(minutes));
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });
};

const calculateDuration = (departure, arrival) => {
  if (!departure || !arrival) return 'N/A';
  const dep = new Date(`2000-01-01T${departure}`);
  const arr = new Date(`2000-01-01T${arrival}`);
  if (arr < dep) arr.setDate(arr.getDate() + 1);
  const diff = arr - dep;
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  return `${hours}h ${minutes}m`;
};

const generateMockFlights = (origin, destination, date) => {
  const airlines = ['American Airlines', 'Delta', 'United', 'JetBlue', 'Southwest', 'Emirates', 'British Airways'];
  const aircraft = ['Boeing 737', 'Airbus A320', 'Boeing 787', 'Airbus A350', 'Boeing 777'];
  
  const flights = [];
  const times = ['08:00', '10:30', '13:15', '15:45', '18:20', '21:00'];
  
  for (let i = 0; i < 6; i++) {
    const depTime = times[i];
    const arrHours = parseInt(depTime.split(':')[0]) + Math.floor(Math.random() * 4) + 2;
    const arrMins = Math.floor(Math.random() * 60);
    const arrTime = `${String(arrHours % 24).padStart(2, '0')}:${String(arrMins).padStart(2, '0')}`;
    
    flights.push({
      id: `FL${Date.now()}-${i}`,
      airline: airlines[Math.floor(Math.random() * airlines.length)],
      flightNumber: `${Math.floor(Math.random() * 9000) + 1000}`,
      aircraft: aircraft[Math.floor(Math.random() * aircraft.length)],
      departure: {
        airport: origin,
        time: depTime,
        date: date,
      },
      arrival: {
        airport: destination,
        time: arrTime,
        date: date,
      },
      duration: calculateDuration(depTime, arrTime),
      price: Math.floor(Math.random() * 500) + 200,
      available: Math.floor(Math.random() * 50) + 10,
    });
  }
  
  return flights.sort((a, b) => a.price - b.price);
};

const searchFlights = async (e) => {
  e.preventDefault();
  
  const origin = originInput.value.trim().toUpperCase();
  const destination = destinationInput.value.trim().toUpperCase();
  const departDate = departDateInput.value;
  const returnDate = returnDateInput.value;
  const passengers = parseInt(passengersSelect.value);

  if (!origin || !destination || !departDate) {
    showError('Please fill in all required fields.');
    return;
  }

  if (origin === destination) {
    showError('Origin and destination cannot be the same.');
    return;
  }

  loading.style.display = 'flex';
  errorMessage.style.display = 'none';
  resultsSection.style.display = 'none';

  try {
    let flights = [];

    if (API_CONFIG.useMockData || !API_CONFIG.apiKey || API_CONFIG.apiKey === 'YOUR_API_KEY_HERE') {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      flights = generateMockFlights(origin, destination, departDate);
    } else {
      const url = `${API_CONFIG.baseUrl}/flights?access_key=${API_CONFIG.apiKey}&dep_iata=${origin}&arr_iata=${destination}&flight_date=${departDate}`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.error) {
        throw new Error(data.error.info || 'API Error');
      }

      flights = data.data.map((flight, index) => ({
        id: `FL${Date.now()}-${index}`,
        airline: flight.airline?.name || 'Unknown Airline',
        flightNumber: flight.flight?.iata || flight.flight?.number || 'N/A',
        aircraft: flight.aircraft?.iata || 'N/A',
        departure: {
          airport: flight.departure?.iata || origin,
          time: flight.departure?.scheduled?.split('T')[1]?.substring(0, 5) || 'N/A',
          date: flight.departure?.scheduled?.split('T')[0] || departDate,
        },
        arrival: {
          airport: flight.arrival?.iata || destination,
          time: flight.arrival?.scheduled?.split('T')[1]?.substring(0, 5) || 'N/A',
          date: flight.arrival?.scheduled?.split('T')[0] || departDate,
        },
        duration: calculateDuration(
          flight.departure?.scheduled?.split('T')[1]?.substring(0, 5),
          flight.arrival?.scheduled?.split('T')[1]?.substring(0, 5)
        ),
        price: Math.floor(Math.random() * 500) + 200,
        available: Math.floor(Math.random() * 50) + 10,
      }));
    }

    displayFlights(flights, passengers, origin, destination, departDate, returnDate);
  } catch (error) {
    console.error('Error searching flights:', error);
    showError('Failed to search flights. Please try again or check your API configuration.');
  } finally {
    loading.style.display = 'none';
  }
};

const displayFlights = (flights, passengers, origin, destination, departDate, returnDate) => {
  if (flights.length === 0) {
    showError('No flights found for your search criteria.');
    return;
  }

  resultsCount.textContent = `Found ${flights.length} flight${flights.length !== 1 ? 's' : ''}`;
  flightsList.innerHTML = '';

  flights.forEach((flight) => {
    const flightCard = document.createElement('div');
    flightCard.className = 'flight-card';
    flightCard.innerHTML = `
      <div class="flight-header">
        <div class="airline-info">
          <h3>${flight.airline}</h3>
          <p class="flight-number">Flight ${flight.flightNumber}</p>
        </div>
        <div class="flight-price">
          <span class="price">$${flight.price}</span>
          <span class="price-label">per person</span>
        </div>
      </div>
      
      <div class="flight-details">
        <div class="flight-route">
          <div class="route-segment">
            <div class="time">${formatTime(flight.departure.time)}</div>
            <div class="airport">${flight.departure.airport}</div>
            <div class="date">${formatDate(flight.departure.date)}</div>
          </div>
          
          <div class="route-connector">
            <div class="duration">${flight.duration}</div>
            <div class="connector-line"></div>
          </div>
          
          <div class="route-segment">
            <div class="time">${formatTime(flight.arrival.time)}</div>
            <div class="airport">${flight.arrival.airport}</div>
            <div class="date">${formatDate(flight.arrival.date)}</div>
          </div>
        </div>
        
        <div class="flight-info">
          <span class="info-item">✈ Aircraft: ${flight.aircraft}</span>
          <span class="info-item">🪑 Seats Available: ${flight.available}</span>
        </div>
      </div>
      
      <button class="btn btn--primary btn--block" data-flight-id="${flight.id}">
        Book Now - $${flight.price * passengers}
      </button>
    `;

    const bookBtn = flightCard.querySelector('button');
    bookBtn.addEventListener('click', () => {
      const bookingData = {
        flight,
        passengers,
        origin,
        destination,
        departDate,
        returnDate,
      };
      localStorage.setItem('bookingData', JSON.stringify(bookingData));
      window.location.href = 'booking.html';
    });

    flightsList.appendChild(flightCard);
  });

  resultsSection.style.display = 'block';
  resultsSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
};

const showError = (message) => {
  errorMessage.textContent = message;
  errorMessage.style.display = 'block';
};

swapBtn.addEventListener('click', () => {
  const temp = originInput.value;
  originInput.value = destinationInput.value;
  destinationInput.value = temp;
});

searchForm.addEventListener('submit', searchFlights);

