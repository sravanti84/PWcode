import React, { useEffect, useRef, useState } from 'react';
import { Wrapper, Status } from '@googlemaps/react-wrapper';

const MapComponent = ({ reports, routeRequest, selectedRouteIndex, onRoutesFound }) => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [directionsRenderers, setDirectionsRenderers] = useState([]);

  // Default Center
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
      markers.forEach(m => m.setMap(null));
      const newMarkers = reports.map((r) => {
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

  useEffect(() => {
    if (map && routeRequest) {
      // Clear old renderers
      directionsRenderers.forEach(r => r.setMap(null));
      
      const directionsService = new window.google.maps.DirectionsService();
      directionsService.route(
        {
          origin: routeRequest.origin,
          destination: routeRequest.destination,
          travelMode: window.google.maps.TravelMode.DRIVING,
          provideRouteAlternatives: true
        },
        (result, status) => {
          if (status === window.google.maps.DirectionsStatus.OK) {
            const newRenderers = result.routes.map((route, index) => {
              const renderer = new window.google.maps.DirectionsRenderer({
                map: map,
                directions: result,
                routeIndex: index,
                suppressMarkers: index !== 0, // Only show markers for primary or one route to avoid clutter
                polylineOptions: {
                  strokeColor: index === (selectedRouteIndex || 0) ? '#3b82f6' : '#94a3b8',
                  strokeOpacity: index === (selectedRouteIndex || 0) ? 1.0 : 0.5,
                  strokeWeight: index === (selectedRouteIndex || 0) ? 6 : 4,
                  zIndex: index === (selectedRouteIndex || 0) ? 100 : 1
                }
              });
              return renderer;
            });
            setDirectionsRenderers(newRenderers);
            
            if (onRoutesFound) {
              onRoutesFound(result.routes.map(r => ({
                summary: r.summary,
                duration: r.legs[0].duration.text,
                distance: r.legs[0].distance.text
              })));
            }
          } else {
            console.error(`error fetching directions ${status}`);
            alert('Could not calculate routes. Please check the locations.');
          }
        }
      );
    }
  }, [map, routeRequest, selectedRouteIndex]);

  return <div ref={mapRef} style={{ width: '100%', height: '100%', borderRadius: '16px' }} />;
};

const MapView = ({ reports, routeRequest, selectedRouteIndex, onRoutesFound }) => {
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', background: '#1e293b' }}>
      <MapComponent 
        reports={reports} 
        routeRequest={routeRequest} 
        selectedRouteIndex={selectedRouteIndex}
        onRoutesFound={onRoutesFound}
      />
    </div>
  );
};

export default MapView;
