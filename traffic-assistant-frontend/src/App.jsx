import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Wrapper, Status } from '@googlemaps/react-wrapper';
import MapView from './components/MapView';
import ReportForm from './components/ReportForm';
import Dashboard from './components/Dashboard';

const render = (status) => {
  if (status === Status.LOADING) return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', background: '#0f172a', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
      <div className="animate-pulse">Loading Intelligent Mobility...</div>
    </div>
  );
  if (status === Status.FAILURE) return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', background: '#0f172a', alignItems: 'center', justifyContent: 'center', color: '#ef4444' }}>
      <div>Maps API Error. Please check your API/Network.</div>
    </div>
  );
  return null;
};

function AppContent({ reports, handleNewReport, routeRequest, setRouteRequest }) {
  const [fromLoc, setFromLoc] = useState('');
  const [toLoc, setToLoc] = useState('');
  const [alternativeRoutes, setAlternativeRoutes] = useState([]);
  const [selectedRouteIndex, setSelectedRouteIndex] = useState(0);
  const [smartVerdict, setSmartVerdict] = useState(null);
  const [analyzingRoutes, setAnalyzingRoutes] = useState(false);
  
  const fromRef = useRef(null);
  const toRef = useRef(null);

  useEffect(() => {
    // This is now safe because AppContent only mounts after Status.SUCCESS
    if (window.google) {
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
      setAlternativeRoutes([]);
      setSelectedRouteIndex(0);
      setSmartVerdict(null);
      setRouteRequest({ origin: fromLoc, destination: toLoc });
    }
  };

  const handleRoutesFound = async (routes) => {
    setAlternativeRoutes(routes);
    setAnalyzingRoutes(true);
    
    try {
      const response = await fetch('https://traffic-assistant-backend-788713020207.us-central1.run.app/api/analyze/route', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ routes, reports })
      });
      const data = await response.json();
      if (data.success) {
        setSmartVerdict(data.analysis);
        if (data.analysis.recommended_route_index !== undefined) {
          setSelectedRouteIndex(data.analysis.recommended_route_index);
        }
      }
    } catch (err) {
      console.error('Failed to fetch AI verdict:', err);
    } finally {
      setAnalyzingRoutes(false);
    }
  };

  return (
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

        {alternativeRoutes.length > 0 && (
          <div className="glass-panel animate-fade-in" style={{ animationDelay: '0.1s', padding: '16px' }}>
            <h3 style={{ marginBottom: '12px', fontSize: '1rem' }}>Route Options</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {alternativeRoutes.map((route, idx) => (
                <div 
                  key={idx}
                  onClick={() => setSelectedRouteIndex(idx)}
                  className={`route-option ${selectedRouteIndex === idx ? 'active' : ''}`}
                  style={{ 
                    padding: '10px', 
                    borderRadius: '8px', 
                    cursor: 'pointer',
                    background: selectedRouteIndex === idx ? 'rgba(59, 130, 246, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                    border: `1px solid ${selectedRouteIndex === idx ? '#3b82f6' : 'transparent'}`,
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                    <span>Route {idx + 1}</span>
                    <span style={{ color: idx === 0 ? 'var(--success)' : 'var(--text-muted)' }}>
                      {idx === 0 ? 'Fastest' : 'Alternative'}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    {route.duration} • {route.distance}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {analyzingRoutes && (
          <div className="glass-panel animate-fade-in" style={{ padding: '16px', background: 'rgba(59, 130, 246, 0.05)' }}>
            <p style={{ fontSize: '0.85rem', color: '#60a5fa' }} className="animate-pulse">
              🔍 AI Analyzing community reports for best path...
            </p>
          </div>
        )}

        {smartVerdict && (
          <div className="glass-panel animate-fade-in" style={{ padding: '16px', background: 'rgba(59, 130, 246, 0.1)', border: '1px solid #3b82f6' }}>
            <h3 style={{ fontSize: '0.9rem', marginBottom: '8px', color: '#60a5fa', display: 'flex', alignItems: 'center', gap: '6px' }}>
              ✨ Smart Verdict
            </h3>
            <p style={{ fontSize: '0.85rem', lineHeight: '1.4' }}>{smartVerdict.verdict}</p>
            <p style={{ fontSize: '0.75rem', marginTop: '8px', color: 'var(--text-muted)', fontStyle: 'italic' }}>
              Reason: {smartVerdict.reasoning}
            </p>
          </div>
        )}

        <div className="glass-panel animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <ReportForm onSubmit={handleNewReport} />
        </div>
      </aside>

      {/* Main Map View */}
      <main className="map-container animate-fade-in" style={{ animationDelay: '0.3s' }}>
        <MapView 
          reports={reports} 
          routeRequest={routeRequest} 
          selectedRouteIndex={selectedRouteIndex}
          onRoutesFound={handleRoutesFound}
        />
      </main>
    </div>
  );
}

function App() {
  const [reports, setReports] = useState([
    { id: 1, type: 'Congestion', severity: 'High', location: 'Main Gate', time: '10 mins ago' },
    { id: 2, type: 'Accident', severity: 'Critical', location: 'Block B Crossing', time: '1 hour ago' }
  ]);
  const [routeRequest, setRouteRequest] = useState(null);

  const handleNewReport = (report) => {
    setReports([report, ...reports]);
  };

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  return (
    <Router>
      <Wrapper apiKey={apiKey} libraries={["places", "geometry"]} render={render}>
        <AppContent 
          reports={reports} 
          handleNewReport={handleNewReport} 
          routeRequest={routeRequest}
          setRouteRequest={setRouteRequest}
        />
      </Wrapper>
    </Router>
  );
}

export default App;
