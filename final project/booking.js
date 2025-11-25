const bookingForm = document.querySelector('#bookingForm');
const flightSummary = document.querySelector('#flightSummary');
const flightSummaryCard = document.querySelector('#flightSummaryCard');
const passengerForms = document.querySelector('#passengerForms');
const paymentSummary = document.querySelector('#paymentSummary');

let bookingData = null;

const loadBookingData = () => {
  const stored = localStorage.getItem('bookingData');
  if (!stored) {
    window.location.href = 'search.html';
    return;
  }

  bookingData = JSON.parse(stored);
  displayFlightSummary();
  displayPassengerForms();
  displayPaymentSummary();
};

const displayFlightSummary = () => {
  const { flight, passengers, origin, destination, departDate } = bookingData;
  
  flightSummary.innerHTML = `
    <div class="booking-detail-item">
      <span class="booking-detail-label">Airline</span>
      <span class="booking-detail-value">${flight.airline}</span>
    </div>
    <div class="booking-detail-item">
      <span class="booking-detail-label">Flight Number</span>
      <span class="booking-detail-value">${flight.flightNumber}</span>
    </div>
    <div class="booking-detail-item">
      <span class="booking-detail-label">Route</span>
      <span class="booking-detail-value">${origin} → ${destination}</span>
    </div>
    <div class="booking-detail-item">
      <span class="booking-detail-label">Departure</span>
      <span class="booking-detail-value">${formatDate(flight.departure.date)} at ${formatTime(flight.departure.time)}</span>
    </div>
    <div class="booking-detail-item">
      <span class="booking-detail-label">Arrival</span>
      <span class="booking-detail-value">${formatDate(flight.arrival.date)} at ${formatTime(flight.arrival.time)}</span>
    </div>
    <div class="booking-detail-item">
      <span class="booking-detail-label">Duration</span>
      <span class="booking-detail-value">${flight.duration}</span>
    </div>
    <div class="booking-detail-item">
      <span class="booking-detail-label">Aircraft</span>
      <span class="booking-detail-value">${flight.aircraft}</span>
    </div>
    <div class="booking-detail-item">
      <span class="booking-detail-label">Passengers</span>
      <span class="booking-detail-value">${passengers}</span>
    </div>
  `;
};

const displayPassengerForms = () => {
  const { passengers } = bookingData;
  passengerForms.innerHTML = '';

  for (let i = 1; i <= passengers; i++) {
    const passengerForm = document.createElement('div');
    passengerForm.className = 'passenger-form';
    passengerForm.innerHTML = `
      <h4>Passenger ${i} ${i === 1 ? '(Primary)' : ''}</h4>
      <div class="form-row">
        <div class="input-group">
          <label class="label">First Name</label>
          <input type="text" class="input" name="firstName${i}" required placeholder="John">
        </div>
        <div class="input-group">
          <label class="label">Last Name</label>
          <input type="text" class="input" name="lastName${i}" required placeholder="Doe">
        </div>
      </div>
      <div class="form-row">
        <div class="input-group">
          <label class="label">Date of Birth</label>
          <input type="date" class="input" name="dob${i}" required>
        </div>
        <div class="input-group">
          <label class="label">Passport Number</label>
          <input type="text" class="input" name="passport${i}" required placeholder="A12345678">
        </div>
      </div>
    `;
    passengerForms.appendChild(passengerForm);
  }
};

const displayPaymentSummary = () => {
  const { flight, passengers } = bookingData;
  const basePrice = flight.price * passengers;
  const tax = Math.round(basePrice * 0.15);
  const serviceFee = 25;
  const total = basePrice + tax + serviceFee;

  paymentSummary.innerHTML = `
    <div class="payment-summary-item">
      <span>Base Fare (${passengers} passenger${passengers !== 1 ? 's' : ''})</span>
      <span>$${basePrice.toLocaleString()}</span>
    </div>
    <div class="payment-summary-item">
      <span>Taxes & Fees</span>
      <span>$${tax.toLocaleString()}</span>
    </div>
    <div class="payment-summary-item">
      <span>Service Fee</span>
      <span>$${serviceFee.toLocaleString()}</span>
    </div>
    <div class="payment-summary-item">
      <span>Total Amount</span>
      <span>$${total.toLocaleString()}</span>
    </div>
  `;
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
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

const handleBooking = (e) => {
  e.preventDefault();
  
  if (!bookingData) return;

  const formData = new FormData(e.target);
  const contactEmail = document.querySelector('#contactEmail').value;
  const contactPhone = document.querySelector('#contactPhone').value;

  const basePrice = bookingData.flight.price * bookingData.passengers;
  const tax = Math.round(basePrice * 0.15);
  const serviceFee = 25;
  const total = basePrice + tax + serviceFee;

  const confirmationData = {
    ...bookingData,
    contactEmail,
    contactPhone,
    basePrice,
    tax,
    serviceFee,
    total,
    bookingReference: `SKW${Date.now()}`,
    bookingDate: new Date().toISOString(),
    passengers: Array.from({ length: bookingData.passengers }, (_, i) => {
      const num = i + 1;
      return {
        firstName: formData.get(`firstName${num}`),
        lastName: formData.get(`lastName${num}`),
        dob: formData.get(`dob${num}`),
        passport: formData.get(`passport${num}`),
      };
    }),
  };

  localStorage.setItem('confirmationData', JSON.stringify(confirmationData));
  window.location.href = 'confirmation.html';
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadBookingData);
} else {
  loadBookingData();
}

bookingForm.addEventListener('submit', handleBooking);

