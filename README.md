# US Population Density Map

An interactive web application that displays US population density data by state using React and Node.js. The application features an interactive map with color-coded population density visualization.

## Features

- **Interactive Map**: Built with Leaflet.js and React-Leaflet
- **Population Density Visualization**: Color-coded states based on population density
- **Real-time Data**: Population data served from Node.js backend
- **Responsive Design**: Works on desktop and mobile devices
- **Interactive Popups**: Click on states to see detailed information
- **Legend**: Color-coded legend showing density ranges
- **Modern UI**: Beautiful gradient background and glass-morphism design

## Technology Stack

### Backend
- **Node.js** - Server runtime
- **Express.js** - Web framework
- **CORS** - Cross-origin resource sharing
- **Axios** - HTTP client

### Frontend
- **React** - UI library
- **React-Leaflet** - Map components
- **Leaflet.js** - Interactive maps
- **Axios** - HTTP client for API calls

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd us-population-density-map
   ```

2. **Install dependencies**
   ```bash
   # Install backend dependencies
   npm install
   
   # Install frontend dependencies
   cd client
   npm install
   cd ..
   ```

   Or use the convenience script:
   ```bash
   npm run install-all
   ```

## Running the Application

### Development Mode

1. **Start both frontend and backend simultaneously**
   ```bash
   npm run dev
   ```

   This will start:
   - Backend server on `http://localhost:5000`
   - React development server on `http://localhost:3000`

2. **Or run them separately**
   ```bash
   # Terminal 1 - Start backend
   npm run server
   
   # Terminal 2 - Start frontend
   npm run client
   ```

### Production Mode

1. **Build the React application**
   ```bash
   npm run build
   ```

2. **Start the production server**
   ```bash
   npm start
   ```

   The application will be available at `http://localhost:5000`

## API Endpoints

- `GET /api/population-data` - Returns all county population data
- `GET /api/population-data/:stateId` - Returns data for a specific state

## Data Structure

The application uses sample population data for US states with the following structure:

```json
{
  "06": {
    "name": "California",
    "population": 39538223,
    "area": 163694.74,
    "density": 241.7
  }
}
```

## Map Features

- **Zoom and Pan**: Standard map navigation
- **State Selection**: Click on states to view details
- **Color Coding**: States are colored based on population density:
  - Dark Red: 2000+ people/sq mi
  - Red: 1000-2000 people/sq mi
  - Orange-Red: 500-1000 people/sq mi
  - Orange: 200-500 people/sq mi
  - Light Orange: 100-200 people/sq mi
  - Yellow-Orange: 50-100 people/sq mi
  - Light Yellow: 20-50 people/sq mi
  - Very Light Yellow: <20 people/sq mi

## Project Structure

```
us-population-density-map/
├── server/
│   └── index.js              # Express server
├── client/
│   ├── public/
│   │   └── index.html        # HTML template
│   ├── src/
│   │   ├── App.js           # Main React component
│   │   ├── App.css          # Component styles
│   │   ├── index.js         # React entry point
│   │   └── index.css        # Global styles
│   └── package.json         # Frontend dependencies
├── package.json             # Backend dependencies
└── README.md               # This file
```

## Customization

### Adding More States

To add more states, update the `populationData` object in `server/index.js`:

```javascript
const populationData = {
  "06": { name: "California", population: 39538223, area: 163694.74, density: 241.7 },
  // Add more states here
};
```

### Changing Map Center

Update the `center` prop in the `MapContainer` component in `client/src/App.js`:

```javascript
<MapContainer
  center={[39.8283, -98.5795]} // [latitude, longitude]
  zoom={4}
>
```

### Modifying Color Scheme

Update the `getDensityColor` function in `client/src/App.js` to change the color mapping.

## Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge

## License

MIT License - feel free to use this project for educational or commercial purposes.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Troubleshooting

### Common Issues

1. **Port already in use**: Change the port in `server/index.js` or kill the process using the port
2. **CORS errors**: Ensure the backend is running and CORS is properly configured
3. **Map not loading**: Check if the GeoJSON URL is accessible and the data format is correct

### Getting Help

If you encounter any issues, please check the browser console for error messages and ensure all dependencies are properly installed. 