import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import MapView from './components/MapView';
import ReportForm from './components/ReportForm';
import Dashboard from './components/Dashboard';

function App() {
  const [reports, setReports] = useState([
    { id: 1, type: 'Congestion', severity: 'High', location: 'Main Gate', time: '10 mins ago' },
    { id: 2, type: 'Accident', severity: 'Critical', location: 'Block B Crossing', time: '1 hour ago' }
  ]);

  const handleNewReport = (report) => {
    setReports([report, ...reports]);
  };

  const [routeRequest, setRouteRequest] = useState(null);
  const [fromLoc, setFromLoc] = useState('');
  const [toLoc, setToLoc] = useState('');
  
  const fromRef = useRef(null);
  const toRef = useRef(null);

  useEffect(() => {
    if (window.google && !routeRequest) {
      const fromAutocomplete = new window.google.maps.places.Autocomplete(fromRef.current);
      fromAutocomplete.addListener('place_changed', () => {
        const place = fromAutocomplete.getPlace();
        setFromLoc(place.formatted_address || place.name);
      });

      const toAutocomplete = new window.google.maps.places.Autocomplete(toRef.current);
      toAutocomplete.addListener('place_changed', () => {
        const place = toAutocomplete.getPlace();
        setToLoc(place.formatted_address || place.name);
      });
    }
  }, []);

  const handleRouteSearch = () => {
    if (fromLoc && toLoc) {
      setRouteRequest({ origin: fromLoc, destination: toLoc });
    }
  };

  return (
    <Router>
      <div className="app-container">
        {/* Sidebar */}
        <aside className="sidebar">
          <div className="glass-panel animate-fade-in" style={{ animationDelay: '0s' }}>
            <h1>🚦 Traffic Assistant</h1>
            <p>Smart neighborhood mobility insights</p>
          </div>
          
          <div className="glass-panel animate-fade-in" style={{ animationDelay: '0.05s', padding: '16px' }}>
            <h2 style={{ marginBottom: '12px' }}>Find Route</h2>
            <div style={{ display: 'flex', gap: '8px', flexDirection: 'column' }}>
              <input 
                ref={fromRef}
                type="text" 
                placeholder="From..." 
                value={fromLoc} 
                onChange={e => setFromLoc(e.target.value)} 
                style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--surface-border)', background: 'rgba(255,255,255,0.05)', color: 'white' }}
              />
              <input 
                ref={toRef}
                type="text" 
                placeholder="To..." 
                value={toLoc} 
                onChange={e => setToLoc(e.target.value)} 
                style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--surface-border)', background: 'rgba(255,255,255,0.05)', color: 'white' }}
              />
              <button onClick={handleRouteSearch} style={{ padding: '10px', marginTop: '4px' }}>
                Show Route
              </button>
            </div>
          </div>

          <div className="glass-panel animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <Dashboard reports={reports} />
          </div>

          <div className="glass-panel animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <ReportForm onSubmit={handleNewReport} />
          </div>
        </aside>

        {/* Main Map View */}
        <main className="map-container animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <MapView reports={reports} routeRequest={routeRequest} />
        </main>
      </div>
    </Router>
  );
}

export default App;
