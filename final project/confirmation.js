const bookingDetails = document.querySelector('#bookingDetails');
const bookingDetailsCard = document.querySelector('#bookingDetailsCard');

const loadConfirmationData = () => {
  const stored = localStorage.getItem('confirmationData');
  if (!stored) {
    window.location.href = 'search.html';
    return;
  }

  const data = JSON.parse(stored);
  displayConfirmation(data);
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

const displayConfirmation = (data) => {
  bookingDetails.innerHTML = `
    <div class="booking-detail-item">
      <span class="booking-detail-label">Booking Reference</span>
      <span class="booking-detail-value" style="color: var(--primary); font-weight: 700; font-size: 1.1rem;">${data.bookingReference}</span>
    </div>
    <div class="booking-detail-item">
      <span class="booking-detail-label">Airline</span>
      <span class="booking-detail-value">${data.flight.airline}</span>
    </div>
    <div class="booking-detail-item">
      <span class="booking-detail-label">Flight Number</span>
      <span class="booking-detail-value">${data.flight.flightNumber}</span>
    </div>
    <div class="booking-detail-item">
      <span class="booking-detail-label">Route</span>
      <span class="booking-detail-value">${data.origin} → ${data.destination}</span>
    </div>
    <div class="booking-detail-item">
      <span class="booking-detail-label">Departure</span>
      <span class="booking-detail-value">${formatDate(data.flight.departure.date)} at ${formatTime(data.flight.departure.time)}</span>
    </div>
    <div class="booking-detail-item">
      <span class="booking-detail-label">Arrival</span>
      <span class="booking-detail-value">${formatDate(data.flight.arrival.date)} at ${formatTime(data.flight.arrival.time)}</span>
    </div>
    <div class="booking-detail-item">
      <span class="booking-detail-label">Duration</span>
      <span class="booking-detail-value">${data.flight.duration}</span>
    </div>
    <div class="booking-detail-item">
      <span class="booking-detail-label">Passengers</span>
      <span class="booking-detail-value">${data.passengers.length}</span>
    </div>
    <div class="booking-detail-item">
      <span class="booking-detail-label">Contact Email</span>
      <span class="booking-detail-value">${data.contactEmail}</span>
    </div>
    <div class="booking-detail-item">
      <span class="booking-detail-label">Contact Phone</span>
      <span class="booking-detail-value">${data.contactPhone}</span>
    </div>
    <div class="booking-detail-item" style="border-top: 2px solid var(--border); margin-top: 1rem; padding-top: 1.5rem;">
      <span class="booking-detail-label" style="font-size: 1.2rem;">Total Amount Paid</span>
      <span class="booking-detail-value" style="font-size: 1.5rem; color: var(--primary); font-weight: 700;">$${data.total.toLocaleString()}</span>
    </div>
  `;
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadConfirmationData);
} else {
  loadConfirmationData();
}

