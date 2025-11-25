# Flight Booking Website

A modern, responsive flight booking application built with HTML, CSS, and JavaScript. Search for flights, view results, and complete bookings with a beautiful user interface.

## Features

- ✈️ **Flight Search**: Search flights by origin, destination, dates, and number of passengers
- 🔄 **Swap Destinations**: Quick swap button to reverse origin and destination
- 📅 **Date Selection**: Choose departure and optional return dates
- 🎫 **Flight Results**: View detailed flight information including:
  - Airline and flight number
  - Departure and arrival times
  - Flight duration
  - Aircraft type
  - Available seats
  - Pricing
- 📝 **Booking System**: Complete booking form with passenger information
- 💾 **API Integration**: Ready for AviationStack API integration
- 🎨 **Modern UI**: Beautiful, responsive design matching the project style

## Setup Instructions

### Option 1: Use Mock Data (Default)

The application is configured to use mock data by default, so you can start using it immediately without any API setup.

### Option 2: Use AviationStack API

1. **Get an API Key**:
   - Visit [AviationStack](https://aviationstack.com/)
   - Sign up for a free account
   - Get your API key from the dashboard

2. **Configure the API**:
   - Open `script.js`
   - Find the `API_CONFIG` object
   - Replace `'YOUR_API_KEY_HERE'` with your actual API key
   - Set `useMockData: false`

```javascript
const API_CONFIG = {
  apiKey: 'your-actual-api-key-here',
  baseUrl: 'https://api.aviationstack.com/v1',
  useMockData: false,
};
```

3. **Run the Application**:
   - Open `index.html` in a web browser
   - Or use a local server (recommended):
     ```bash
     # Using Python
     python -m http.server 8000
     
     # Using Node.js (http-server)
     npx http-server
     ```

## Usage

1. **Search for Flights**:
   - Enter origin and destination (city or airport code)
   - Select departure date
   - Optionally select return date
   - Choose number of passengers
   - Click "Search Flights"

2. **View Results**:
   - Browse available flights
   - See pricing, times, and flight details
   - Compare different options

3. **Book a Flight**:
   - Click "Book Now" on your preferred flight
   - Fill in passenger information
   - Confirm booking

## Airport Codes

Common airport codes you can use:
- **JFK** - New York (JFK)
- **LAX** - Los Angeles
- **LHR** - London Heathrow
- **CDG** - Paris Charles de Gaulle
- **DXB** - Dubai
- **NRT** - Tokyo Narita
- **SYD** - Sydney
- **SFO** - San Francisco
- **ORD** - Chicago O'Hare
- **MIA** - Miami

## File Structure

```
final project/
├── index.html      # Main HTML structure
├── styles.css      # Styling and layout
├── script.js       # JavaScript logic and API integration
└── README.md       # This file
```

## Browser Compatibility

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Notes

- The booking system is a frontend demonstration. In a production environment, you would need a backend server to process actual bookings.
- API rate limits may apply when using the free tier of AviationStack.
- Mock data is used when no API key is provided or when `useMockData` is set to `true`.

## Future Enhancements

- User authentication
- Saved searches and favorites
- Price alerts
- Multi-city trips
- Seat selection
- Payment integration
- Email confirmations

## License

This is a demonstration project for educational purposes.

