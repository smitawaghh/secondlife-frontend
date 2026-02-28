import React, { useState, useEffect, useRef } from "react";
import "./Tracklot.css";

/* ── MOCK LOT DATA ── */
const MOCK_LOTS = {
  "LP-001": {
    id: "LP-001",
    foodName: "Basmati Rice (Expired)",
    category: "Dry Goods",
    status: "IN_TRANSIT",
    qtyKg: 120,
    donor: "FreshMart Superstore, Mumbai",
    recipient: "Happy Paws Animal Shelter, Pune",
    expiryDate: "2025-01-15",
    donatedOn: "2026-02-01",
    estimatedDelivery: "2026-02-28",
    route: [
      { lat: 19.076, lng: 72.8777, label: "Mumbai (Origin)", type: "origin", city: "Mumbai" },
      { lat: 19.22, lng: 73.15, label: "Thane Hub", type: "checkpoint", city: "Thane" },
      { lat: 18.88, lng: 73.65, label: "Khopoli Check", type: "checkpoint", city: "Khopoli" },
      { lat: 18.5204, lng: 73.8567, label: "Pune (Destination)", type: "destination", city: "Pune" },
    ],
    custody: [
      { event: "LOT_CREATED",  at: "2026-02-01T09:00:00", by: "FreshMart Superstore", note: "Lot created and packed for donation", status: "done" },
      { event: "SCREENING",    at: "2026-02-03T11:30:00", by: "SLF Compliance Team", note: "Chemical stability verified. Cleared for animal feed.", status: "done" },
      { event: "PICKUP",       at: "2026-02-05T08:00:00", by: "SLF Logistics Partner", note: "Picked up from Mumbai donor location", status: "done" },
      { event: "IN_TRANSIT",   at: "2026-02-05T10:00:00", by: "Truck #MH-04-AB-7823", note: "En route to Pune via NH-48", status: "active" },
      { event: "DELIVERED",    at: null, by: "Happy Paws Shelter", note: "Awaiting delivery confirmation", status: "pending" },
    ],
  },
  "LP-002": {
    id: "LP-002",
    foodName: "Canned Dog Food Mix",
    category: "Pet Food",
    status: "DELIVERED",
    qtyKg: 60,
    donor: "PetZone Chain, Delhi",
    recipient: "City Animal Rescue, Noida",
    expiryDate: "2025-11-20",
    donatedOn: "2026-01-10",
    estimatedDelivery: "2026-01-14",
    route: [
      { lat: 28.6139, lng: 77.209, label: "Delhi (Origin)", type: "origin", city: "Delhi" },
      { lat: 28.65, lng: 77.32,  label: "Ghaziabad Hub", type: "checkpoint", city: "Ghaziabad" },
      { lat: 28.5355, lng: 77.391, label: "Noida (Destination)", type: "destination", city: "Noida" },
    ],
    custody: [
      { event: "LOT_CREATED", at: "2026-01-10T10:00:00", by: "PetZone Chain", note: "Lot packaged and ready", status: "done" },
      { event: "SCREENING",   at: "2026-01-11T09:00:00", by: "SLF Compliance Team", note: "All cans intact. Approved.", status: "done" },
      { event: "PICKUP",      at: "2026-01-12T07:30:00", by: "SLF Logistics", note: "Collected from Delhi warehouse", status: "done" },
      { event: "IN_TRANSIT",  at: "2026-01-12T09:00:00", by: "Truck #DL-01-CX-4521", note: "Route: Delhi → Noida via NH-9", status: "done" },
      { event: "DELIVERED",   at: "2026-01-14T14:00:00", by: "City Animal Rescue", note: "Received and signed off. 60kg confirmed.", status: "done" },
    ],
  },
  "LP-003": {
    id: "LP-003",
    foodName: "Packaged Grain Mix",
    category: "Packaged",
    status: "SCREENING",
    qtyKg: 200,
    donor: "BigBasket Warehouse, Bangalore",
    recipient: "TBD — Pending Compliance",
    expiryDate: "2025-12-01",
    donatedOn: "2026-02-20",
    estimatedDelivery: "TBD",
    route: [
      { lat: 12.9716, lng: 77.5946, label: "Bangalore (Origin)", type: "origin", city: "Bangalore" },
    ],
    custody: [
      { event: "LOT_CREATED", at: "2026-02-20T08:00:00", by: "BigBasket Warehouse", note: "Lot registered on SLF platform", status: "done" },
      { event: "SCREENING",   at: "2026-02-21T10:00:00", by: "SLF Compliance Team", note: "Currently under chemical stability review", status: "active" },
      { event: "PICKUP",      at: null, by: "SLF Logistics", note: "Awaiting compliance clearance", status: "pending" },
      { event: "IN_TRANSIT",  at: null, by: "—", note: "Not started", status: "pending" },
      { event: "DELIVERED",   at: null, by: "—", note: "Not started", status: "pending" },
    ],
  },
};

const STATUS_META = {
  CREATED:    { label: "Created",    color: "#6b7280", bg: "#f3f4f6" },
  SCREENING:  { label: "Screening",  color: "#d97706", bg: "#fef3c7" },
  IN_TRANSIT: { label: "In Transit", color: "#2563eb", bg: "#dbeafe" },
  DELIVERED:  { label: "Delivered",  color: "#16a34a", bg: "#dcfce7" },
  RECALLED:   { label: "Recalled",   color: "#dc2626", bg: "#fee2e2" },
};

const EVENT_META = {
  LOT_CREATED: { icon: "📦", label: "Lot Created" },
  SCREENING:   { icon: "🔬", label: "Screening" },
  PICKUP:      { icon: "🚚", label: "Picked Up" },
  IN_TRANSIT:  { icon: "📍", label: "In Transit" },
  DELIVERED:   { icon: "✅", label: "Delivered" },
};

function formatDate(iso) {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}
function formatTime(iso) {
  if (!iso) return null;
  return new Date(iso).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
}

/* ── ICONS ── */
const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
    <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);
const QRIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.8"/>
    <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.8"/>
    <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.8"/>
    <rect x="5" y="5" width="3" height="3" fill="currentColor"/>
    <rect x="16" y="5" width="3" height="3" fill="currentColor"/>
    <rect x="5" y="16" width="3" height="3" fill="currentColor"/>
    <rect x="14" y="14" width="3" height="3" fill="currentColor"/>
    <rect x="19" y="14" width="2" height="2" fill="currentColor"/>
    <rect x="14" y="19" width="2" height="2" fill="currentColor"/>
    <rect x="19" y="19" width="2" height="2" fill="currentColor"/>
  </svg>
);
const MapPinIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M12 2a7 7 0 017 7c0 5-7 13-7 13S5 14 5 9a7 7 0 017-7z" fill="currentColor" opacity="0.2" stroke="currentColor" strokeWidth="1.8"/>
    <circle cx="12" cy="9" r="2.5" fill="currentColor"/>
  </svg>
);
const BoxIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" stroke="currentColor" strokeWidth="1.8"/>
    <path d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
);
const TruckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <rect x="1" y="7" width="13" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.8"/>
    <path d="M14 10h4l3 4v3h-7V10z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
    <circle cx="5.5" cy="18.5" r="2" stroke="currentColor" strokeWidth="1.8"/>
    <circle cx="18.5" cy="18.5" r="2" stroke="currentColor" strokeWidth="1.8"/>
  </svg>
);
const WeightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M12 3a3 3 0 110 6 3 3 0 010-6zM6.5 8.5L4 21h16l-2.5-12.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const CalIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.8"/>
    <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
);
const ArrowRight = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M2 7h10M9 4l3 3-3 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
);
const CloseIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path d="M4 4l10 10M14 4L4 14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
);

/* ══════════════════════════════════════════════
   LEAFLET MAP COMPONENT
   Uses CDN — no npm install needed
   ══════════════════════════════════════════════ */
function LeafletMap({ lot }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const layersRef = useRef([]);

  useEffect(() => {
    // Load Leaflet CSS & JS via CDN if not already loaded
    if (!document.getElementById("leaflet-css")) {
      const link = document.createElement("link");
      link.id = "leaflet-css";
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }

    function initMap() {
      if (!mapRef.current || mapInstanceRef.current) return;

      const L = window.L;
      if (!L) return;

      const route = lot.route;
      const center = route[0];

      const map = L.map(mapRef.current, {
        center: [center.lat, center.lng],
        zoom: 8,
        zoomControl: true,
        attributionControl: true,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 18,
      }).addTo(map);

      mapInstanceRef.current = map;

      // Draw route polyline
      if (route.length > 1) {
        const latlngs = route.map(p => [p.lat, p.lng]);
        const polyline = L.polyline(latlngs, {
          color: "#2D6A4F",
          weight: 4,
          opacity: 0.85,
          dashArray: lot.status === "IN_TRANSIT" ? "10, 8" : null,
        }).addTo(map);
        layersRef.current.push(polyline);
        map.fitBounds(polyline.getBounds(), { padding: [40, 40] });
      } else {
        map.setView([route[0].lat, route[0].lng], 10);
      }

      // Custom marker icons
      const makeIcon = (type) => {
        const colors = {
          origin: "#2D6A4F",
          checkpoint: "#40916C",
          destination: "#1A2E1F",
        };
        const size = type === "origin" || type === "destination" ? 36 : 28;
        const bg = colors[type] || "#52B788";
        return L.divIcon({
          className: "",
          html: `<div style="
            width:${size}px;height:${size}px;border-radius:50%;
            background:${bg};border:3px solid white;
            box-shadow:0 3px 12px rgba(0,0,0,0.28);
            display:flex;align-items:center;justify-content:center;
            font-size:${type === "origin" ? "16px" : type === "destination" ? "15px" : "11px"};
          ">${type === "origin" ? "📦" : type === "destination" ? "🏠" : "📍"}</div>`,
          iconSize: [size, size],
          iconAnchor: [size / 2, size / 2],
        });
      };

      // Add markers
      route.forEach((point, idx) => {
        const marker = L.marker([point.lat, point.lng], {
          icon: makeIcon(point.type),
        })
          .bindPopup(
            `<div style="font-family:DM Sans,sans-serif;min-width:160px;">
              <strong style="color:#1A2E1F;font-size:0.9rem;">${point.label}</strong><br/>
              <span style="font-size:0.78rem;color:#6B8070;">${point.type.replace("_", " ").toUpperCase()}</span>
            </div>`,
            { maxWidth: 220 }
          )
          .addTo(map);
        layersRef.current.push(marker);

        // Auto-open popup for current in-transit checkpoint
        if (lot.status === "IN_TRANSIT" && idx === 1) {
          setTimeout(() => marker.openPopup(), 600);
        }
      });

      // Animated pulsing marker for current location (IN_TRANSIT)
      if (lot.status === "IN_TRANSIT" && route.length >= 2) {
        const from = route[1];
        const pulseIcon = L.divIcon({
          className: "",
          html: `<div class="tl-pulse-marker">🚚</div>`,
          iconSize: [44, 44],
          iconAnchor: [22, 22],
        });
        const pulseMarker = L.marker([from.lat, from.lng], { icon: pulseIcon })
          .bindPopup("<strong>Current Location</strong><br/>Truck #MH-04-AB-7823")
          .addTo(map);
        layersRef.current.push(pulseMarker);
      }
    }

    if (window.L) {
      initMap();
    } else {
      const script = document.createElement("script");
      script.id = "leaflet-js";
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      script.onload = initMap;
      document.head.appendChild(script);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        layersRef.current = [];
      }
    };
  }, [lot]);

  return <div ref={mapRef} className="tl-map" />;
}

/* ══════════════════════════════════════════════
   MAIN PAGE
   ══════════════════════════════════════════════ */
export default function TrackLot() {
  const [query, setQuery] = useState("");
  const [activeLot, setActiveLot] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("timeline");

  function handleSearch(e) {
    e.preventDefault();
    const q = query.trim().toUpperCase().replace(/\s/g, "");
    const id = q.startsWith("LP-") ? q : `LP-${q.replace("LP", "").padStart(3, "0")}`;
    setLoading(true);
    setError("");
    setTimeout(() => {
      const found = MOCK_LOTS[id];
      if (found) {
        setActiveLot(found);
        setError("");
        setActiveTab("timeline");
      } else {
        setActiveLot(null);
        setError(`No lot found for "${query}". Try LP-001, LP-002, or LP-003.`);
      }
      setLoading(false);
    }, 700);
  }

  function clearLot() {
    setActiveLot(null);
    setQuery("");
    setError("");
  }

  const meta = activeLot ? (STATUS_META[activeLot.status] || STATUS_META.CREATED) : null;

  return (
    <div className="tl-page">

      {/* ══ HERO SEARCH ══ */}
      <section className="tl-hero">
        <div className="tl-hero-overlay" />
        <div className="tl-hero-content">
          <span className="tl-hero-eyebrow">
            <span className="tl-eyebrow-dot" /> REAL-TIME LOT TRACKING
          </span>
          <h1 className="tl-hero-title">
            Where is your<br /><em>food lot right now?</em>
          </h1>
          <p className="tl-hero-sub">
            Enter your Lot ID to see live custody updates, route map, and delivery status.
          </p>

          <form className="tl-search-form" onSubmit={handleSearch}>
            <div className="tl-search-box">
              <span className="tl-search-prefix">
                <BoxIcon />
              </span>
              <input
                className="tl-search-input"
                placeholder="Enter Lot ID  e.g. LP-001"
                value={query}
                onChange={e => setQuery(e.target.value)}
                autoFocus
              />
              {query && (
                <button type="button" className="tl-search-clear" onClick={() => setQuery("")}>
                  <CloseIcon />
                </button>
              )}
              <button type="submit" className="tl-search-btn" disabled={!query.trim() || loading}>
                {loading ? <span className="tl-spin" /> : <><SearchIcon /> Track</>}
              </button>
            </div>
            <div className="tl-quick-lots">
              <span>Try:</span>
              {["LP-001", "LP-002", "LP-003"].map(id => (
                <button key={id} type="button" className="tl-quick-btn"
                  onClick={() => { setQuery(id); }}>
                  {id}
                </button>
              ))}
            </div>
          </form>

          {error && (
            <div className="tl-error">
              <span>⚠️</span> {error}
            </div>
          )}
        </div>

        {/* Floating background lot cards */}
        <div className="tl-hero-bg-cards" aria-hidden="true">
          <div className="tl-bg-card tl-bg-card-1">LP-001 · In Transit · 120kg</div>
          <div className="tl-bg-card tl-bg-card-2">LP-002 · Delivered · 60kg</div>
          <div className="tl-bg-card tl-bg-card-3">LP-003 · Screening · 200kg</div>
        </div>
      </section>

      {/* ══ RESULT SECTION ══ */}
      {activeLot && (
        <section className="tl-result">

          {/* ── TOP BAR ── */}
          <div className="tl-result-topbar">
            <div className="tl-result-id-group">
              <span className="tl-result-id">{activeLot.id}</span>
              <span className="tl-status-pill" style={{ color: meta.color, background: meta.bg }}>
                {meta.label}
              </span>
            </div>
            <div className="tl-result-name">{activeLot.foodName}</div>
            <button className="tl-close-btn" onClick={clearLot} title="Clear"><CloseIcon /> New Search</button>
          </div>

          {/* ── SUMMARY CHIPS ── */}
          <div className="tl-chips">
            <div className="tl-chip">
              <WeightIcon /> <span>{activeLot.qtyKg} kg</span>
            </div>
            <div className="tl-chip">
              <BoxIcon /> <span>{activeLot.category}</span>
            </div>
            <div className="tl-chip">
              <CalIcon /> <span>Donated {formatDate(activeLot.donatedOn)}</span>
            </div>
            <div className="tl-chip">
              <MapPinIcon /> <span>{activeLot.route[activeLot.route.length - 1].city}</span>
            </div>
            <div className="tl-chip">
              <TruckIcon />
              <span>Est. {activeLot.estimatedDelivery === "TBD" ? "TBD" : formatDate(activeLot.estimatedDelivery)}</span>
            </div>
          </div>

          {/* ── MAIN GRID ── */}
          <div className="tl-main-grid">

            {/* LEFT — Map */}
            <div className="tl-map-panel">
              <div className="tl-panel-header">
                <h3 className="tl-panel-title"><MapPinIcon /> Route Map</h3>
                <span className="tl-map-legend">
                  <span className="tl-leg-dot tl-leg-origin" />Origin
                  <span className="tl-leg-dot tl-leg-check" />Checkpoint
                  <span className="tl-leg-dot tl-leg-dest" />Destination
                </span>
              </div>
              <LeafletMap lot={activeLot} key={activeLot.id} />

              {/* Route stops list */}
              <div className="tl-route-stops">
                {activeLot.route.map((r, i) => (
                  <div key={i} className={`tl-stop tl-stop-${r.type}`}>
                    <div className="tl-stop-dot">
                      {r.type === "origin" ? "📦" : r.type === "destination" ? "🏠" : "📍"}
                    </div>
                    {i < activeLot.route.length - 1 && <div className="tl-stop-line" />}
                    <div className="tl-stop-info">
                      <span className="tl-stop-label">{r.label}</span>
                      <span className="tl-stop-type">{r.type.replace("_", " ")}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT — Details + Timeline */}
            <div className="tl-detail-panel">

              {/* Tabs */}
              <div className="tl-tabs">
                {["timeline", "details"].map(t => (
                  <button key={t} type="button"
                    className={`tl-tab ${activeTab === t ? "active" : ""}`}
                    onClick={() => setActiveTab(t)}>
                    {t === "timeline" ? "📋 Custody Timeline" : "📄 Lot Details"}
                  </button>
                ))}
              </div>

              {/* Timeline Tab */}
              {activeTab === "timeline" && (
                <div className="tl-timeline">
                  {activeLot.custody.map((c, i) => {
                    const em = EVENT_META[c.event] || { icon: "•", label: c.event };
                    return (
                      <div key={i} className={`tl-tl-item tl-tl-${c.status}`}>
                        <div className="tl-tl-left">
                          <div className="tl-tl-icon-wrap">
                            <span className="tl-tl-icon">{em.icon}</span>
                          </div>
                          {i < activeLot.custody.length - 1 && (
                            <div className={`tl-tl-connector ${c.status === "done" ? "done" : ""}`} />
                          )}
                        </div>
                        <div className="tl-tl-body">
                          <div className="tl-tl-header-row">
                            <span className="tl-tl-event">{em.label}</span>
                            {c.status === "active" && (
                              <span className="tl-tl-live"><span className="tl-live-dot" />Live</span>
                            )}
                            {c.status === "pending" && (
                              <span className="tl-tl-pending">Pending</span>
                            )}
                          </div>
                          {c.at && (
                            <div className="tl-tl-time">
                              {formatDate(c.at)} · {formatTime(c.at)}
                            </div>
                          )}
                          <div className="tl-tl-by">By: {c.by}</div>
                          <div className="tl-tl-note">{c.note}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Details Tab */}
              {activeTab === "details" && (
                <div className="tl-details">
                  <div className="tl-details-section">
                    <h4 className="tl-details-heading">Lot Information</h4>
                    <div className="tl-kv-grid">
                      {[
                        ["Lot ID", activeLot.id],
                        ["Food Name", activeLot.foodName],
                        ["Category", activeLot.category],
                        ["Quantity", `${activeLot.qtyKg} kg`],
                        ["Expiry Date", formatDate(activeLot.expiryDate)],
                        ["Donated On", formatDate(activeLot.donatedOn)],
                        ["Status", meta.label],
                      ].map(([k, v]) => (
                        <div key={k} className="tl-kv-row">
                          <span className="tl-kv-key">{k}</span>
                          <span className="tl-kv-val">{v}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="tl-details-section">
                    <h4 className="tl-details-heading">Chain of Custody</h4>
                    <div className="tl-kv-grid">
                      {[
                        ["Donor", activeLot.donor],
                        ["Recipient", activeLot.recipient],
                        ["Est. Delivery", activeLot.estimatedDelivery === "TBD" ? "TBD" : formatDate(activeLot.estimatedDelivery)],
                      ].map(([k, v]) => (
                        <div key={k} className="tl-kv-row">
                          <span className="tl-kv-key">{k}</span>
                          <span className="tl-kv-val">{v}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="tl-qr-section">
                    <div className="tl-qr-box">
                      <div className="tl-qr-grid" aria-label="QR code placeholder">
                        {Array.from({ length: 49 }).map((_, i) => (
                          <div key={i} className="tl-qr-cell"
                            style={{ background: Math.random() > 0.5 ? "#1A2E1F" : "transparent" }} />
                        ))}
                      </div>
                    </div>
                    <div className="tl-qr-text">
                      <p className="tl-qr-title">Lot QR Code</p>
                      <p className="tl-qr-sub">Scan to verify authenticity and view chain of custody on-site</p>
                      <button className="tl-qr-btn"><QRIcon /> Download QR</button>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>

        </section>
      )}

      {/* ══ EMPTY STATE ══ */}
      {!activeLot && !error && (
        <section className="tl-empty">
          <div className="tl-empty-inner">
            <div className="tl-empty-icon">🗺️</div>
            <h3>Enter a Lot ID to begin tracking</h3>
            <p>Your lot's full journey — from donor to animal shelter — visible in real-time.</p>
            <div className="tl-empty-features">
              {[
                { icon: "📍", title: "Live Map Route", desc: "See exactly where your lot is on an interactive map" },
                { icon: "🔗", title: "Full Chain of Custody", desc: "Every handoff logged with timestamp and signature" },
                { icon: "✅", title: "Compliance Verified", desc: "Chemical stability and packaging checks visible" },
                { icon: "📦", title: "QR Traceability", desc: "Scan any QR code to verify lot authenticity" },
              ].map((f, i) => (
                <div key={i} className="tl-feature-card">
                  <span className="tl-feature-icon">{f.icon}</span>
                  <h4>{f.title}</h4>
                  <p>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

    </div>
  );
}