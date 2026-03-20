import React, { useState } from 'react';
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

  return (
    <Router>
      <div className="app-container">
        {/* Sidebar */}
        <aside className="sidebar">
          <div className="glass-panel animate-fade-in" style={{ animationDelay: '0s' }}>
            <h1>🚦 Traffic Assistant</h1>
            <p>Smart neighborhood mobility insights</p>
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
          <MapView reports={reports} />
        </main>
      </div>
    </Router>
  );
}

export default App;
