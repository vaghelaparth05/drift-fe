import { useMemo, useState, useRef, useEffect } from "react";
import Map, { Marker, NavigationControl } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";

import { events } from "../data/events";
import type { Event } from "../types/Events";
import EventMarker from "./EventMarker";
import ChatPanel from "./ChatPanel";

const MELBOURNE_CENTER = {
  latitude: -37.8136,
  longitude: 144.9631,
  zoom: 12,
};

const menuItems = [
  {
    label: "About Us",
    icon: (
      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
      </svg>
    ),
    description: "Our story & mission",
  },
  {
    label: "Explore",
    icon: (
      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /><path d="M2 12h20" />
      </svg>
    ),
    description: "Discover events near you",
  },
  {
    label: "Sign In",
    icon: (
      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" /><polyline points="10 17 15 12 10 7" /><line x1="15" y1="12" x2="3" y2="12" />
      </svg>
    ),
    description: "Access your account",
  },
  {
    label: "Sign Up",
    icon: (
      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><line x1="19" y1="8" x2="19" y2="14" /><line x1="22" y1="11" x2="16" y2="11" />
      </svg>
    ),
    description: "Create a new account",
    highlight: true,
  },
];

export default function EventMap() {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationStatus, setLocationStatus] = useState<"idle" | "loading" | "granted" | "denied">("idle");
  const [previousView, setPreviousView] = useState<any>(null);
  const mapRef = useRef<any>(null);
  const watchIdRef = useRef<number | null>(null);

  // ── Live geolocation ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationStatus("denied");
      return;
    }

    setLocationStatus("loading");

    // Get initial position fast
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        setUserLocation({ lat, lng });
        setLocationStatus("granted");

        // Fly to user on first load
        const map = mapRef.current?.getMap();
        if (map) {
          map.flyTo({ center: [lng, lat], zoom: 13, duration: 2200, essential: true });
        }
      },
      () => setLocationStatus("denied"),
      { enableHighAccuracy: true, timeout: 8000 }
    );

    // Watch for live updates
    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocationStatus("granted");
      },
      () => {},
      { enableHighAccuracy: true, maximumAge: 5000 }
    );

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  const markers = useMemo(
    () =>
      events.map((event) => (
        <Marker key={event.id} latitude={event.lat} longitude={event.lng} anchor="bottom">
          <EventMarker event={event} onClick={(e) => flyToEvent(e)} />
        </Marker>
      )),
    []
  );

  const closeEvent = () => {
    const map = mapRef.current?.getMap();
    if (map && previousView) {
      map.flyTo({ center: [previousView.lng, previousView.lat], zoom: previousView.zoom, duration: 1500 });
    }
    setSelectedEvent(null);
  };

  const flyToEvent = (event: Event) => {
    const map = mapRef.current?.getMap();
    if (!map) return;
    const center = map.getCenter();
    setPreviousView({ lat: center.lat, lng: center.lng, zoom: map.getZoom() });
    map.flyTo({ center: [event.lng, event.lat], zoom: 14, duration: 2000, essential: true });
    setSelectedEvent(event);
  };

  const flyToUser = () => {
    if (!userLocation) return;
    const map = mapRef.current?.getMap();
    if (map) {
      map.flyTo({ center: [userLocation.lng, userLocation.lat], zoom: 15, duration: 1800, essential: true });
    }
  };

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Syne:wght@700;800&display=swap');

        /* ── User location marker ── */
        @keyframes outerPing {
          0%   { transform: scale(0.8); opacity: 0.8; }
          70%  { transform: scale(2.6); opacity: 0; }
          100% { transform: scale(2.6); opacity: 0; }
        }
        @keyframes middleRing {
          0%   { transform: scale(0.9); opacity: 0.5; }
          60%  { transform: scale(1.9); opacity: 0; }
          100% { transform: scale(1.9); opacity: 0; }
        }
        @keyframes corePulse {
          0%, 100% { transform: scale(1);    box-shadow: 0 0 0 0 rgba(56,189,248,0.7), 0 4px 14px rgba(56,189,248,0.5); }
          50%       { transform: scale(1.12); box-shadow: 0 0 0 6px rgba(56,189,248,0),  0 6px 20px rgba(56,189,248,0.8); }
        }
        @keyframes shadowGrow {
          0%, 100% { transform: scale(1);    opacity: 0.35; }
          50%       { transform: scale(1.2); opacity: 0.15; }
        }
        @keyframes locatingDots {
          0%, 80%, 100% { opacity: 0.2; transform: scale(0.8); }
          40%            { opacity: 1;   transform: scale(1); }
        }

        .loc-outer-ping {
          position: absolute; inset: 0; border-radius: 50%;
          background: radial-gradient(circle, rgba(56,189,248,0.35) 0%, transparent 70%);
          animation: outerPing 2.2s cubic-bezier(0.4,0,0.6,1) infinite;
        }
        .loc-middle-ring {
          position: absolute; inset: 0; border-radius: 50%;
          background: radial-gradient(circle, rgba(99,210,255,0.25) 0%, transparent 65%);
          animation: middleRing 2.2s cubic-bezier(0.4,0,0.6,1) 0.4s infinite;
        }
        .loc-core {
          position: relative; z-index: 2;
          width: 22px; height: 22px; border-radius: 50%;
          background: linear-gradient(135deg, #7dd3fc 0%, #38bdf8 40%, #0ea5e9 100%);
          border: 2.5px solid rgba(255,255,255,0.95);
          animation: corePulse 2.2s ease-in-out infinite;
        }
        /* 3-D top highlight */
        .loc-core::before {
          content: '';
          position: absolute;
          top: 3px; left: 4px;
          width: 8px; height: 5px;
          border-radius: 50%;
          background: rgba(255,255,255,0.55);
          filter: blur(1px);
        }
        /* Bottom shadow dot */
        .loc-shadow {
          position: absolute; bottom: -6px; left: 50%;
          transform: translateX(-50%);
          width: 14px; height: 5px;
          background: rgba(14,165,233,0.4);
          border-radius: 50%;
          filter: blur(3px);
          animation: shadowGrow 2.2s ease-in-out infinite;
        }

        /* Locating indicator dots */
        .locating-dot {
          display: inline-block;
          width: 5px; height: 5px;
          border-radius: 50%;
          background: #38bdf8;
          animation: locatingDots 1.2s ease-in-out infinite;
        }
        .locating-dot:nth-child(2) { animation-delay: 0.2s; }
        .locating-dot:nth-child(3) { animation-delay: 0.4s; }

        /* ── Menu ── */
        @keyframes menuSlideIn {
          from { opacity: 0; transform: translateY(-8px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)   scale(1); }
        }
        @keyframes itemFadeIn {
          from { opacity: 0; transform: translateX(-10px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .menu-panel { animation: menuSlideIn 0.22s cubic-bezier(0.16,1,0.3,1) forwards; }
        .menu-item  { opacity: 0; animation: itemFadeIn 0.2s cubic-bezier(0.16,1,0.3,1) forwards; }
        .menu-item:nth-child(1) { animation-delay: 0.04s; }
        .menu-item:nth-child(2) { animation-delay: 0.08s; }
        .menu-item:nth-child(3) { animation-delay: 0.12s; }
        .menu-item:nth-child(4) { animation-delay: 0.16s; }

        .menu-item-btn {
          width: 100%; display: flex; align-items: center; gap: 12px;
          padding: 10px 14px; border-radius: 10px; border: none;
          background: transparent; color: rgba(255,255,255,0.82);
          font-family: 'DM Sans', sans-serif; font-size: 13.5px; font-weight: 400;
          cursor: pointer; text-align: left;
          transition: background 0.15s ease, color 0.15s ease, transform 0.12s ease;
        }
        .menu-item-btn:hover { background: rgba(255,255,255,0.08); color: #fff; transform: translateX(3px); }
        .menu-item-btn.highlight {
          background: rgba(99,179,237,0.12); color: #90cdf4;
          border: 1px solid rgba(99,179,237,0.2);
        }
        .menu-item-btn.highlight:hover { background: rgba(99,179,237,0.2); color: #bee3f8; }

        .hamburger-btn {
          width: 42px; height: 42px; border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.12);
          background: rgba(10,10,20,0.65);
          backdrop-filter: blur(16px) saturate(180%);
          -webkit-backdrop-filter: blur(16px) saturate(180%);
          cursor: pointer; display: flex; align-items: center; justify-content: center;
          transition: background 0.15s ease, border-color 0.15s ease, transform 0.12s ease;
        }
        .hamburger-btn:hover { background: rgba(20,20,40,0.8); border-color: rgba(255,255,255,0.22); transform: scale(1.05); }
        .hamburger-btn.open  { background: rgba(19,19,19,0.85); border-color: rgba(99,179,237,0.35); }

        .bar {
          display: block; width: 16px; height: 1.5px;
          background: rgba(255,255,255,0.9); border-radius: 2px;
          transition: transform 0.22s cubic-bezier(0.16,1,0.3,1), opacity 0.18s ease;
          transform-origin: center;
        }

        /* Locate-me button */
        .locate-btn {
          backdrop-filter: blur(16px) saturate(180%);
          -webkit-backdrop-filter: blur(16px) saturate(180%);
          transition: background 0.15s ease, border-color 0.15s ease, transform 0.12s ease;
        }
        .locate-btn:hover { transform: scale(1.05); }
        .locate-btn:active { transform: scale(0.97); }
      `}</style>

      <Map
        ref={mapRef}
        mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
        initialViewState={MELBOURNE_CENTER}
        mapStyle="mapbox://styles/mapbox/dark-v11"
        style={{ width: "100%", height: "100%" }}
      >
        <NavigationControl position="top-right" />

        {/* Live user location marker */}
        {userLocation && (
          <Marker latitude={userLocation.lat} longitude={userLocation.lng} anchor="center">
            <div style={{ position: "relative", width: 48, height: 48, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div className="loc-outer-ping" />
              <div className="loc-middle-ring" />
              <div className="loc-core" />
              <div className="loc-shadow" />
            </div>
          </Marker>
        )}

        {markers}
      </Map>

      {/* ── Menu ── */}
      <div style={{ position: "absolute", top: 16, left: 16, zIndex: 10, fontFamily: "'DM Sans', sans-serif" }}>
        <button
          className={`hamburger-btn ${menuOpen ? "open" : ""}`}
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "4px", alignItems: "center" }}>
            <span className="bar" style={{ transform: menuOpen ? "translateY(5.5px) rotate(45deg)" : "none" }} />
            <span className="bar" style={{ opacity: menuOpen ? 0 : 1, transform: menuOpen ? "scaleX(0)" : "none" }} />
            <span className="bar" style={{ transform: menuOpen ? "translateY(-5.5px) rotate(-45deg)" : "none" }} />
          </div>
        </button>

        {menuOpen && (
          <div
            className="menu-panel"
            style={{
              marginTop: 10, width: 230, borderRadius: 16,
              border: "1px solid rgba(255,255,255,0.1)",
              background: "rgba(26,26,26,0.75)",
              backdropFilter: "blur(24px) saturate(180%)",
              WebkitBackdropFilter: "blur(24px) saturate(180%)",
              boxShadow: "0 16px 48px rgba(0,0,0,0.5), 0 0 0 0.5px rgba(255,255,255,0.05) inset",
              overflow: "hidden", padding: "8px",
            }}
          >
            <div style={{ padding: "10px 14px 12px", borderBottom: "1px solid rgba(255,255,255,0.07)", marginBottom: 6 }}>
              <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 15, color: "#fff", letterSpacing: "-0.3px" }}>
                EVENTSMAP
              </div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.38)", marginTop: 2 }}>Melbourne, VIC</div>
            </div>

            {menuItems.map((item) => (
              <div key={item.label} className="menu-item">
                <button className={`menu-item-btn ${item.highlight ? "highlight" : ""}`}>
                  <span style={{ opacity: 0.75, flexShrink: 0 }}>{item.icon}</span>
                  <div>
                    <div style={{ fontWeight: 500, lineHeight: 1.2 }}>{item.label}</div>
                    <div style={{ fontSize: 11, opacity: 0.45, marginTop: 1 }}>{item.description}</div>
                  </div>
                </button>
              </div>
            ))}

            <div style={{ padding: "8px 14px 4px", fontSize: 10.5, color: "rgba(255,255,255,0.22)", borderTop: "1px solid rgba(255,255,255,0.06)", marginTop: 6 }}>
              © 2025 EventsMap
            </div>
          </div>
        )}
      </div>

      {/* ── Locate-me button ── */}
      <button
        onClick={flyToUser}
        disabled={!userLocation}
        aria-label="Fly to my location"
        className="locate-btn"
        style={{
          position: "absolute",
          bottom: 32,
          right: 16,
          zIndex: 10,
          width: 44,
          height: 44,
          borderRadius: 13,
          border: locationStatus === "granted"
            ? "1px solid rgba(56,189,248,0.35)"
            : "1px solid rgba(255,255,255,0.1)",
          background: locationStatus === "granted"
            ? "rgba(14,165,233,0.15)"
            : "rgba(10,10,20,0.65)",
          cursor: userLocation ? "pointer" : "default",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: locationStatus === "granted"
            ? "0 4px 20px rgba(14,165,233,0.25)"
            : "0 4px 16px rgba(0,0,0,0.3)",
        }}
      >
        {locationStatus === "loading" ? (
          /* Animated locating dots */
          <div style={{ display: "flex", gap: 3, alignItems: "center" }}>
            <span className="locating-dot" />
            <span className="locating-dot" />
            <span className="locating-dot" />
          </div>
        ) : locationStatus === "denied" ? (
          /* Denied — crossed-out icon */
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="2">
            <line x1="1" y1="1" x2="23" y2="23" />
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s.37-.44 1-1.16" />
            <path d="M18.44 18.44C19.38 16.55 19 14 19 9c0-3.87-3.13-7-7-7-.54 0-1.07.06-1.58.17" />
          </svg>
        ) : (
          /* Active crosshair */
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
            stroke={locationStatus === "granted" ? "#38bdf8" : "rgba(255,255,255,0.6)"}
            strokeWidth="2" strokeLinecap="round">
            <circle cx="12" cy="12" r="4" />
            <line x1="12" y1="2"  x2="12" y2="6"  />
            <line x1="12" y1="18" x2="12" y2="22" />
            <line x1="2"  y1="12" x2="6"  y2="12" />
            <line x1="18" y1="12" x2="22" y2="12" />
          </svg>
        )}
      </button>

      {/* ── Geolocation status toast ── */}
      {locationStatus === "denied" && (
        <div style={{
          position: "absolute", bottom: 86, right: 16, zIndex: 10,
          padding: "8px 13px", borderRadius: 10,
          background: "rgba(26,26,26,0.85)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255,100,100,0.2)",
          color: "rgba(255,150,150,0.8)",
          fontSize: 12,
          fontFamily: "'DM Sans', sans-serif",
          maxWidth: 200,
          boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
        }}>
          Location access denied. Enable it in browser settings.
        </div>
      )}

      {selectedEvent && <ChatPanel event={selectedEvent} onClose={closeEvent} />}

      {selectedEvent && (
        <div style={{ position: "absolute", inset: 0, background: "rgba(44,44,44,0.25)", pointerEvents: "none" }} />
      )}
    </div>
  );
}