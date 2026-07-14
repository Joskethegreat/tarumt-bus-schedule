import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import L from "leaflet";
import { locations } from "../data/locations";
import "../styles/MapModal.css";

// Fix for default markers not showing in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

export default function MapModal({ isOpen, onClose, note }) {
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [routeStops, setRouteStops] = useState([]);

  useEffect(() => {
    if (!isOpen || !note) {
      setRouteCoordinates([]);
      setRouteStops([]);
      return;
    }

    // Parse the note to extract location names
    const stops = note
      .split(">")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    // Match locations and get coordinates
    const coordinates = [];
    const validStops = [];

    stops.forEach((stop, index) => {
      const location = locations[stop];
      if (location) {
        coordinates.push([location.lat, location.lng]);
        validStops.push({ name: stop, step: index + 1, coords: location });
      }
    });

    setRouteCoordinates(coordinates);
    setRouteStops(validStops);
  }, [isOpen, note]);

  if (!isOpen) return null;

  const center =
    routeCoordinates.length > 0
      ? [
          routeCoordinates.reduce((sum, c) => sum + c[0], 0) /
            routeCoordinates.length,
          routeCoordinates.reduce((sum, c) => sum + c[1], 0) /
            routeCoordinates.length,
        ]
      : [3.17, 101.58]; // Default center

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Route Map</h2>
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        {routeCoordinates.length === 0 ? (
          <p className="no-data">
            Could not find coordinates for this route. Please check location
            names.
          </p>
        ) : (
          <>
            <MapContainer center={center} zoom={14} className="map-container">
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; OpenStreetMap contributors'
              />
              <Polyline positions={routeCoordinates} color="blue" weight={3} />

              {routeStops.map((stop, idx) => {
                const stopsAtLocation = routeStops.filter(s =>
                  s.coords.lat === stop.coords.lat && s.coords.lng === stop.coords.lng
                );
                const isFirstAtLocation = stopsAtLocation[0] === stop;

                if (!isFirstAtLocation) return null;

                const steps = stopsAtLocation.map(s => s.step).join(" and ");

                return (
                  <Marker key={idx} position={[stop.coords.lat, stop.coords.lng]}>
                    <Popup>
                      <div className="popup-content">
                        <strong>Stop {steps}</strong>
                        <p>{stop.name}</p>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}
            </MapContainer>

            <div className="stops-list">
              <h3>Route Stops:</h3>
              <ul>
                {routeStops.map((stop, idx) => (
                  <li key={idx}>
                    <strong>{stop.step}.</strong> {stop.name}
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
