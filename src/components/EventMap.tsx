import { useMemo, useState, useRef } from "react";
import Map, { Marker, NavigationControl } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";

import { events } from "../data/events";
import type { Event } from "../types/Events";
import EventMarker from "./EventMarker";
import ChatPanel from "./ChatPanel"

const MELBOURNE_CENTER = {
  latitude: -37.8136,
  longitude: 144.9631,
  zoom: 12,
};

export default function EventMap() {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [userLocation, setUserLocation] = useState({
    lat: -37.8136,
    lng: 144.9631,
  });
  const [previousView, setPreviousView] = useState<any>(null)

  const mapRef = useRef<any>(null);

  const markers = useMemo(
    () =>
      events.map((event) => (
        <Marker
          key={event.id}
          latitude={event.lat}
          longitude={event.lng}
          anchor="bottom"
        >
          <EventMarker event={event} onClick={(e) => flyToEvent(e)} />
        </Marker>
      )),
    []
  );

  const closeEvent = () => {

  const map = mapRef.current?.getMap()

  if (map && previousView) {
    map.flyTo({
      center: [previousView.lng, previousView.lat],
      zoom: previousView.zoom,
      duration: 1500
    })
  }

  setSelectedEvent(null)
}

  const flyToEvent = (event: Event) => {
    const map = mapRef.current?.getMap();

    if (!map) return;

    const center = map.getCenter()

  setPreviousView({
    lat: center.lat,
    lng: center.lng,
    zoom: map.getZoom()
  })

    map.flyTo({
      center: [event.lng, event.lat],
      zoom: 14,
      duration: 2000,
      essential: true,
    });

    setSelectedEvent(event);
  };

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
      <Map
        ref={mapRef}
        mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
        initialViewState={MELBOURNE_CENTER}
        mapStyle="mapbox://styles/mapbox/dark-v11"
        style={{ width: "100%", height: "100%" }}
        onClick={(e) =>
          setUserLocation({
            lat: e.lngLat.lat,
            lng: e.lngLat.lng,
          })
        }
      >
        <NavigationControl position="top-right" />
        <Marker
          latitude={userLocation.lat}
          longitude={userLocation.lng}
          anchor="center"
        >
          <div
            style={{
              width: 20,
              height: 20,
              borderRadius: "50%",
              background: "#3b82f6",
              border: "3px solid white",
              boxShadow: "0 0 12px rgba(59,130,246,0.8)",
              animation: "userPulse 2s infinite",
            }}
          />
        </Marker>
        {markers}
      </Map>

      {selectedEvent && <ChatPanel event={selectedEvent} onClose={closeEvent} />}

      {selectedEvent && (
  <div
    style={{
      position: "absolute",
      inset: 0,
      background: "rgba(0,0,0,0.25)",
      pointerEvents: "none"
    }}
  />
)}
    </div>
  );
}
