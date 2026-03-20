import React, { useEffect, useRef, useState } from 'react';
import { Wrapper, Status } from '@googlemaps/react-wrapper';

const MapComponent = ({ reports }) => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);

  // Default Center (e.g., Delhi, India or a general coordinates)
  const center = { lat: 28.6139, lng: 77.2090 };
  const zoom = 14;

  useEffect(() => {
    if (mapRef.current && !map) {
      setMap(new window.google.maps.Map(mapRef.current, {
        center,
        zoom,
        styles: [ 
          { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
          { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
          { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
          { featureType: "road", elementType: "geometry", stylers: [{ color: "#38414e" }] },
          { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#212a37" }] },
          { featureType: "water", elementType: "geometry", stylers: [{ color: "#17263c" }] }
        ],
        disableDefaultUI: true
      }));
    }
  }, [mapRef, map]);

  useEffect(() => {
    if (map && reports) {
      // Clear old markers
      markers.forEach(m => m.setMap(null));
      
      const newMarkers = reports.map((r, i) => {
        // Offset coordinates slightly so overlapping reports show up independently for demo
        const latOffset = (Math.random() - 0.5) * 0.01;
        const lngOffset = (Math.random() - 0.5) * 0.01;
        
        return new window.google.maps.Marker({
          position: { lat: center.lat + latOffset, lng: center.lng + lngOffset },
          map: map,
          title: r.type,
          icon: r.severity === 'Critical' 
            ? 'http://maps.google.com/mapfiles/ms/icons/red-dot.png' 
            : 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png',
          animation: window.google.maps.Animation.DROP,
        });
      });

      setMarkers(newMarkers);
    }
  }, [map, reports]);

  return <div ref={mapRef} style={{ width: '100%', height: '100%', borderRadius: '16px' }} />;
};

const render = (status) => {
  if (status === Status.LOADING) return <div style={{ color: 'white', padding: '20px' }}>Loading Live Map...</div>;
  if (status === Status.FAILURE) return <div style={{ color: 'white', padding: '20px' }}>Error loading mapping services.</div>;
  return null;
};

const MapView = ({ reports }) => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return <div style={{ color: 'white', padding: '20px' }}>Please provide VITE_GOOGLE_MAPS_API_KEY in frontend .env</div>;
  }

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', background: '#1e293b' }}>
      <Wrapper apiKey={apiKey}>
        <MapComponent reports={reports} />
      </Wrapper>
    </div>
  );
};

export default MapView;
