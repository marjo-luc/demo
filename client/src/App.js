import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import axios from 'axios';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import 'leaflet-draw';
import './App.css';

// Helper component to add drawing controls
function DrawControl({ onCreated }) {
  const map = useMap();
  useEffect(() => {
    const drawnItems = new L.FeatureGroup();
    map.addLayer(drawnItems);
    const drawControl = new L.Control.Draw({
      edit: { featureGroup: drawnItems },
      draw: {
        polygon: true,
        polyline: true,
        rectangle: true,
        circle: true,
        marker: true,
        circlemarker: false
      }
    });
    map.addControl(drawControl);
    map.on(L.Draw.Event.CREATED, function (e) {
      drawnItems.addLayer(e.layer);
      if (onCreated) onCreated(e);
    });
    // Cleanup
    return () => {
      map.removeControl(drawControl);
      map.removeLayer(drawnItems);
    };
  }, [map, onCreated]);
  return null;
}

function App() {
  const [populationData, setPopulationData] = useState({});
  const [geoJsonData, setGeoJsonData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedState, setSelectedState] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch population data from our API
        const populationResponse = await axios.get('/api/population-data');
        setPopulationData(populationResponse.data);

        // Try to fetch GeoJSON data from external source, fallback to local if needed
        try {
          const geoJsonResponse = await axios.get('https://raw.githubusercontent.com/PublicaMundi/MappingAPI/master/data/geojson/us-states.json');
          setGeoJsonData(geoJsonResponse.data);
        } catch (geoError) {
          console.error('External GeoJSON failed, trying local file:', geoError);
          const localGeoJsonResponse = await axios.get('/us-states.json');
          setGeoJsonData(localGeoJsonResponse.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getDensityColor = (density) => {
    if (density > 2000) return '#800026';
    if (density > 1000) return '#BD0026';
    if (density > 500) return '#E31A1C';
    if (density > 200) return '#FC4E2A';
    if (density > 100) return '#FD8D3C';
    if (density > 50) return '#FEB24C';
    if (density > 20) return '#FED976';
    return '#FFEDA0';
  };

  const style = (feature) => {
    const stateId = feature.properties.STATE;
    const stateData = populationData[stateId];
    const density = stateData ? stateData.density : 0;
    
    return {
      fillColor: getDensityColor(density),
      weight: 2,
      opacity: 1,
      color: 'white',
      dashArray: '3',
      fillOpacity: 0.7
    };
  };

  const onEachFeature = (feature, layer) => {
    const stateId = feature.properties.STATE;
    const stateData = populationData[stateId];
    
    if (stateData) {
      layer.on({
        click: () => {
          setSelectedState({
            id: stateId,
            name: stateData.name,
            population: stateData.population.toLocaleString(),
            area: stateData.area.toLocaleString(),
            density: stateData.density.toFixed(1)
          });
        }
      });

      layer.bindPopup(`
        <div style="text-align: center;">
          <h3 style="margin: 0 0 10px 0; color: #333;">${stateData.name}</h3>
          <p style="margin: 5px 0; color: #666;">
            <strong>Population:</strong> ${stateData.population.toLocaleString()}
          </p>
          <p style="margin: 5px 0; color: #666;">
            <strong>Area:</strong> ${stateData.area.toLocaleString()} sq mi
          </p>
          <p style="margin: 5px 0; color: #666;">
            <strong>Density:</strong> ${stateData.density.toFixed(1)} people/sq mi
          </p>
        </div>
      `);
    }
  };

  if (loading) {
    return (
      <div className="app">
        <div className="loading">
          <h3>Loading Population Data...</h3>
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="header">
        <h1>US Population Density Map</h1>
        <p>Interactive visualization of population density by state across the United States</p>
        <a
          href="https://github.com/marjo-luc/demo"
          target="_blank"
          rel="noopener noreferrer"
          className="github-btn"
        >
          View on GitHub
        </a>
      </header>
      
      <div className="map-container">
        <MapContainer
          center={[39.8283, -98.5795]}
          zoom={4}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          
          {geoJsonData ? (
            <GeoJSON
              data={geoJsonData}
              style={style}
              onEachFeature={onEachFeature}
            />
          ) : (
            <div style={{ 
              position: 'absolute', 
              top: '50%', 
              left: '50%', 
              transform: 'translate(-50%, -50%)',
              background: 'white',
              padding: '20px',
              borderRadius: '8px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
              zIndex: 1000
            }}>
              <p>Loading map data...</p>
            </div>
          )}
          {/* Add drawing controls */}
          <DrawControl />
        </MapContainer>

        {selectedState && (
          <div className="info-panel">
            <h3>{selectedState.name}</h3>
            <p><span className="highlight">Population:</span> {selectedState.population}</p>
            <p><span className="highlight">Area:</span> {selectedState.area} sq mi</p>
            <p><span className="highlight">Density:</span> {selectedState.density} people/sq mi</p>
          </div>
        )}

        <div className="legend">
          <h4>Population Density (people/sq mi)</h4>
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#800026' }}></div>
            <span>2000+</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#BD0026' }}></div>
            <span>1000-2000</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#E31A1C' }}></div>
            <span>500-1000</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#FC4E2A' }}></div>
            <span>200-500</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#FD8D3C' }}></div>
            <span>100-200</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#FEB24C' }}></div>
            <span>50-100</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#FED976' }}></div>
            <span>20-50</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#FFEDA0' }}></div>
            <span>&lt;20</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App; 