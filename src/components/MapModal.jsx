import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import L from "leaflet";
import { locations } from "../data/locations";
import "../styles/MapModal.css";
import googleMapsIcon from "../assets/google-maps-icon.png";
import { useLanguage } from "../context/LanguageContext";

function numberedIcon(label) {
  const fontSize = label.length > 3 ? "0.6rem" : "0.75rem";
  return L.divIcon({
    className: "numbered-marker",
    html: `<div class="numbered-marker-pin"><span style="font-size: ${fontSize}">${label}</span></div>`,
    iconSize: [30, 42],
    iconAnchor: [15, 42],
    popupAnchor: [0, -38],
  });
}

function bearing([lat1, lng1], [lat2, lng2]) {
  const toRad = (d) => (d * Math.PI) / 180;
  const toDeg = (r) => (r * 180) / Math.PI;
  const y = Math.sin(toRad(lng2 - lng1)) * Math.cos(toRad(lat2));
  const x =
    Math.cos(toRad(lat1)) * Math.sin(toRad(lat2)) -
    Math.sin(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.cos(toRad(lng2 - lng1));
  return (toDeg(Math.atan2(y, x)) + 360) % 360;
}

function arrowIcon(angle) {
  return L.divIcon({
    className: "direction-arrow",
    html: `<div class="direction-arrow-icon" style="transform: rotate(${angle}deg)">&#9650;</div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });
}

export default function MapModal({ isOpen, onClose, note }) {
  const { t } = useLanguage();
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
          <h2>{t("routeMapTitle")}</h2>
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        {routeCoordinates.length === 0 ? (
          <p className="no-data">
            {t("noRouteData")}
          </p>
        ) : (
          <>
            <MapContainer center={center} zoom={14} className="map-container">
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; OpenStreetMap contributors'
              />
              <Polyline positions={routeCoordinates} color="blue" weight={3} />

              {routeCoordinates.slice(0, -1).map((start, idx) => {
                const end = routeCoordinates[idx + 1];
                const mid = [
                  (start[0] + end[0]) / 2,
                  (start[1] + end[1]) / 2,
                ];
                const angle = bearing(start, end);
                return (
                  <Marker
                    key={`arrow-${idx}`}
                    position={mid}
                    icon={arrowIcon(angle)}
                    interactive={false}
                  />
                );
              })}

              {routeStops.map((stop, idx) => {
                const stopsAtLocation = routeStops.filter(s =>
                  s.coords.lat === stop.coords.lat && s.coords.lng === stop.coords.lng
                );
                const isFirstAtLocation = stopsAtLocation[0] === stop;

                if (!isFirstAtLocation) return null;

                const steps = stopsAtLocation.map(s => s.step).join(" and ");
                const pinLabel = stopsAtLocation.map(s => s.step).join("/");

                return (
                  <Marker
                    key={idx}
                    position={[stop.coords.lat, stop.coords.lng]}
                    icon={numberedIcon(pinLabel)}
                  >
                    <Popup>
                      <div className="popup-content">
                        <strong>{t("stopLabel")} {steps}</strong>
                        <p>{stop.name}</p>
                        <a
                          className="gmaps-directions-link"
                          href={`https://www.google.com/maps/dir/?api=1&destination=${stop.coords.lat},${stop.coords.lng}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <img src={googleMapsIcon} alt="" className="gmaps-icon" />
                          {t("viewDirection")}
                        </a>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}
            </MapContainer>

            <div className="stops-list">
              <h3>{t("routeStopsHeading")}</h3>
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
