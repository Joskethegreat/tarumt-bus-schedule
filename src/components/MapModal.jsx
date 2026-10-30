import { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import { createPortal } from "react-dom";
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

// The map's box is sized by the layout (it fills the phone screen), so Leaflet
// must re-measure whenever that box changes: rotation, address bar collapsing.
function ResizeWatcher() {
  const map = useMap();

  useEffect(() => {
    const el = map.getContainer();
    const observer = new ResizeObserver(() => map.invalidateSize());
    observer.observe(el);
    return () => observer.disconnect();
  }, [map]);

  return null;
}

const FOCUSABLE = 'button, a[href], [tabindex]:not([tabindex="-1"])';

export default function MapModal({ isOpen, onClose, note, subtitle }) {
  const { t } = useLanguage();
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [routeStops, setRouteStops] = useState([]);
  const [map, setMap] = useState(null);
  // Which pin's popup is open, keyed by that pin's first step number.
  const [selectedKey, setSelectedKey] = useState(null);

  const dialogRef = useRef(null);
  const closeBtnRef = useRef(null);
  const markerRefs = useRef({});
  const rowRefs = useRef({});

  useEffect(() => {
    if (!isOpen || !note) {
      setRouteCoordinates([]);
      setRouteStops([]);
      setSelectedKey(null);
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

    // Stops that share a spot (a loop's first and last) share one pin, named
    // after the earliest step. `key` ties each list row to its pin.
    validStops.forEach((s) => {
      s.key = validStops.find(
        (o) => o.coords.lat === s.coords.lat && o.coords.lng === s.coords.lng
      ).step;
    });

    setRouteCoordinates(coordinates);
    setRouteStops(validStops);
  }, [isOpen, note]);

  // Dialog behaviour: move focus in, give it back on close, Escape closes
  // (first the open stop popup, then the whole dialog).
  useEffect(() => {
    if (!isOpen) return;
    const previouslyFocused = document.activeElement;
    closeBtnRef.current?.focus();

    const onKey = (e) => {
      if (e.key !== "Escape") return;
      if (selectedKey !== null && map) map.closePopup();
      else onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      previouslyFocused?.focus?.();
    };
  }, [isOpen, onClose, map, selectedKey]);

  // Keep the highlighted list row in view when a pin is tapped.
  useEffect(() => {
    if (selectedKey === null) return;
    rowRefs.current[selectedKey]?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [selectedKey]);

  if (!isOpen) return null;

  function trapTab(e) {
    if (e.key !== "Tab" || !dialogRef.current) return;
    const items = [...dialogRef.current.querySelectorAll(FOCUSABLE)].filter(
      (el) => !el.disabled && el.offsetParent !== null
    );
    if (items.length === 0) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  // Tapping a list row centers its pin and opens the stop popup.
  function showStop(stop) {
    const marker = markerRefs.current[stop.key];
    if (!map || !marker) return;
    map.setView([stop.coords.lat, stop.coords.lng], Math.max(map.getZoom(), 15));
    marker.openPopup();
  }

  const center =
    routeCoordinates.length > 0
      ? [
          routeCoordinates.reduce((sum, c) => sum + c[0], 0) /
            routeCoordinates.length,
          routeCoordinates.reduce((sum, c) => sum + c[1], 0) /
            routeCoordinates.length,
        ]
      : [3.17, 101.58]; // Default center

  // Portal to <body>: an ancestor with backdrop-filter would otherwise trap
  // position:fixed inside itself, making the modal look embedded.
  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="map-modal-title"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={trapTab}
      >
        <div className="modal-header">
          <div className="modal-heading">
            <h2 id="map-modal-title">{t("routeMapTitle")}</h2>
            {subtitle && <p className="modal-subtitle">{subtitle}</p>}
          </div>
          <button
            type="button"
            className="close-btn"
            ref={closeBtnRef}
            onClick={onClose}
            aria-label={t("close")}
            title={t("close")}
          >
            ✕
          </button>
        </div>

        {routeCoordinates.length === 0 ? (
          <p className="no-data">
            {t("noRouteData")}
          </p>
        ) : (
          <>
            <MapContainer center={center} zoom={14} className="map-container" ref={setMap}>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; OpenStreetMap contributors'
              />
              <ResizeWatcher />
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
                    ref={(m) => {
                      if (m) markerRefs.current[stop.key] = m;
                    }}
                    eventHandlers={{
                      popupopen: () => setSelectedKey(stop.key),
                      popupclose: () =>
                        setSelectedKey((k) => (k === stop.key ? null : k)),
                    }}
                  >
                    {/* No built-in X (24px, hard to hit): tap the map, press Esc or tap another stop to dismiss. */}
                    <Popup closeButton={false}>
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
                {routeStops.map((stop) => (
                  <li
                    key={stop.step}
                    className={stop.key === selectedKey ? "active" : ""}
                    ref={(el) => {
                      if (el && stop.step === stop.key) rowRefs.current[stop.key] = el;
                    }}
                  >
                    <button type="button" onClick={() => showStop(stop)}>
                      <strong>{stop.step}.</strong> {stop.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}

        {/* Phones: a big Close bar at the bottom, where the thumb rests. */}
        <button type="button" className="close-bar" onClick={onClose}>
          {t("close")}
        </button>
      </div>
    </div>,
    document.body
  );
}
